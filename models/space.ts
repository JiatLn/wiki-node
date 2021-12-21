import mongoose from 'mongoose';
import { INote } from './note';
import { IUser } from './user';

export interface ISpace extends mongoose.Document {
  name: string;
  code: string;
  description?: string;
  creator: IUser;
  notes: INote[];
  createAt: Date;
  updateAt: Date;
}

export const SpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  notes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Note',
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

const Space = mongoose.model<ISpace>('Space', SpaceSchema);
export default Space;
