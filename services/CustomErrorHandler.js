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
  static unAuthorized(message = "unAuthorized") {
    return new CustomerErrorHandler(401, message);
  }
  static notFound(message = "404 Not Found") {
    return new CustomerErrorHandler(404, message);
  }
  static uploadingFileError(message = "file upload error / server error") {
    return new CustomerErrorHandler(500, message);
  }
}
export default CustomerErrorHandler;
