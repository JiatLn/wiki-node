import express, { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user';

const userRouter = express.Router();

userRouter.get('/login', (req, res: Response) => {
  console.log(req.header);
  res.send('登录页');
});

userRouter.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      username: username,
    });
    const isEqual = await bcrypt.compare(password, user?.password ?? '');
    if (!user || !isEqual) {
      res.send({
        code: 400,
        msg: '用户名或密码错误',
      });
      return;
    }
    // 生成token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      'somesupersecretkey',
      {
        expiresIn: '24h',
      },
    );
    res.send({
      code: 200,
      msg: '登录成功',
      data: {
        token,
        username: user.username,
        id: user.id,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      code: 500,
      msg: '未知的错误发生了~',
    });
  }
});

userRouter.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  let user = await User.findOne({
    username: username,
  });
  if (user?.id) {
    res.send({
      code: 400,
      msg: '该用户已被注册',
    });
    return;
  }

  // 生成hash密码
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser: IUser = new User({
    username: username,
    password: hashedPassword,
  });
  // 保存用户
  await newUser.save();
  res.send({
    code: 200,
    msg: '注册成功',
  });
});

export default userRouter;
