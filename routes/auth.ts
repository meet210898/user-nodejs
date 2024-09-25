import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/user";
import auth from "../middleware/auth";
import config from "../src/config";

const router = express.Router();
const JWT_SECRET = config.JWT_SECRET;

interface CustomRequest extends Request {
  user?: { userId: string; iat: number; exp: number };
}

// SIGNUP
router.post("/users/signup", async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "The passwords you entered do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// LOGIN
router.post("/users/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET as string, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// VIEW PROFILE
router.get("/users/me", auth, async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ _id: req?.user?.userId }).select(
      "-_id -password"
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this information" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile", error });
  }
});

// GET RANDOM JOKE
router.get("/random-joke", auth, async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://api.chucknorris.io/jokes/random");
    const joke = response.data.value;

    res.status(200).json({ joke });
  } catch (error) {
    console.error("Error fetching joke:", error);
    res.status(500).json({ message: "Error fetching joke" });
  }
});

// LOGOUT
router.post("/users/logout", auth, (req: Request, res: Response): void => {
  res.status(200).json({ message: "User logged out successfully" });
});

export default router;
