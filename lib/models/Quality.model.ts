import mongoose from 'mongoose';

const qualitySchema = new mongoose.Schema(
  {
    quality: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Quality = mongoose.models.Quality || mongoose.model('Quality', qualitySchema);
export default Quality;