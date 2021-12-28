const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");

const db =
  "mongodb+srv://makesh:01%40AprilMonth@cluster0.524uj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(db, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("database connected");
  }
});

function verifyToken(req, res, next) {
  // console.log(req.headers);
  if (!req.headers.authorization) {
    console.log("a");

    return res.status(401).send("unAuthorizedRequest");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    console.log("b");
    return res.status(401).send("unAuthorizedRequest");
  }
  let payload;
  try {
    console.log("try");
    payload = jwt.verify(token, "makesh");
    if (!payload) {
      console.log("c");

      return res.status(401).send("unAuthorizedRequest");
    }
  } catch (e) {
    console.log("catch");

    return res.status(401).send("unAuthorizedRequest");
  }

  req.userId = payload.subject;
  next();
}
router.get("/", function (req, res) {
  res.send("API SENT");
});

router.post("/register", (req, res) => {
  let userData = req.body;
  console.log(userData);
  let user = new User(userData);
  user.save((error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log("*****");
      console.log(data);
      let payload = {
        subject: data.id,
      };
      let token = jwt.sign(payload, "makesh");
      res.status(200).json({ token });
    }
  });
});

router.post("/login", (req, res) => {
  let userData = req.body;
  User.findOne({ email: userData.email }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (!user) {
        res.status(401).send("Email not found");
      } else if (user.password !== userData.password) {
        res.status(401).send("Wrong Password");
      } else {
        let payload = {
          subject: userData.id,
        };
        let token = jwt.sign(payload, "makesh");
        res.status(200).send({ token });
      }
    }
  });
});

router.get("/events", (req, res) => {
  let events = [
    {
      id: "100",
      name: "Makesh",
      description: "Some description 1",
    },
    {
      id: "200",
      name: "John",
      description: "Some description 2",
    },
    {
      id: "300",
      name: "Peter",
      description: "Some description 3",
    },
    {
      id: "400",
      name: "Kumar",
      description: "Some description4",
    },
  ];
  res.json(events);
});
router.get("/special", verifyToken, (req, res) => {
  let events = [
    {
      id: "1000",
      name: "Dhoni",
      description: "Some description 01",
    },
    {
      id: "2000",
      name: "Dravid",
      description: "Some description 22",
    },
    {
      id: "3000",
      name: "Sachin",
      description: "Some description 10",
    },
    {
      id: "4000",
      name: "Kumble",
      description: "Some description 99",
    },
  ];
  res.json(events);
});
module.exports = router;
