import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from './routes/user';
import spaceRouter from './routes/space';
import isAuth from './middleware/isAuth';
import noteRouter from './routes/note';

declare global {
  namespace Express {
    interface Request {
      isAuth?: Boolean;
      userId?: string;
    }
  }
}

const app = express();
const port = 2022;

app.use(bodyParser.json({ limit: '2100000kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use('/user', userRouter);
app.use('/space', spaceRouter);
app.use('/note', noteRouter);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {},
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Api app listening at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log('------------------');
    console.log(err);
    console.log('------------------');
  });
