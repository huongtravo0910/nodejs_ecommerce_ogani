const mongodb = require("mongodb");
const url = "mongodb://localhost:27017/store";
const option = { useUnifiedTopology: true };

exports.getProducts = async (page, size) => {
  const client = mongodb.MongoClient(url, option);
  await client.connect();
  const db = client.db("store");
  const sk = (page - 1) * size;
  const a = await db
    .collection("Product")
    .find()
    .skip(sk)
    .limit(size)
    .toArray();
  client.close();
  return a;
};

exports.getProductsByCategory = async (page, size, category) => {
  const client = mongodb.MongoClient(url, option);
  await client.connect();
  const db = client.db("store");
  const sk = (page - 1) * size;
  const cate = { category: { $eq: category } };
  const a = await db
    .collection("Product")
    .find(cate)
    .skip(sk)
    .limit(size)
    .toArray();
  client.close();
  return a;
};

exports.getProductsRelation = async (page, size, id, categoryName) => {
  const client = mongodb.MongoClient(url, option);
  await client.connect();
  const db = client.db("store");
  const sk = (page - 1) * size;
  const query = { category: { $in: categoryName }, _id: { $ne: id } };
  const a = await db
    .collection("Product")
    .find(query)
    .skip(sk)
    .limit(size)
    .toArray();
  client.close();
  return a;
};

exports.getProductById = async (id) => {
  const client = mongodb.MongoClient(url, option);
  await client.connect();
  const db = client.db("store");
  const o = await db.collection("Product").findOne({ _id: id });
  client.close();
  return o;
};

exports.searchProducts = async (q, page, size) => {
  const client = mongodb.MongoClient(url, option);
  await client.connect();
  const db = client.db("store");
  const sk = (page - 1) * size;
  const a = await db
    .collection("Product")
    .find({ name: { $regex: q, $options: "i" } })
    .skip(sk)
    .limit(size)
    .toArray();
  client.close();
  return a;
};

exports.countSearchProducts = async (q) => {
  const client = mongodb.MongoClient(url, option);
  await client.connect();
  const db = client.db("store");
  const a = await db
    .collection("Product")
    .countDocuments({ title: { $regex: q, $options: "i" } });
  client.close();
  return a;
};

exports.countProducts = async () => {
  const client = mongodb.MongoClient(url, option);
  await client.connect();
  const db = client.db("store");
  const ret = await db.collection("Product").countDocuments();
  client.close();
  return ret;
};

exports.statisticProduct = async () => {
  const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const cond = [{$group: {_id: "$category", total: {$sum: 1}}}];
	const arr = await db.collection("Product").aggregate(cond).toArray();
	client.close();
	return arr;
}