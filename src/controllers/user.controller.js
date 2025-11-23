import { User } from "../models/user.model.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({
    validateBeforeSave: false,
  });
  return {
    accessToken,
    refreshToken,
  };
};
// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(req.body);
  if (!name || !email || !password || !confirmPassword) {
    throw new apiErrors(400, "All fields are required");
  }
  if (password !== confirmPassword) {
    throw new apiErrors(400, "Passwords do not match");
  }
  if (
    [name, email, password, confirmPassword].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new apiErrors(400, "Fields cannot be empty");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new apiErrors(409, "Email already exists");
  }
  if (password !== confirmPassword) {
    throw new apiErrors(400, "Passwords do not match");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new apiErrors(500, "Failed to register user");
  }
  res
    .status(200)
    .json(new apiResponse(200, createdUser, "User register successfully"));
});
// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new apiErrors(404, "User not found");
  }
  const isPasswordMatched = await user.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    throw new apiErrors(401, "Invalid password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Login successful"
      )
    );
});
// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, null, "Logout successful"));
});

export { registerUser, loginUser, logoutUser };
