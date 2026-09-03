const errorHandler = (err, req, res, next) => {
  return res.status(500).json({ message: "Server error" });
};

export default errorHandler;
