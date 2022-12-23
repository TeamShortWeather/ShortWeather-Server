export interface userSearchInput {
  id?: number;
  email?: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
}

export interface userInputDTO {
  name: string;
  email: string;
  socialType: string;
  fcmToken?: string;
  socialId?: string;
}

export interface userInputDTO2 {
  email: string;
  socialType: string;
  fcmToken?: string;
}

export interface changeUserDTO {
  deviceToken: string;
  socialUserId: number;
  deviceId: number;
  email: string;
  socialType: string;
  fcmToken?: string;
}

export interface createDeviceDTO {
  fcmToken?: string;
  socialType: string;
  deviceToken: string;
}
