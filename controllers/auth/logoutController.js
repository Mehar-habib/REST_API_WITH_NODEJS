import Joi from "joi";
import { RefreshToken } from "../../models";

const logoutController = {
  async logout(req, res, next) {
    // ! validation
    const logoutSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = logoutSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (error) {
      return next(new Error("Something went wrong in the database!"));
    }
    res.json({ status: 1 });
  },
};
export default logoutController;
