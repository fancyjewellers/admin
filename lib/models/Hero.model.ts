import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    poster_no: {
      type: Number,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Hero = mongoose.models.Hero || mongoose.model('Hero', heroSchema);
export default Hero;