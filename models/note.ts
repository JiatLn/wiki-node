import mongoose from 'mongoose';
import { ISpace } from './space';
import { IUser } from './user';

export interface INote extends mongoose.Document {
  title: string;
  content: string;
  author: IUser;
  space: ISpace;
  createAt: Date;
  updateAt: Date;
  isPublished: Boolean;
  isDeleted: Boolean;
}

export const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  space: {
    type: mongoose.Types.ObjectId,
    ref: 'Space',
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Note = mongoose.model<INote>('Note', NoteSchema);
export default Note;
