import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import auth from "./auth.js";
import db from "./db.js";
import mongo from "mongodb";

const usersCollection = db.collection("Users");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/secure-route", [auth.verify], (req, res) => {
  res.json({ message: "This is a secure route" });
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
    res
      .status(500)
      .json({ error: "Email already exists. Please choose a different one." });
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
    const result = await auth.changeUserProfile(
      email,
      userData.firstName,
      userData.lastName,
      userData.old_password,
      userData.new_password
    );

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

app.get("/exercises", async (req, res) => {
  try {
    const exerciseList = await db.collection("exerciselist").find({}).toArray();
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
      res.status(200).json({ message: "Diary entry saved successfully." });
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

app.post("/register", (req, res) => {
  res.status(201).send();
});

app.get("/user/:userId", (req, res) => {
  res.json([{ userId: 2 }]);
});

app.get("/workouts/recommendedworkouts", (req, res) => {
  res.json([{}]);
});

app.get("/workouts/recommendedworkouts/:id", (req, res) => {
  res.json([{ id: 3 }]);
});

app.post("/workouts/myworkouts", (req, res) => {
  res.status(201).send();
});

app.get("/workouts/myworkouts/:id", (req, res) => {
  res.json({ id: 5 });
});

app.get("/exercises", (req, res) => {
  res.json({});
});

app.get("/exercises/:title", (req, res) => {
  res.json({});
});

app.post("/nutritions/:userId/record", (req, res) => {
  res.status(201).json({ message: "Zabilježeni podaci o prehrani" });
});

app.get("/nutritions/:userId", (req, res) => {
  res
    .status(200)
    .json({ message: "Preporuke za prehranu za pojedinog korisnika!" });
});

app.patch("/user/:userId", (req, res) => {
  res.status(200).json(updatedUser);
});

//ruta za priduživanje zajdnici
app.post("/community/join", (req, res) => {
  res.status(201).send();
});

//dohvat informacija o zajedinici
app.get("/community/:communityId", (req, res) => {
  res.status(200).send();
});

app.get("/progress/:userId", (req, res) => {
  res.status(200).send();
});

app.post("/bmi/:userId/record", (req, res) => {
  res.status(200).json({ message: "Zabilježeni podaci o BMI" });
});

app.post("/diary/:userId/record", (req, res) => {
  res.status(200).json({ message: "Uneseni podaci u dnevniku." });
});

app.get("/diary/:userId", (req, res) => {
  res.status(200).json({});
});

app.listen(port, () => console.log(`Slušam na portu ${port}!`));
