import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  phone: string;
  password: string;
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
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
