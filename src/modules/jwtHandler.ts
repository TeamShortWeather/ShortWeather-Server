import jwt from 'jsonwebtoken';
import config from '../config';
import axios from 'axios';
import qs from 'qs';
const fs = require('fs');
const { TOKEN_EXPIRED, TOKEN_INVALID } = require('../modules/jwt');

const secretKey = process.env.JWT_SECRET;
const ONE_HOUR = 36000;
const TWO_WEEK = ONE_HOUR * 24 * 14;

// const sign = user => {
//   const payload = {
//     user: {
//       id: user,
//     },
//   };

//   const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '14d' });
//   return token;
// };

//* 받아온 userId를 담는 access token 생성
const sign = (userId: number) => {
  const payload = {
    userId,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  return accessToken;
};

const createRefresh = user => {
  const payload = {
    user: {
      id: user,
    },
  };
  const result = {
    refreshToken: jwt.sign(payload, secretKey, { expiresIn: '24d' }),
  };
  return result;
};

const getDevice = deviceId => {
  const payload = {
    device: {
      deviceId: deviceId,
    },
  };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: 36000000000 });
  return token;
};

// const socialSign = user => {
//   const payload = {
//     id: user.id,
//     name: user.name,
//     socialId: user.socialId,
//   };

//   const result = {
//     accesstoken: jwt.sign(payload, secretKey),
//   };
//   return result;
// };

const makeJWT = () => {
  let privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n');
  let token = jwt.sign(
    {
      iss: process.env.APPLE_TEAMID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      aud: 'https://appleid.apple.com',
      sub: process.env.APPLE_CLIENTID,
    },
    privateKey,
    {
      algorithm: 'ES256',
      header: {
        alg: 'ES256',
        kid: process.env.APPLE_KEYID,
      },
    },
  );
  console.log(token);
  return token;
};

const getRefreshToken = async (code): Promise<string> => {
  // const { code } = req.query.code;
  const client_secret = makeJWT();
  try {
    let refresh_token: string;
    let data = {
      code: code,
      client_id: process.env.APPLE_CLIENTID,
      client_secret: client_secret,
      grant_type: 'authorization_code',
    };
    await axios
      .post(`https://appleid.apple.com/auth/token`, qs.stringify(data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(async res => {
        refresh_token = res.data.refresh_token;
      });
    return refresh_token;
  } catch (error) {
    console.log(error);
  }
};


//* token 검사!
const verify = (token: string) => {
  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error: any) {
    if (error.message === "jwt expired") {
      return TOKEN_EXPIRED;
    } else if (error.message === "invalid token") {
      return TOKEN_INVALID;
    } else {
      return TOKEN_INVALID;
    }
  }

  return decoded;
};

// //token 검증
// const verify = token => {
//   let decode;
//   try {
//     decode = jwt.verify(token, secretKey);
//   } catch (error) {
//     if (error.message === 'jwt expired') {
//       console.log('만료된 토큰입니다.');
//       return TOKEN_EXPIRED;
//     } else if (error.message === 'invalid signature') {
//       console.log('유효하지 않은 토큰입니다.');
//       return TOKEN_INVALID;
//     } else {
//       console.log(error.message);
//       return 9999;
//     }
//   }
//   // 해독이나 인증이 완료되면, 해독된 상태의 JWT 반환
//   return decode;
// };

const verifyAndRenewalToken = token => {
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
    const userId = decoded.user.id;
    const accessToken = sign(userId);
    const refreshToken = createRefresh(userId).refreshToken;

    const data = {
      accessToken,
      refreshToken,
    };
    return data;
  } catch (err) {
    console.log(err.message);
    console.log('what?');
    throw 401;
  }
};

export default {
  sign,
  getDevice,
  makeJWT,
  getRefreshToken,
  createRefresh,
  verify,
  verifyAndRenewalToken,
};
