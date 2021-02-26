const express = require("express");
const cartRoute = express.Router();

const helper = require("../helpers");
const cart = require("../models/cart");
const invoice = require("../models/invoice");
const category = require("../models/category");

module.exports = cartRoute;

cartRoute.post("/add", async (req, res) => {
  let cartId = "";
  if (req.cookies.cartId) {
    cartId = req.cookies["cartId"];
  } else {
    cartId = helper.randomString(16);
    res.cookie("cartId", cartId, { maxAge: 60 * 60 * 24 * 1000 * 30 });
  }
  const o = {
    productId: req.body["productId"],
    cartId: cartId,
    qty: req.body["qty"],
  };
  console.log(o);
  const ret = await cart.addCart(o);
  res.redirect("/cart");
});

cartRoute.get("/", async (req, res) => {
  const session = req.cookies.session;
  if (req.cookies.cartId) {
    let arr = await cart.getCart(req.cookies["cartId"]);
    let cartTotal = 0;
    for (let i in arr) {
      arr[i]["name"] = arr[i]["product"][0]["name"];
      arr[i]["imageUrl"] = arr[i]["product"][0]["image"];
      arr[i]["price"] = arr[i]["product"][0]["price"];
      arr[i]["eachTotal"] =
        parseInt(arr[i]["product"][0]["price"]) * arr[i]["qty"];
      cartTotal += parseInt(arr[i]["product"][0]["price"]) * arr[i]["qty"];
    }
    const categories = await category.getCategories();
    console.log(cartTotal);
    res.render("cart/index", {
      a: arr,
      cartTotal: cartTotal,
      categories: categories,
      title: "Cart",
      session: session,
    });
  } else {
    res.redirect("/");
  }
});

cartRoute.post("/edit", async (req, res) => {
  if (req.cookies.cartId) {
    const o = {
      cartId: req.cookies["cartId"],
      productId: req.body["productId"],
      qty: req.body["qty"],
    };
    const ret = await cart.editCart(o);
    console.log(ret);
    res.json(ret);
  } else {
    res.end("failed");
  }
});

cartRoute.get("/del/:id", async (req, res) => {
  const id = req.params["id"];
  console.log("id:" + id);
  const ret = await cart.deleteCart(id);
  res.redirect("/cart");
});

//Checkout
cartRoute.get("/shipping", async (req, res) => {
  if (req.cookies.session) {
    const session = req.cookies.session;
    if (req.cookies.cartId) {
      res.render("cart/shipping", { session: session });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/auth/login");
  }
});

cartRoute.post("/shipping", async (req, res) => {
  if (req.cookies.cartId) {
    if(!(req.body.fn&&req.body.ln&&req.body.address&&req.body.tel&&req.body.email)){
      return res.render("cart/shipping", { message: "Please fill in all fields" })
    }
    const id = helper.randomString(16);
    const o = {
      _id: id,
      firstName: req.body.fn,
      lastName: req.body.ln,
      address: req.body.address,
      phone: req.body.tel,
      email: req.body.email,
      payment: "",
      date: new Date(),
      details: [],
    };
    const arr = await cart.getCart(req.cookies["cartId"]);
    for (const i in arr) {
      o["details"].push({
        productId: arr[i]["productId"],
        price: arr[i]["product"][0]["price"],
        quantity: arr[i]["qty"],
        name: arr[i]["product"][0]["name"],
        imageUrl: arr[i]["product"][0]["image"],
      });
    }
    res.cookie("cart", o);
    res.redirect("/cart/payment/");
  } else {
    res.redirect("/");
  }
});

cartRoute.get("/payment", async (req, res) => {
  if (req.cookies.session) {
    if (req.cookies.cartId) {
      const session = req.cookies.session;
      res.render("cart/payment", { session: session });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/auth/login");
  }
});

cartRoute.post("/payment", async (req, res) => {
  if (req.cookies.session) {
    if (req.cookies.cartId && req.cookies.cart) {
      const o = req.cookies.cart;
      o.payment = req.body.payment;
      res.cookie("cart", o);
      res.redirect("/cart/placeorder");
      console.log(o);
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/auth/login");
  }
});

cartRoute.get("/placeorder", async (req, res) => {
  if (req.cookies.session) {
    if (req.cookies.cartId) {
      const session = req.cookies.session;
      let total = 0;
      const o = req.cookies.cart;
      const arr = o.details;
      const id = o._id;
      for (let i in arr) {
        total += parseInt(arr[i].price);
      }
      res.render("cart/placeOrder", {
        o: o,
        arr: arr,
        total: total,
        id: id,
        session: session,
      });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/auth/login");
  }
});

cartRoute.get("/addinvoice", async (req, res) => {
  if (req.cookies.session) {
    if (req.cookies.cartId) {
      const o = req.cookies.cart;
      console.log(o._id);
      const id = o._id;
      const ret = await invoice.addInvoice(o);
      const ret2 = await cart.deleteCart(req.cookies.cartId);
      console.log(`/invoice/detail/${id}`);
      console.log(ret);
      console.log(ret2);
      res.clearCookie("cart");
      res.clearCookie("cartId");

      res.redirect(`/invoice/detail/${id}`);
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/auth/login");
  }
});
