import mongoose, { Document, Schema } from "mongoose";

interface UserType extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema: Schema<UserType> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
