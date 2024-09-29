import dotenv from "dotenv";
dotenv.config();
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // Cloudinary URL
      default: null,
    },
    bio: {
      type: String,
      maxLength: 500,
      default: "",
    },
    technologies: [
      {
        type: String, // For user-selected categories like JavaScript, Python, etc.
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project", // References the Project model
      },
    ],
    refreshToken: {
      type: String, // Refresh token stored for the user
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for authentication
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // e.g., '15m'
    }
  );
};
console.log(process.env.REFRESH_TOKEN_EXPIRY);
// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // e.g., '7d'
    }
  );
};

// Update refresh token
userSchema.methods.updateRefreshToken = async function (token) {
  this.refreshToken = token;
  await this.save({ validateBeforeSave: false });
};

export const User = mongoose.model("User", userSchema);
