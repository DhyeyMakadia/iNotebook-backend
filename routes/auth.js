const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
require("dotenv").config();

const CreateUserValidate = [
  body("name", "Name cannot be null").exists(),
  body("email", "Email must be in valid format").isEmail(),
  body("password", "Password must be atleast 5 characters long").isLength({
    min: 5,
  }),
];
const LoginValidate = [
  body("email", "Email must be in valid format").isEmail(),
  body("password", "Password cannot be null").exists(),
];

// ROUTE 1: Create a User: POST "/api/auth/createuser". No Login Required
router.post("/createuser", CreateUserValidate, async (req, res) => {
  // IF there are errors, return bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check if user exists, return bad request and errors
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "A User with the same email already exists." });
    }

    var salt = await bcrypt.genSaltSync(10);
    var securedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user instance and save it to db
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: securedPassword,
    });

    let data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ authtoken });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Authenticate a User: POST "/api/auth/login". No Login Required
router.post("/login", LoginValidate, async (req, res) => {
  // IF there are errors, return bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please try to login with valid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(400)
        .json({ error: "Please try to login with valid credentials." });
    }

    let data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ authtoken });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Get a Logged-in User: POST "/api/auth/getuser". Login Required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
