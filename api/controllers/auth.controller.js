import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  // hash password
  const hashedPassword = bcryptjs.hashSync(password, 10);
  // save data using User model
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save(); // save user
    res.status(201).json("user created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email }); // check in user model
    // check for email
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }
    // create token after successful match
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // exclude password from returning
    const { password: pass, ...rest } = validUser._doc;
    // save token as cookie
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
