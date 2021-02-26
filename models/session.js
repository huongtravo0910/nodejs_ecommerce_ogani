const mongodb =  require('mongodb');
const url = 'mongodb://localhost:27017/store';
const option = {useUnifiedTopology: true};

exports.addToken = async(val) => {
    const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const ret = await db.collection("Session").insertOne(val);
	client.close();
}

exports.deleteSession = async(id) =>  {
	const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const ret = await db.collection("Session").removeOne({_id: id});
	client.close();
	return ret.result;
}

exports.getSessionById = async(id) => {
	const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const o = await db.collection("Session").findOne({_id: id});
	client.close();
	return o;
}

