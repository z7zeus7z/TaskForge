import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Register New Account
const register = async (req, res, next) => {
  try {
    const { fname, lname, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
      role: "member",
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in RegisterController", error);
    next(error);
  }
};
//Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
      },
    );
    return res.status(200).json({ message: "Login successfully", token });
  } catch (error) {
    console.error("Error in Login controller :", error);
    next(error);
  }
};
export { register, login };
