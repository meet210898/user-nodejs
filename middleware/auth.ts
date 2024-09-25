import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../src/config";

const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized user" });
    return;
  }

  jwt.verify(token, config.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "User is forbidden" });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
