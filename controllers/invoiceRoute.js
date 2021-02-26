const express = require("express");
const router = express.Router();

const invoice = require("../models/invoice");

module.exports = router;

router.get("/detail/:id", async (req, res) => {
  if (req.cookies.session) {
	const session = req.cookies.session;
    let total = 0;
    const o = await invoice.getInvoiceById(req.params["id"]);
    const arr = o.details;
    for (let i in arr) {
      total += parseInt(arr[i].price);
    }
    console.log(o);
    console.log(arr);
    res.render("invoice/detail", { "o": o, "arr": arr, "total": total, "session": session });
  } else {
    res.redirect("/auth/login");
  }
});
