const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');

const CreateUserValidate = [
  body("name", "Name cannot be null").isLength({ min: 1 }),
  body("email","Email must be in valid format").isEmail(),
  body("password", "Password must be atleast 5 characters long").isLength({
    min: 5,
  }),
]

// Create a User: POST "/api/auth/" Doesn't require Auth
router.post("/", CreateUserValidate, (req, res) => {

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => res.json(user))
    .catch(() => {
      res.json({ err: "Please enter a valid Email Address" });
    });
});

module.exports = router;
