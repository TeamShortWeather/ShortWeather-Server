import req from "supertest";
import app from "../src/index";

describe('GET /auth/login', () => {
    it('유저 인증 - 200', (done) => {
        req(app)
        .get('/auth/login')
        .set('Content-Type', 'application/json')
        .set('deviceToken', `${process.env.TEST_DEVICE_TOKEN}`)
        .expect(200)
        .then(res => {
            done();
        })
        .catch(err => {
            console.log(err);
            done(err);
        });
    });
    //토큰 누락
    it('유저 인증 - 400', done => {
        req(app)
        .get('/auth/login')
        .set('Content-Type', 'application/json')
        .expect(400)
        .then(res => {
            done();
        })
        .catch(err => {
            console.log(err);
            done(err);
        });
    });
});

describe('POST /auth', () => {
    it('유저 정보 입력 - 201', (done) => {
        req(app)
        .post('/auth')
        .type('application/json')
        .send({
            "gender": "여자",
            "age": "20",
            "tempSens": "더위를 잘타요",
            "wakeUpTime": "0800",
            "goOutTime": "0800",
            "goHomeTime": "0800",
            "deviceToken": "sadas"
        })
        .expect(201)
        .then(res => {
            done();
        })
        .catch(err => {
            console.log(err);
            done(err);
        });
    });
    //토큰 누락
    it('유저 인증 - 400', done => {
        req(app)
        .post('/auth')
        .set('Content-Type', 'application/json')
        .expect(400)
        .then(res => {
            done();
        })
        .catch(err => {
            console.log(err);
            done(err);
        });
    });
});
  