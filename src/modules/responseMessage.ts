const message = {
  NULL_VALUE: "필요한 값이 없습니다.",
  NOT_FOUND: "존재하지 않는 자원",
  BAD_REQUEST: "잘못된 요청",
  INTERNAL_SERVER_ERROR: "서버 내부 오류",
  SUCCESS: "성공",
  NULL_VALUE_TOKEN: "토큰만료",
  BAD_PATH: "잘못된 경로입니다.",
  UNAUTHORIZED: "승인되지 않은 유저입니다.",
  FORBIDDEN: "권한이 없는 유저의 요청입니다.",
  DUPLICATED: "이미 존재하는 데이터입니다.",
  TEMPORARY_UNAVAILABLE: "일시적으로 사용할 수 없는 서버입니다.",
  DB_ERROR: "데이터베이스 오류입니다.",

  CREATE_USER: "유저 생성 성공",
  SUCCESS_SIGN_OUT: "로그아웃 성공",
  SUCCESS_WITHDRAWAL: "회원탈퇴 성공",
  TOKEN_EMPTY: "토큰이 없습니다.",
  TOKEN_INVALID: "토큰이 유효하지 않음",
  CREATE_TOKEN: "토큰 생성",
  ALL_TOKEN_EXPIRED: "모든 토큰이 만료되었음",
  TOKEN_EXPIRED: "토큰 만료",
  CREATE_DEVICE_SUCCESS: "디바이스 회원가입 성공",
  DEVICE_LOGIN_SUCCESS: "디바이스 로그인 성공",

  READ_OBSERVED_WEATHER_SUCCESS: "관측 날씨 조회 성공",
  READ_OBSERVED_WEATHER_FAIL: "관측 날씨 조회 실패",

  CREATE_USER_SUCCESS: '유저 정보 입력 성공',
  CREATE_USER_FAIL: '유저 정보 입력 실패',
  READ_USER_SUCCESS: '유저 등록 조회 성공',
  READ_USER_UNAUTHORIZED: '등록되지 않은 유저입니다.',

  READ_TODAY_WEATHER_SUCCESS: '오늘 날씨 정보 조회 성공',
  READ_TODAY_WEATHER_FAIL: '오늘 날씨 정보 조회 실패',

  READ_WEATHER_DETAIL_SUCCESS: '오늘 날씨 상세 조회 성공',
  READ_WEATHER_DETAIL_FAIL: '오늘 날씨 상세 조회 실패',

  READ_TEMP_WEATHER_SUCCESS: "시간대별 온도 조회 성공",
  READ_TEMP_WEATHER_FAIL: "시간대별 온도 조회 실패",

  READ_RAIN_WEATHER_SUCCESS: "시간대별 강수 조회 성공",
};

export default message;
