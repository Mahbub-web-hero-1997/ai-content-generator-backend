import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      minlength: 6,
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://as1.ftcdn.net/v2/jpg/15/69/08/22/1000_F_1569082208_z9TfrJ9jVbJuk1aTrPnXIEEYguJhiij6.jpg",
      trim: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    credits: {
      type: Number,
      default: 0,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "basic", "pro", "enterprise"],
      default: "free",
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
userSchema
  .virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });
// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
// Check password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password) return null;
  return await bcrypt.compare(password, this.password);
};
// Generate Access Token
userSchema.methods.generateAccessToken = async function () {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
  return token;
};
// Generate Refresh Token
userSchema.methods.generateRefreshToken = async function () {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );
  return token;
};
export const User = mongoose.model("User", userSchema);
