import jwt from "jsonwebtoken";

export const authHandler = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Token missing" });
  }

  const decoded = jwt.verify(
    token.startsWith("Bearer ") ? token.split(" ")[1] : token,
    process.env.JWT_SECRET
  );
  if (!decoded) {
    return res.status(403).json({ success: false, error: "Invalid token" });
  }

  req["user"] = decoded;

  // If token is valid, proceed to the next middleware or route handler
  next();
};
