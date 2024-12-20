class resHandle {
    static handleError(res, number, error, success) {
      return res.status(number).json({
        message: error,
        success: false,
      });
    }
    static handleData(res, number, message, success, data) {
      return res.status(number).json({
        message: message,
        success: success,
        data: data,
      });
    }
  }
  
  module.exports = resHandle;
  