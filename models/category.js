const mongodb =  require('mongodb');
const url = 'mongodb://localhost:27017/store';
const option = {useUnifiedTopology: true};

exports.getCategories = async () => {
	const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const a = await db.collection("Product").distinct("category", {category: {$nin: [null,""]}});
	client.close();
	return a;
}
