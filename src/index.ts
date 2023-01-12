import express, { Request, Response, NextFunction } from 'express';
const app = express();

// import connectDB from './loaders/db';
import routes from './routes';
const schedule = require('node-schedule');
import generalErrorHandler from './error/generalErrorHandler';
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);
app.use(generalErrorHandler);

interface ErrorType {
  message: string;
  status: number;
}

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 8;
rule.minute = 0;
rule.tz = "Asia/Seoul";

app.use(function (err: ErrorType, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app
  .listen(process.env.PORT, () => {
    console.log(`
    ################################################
          🛡️  Server listening on port 🛡️
    ################################################
  `);
  })
  .on('error', err => {
    console.error(err);
    process.exit(1);
  });

export default app;
