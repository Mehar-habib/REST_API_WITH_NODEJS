import Joi from "joi";
import CustomerErrorHandler from "../../services/CustomErrorHandler";
import { User } from "../../models";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService";

const registerController = {
  async register(req, res, next) {
    // todo validate the request,  authorize the request,  check if user is in the database already,  prepare model,  store in database,  generate jwt token,  send response

    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // check if user is in the database already
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomerErrorHandler.alreadyExist("This email is already exist")
        );
      }
    } catch (err) {
      return next(err);
    }
    const { name, email, password } = req.body;
    // todo ==> Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // todo ==> prepare the model
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    let access_token;
    try {
      const result = await user.save();
      // todo ==> Token
      access_token = JwtService.sign({
        _id: result._id,
        role: result.role,
      });
    } catch (err) {
      return next(err);
    }
    res.json({ access_token });
  },
};
export default registerController;
