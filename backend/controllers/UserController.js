import User from "../models/User.js";

const getUsers = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const users = await User.find({
      _id: { $ne: userId },
    }).select("fname lname email");
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getUsers Controller", error);
    next(error);
  }
};
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error in getProfile Controller", error);
    next(error);
  }
};
export { getUsers, getProfile };
