import { ISpace } from './space';
import mongoose from 'mongoose';
import { INote } from './note';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  phone: string;
  password: string;
  spaces: ISpace[];
  notes: INote[];
}

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  spaces: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Space',
    },
  ],
  notes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
