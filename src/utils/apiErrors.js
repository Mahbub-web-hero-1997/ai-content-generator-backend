class apiErrors extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    success = false,
    data = null,
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export default apiErrors;
