const mongodb = require("mongodb");
const url = "mongodb://localhost:27017/store";
const option = { useUnifiedTopology: true };

exports.addInvoice = async (o) => {
  const client = mongodb.MongoClient(url, option);
  await client.connect();
  const db = client.db("store");
  const ret = await db.collection("Invoice").insertOne(o);
  client.close();
  return ret.result;
};

exports.getInvoiceById = async (id) => {
  const client = mongodb.MongoClient(url, option);
  await client.connect();
  const db = client.db("store");
  const o = await db.collection("Invoice").findOne({_id: id});
  client.close();
  return o;
};
