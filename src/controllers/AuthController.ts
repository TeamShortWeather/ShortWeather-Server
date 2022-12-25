import { NextFunction, Request, Response } from "express";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import message from "../modules/responseMessage";
import AuthService from "../services/AuthService";
const db = require("../loaders/db");
import jwtHandler from "../modules/jwtHandler";
const dotenv = require("dotenv");
dotenv.config();



/**
 *  @route POST /auth/devicelogin
 *  @desc Post Auth
 *  @access Private
 */
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

export default {
  getDevice,
};
