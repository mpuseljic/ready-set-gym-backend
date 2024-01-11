import mongo from "mongodb";
import { ObjectId } from "mongodb";
import db from "./db.js";
import bcrypt from "bcrypt";

const usersCollection = db.collection("Users");

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
        throw new Error("Email already exists. Please choose a different one.");
      } else {
        throw error;
      }
    }
  },
};
