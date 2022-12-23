import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
const { validationResult } = require('express-validator');
const sc = require('../modules/statusCode');

exports.validatorErrorChecker = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  next();
};
