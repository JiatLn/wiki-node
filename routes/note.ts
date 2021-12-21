import express, { Request, Response } from 'express';
import Note, { INote } from '../models/note';
import Space from '../models/space';
import User from '../models/user';

const noteRouter = express.Router();

noteRouter.post('/', async (req: Request, res: Response) => {
  if (!req.isAuth) {
    res.send({
      code: 403,
      msg: '用户认证失败！',
      data: null,
    });
  }

  const { title, content, isPublished, space } = req.body as INote;

  let newNote = new Note({
    title: title,
    content: content,
    author: req.userId,
    isPublished: isPublished,
    space: space,
  });
  let result = await newNote.save();
  // 更新
  await User.findByIdAndUpdate(req.userId, {
    $push: {
      notes: result.id,
    },
  });
  await Space.findByIdAndUpdate(space, {
    $push: {
      notes: result.id,
    },
  });
  res.send({
    code: 200,
    msg: '笔记创建成功',
    data: null,
  });
});

noteRouter.get('/list', async (req: Request, res: Response) => {
  if (!req.isAuth) {
    res.send({
      code: 403,
      msg: '用户认证失败！',
      data: null,
    });
  }
  const { pageSize, pageNum, space } = req.query;
  const total = (await Note.find({ space: space })).length;
  Note.find({ space: space })
    .limit(Number(pageSize) || 10)
    .populate({ path: 'author', model: User, select: 'username' })
    .then(notes => {
      let rows = [];
      rows = notes.map((item: INote) => {
        return {
          title: item.title,
          author: item.author.username,
          updateAt: item.updateAt,
          nid: item._id,
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

noteRouter.get('/', async (req: Request, res: Response) => {
  if (!req.isAuth) {
    res.send({
      code: 403,
      msg: '用户认证失败！',
      data: null,
    });
  }
  const { nid } = req.query;
  Note.findOne({ _id: nid })
    .populate({ path: 'author', model: User, select: 'username' })
    .then(note => {
      res.send({
        code: 200,
        msg: '',
        data: note,
      });
    });
});

export default noteRouter;
