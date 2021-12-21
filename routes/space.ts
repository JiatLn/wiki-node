import { ISpace } from './../models/space';
import express, { Request, Response } from 'express';
import Note from '../models/note';
import Space from '../models/space';
import User from '../models/user';

const spaceRouter = express.Router();

spaceRouter.post('/', async (req: Request, res: Response) => {
  if (!req.isAuth) {
    res.send({
      code: 403,
      msg: '用户认证失败！',
      data: null,
    });
  }
  const { name, code, description } = req.body;
  const newSpace = new Space({
    name: name,
    code: code,
    description: description,
    creator: req.userId,
  });
  // 保存
  let result = await newSpace.save();
  // 更新
  await User.findByIdAndUpdate(req.userId, {
    $push: {
      spaces: result.id,
    },
  });
  res.send({
    code: 200,
    msg: '知识库创建成功',
    data: null,
  });
});

spaceRouter.get('/list', async (req: Request, res: Response) => {
  if (!req.isAuth) {
    res.send({
      code: 403,
      msg: '用户认证失败！',
      data: null,
    });
  }
  const { pageSize, pageNum } = req.query;
  const total = (await Space.find()).length;
  Space.find({})
    .limit(Number(pageSize) || 10)
    .populate({ path: 'creator', model: User, select: 'username' })
    .populate({ path: 'notes', model: Note })
    .then(spaces => {
      let rows = [];
      rows = spaces.map((item: ISpace) => {
        return {
          name: item.name,
          creator: item.creator.username,
          updateAt: item.updateAt,
          noteCount: item.notes.length,
          sid: item._id,
        };
      });
      res.send({
        code: 200,
        msg: '',
        data: {
          rows: rows,
          total: total,
        },
      });
    });
});

spaceRouter.get('/', async (req: Request, res: Response) => {
  if (!req.isAuth) {
    res.send({
      code: 403,
      msg: '用户认证失败！',
      data: null,
    });
  }
  const { sid } = req.query;
  Space.findOne({ _id: sid })
    .populate({ path: 'creator', model: User, select: 'username' })
    .populate({ path: 'notes', model: Note })
    .then(space => {
      res.send({
        code: 200,
        msg: '',
        data: space,
      });
    });
});

export default spaceRouter;
