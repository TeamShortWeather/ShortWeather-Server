import req from "supertest";
import app from "../src/index";

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

describe('GET /weather/today/question', () => {
  it('오늘 날씨 물음표 멘트 조회 - 200', (done) => {
    req(app).get('/weather/today/question')
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
  it('오늘 날씨 물음표 멘트 조회 - 401', done => {
    req(app)
      .get('/weather/today/question')
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

describe('GET weather/today/detail', () => {
  it('오늘 날씨 상세 조회 성공 - 200', (done) => {
    req(app).get('/weather/today/detail')
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
  it('오늘 날씨 상세 조회 성공 - 401', done => {
    req(app)
      .get('/weather/today/detail')
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

describe('GET weather/today/detail/temp', () => {
  it('시간대별 날씨 온도 조회 성공 - 200', (done) => {
    req(app).get('/weather/today/detail/temp')
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
  it('시간대별 날씨 온도 조회 성공 - 401', done => {
    req(app)
      .get('/weather/today/detail/temp')
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

describe('GET weather/today/detail/rain', () => {
  it('시간대별 날씨 강수 조회 성공 - 200', (done) => {
    req(app).get('/weather/today/detail/rain')
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
  it('시간대별 날씨 강수 조회 성공 - 401', done => {
    req(app)
      .get('/weather/today/detail/rain')
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
