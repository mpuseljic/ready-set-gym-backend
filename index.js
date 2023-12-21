const express = require("express");
const app = express();
const router = express.Router();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const homeRoute = require("./routes/home.route");
// const loginRoute = require("./routes/login.route");
// const userRoute = require("./routes/user.route");
// const dbRoute = require("./routes/progLang.route");
// const signupRoute = require("./routes/signup.route");
// app.use("/");
app.use("/", router); // home
// app.use("/", loginRoute); // login
// app.use("/", userRoute); // "profil"
// app.use("/", dbRoute); // db
// app.use("/", signupRoute);

app.get("/auth", (req, res) => {
  res.json({ token: "adf" });
});

app.post("/register", (req, res) => {
  res.status(201).send();
});

app.get("/user", (req, res) => {
  res.json([{}]);
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

// ruta za priduživanje zajdnici
app.post("/community/join", (req, res) => {
  res.status(201).send();
});

// dohvat informacija o zajedinici
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

app.listen(8081, function () {
  console.log("Server is running on port 8081 ");
});
