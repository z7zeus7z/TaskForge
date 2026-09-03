import User from "../models/User";

const authorize = (role) => {
  return async (req, res, next) => {
    try {
      const user = User.findById(req.user.userId);
      if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
      }
      if (user.role !== role) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

export default authorize;
