const mongodb =  require('mongodb');
const url = 'mongodb://localhost:27017/store';
const option = {useUnifiedTopology: true};

exports.getCart = async(cartId) => {
	const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");	
	const lookup = [{$lookup: 
		{from: "Product", localField: "productId", 
		foreignField: "_id", 
		as: "product"}}, {$match: {"cartId": cartId}}];
	const arr =  await db.collection("Cart").aggregate(lookup).toArray(); 
	client.close();
	return arr;
}

exports.addCart = async (o) => {
	const client = mongodb.MongoClient(url, option);
	await client.connect();
    const db = client.db("store");
    const cond = {productId: parseInt(o["productId"]), cartId: o["cartId"]};
	const set = {$set: {qty: o["qty"]}};
	const ret = await db.collection("Cart").updateOne(cond, set, {upsert: true} );
	client.close();
	return ret.result;
}

exports.editCart = async (o) => {
	const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const cond = {cartId: o["cartId"], productId: parseInt(o["productId"])};
	const set = {$set: {qty: o["qty"]}};
	const ret = await db.collection("Cart").updateOne(cond, set, {upsert: true});
	client.close();
	return ret.result;
}

exports.deleteCart = async (id) => {
	const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const ret = await db.collection("Cart").deleteOne({cartId: id});
	client.close();
	return ret.result;
}
