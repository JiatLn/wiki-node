import mongoose from 'mongoose';
import { ISpace } from './space';
import { IUser } from './user';

export interface IPage extends mongoose.Document {
  name: string;
  content: string;
  creator: IUser;
  space: ISpace;
  createAt: Date;
  updateAt: Date;
}

export const PageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  space: {
    type: mongoose.Types.ObjectId,
    ref: 'Space',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

const Page = mongoose.model<IPage>('Page', PageSchema);
export default Page;
