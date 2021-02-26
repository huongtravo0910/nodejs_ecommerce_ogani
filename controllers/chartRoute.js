const express = require("express");
const router = express.Router();
const product = require("../models/product");
module.exports = router;

router.get("/", async (req, res) => {
	const arr = await product.statisticProduct();
	console.log(arr)
	res.render("chart/index", {'arr': arr});
})
