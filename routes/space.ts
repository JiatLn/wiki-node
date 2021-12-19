import { ISpace } from './../models/space';
import express, { Request, Response } from 'express';
import Page from '../models/page';
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
  await newSpace.save();
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
  const { pageSize, pageNum } = req.params;
  const total = (await Space.find()).length;
  Space.find({})
    .limit(Number(pageSize) || 10)
    .populate({ path: 'creator', model: User, select: 'username' })
    .populate({ path: 'pages', model: Page })
    .then(spaces => {
      let rows = [];
      rows = spaces.map((item: ISpace) => {
        return {
          name: item.name,
          creator: item.creator.username,
          updateAt: item.updateAt,
          pageCount: item.pages.length,
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

export default spaceRouter;
