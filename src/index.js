import express from "express";
import cors from "cors";
import auth from "./auth.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/tajna", (req, res) => {
  let verify = auth.verify(req, res);
  if (!verify) {
    return;
  }

  res.json({ message: "Ovo je tajna" + req.jwt.email });
});

app.post("/auth", async (req, res) => {
  let userData = req.body;
  try {
    const respData = await auth.authenticateUser(
      userData.email,
      userData.password
    );
    res.json(respData);
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
