const mongodb =  require('mongodb');
const url = 'mongodb://localhost:27017/store';
const option = {useUnifiedTopology: true};

exports.addUser = async(o) => {
    const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const ret = await db.collection("User").insertOne(o);
	client.close();
}
 
exports.getUser = async(userName, password) => {
    const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const o = await db.collection("User").findOne({Username: userName, Password: password});
    client.close();
    return o;
}

exports.updatePassword = async (userName, oPwd, nPwd ) => {
	const client = mongodb.MongoClient(url, option);
	await client.connect();
	const db = client.db("store");
	const o = await db.collection("User").updateOne({Username: userName, Password: oPwd}, {$set: {Password: nPwd}});
	client.close();
	return o.result;
}