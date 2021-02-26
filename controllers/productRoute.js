const express = require("express");
const category = require("../models/category");
const product = require("../models/product");

const productRoute = express.Router();
module.exports = productRoute;

productRoute.get("/product/search/:page?", async (req, res) => {
  const page = 1;
  if (req.params.page) {
    page = parseInt(req.params["page"]);
  }
  const q = req.query["q"];
  const categories = await category.getCategories();
  const size = 9;
  const products = await product.searchProducts(q, page, size);
  const url = `/product/search/{0}?q=${q}`;
  const total = await product.countSearchProducts(q);
  const numOfPages = Math.ceil(total / size);
  const session = req.cookies.session;
  res.render("product/index", {"url": url, "numOfPages": numOfPages,"page": page, "categories": categories, "products": products, title: q, "q": q, session: session })
});

productRoute.get("/product/category/:name", async (req, res) => {
  const session = req.cookies.session;
  const name = req.params["name"];
  const categories = await category.getCategories();
  const products = await product.getProductsByCategory(1, 18, name);
  res.render("product/index", {"categories":categories, "products": products, title: name,  session: session});
});

productRoute.get("/product/detail/:id", async (req, res) => {
  const session = req.cookies.session;
  const id = parseInt(req.params["id"]);
  const categories = await category.getCategories();
  const o = await product.getProductById(id);
  let arrCate = [];
  arrCate.push(o["category"]);
  const products = await product.getProductsRelation(1, 18, id, arrCate);
  res.render("product/detail", {"categories":categories, "products": products, "o":o, title: o["title"], session: session});
});

productRoute.get("/:page?", async (req, res) => {
  const session = req.cookies.session;
  let page = 1;
  if (req.params.page) {
    page = parseInt(req.params["page"]);
  }
  const categories = await category.getCategories();
  const size = 9;
  const products = await product.getProducts(page, size);
  const total = await product.countProducts();
  const numOfPages = Math.ceil(total / size);
  res.render("product/index", {"url": "/{0}","page":page, "numOfPages":numOfPages, "categories":categories, "products": products, title: "Ogani", session: session});
});
