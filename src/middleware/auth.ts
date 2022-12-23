import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import AuthService from '../services/AuthService';
const { TOKEN_INVALID, TOKEN_EXPIRED } = require('../modules/jwt');
const db = require('../loaders/db');

const auth = async (req: Request, res: Response, next: NextFunction) => {
  // request-header 에서 토큰 받아오기
  const token = req.header('authorization');

  // 토큰 유무 검증
  if (!token) {
    return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
  }

  // 토큰 검증
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded === TOKEN_EXPIRED) {
      //토큰이 만료됐다면
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_EXPIRED));
    }

    if (decoded === TOKEN_INVALID) {
      //토큰이 유효하지 않다면
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_INVALID));
    }
    req.body.user = (decoded as any).user;

    next(); // 미들웨어 실행 끝나면 다음으로 넘기기
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_EXPIRED)); //토큰 만료시 여기 실행됨
    }
    res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_INVALID));
  }
};

module.exports = { auth };
