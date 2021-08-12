const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require('body-parser');    
var urlencodedParser = bodyParser.urlencoded({ extended: false }) ;
const User = require("./models/User");
mongoose.connect("mongodb://localhost:27017/freelance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/signup/:referral", urlencodedParser, (req, res) => {
    const referral = req.params.referral;
    
    User.findOne({email: req.body.email})
    .then((usr) => {
        if(!usr){
            if(mongoose.Types.ObjectId.isValid(referral)){
                User.findOne({ _id: referral })
                .then((userFound) => {
                    if (!userFound){
                    var user = new User({"email": req.body.email, "wallet": 0, "referred_by": ""});
                    user.save(function (err) {
                        if (err) {
                            res.send(err);
                            return console.log(err);
                        }
                        console.log("User saved without reference!!!");
                        res.send("User saved without reference!!!");
                        return;
                    });
                    }else{
                        var user = new User({"email": req.body.email, "wallet": 0, "referred_by": referral});
                        user.save((err) => {
                            if (err) {
                                res.send(err);
                                return console.log(err);
                            }
                            userFound.wallet = userFound.wallet+100;
                            userFound.save((err) => {
                                if(err){
                                    console.log("User saved but wallet balance of referer not updated!!!");
                                    res.send("User saved but wallet balance of referer not updated!!!");
                                    return;
                                }
                                console.log("User saved and wallet balance of referer updated!!!");
                                res.send("User saved and wallet balance of referer updated!!!");
                                return;
                            });
                            
                        });
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return;
                    });
            }
            else{
                var user = new User({"email": req.body.email, "wallet": 0, "referred_by": ""});
                user.save(function (err) {
                    if (err) return console.log(err);
                    console.log("User saved without reference (Invalid reference)!!!");
                    res.send("User saved without reference (Invalid reference)!!!");
                    return;
                });
            }
        }else{
            console.log("Email already registerd!!!");
            res.send("Email already registered!!!");
            return;
        }
    });
})

app.get("/user/:email", (req, res) => {
    const email = req.params.email;

    User.findOne({email: email})
    .then((usr) => {
        if(usr){
            console.log(usr);
            res.send(usr);
            return;
        }
        else{
            console.log("No user with this email!!!");
            res.send("No user with this email!!!");
            return;
        }
    })
})

app.get("/referral/:email", (req, res) => {
    const email = req.params.email;

    User.findOne({email: email})
    .then((usr) => {
        if(usr){
            console.log(`http://localhost:3000/signup/${usr._id}`);
            res.send(`http://localhost:3000/signup/${usr._id}`);
            return;
        }
        else{
            console.log("No user with this email!!!");
            res.send("No user with this email!!!");
            return;
        }
    })
})


app.listen(3000);