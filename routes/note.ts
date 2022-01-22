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
    return
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
    data: {
      nid: result.id
    },
  });
});

noteRouter.get('/list', async (req: Request, res: Response) => {
  if (!req.isAuth) {
    res.send({
      code: 403,
      msg: '用户认证失败！',
      data: null,
    });
    return
  }
  const { space } = req.query;
  const total = (await Note.find({ space: space })).length;
  Note.find({ space: space })
    .populate({ path: 'author', model: User, select: 'username' })
    .then(notes => {
      let rows = [];
      rows = notes.map((item: INote) => {
        return {
          title: item.title,
          author: item.author.username,
          updateAt: item.updateAt,
          nid: item._id,
          isPublished: item.isPublished,
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
    return
  }
  const { nid } = req.query;
  Note.findOne({ _id: nid })
    .populate({ path: 'author', model: User, select: 'username' })
    .then(note => {
      res.send({
        code: 200,
        msg: '',
        data: note
      });
    });
});

noteRouter.delete('/', async (req: Request, res: Response) => {
  if (!req.isAuth) {
    res.send({
      code: 403,
      msg: '用户认证失败！',
      data: null,
    });
    return
  }
  const { nid } = req.query;
  let note = await Note.findById(nid);
  let authorId = note?.author._id.toHexString()
  if (!note?.id) {
    res.send({
      code: 400,
      msg: '该数据不存在',
      data: null
    })
  } else if (authorId !== req.userId) {
    res.send({
      code: 403,
      msg: '只有作者才能删除该笔记',
      data: null,
    });
  } else {
    await Note.findByIdAndRemove(nid)
    // TODO 删除User和Space中的Note记录
    res.send({
      code: 200,
      msg: '删除成功！',
      data: null
    })
  }

})

export default noteRouter;
