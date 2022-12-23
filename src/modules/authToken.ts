import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/AuthService';
import jwtHandler from './jwtHandler';
import message from './responseMessage';
import statusCode from './statusCode';
import util from './util';
const { TOKEN_EXPIRED, TOKEN_INVALID } = require('../modules/jwt');

const authToken = async (req: Request, res: Response) => {
  const { accesstoken, refreshtoken } = req.headers;

  //accesstoken 또는 refreshtoken이 없다면 Token이 비었다는 것을 반환
  if (!accesstoken || !refreshtoken) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.TOKEN_EMPTY));
  }

  let client;

  try {
    client = await dbConfig.connect(req);

    //accesstoken 검증
    const decodedToken = jwtHandler.verify(accesstoken);

    //token이 유효하지 않다면
    if (decodedToken === TOKEN_INVALID) {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_INVALID));
    }

    //token 만료 검증
    if (decodedToken === TOKEN_EXPIRED) {
      //accessToken 이 만료됐을 때
      //refreshtoken 검증
      const refresh = jwtHandler.verify(refreshtoken);

      //refreshtoken이 유효하지 않으면
      if (refresh === TOKEN_INVALID) {
        return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_INVALID));
      }
      //refreshtoken이 만료됐고, decodedToken 에서의 accesstoken이 만료됐다면 모든 토큰 만료
      if (refresh === TOKEN_EXPIRED) {
        return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.ALL_TOKEN_EXPIRED));
      }

      //토큰 만료가 되지 않았다면, user의 refreshToken으로 유저를 조회한다.
      const user = await AuthService.getUserByRfToken(client, refreshtoken);

      // accesstoken 과 refreshToken을 재발급하기
      const accesstoken = jwtHandler.sign(user);
      const refreshToken = jwtHandler.createRefresh(user);

      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, message.CREATE_TOKEN, {
          accesstoken,
          refreshToken,
        }),
      );
    }
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

export default {
  authToken,
};
