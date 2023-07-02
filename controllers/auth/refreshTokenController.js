import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomerErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const refreshTokenController = {
  async refresh(req, res, next) {
    //! validate the token
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // ! check the token in database
    let refreshToken;
    try {
      refreshToken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshToken) {
        return next(CustomerErrorHandler.unAuthorized("Invalid refresh token"));
      }
      //! verify the token take 2 argument 'refresh_token', 'secret'
      let userId;
      try {
        const { _id } = await JwtService.verify(
          refreshToken.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (error) {
        return next(CustomerErrorHandler.unAuthorized("Invalid refresh token"));
      }
      // !find the user _id in 'User' models
      const user = User.findOne({ _id: userId });
      if (!user) {
        return next(CustomerErrorHandler.unAuthorized("No user found!"));
      }
      // ! generate token
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "2y",
        REFRESH_SECRET
      );
      // ! save token in database
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });
    } catch (error) {
      return next(new Error("Something went wrong" + error.message));
    }
  },
};
export default refreshTokenController;
