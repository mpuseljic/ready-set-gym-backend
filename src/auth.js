import mongo from "mongodb";
import { ObjectId } from "mongodb";
import db from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usersCollection = db.collection("Users");
const WorkoutPlanCollection = db.collection("WorkoutPlans");

usersCollection.createIndex({ email: 1 }, { unique: true });

export default {
    async registerUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        try {
            await usersCollection.insertOne({
                _id: new ObjectId(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: hashedPassword,
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(
                    "Email already exists. Please choose a different one."
                );
            } else {
                throw error;
            }
        }
    },

    async authenticateUser(email, password) {
        let userData = await usersCollection.findOne({ email: email });

        console.log("Received data: ", email, password);
        console.log("User data from the database: ", userData);

        if (
            userData &&
            userData.password &&
            (await bcrypt.compare(password, userData.password))
        ) {
            delete userData.password;
            let token = jwt.sign(userData, process.env.JWT_SECRET, {
                algorithm: "HS512",
                expiresIn: "1 week",
            });
            return {
                token,
                email: userData.email,
            };
        } else {
            throw new Error("Cannot authenticate");
        }
    },

    verify(req, res, next) {
        try {
            let authorization = req.headers.authorization.split(" ");
            let type = authorization[0];
            let token = authorization[1];

            if (type !== "Bearer") {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(token, process.env.JWT_SECRET);
                return next();
            }
        } catch (error) {
            return res.status(401).send();
        }
    },

    async changeUserProfile(
        email,
        firstName,
        lastName,
        old_password,
        new_password
    ) {
        try {
            console.log("Updating profile for email:", email);
            console.log("New profile data:", { firstName, lastName });
            const user = await usersCollection.findOne({ email: email });

            if (
                user &&
                user.password &&
                (await bcrypt.compare(old_password, user.password))
            ) {
                console.log("Old password matches. Updating profile...");
                const delta = {};
                if (firstName) {
                    delta.firstName = firstName;
                }
                if (lastName) {
                    delta.lastName = lastName;
                }
                if (new_password) {
                    const new_password_hashed = await bcrypt.hash(
                        new_password,
                        8
                    );
                    delta.password = new_password_hashed;
                }

                const result = await usersCollection.updateOne(
                    { _id: user._id },
                    { $set: delta }
                );

                return result.modifiedCount === 1;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            throw new Error("Failed to change password!");
        }
    },
    async changeUserProfilePicture(email, imagePath) {
        try {
            console.log("Updating profile for email:", email);
            const user = await usersCollection.findOne({ email: email });

            if (user && user.password) {
                const delta = { imagePath: imagePath };
                const result = await usersCollection.updateOne(
                    { _id: user._id },
                    { $set: delta }
                );

                return result.modifiedCount === 1;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            throw new Error("Failed to change profile picture!");
        }
    },
    async addNewWorkoutPlan(email, titleImagePath, exercisesArray, planName) {
        try {
            console.log("Creating new workout plan for:", email);
            const user = await usersCollection.findOne({ email: email });

            if (user && user.password) {
                const result = await WorkoutPlanCollection.insertOne({
                    _id: new ObjectId(),
                    email: email,
                    titleImagePath: titleImagePath,
                    exercisesArray: exercisesArray,
                    planName: planName,
                });

                return result;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            throw new Error("Failed to add new plan");
        }
    },
};
