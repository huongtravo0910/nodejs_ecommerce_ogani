const express = require("express");
const crypto = require("crypto");

const helper = require("../helpers");
const user = require("../models/user");
const session = require("../models/session");


const authRouter = express.Router();
module.exports = authRouter;


//1.Register a user
authRouter.get("/register", (req, res) => {
  res.render("auth/register");
})


authRouter.post("/register", async (req, res) => {
  try {
    if (!(req.body.email&&req.body.password&&req.body.gender&&req.body.username)){
      return res.render("auth/register",{ message: "Please enter information" });
    }
    const pwd = crypto.createHash("md5").update(req.body['password'] + "$#%&" + req.body["username"] ).digest("hex");
    const checkedUser = await user.getUser(req.body.username, pwd);
    if(checkedUser){
      return res.render("auth/register",{ message: "Existed User" });
    }
    const o = {
      "Username": req.body["username"],
      "Password": pwd,
      "Email": req.body["email"],
      "Gender": req.body["gender"]
    }
    const ret = await user.addUser(o);
    console.log(ret)
    if(req.cookies.session){
      res.clearCookie("session")
    }
    if(req.cookies.card){
      res.clearCookie("card")
    }
    if(req.cookies.cartId){
      res.clearCookie("cartId")
    }
    return res.redirect("/auth/login")
  } catch (error) {
    return res
      .send({ message: error.message, error: "server_error" });
  }
});

//2.Login a user
authRouter.get("/login", async(req, res) => {
  res.render("auth/login")
});

authRouter.post("/login", async (req, res) => {
  try {
    //Check whether the user exist
    const pwd = crypto.createHash("md5").update(req.body['password'] + "$#%&" + req.body["username"] ).digest("hex");
    const loginUser = await user.getUser(req.body.username, pwd);
    if (!loginUser) {
      return res.render("auth/login", { message: "Sign in failed. Check username and password."});
    }
    token = helper.randomString(32);
    const val = {_id: token, UserId: loginUser["_id"], Username: loginUser["Username"]};
    await session.addToken(val);
    if(req.body.reb == 1) {
			res.cookie("session", token, {maxAge: 60*60*24*30});
		}else {
			res.cookie("session", token);
    }
    res.redirect("/cart");
  } catch (error) {
    return res
      .send({ message: error.message, error: "server_error" });
  }
});

// //3.Change password
authRouter.get("/change", (req, res) => {
  res.render("auth/change")
})

authRouter.post("/change", async (req, res) => {
  try {
    const o = await session.getSessionById(req.cookies["session"]);
    const userName = o["Username"];
    const oPwd = crypto.createHash("md5").update(req.body['old-password'] + "$#%&" + userName ).digest("hex");
	  const nPwd = crypto.createHash("md5").update(req.body['new-password'] + "$#%&" + userName ).digest("hex");
    const retUpdate = await user.updatePassword(userName, oPwd, nPwd);
    if(retUpdate.n > 0){
      const token = req.cookies["session"];
      await session.deleteSession(token);
      res.clearCookie("session");
      return res.render("auth/change",{message: "Change successfully"});
    }else{
      res.render("auth/change",{message: "Change password failed"})
    }
  } catch (error) {
    return res
      .send({ message: error.message, error: "server_error" });
  }
});


//4. Log out
authRouter.get("/logout", async(req, res) => {
	if(req.cookies.session) {
		const token = req.cookies['session'];
		await session.deleteSession(token);		
		res.clearCookie("session");
	}
	res.redirect("/auth/login")
})
