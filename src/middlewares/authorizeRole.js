import apiErrors from "../utils/apiErrors.js";

const authorizeRole = (...role) => {
  return (req, res, next) => {
    if (!req.user || !role.includes(req.user.role)) {
      return next(new apiErrors(401, "Unauthorized access"));
    }
    next();
  };
};

export default authorizeRole;
