import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import auth from "./src/auth.js";
import db from "./src/db.js";
import mongo from "mongodb";

const usersCollection = db.collection("Users");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/secure-route", [auth.verify], (req, res) => {
    res.json({ message: "This is a secure route" });
});

app.get("/", (req, res) => {
    res.send("Express on Vercel");
});
app.post("/auth", async (req, res) => {
    let userData = req.body;
    try {
        const respData = await auth.authenticateUser(
            userData.email,
            userData.password
        );
        res.json({ token: respData.token });
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
});

app.post("/users", async (req, res) => {
    const userData = req.body;
    try {
        const respData = await auth.registerUser(userData);
        res.json(respData);
    } catch (error) {
        res.status(500).json({
            error: "Email already exists. Please choose a different one.",
        });
    }
});

app.get("/users/profile", [auth.verify], async (req, res) => {
    try {
        const user = await usersCollection.findOne({ email: req.jwt.email });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.patch("/user", [auth.verify], async (req, res) => {
    try {
        const userData = req.body;
        const email = req.jwt.email;
        let result;
        if (userData.new_password) {
            result = await auth.changeUserProfile(
                email,
                userData.firstName,
                userData.lastName,
                userData.old_password,
                userData.new_password
            );
        } else {
            result = await auth.changeUserProfilePicture(
                email,
                userData.imagePath
            );
        }

        if (result) {
            console.log("Profile successfully updated.");
            res.status(201).json({ message: "Password successfully updated." });
        } else {
            console.log("Failed to update profile.");
            res.status(500).json({ error: "Failed to update password." });
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update password!" });
    }
});

app.post("/workout-plan", async (req, res) => {
    try {
        const workoutPlanData = req.body;
        const result = await auth.addNewWorkoutPlan(
            workoutPlanData.email,
            workoutPlanData.imageUrl,
            workoutPlanData.exercises,
            workoutPlanData.name
        );
        if (result) {
            console.log("New plan successfully added.");
            res.status(201).json({ message: "New plan successfully added." });
        } else {
            console.log("Failed to add new plan.");
            res.status(500).json({ error: "Failed to add new plan." });
        }
    } catch (error) {
        console.error("Error adding a plan:", error);
        res.status(500).json({ error: "Error adding a plan" });
    }
});

app.get("/workout-plan/:userEmail", async (req, res) => {
    const email = req.params.userEmail;
    try {
        const userWorkoutPlans = await db
            .collection("WorkoutPlans")
            .find({
                email: email,
            })
            .toArray();
        res.json(userWorkoutPlans);
    } catch (error) {
        console.error("Error fetching exercise list:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/exercises", async (req, res) => {
    try {
        const exerciseList = await db
            .collection("exerciselist")
            .find({})
            .toArray();
        res.json(exerciseList);
    } catch (error) {
        console.error("Error fetching exercise list:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/recommendedworkouts/:workoutType", async (req, res) => {
    const workoutType = req.params.workoutType;
    try {
        const recommendedWorkouts = await db
            .collection("recommendedWorkouts")
            .findOne({ type: workoutType });
        res.json(recommendedWorkouts);
    } catch (error) {
        console.error("Error fetching recommended workouts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/diary/record", [auth.verify], async (req, res) => {
    try {
        const { content, date } = req.body;
        const user = await usersCollection.findOne({ email: req.jwt.email });

        if (user) {
            await db.collection("UserDiary").insertOne({
                email: user.email,
                content,
                date,
            });
            res.status(200).json({
                message: "Diary entry saved successfully.",
            });
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        console.error("Error saving diary entry:", error);
        res.status(500).json({ error: "Failed to save diary entry." });
    }
});

app.get("/users/profile-diary", [auth.verify], async (req, res) => {
    try {
        const diaries = await db
            .collection("UserDiary")
            .find({ email: req.jwt.email })
            .toArray();
        res.json(diaries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/diary/record/:diaryId", [auth.verify], async (req, res) => {
    try {
        const diaryId = req.params.diaryId;

        const user = await usersCollection.findOne({ email: req.jwt.email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const diaryEntry = await db.collection("UserDiary").findOne({
            _id: new mongo.ObjectId(diaryId),
            email: user.email,
        });
        if (!diaryEntry) {
            return res.status(404).json({ error: "Diary entry not found." });
        }

        await db.collection("UserDiary").deleteOne({
            _id: new mongo.ObjectId(diaryId),
        });
        res.status(200).json({ message: "Diary entry deleted successfully." });
    } catch (error) {
        console.error("Error deleting diary entry:", error);
        res.status(500).json({ error: "Failed to delete diary entry." });
    }
});

app.post("/weight/record", [auth.verify], async (req, res) => {
    try {
        const { weight } = req.body;
        const user = await usersCollection.findOne({ email: req.jwt.email });

        if (user) {
            await db.collection("Weight").insertOne({
                email: user.email,
                weight: parseInt(weight),
                month: new Date().toLocaleString("en-US", { month: "long" }),
            });
            res.status(200).json({ message: "Weight recorded successfully." });
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        console.error("Error recording weight:", error);
        res.status(500).json({ error: "Failed to record weight." });
    }
});

app.get("/weight", [auth.verify], async (req, res) => {
    try {
        const weights = await db
            .collection("Weight")
            .find({ email: req.jwt.email })
            .toArray();
        res.json({ weights });
    } catch (error) {
        console.error("Error fetching weights:", error);
        res.status(500).json({ error: "Failed to fetch weights." });
    }
});

app.listen(port, () => console.log(`Slušam na portu ${port}!`));

export default app;
