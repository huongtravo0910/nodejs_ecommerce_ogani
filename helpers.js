exports.validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function randomInt (n){
	return Math.floor((Math.random()*n));
}

exports.randomString = (length) => {
	const s="qwertyuiopasdfghjklzxcvbnm1234567890";
	let a = [];
	for (let i = 0; i < length; i++) {
		a.push(s.charAt(randomInt(s.length)));
	}
	return a.join("");
}