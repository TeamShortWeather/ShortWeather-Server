import { changeUserDTO, createDeviceDTO, userInputDTO } from '../DTO/AuthDTO';
const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const findUserByEmail = async (client: any, email: string, socialType: string) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM "user"
    WHERE email = $1 AND social_type = $2 AND is_deleted = false 
    `,
    [email, socialType],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const findUserBySocialId = async (client: any, socialId: string) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM "user"
    WHERE social_id = $1 AND is_deleted = false
    `,
    [socialId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const createUser = async (client: any, data: userInputDTO) => {
  const { rows } = await client.query(
    `
        INSERT INTO "user"(name, email, social_type, fcm_token, social_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
    [data.name, data.email, data.socialType, data.fcmToken, data.socialId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const updateFcm = async (client: any, fcm: string, userId: number) => {
  const { rows } = await client.query(
    `
    UPDATE "user"
    SET fcm_token = $1
    WHERE id = $2
    RETURNING *
    `,
    [fcm, userId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// const deviceUser = async (client: any, deviceToken: string) => {
//   const { rows } = await client.query(
//     `
//     SELECT *
//     FROM "user"
//     WHERE device_token = $1
//     `,
//     [deviceToken],
//   );

//   if (rows[0]) {
//     return convertSnakeToCamel.keysToCamel(rows[0]);
//   }
//   const { rows: user } = await client.query(
//     `
//     INSERT INTO "user" (device_token)
//     VALUES ($1)
//     RETURNING *
//     `,
//     [deviceToken],
//   );
//   return convertSnakeToCamel.keysToCamel(user[0]);
// };

const findDevice = async (client: any, socialType: string, device: string) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM "user"
    WHERE social_type = $1 AND device_token = $2 AND is_deleted = false
    `,
    [socialType, device],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getUser = async (client: any, email: string, socialType: string) => {
  const { rows } = await client.query(
    `
    SELECT id
    FROM "user"
    WHERE email = $1 AND social_type = $2
    `,
    [email, socialType],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const changeUser = async (client: any, oldUserId: number, userId: number) => {
  const { rows: updateTag } = await client.query(
    `
    UPDATE tag
    SET user_id = $1
    WHERE user_id = $2
    `,
    [userId, oldUserId],
  );
  const { rows: updatePhoto } = await client.query(
    `
    UPDATE photo
    SET user_id = $1
    WHERE user_id = $2
    `,
    [userId, oldUserId],
  );
  const { rows: updatePush } = await client.query(
    `
    UPDATE push
    SET user_id = $1
    WHERE user_id = $2
    `,
    [userId, oldUserId],
  );
};

const deleteFcm = async (client: any, userId: string) => {
  const { rows } = await client.query(
    `
  UPDATE "user" 
  SET fcm_token = Null 
  WHERE id = $1
  `,
    [userId],
  );
};

const deleteUser = async (client: any, userId: number) => {
  const { rows } = await client.query(
    `
    DELETE FROM "user"
    WHERE id = $1
    RETURNING *
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const createDevice = async (client: any, data: createDeviceDTO) => {
  const { rows } = await client.query(
    `
        INSERT INTO "user"(social_type, fcm_token, device_token)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
    [data.socialType, data.fcmToken, data.deviceToken],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// refreshToken으로 특정 유저 조회
const getUserByRfToken = async (client, refreshToken) => {
  const { rows } = await client.query(
    `
    SELECT * 
    FROM "user"
    WHERE refresh_token = $1 AND is_deleted = false
    `,
    [refreshToken],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getUserById = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "user"
    WHERE id = $1
      AND is_deleted = false
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const addPlatformTag = async (client: any, userId: number, tagName: string[]) => {
  for (let i of tagName) {
    const { rows } = await client.query(
      `
      INSERT INTO tag
      (name, tag_type, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
          `,
      [i, 'platform', userId],
    );
  }
};

export default {
  findUserByEmail,
  createUser,
  updateFcm,
  findDevice,
  changeUser,
  getUser,
  deleteFcm,
  deleteUser,
  createDevice,
  addPlatformTag,
  getUserById,
  getUserByRfToken,
  findUserBySocialId,
};
