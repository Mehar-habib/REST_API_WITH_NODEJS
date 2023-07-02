import CustomerErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";

const auth = async (req, res, next) => {
  // ! get the token from url ==> Query
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(CustomerErrorHandler.unAuthorized());
  }
  const token = authHeader.split(" ")[1];
  try {
    // ! verify the token
    const { _id, role } = await JwtService.verify(token);
    const user = {
      _id,
      role,
    };
    // ! prepare the object and send from userController
    req.user = user;
    // todo ==> call the Next middleware
    next();
  } catch (error) {
    return next(CustomerErrorHandler.unAuthorized());
  }
};
export default auth;
