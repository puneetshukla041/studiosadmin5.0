// models/Counter.ts
import mongoose, { Schema } from 'mongoose';

// No need to extend Document in newer Mongoose versions
export interface ICounter {
  _id: string;
  sequenceValue: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model<ICounter>('Counter', CounterSchema);

export default Counter;