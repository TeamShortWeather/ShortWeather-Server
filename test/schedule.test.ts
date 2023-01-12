import req from "supertest";
import app from "../src/index";

describe('POST /schedule/observed', () => {
  it('관측 날씨 조회 - 200', (done) => {
    req(app).post('/schedule/observed')
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => {
        done();
      })
      .catch(err => {
        console.log(err);
        done(err);
      });
  });
});

describe('POST /schedule/forecast/daily', () => {
    it('하루 예보 저장 - 200', (done) => {
        req(app).post('/schedule/forecast/daily')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(res => {
            done();
        })
        .catch(err => {
            console.log(err);
            done(err);
        });
    });
});

describe('POST /schedule/forecast/hourly', () => {
    it('시간 예보 저장 - 200', (done) => {
      req(app).post('/schedule/forecast/hourly')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(res => {
          done();
        })
        .catch(err => {
          console.log(err);
          done(err);
        });
    });
  });

  describe('PATCH /schedule/forecast/daily', () => {
    it('기상지수 저장 성공 - 200', (done) => {
      req(app).patch('/schedule/forecast/daily')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(res => {
          done();
        })
        .catch(err => {
          console.log(err);
          done(err);
        });
    });
  }); 
