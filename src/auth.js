import mongo from "mongodb";
import { ObjectId } from "mongodb";
import db from "./db.js";
import bcrypt from "bcrypt";

const usersCollection = db.collection("Users");

usersCollection.createIndex({ email: 1 }, { unique: true });

export default {
  async registerUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await usersCollection.insertOne({
      _id: new ObjectId(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
    });
  },
};
