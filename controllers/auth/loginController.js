import Joi from "joi";
import User from "../../models/user";
import CustomerErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService";

const loginController = {
  async login(req, res, next) {
    // todo ==> Validate
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // todo ==> user already register
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomerErrorHandler.wrongCredentials());
      }
      // todo ==> Compare the password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomerErrorHandler.wrongCredentials());
      }
      // todo ==> TOken
      const access_token = JwtService.sign({ _id: user._id, role: user.role });

      res.json({ access_token });
    } catch (error) {
      return next(error);
    }
  },
};
export default loginController;
