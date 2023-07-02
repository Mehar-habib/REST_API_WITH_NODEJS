class CustomerErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }
  static alreadyExist(message) {
    return new CustomerErrorHandler(409, message);
  }
  static wrongCredentials(message = "Username or Password wrong!") {
    return new CustomerErrorHandler(401, message);
  }
}
export default CustomerErrorHandler;
