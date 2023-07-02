import { User } from "../../models";
import CustomerErrorHandler from "../../services/CustomErrorHandler";

const userController = {
  async me(req, res, next) {
    try {
      //! get the USER from auth middleware
      // ! select method: neglect the password, updatedAt v
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v"
      );
      if (!user) {
        return next(CustomerErrorHandler.notFound());
      }
      res.json(user);
    } catch (err) {
      return next(err);
    }
  },
};
export default userController;
