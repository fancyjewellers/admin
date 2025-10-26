import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Rate = mongoose.models.Rate || mongoose.model('Rate', rateSchema);

export default Rate;



