import { User } from "../models";
import CustomerErrorHandler from "../services/CustomErrorHandler";

const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (user.role === "admin") {
      next();
    } else {
      return next(CustomerErrorHandler.unAuthorized());
    }
  } catch (error) {
    return next(error);
  }
};
export default admin;
