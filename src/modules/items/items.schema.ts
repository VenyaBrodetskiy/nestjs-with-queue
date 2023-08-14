import { Schema, Document } from 'mongoose';

export const ItemSchema = new Schema({
  name: String,
  description: String,
});

export interface Item extends Document {
  name: string;
  description: string;
}
