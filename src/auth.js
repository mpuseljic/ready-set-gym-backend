import mongo from "mongodb";
import { ObjectId } from "mongodb";
import db from "./db.js";

const usersCollection = db.collection("Users");

export default {
  async registerUser(userData) {
    await usersCollection.insertOne({
      _id: new ObjectId(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
    });
  },
};
