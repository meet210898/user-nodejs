import express from "express";
import mongoose from "mongoose";
import routes from "../routes/auth";
import config from "./config";

const app = express();
const PORT = config.PORT || 5000;
app.use(express.json());

const mongoURI = config.DATABASE_URL;

app.use("/api", routes);

mongoose
  .connect(mongoURI as string)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err: any) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
