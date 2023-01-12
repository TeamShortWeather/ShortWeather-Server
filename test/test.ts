const req = require("supertest");
const app = require("../src/index");

describe('GET /weather/today', () => {
  it('오늘 날씨 정보 조회 - 200', (done) => {
    req(app).get('/weather/today')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_ACCESS_TOKEN}` })
      .expect(200)
      .then(res => {
        done();
      })
      .catch(err => {
        console.log(err);
        done(err);
      });
  });
  it('오늘 날씨 정보 조회 - 401', done => {
    req(app)
      .get('/weather/today')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ` })
      .expect(401)
      .then(res => {
        done();
      })
      .catch(err => {
        console.log(err);
        done(err);
      });
  });
});
