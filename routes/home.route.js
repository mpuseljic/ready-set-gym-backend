const express = require("express");
const router = express.Router();

router.get("/home", async (req, res) => {
	res.status(200).send("Success");
});
module.exports = router;
