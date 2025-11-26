import { User } from "../models/user.model.js";
import apiErrors from "../utils/apiErrors.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new apiErrors(401, "Unauthorized: No token provided in cookie");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decoded);
    const user = await User.findById(decoded.id).select("_id email name role");

    if (!user) {
      throw new apiErrors(401, "Unauthorized: User Not found");
    }
    req.user = user;
    console.log("Load Body from token", req.body);
    // console.log("Load user from verify Token", req.user);
    next();
  } catch (error) {
    return next(
      new apiErrors(
        error.status || 500,
        error.message || "Internal Server Error"
      )
    );
  }
};

export default verifyToken;
