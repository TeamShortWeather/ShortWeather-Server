import { NextFunction, Request, Response } from "express";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import message from "../modules/responseMessage";
import AuthService from "../services/AuthService";
const db = require("../loaders/db");
import jwtHandler from "../modules/jwtHandler";
import { UserCreateDTO } from "../DTO/AuthDTO";
import { validationResult } from "express-validator";
const dotenv = require("dotenv");
dotenv.config();

const createUser = async (req: Request, res: Response) => {
  //? validation의 결과를 바탕으로 분기 처리
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE))
  }

  const userCreateDto: UserCreateDTO = req.body;
  const data = await AuthService.createUser(userCreateDto);

  if (!data) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.CREATE_USER_FAIL))
  }

  //? jwtHandler 내 sign 함수를 이용해 accessToken 생성
  const accessToken = jwtHandler.sign(data.id);

  const result = {
    id: data.id,
    gender: data.gender,
    age: data.age,
    tempSens: data.temp_sens,
    wakeUpTime: data.wake_up_time,
    goOutTime: data.go_out_time,
    goHomeTime: data.go_home_time,
    deviceToken: data.device_token,
    accessToken: accessToken,
  };

  return res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.CREATE_USER_SUCCESS, result));
};

//* 유저 등록 조회
const getUserByDevice = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE))
  }

  const deviceToken = req.header('deviceToken');

  try {
    const data = await AuthService.getUserByDevice(deviceToken);

    if (!data) {
      const result = {
        deviceToken: deviceToken,
        accessToken: null,
        isExist: false
      }
      return res.status(statusCode.OK).send(util.success(statusCode.OK, message.READ_USER_UNAUTHORIZED, result));
    }

    const accessToken = jwtHandler.sign(data.id);
    const result = {
      deviceToken: deviceToken,
      accessToken: accessToken,
      isExist: true
    }
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.READ_USER_SUCCESS, result));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route POST /auth/devicelogin
 *  @desc Post Auth
 *  @access Private
 */
/*
const getDevice = async (req: Request, res: Response) => {
  const { socialType, fcm, device } = req.body;

  let client;
  let user;
  try {
    client = await db.connect(db);

    if (socialType == "device") {
      const data = {
        fcmToken: fcm,
        socialType: socialType,
        deviceToken: device,
      };

      user = await AuthService.findDevice(client, socialType, device);

      if (!user) {
        user = await AuthService.createDevice(client, data);
        const { refreshToken } = jwtHandler.createRefresh(user.id);
        const jwtToken = jwtHandler.sign(user.id);

        return res.status(statusCode.CREATED).send(
          util.success(statusCode.CREATED, message.CREATE_DEVICE_SUCCESS, {
            user,
            accesstoken: jwtToken,
            refreshToken: refreshToken,
          })
        );
      }

      const { refreshToken } = jwtHandler.createRefresh(user.id);
      const jwtToken = jwtHandler.sign(user.id);

      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, message.DEVICE_LOGIN_SUCCESS, {
          user,
          accesstoken: jwtToken,
          refreshToken: refreshToken,
        })
      );
    }
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  } finally {
    client.release();
  }
};
*/

export default {
  createUser,
  getUserByDevice,
};
