const express = require("express");
const app = express();
const router = express.Router();

// app.use(express.json());
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

app.listen(8081, function () {
	console.log("Server is running on port 8081 ");
});
