## ☀️☁️☔️ShortWeather-Server☀️☁️☔️

> 31th IN SOPT ShortWeather <br>
> 프로젝트 기간 : 2022.12.10 ~ 

<br>

### <strong> ☀️ Server ☀️ </strong>

| <img src="https://avatars.githubusercontent.com/u/82046935?v=4" width="200">|<img src="https://avatars.githubusercontent.com/u/81256252?v=4" width="200">|<img src="https://avatars.githubusercontent.com/u/70002218?v=4" width="200">|
| :-----------------------------------: | :-----------------------------------------------: | :-----------------------------------------------:
|                김민욱                 |                      김도연                       |                      강수현                       |
| [  coreminw ](https://github.com/coreminw) | [  doyeoo ](https://github.com/doyeoo) | [  onpyeong ](https://github.com/onpyeong) |

<br>

### <strong> 🏃 Used 🏃 </strong>
<br>
<p>
<img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white"/>
<img alt="AWS" src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white"/><br>
<img alt="Prettier" src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black"/>
<img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=for-the-badge&logo=ESLint&logoColor=white"/>
</p>
  
<br>

## ☁️ Coding Convention ☁️
<br>
<details markdown="1">
<summary>네이밍</summary>

### DB

- DB 이름은 **UpperCamelCase**를 사용합니다.

<br>

### 함수, 변수, 타입
- 함수와 변수에는 **lowerCamelCase**를 사용합니다.
- 함수명은 동사로 시작합니다.
- 타입명은 **파스칼케이스**를 사용합니다.
  - interface이름에 I를 붙이지 않습니다.
- 기본 클래스 파일을 생성하거나 컴포넌트를 생성할 때는 약어 규칙에 따라 네이밍합니다.  

<br>

### 변수 네이밍

- `날씨` → weather
- `유저` → user 
- `배열을 담은 변수`→ ~s(복수형)
- `상태` → status 

---
</details>

<br>

## ✉️ Commit Convention

```
[CHORE] 코드 수정, 내부 파일 수정 
[FEAT] 새로운 기능 구현 
[ADD] Feat 이외의 부수적인 코드 추가, 라이브러리 추가, 새로운 파일 생성 시, 에셋 추가
[HOTFIX] issue나, QA에서 급한 버그 수정에 사용
[FIX] 버그, 오류 해결
[REMOVE] 쓸모없는 코드 삭제 
[DOCS] README나 WIKI 등의 문서 개정
[MOVE] 프로젝트 내 파일이나 코드의 이동 
[RENAME] 파일 이름, 변수명, 함수명 변경이 있을 때 사용합니다. 
[REFACTOR] 전면 수정이 있을 때 사용합니다 
```
<br>

## ✨ Github Management
<br>

<details>
<summary> ✨ Gitflow ✨ </summary>
<div markdown="1">  

```
1. Issue를 생성한다.
2. 깃 컨벤션에 맞게 Branch를 생성한다.
3. Add - Commit - Push - Pull Request 의 과정을 거친다.
4. Pull Request가 작성되면 작성자 이외의 다른 팀원이 Code Review를 한다.
5. Code Review가 완료되면 Pull Request 작성자가 develop Branch로 merge 한다.
6. merge된 Branch는 삭제한다.
7. 종료된 Issue와 Pull Request의 Label과 Project를 관리한다.
```
	
### 🌴 브랜치
---
#### 📌 브랜치 단위
- 브랜치 단위 = 이슈 단위 = PR단위

#### 📌 브랜치명
- 브랜치는 뷰 단위로 생성합니다.
- 브랜치 규칙 → feature/#이슈번호-탭-기능간략설명
- `ex) feature/#1-postLike`
- 탭이름 - Weather, User
- 공통적인 것 작업 - Global
    - feature/chore/fix/network

<br>
	
### 💡 이슈, PR 규칙
---
	
#### 📌 Issue명 = PR명
- [FEAT] - 기능 구현
- [FIX] - 버그 수정
- [REFACTOR] - 코드 리팩토링(결과물은 같지만 코드의 향상)
- [CHORE] - 수정
- [ADD] - 세팅 및 라이브러리 추가

</details>

<br>

### <strong> ☔️ APIs ☔️ </strong>
|   EndPoint   |               detail               | developer | done |
| :------: | :--------------------------------: | :-------: |:--: |
|   User  |       유저 등록 확인       |   민욱    |  ❌  |
|         |       유정 정보 입력하기       |   도연    |  ❌  |
|   Setting      |       기상시간 설정       |   수현    |  ❌  |
|         |       외출/귀가시간대 설정       |   민욱    |  ❌  |
|   Weather1   |       오늘 날씨 정보 조회       |   도연    |  ❌  |
|   Weather2   |       시간별 오늘 날씨 정보 조회       |   수현    |  ❌  |
|         |       시간대별 날씨 - 날씨 조회       |   민욱    |  ❌  |
|         |       시간대별 날씨 - 강수 조회       |   수현    |  ❌  |

<br>



<br>

## <strong> ERD & Directory Tree</strong>
<details>
<summary>🗄 ERD</summary>
<img src="https://user-images.githubusercontent.com/82046935/210375222-d0b48e33-0555-466d-a526-8449eec7cfbd.png">

</details>
<br>
<details>
<summary>📦 Directory Tree</summary>

```
	
├── tsconfig.json
├── nodemone.json
├── package.json
└── src
    ├── config
    ├── controllers
    ├── interfaces
    ├── loaders
    ├── middleware
    ├── modules
    ├── routes
    ├── service
    └──  index.ts
└── test

```
</details>
<br>

## <strong>package.json</strong>
```
{
  "name": "node-typescript-init",
  "version": "1.0.0",
  "description": "> 31th IN SOPT ShortWeather <br>\r > 프로젝트 기간 : 2022.12.10 ~",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc && node dist",
    "test": "mocha test/* --timeout 10000 -exit -r ts-node/register",
    "prepare": "husky install"
  },
  "author": "doyeoo <ehdusla013@gmail.com>",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.15",
    "@types/jsonwebtoken": "^8.5.8",
    "@types/mocha": "^9.1.1",
    "@types/multer": "^1.4.7",
    "@types/multer-s3": "^2.7.12",
    "@types/mysql": "^2.15.21",
    "@types/node": "^18.11.18",
    "@typescript-eslint/eslint-plugin": "^5.30.5",
    "@typescript-eslint/parser": "^5.30.5",
    "chai": "^4.3.7",
    "eslint": "^8.19.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^17.0.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-prettier": "^4.2.1",
    "husky": "^8.0.0",
    "jest": "^29.3.1",
    "mocha": "^10.2.0",
    "nodemon": "^2.0.20",
    "supertest": "^6.3.3",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.3"
  },
  "dependencies": {
    "@prisma/client": "^4.8.1",
    "accuweather": "^1.0.1",
    "apple-auth": "^1.0.7",
    "aws-sdk": "^2.1171.0",
    "axios": "^1.2.2",
    "dayjs": "^1.11.7",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "express-validator": "^6.14.0",
    "firebase-admin": "^11.0.0",
    "jsonwebtoken": "^8.5.1",
    "lodash": "^4.17.21",
    "logger": "^0.0.1",
    "moment": "^2.29.4",
    "moment-timezone": "^0.5.38",
    "multer": "^1.4.4",
    "multer-s3": "^2.10.0",
    "mysql": "^2.18.1",
    "mysql2": "^2.3.3",
    "node-schedule": "^2.1.0",
    "pg": "^8.7.3",
    "prisma": "^4.8.1",
    "reflect-metadata": "^0.1.13",
    "request": "^2.88.2",
    "typeorm": "^0.2",
    "typeorm-naming-strategies": "^2.0.0"
  },
  "husky": {
    "hooks": {
      "pre-push": "yarn run test"
    }
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/TeamShortWeather/ShortWeather-Server.git"
  },
  "bugs": {
    "url": "https://github.com/TeamShortWeather/ShortWeather-Server/issues"
  },
  "homepage": "https://github.com/TeamShortWeather/ShortWeather-Server#readme",
  "directories": {
    "test": "test"
  },
  "keywords": []
}
```
