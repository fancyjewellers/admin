import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    poster_no: { 
      type: Number, 
      required: true,
      unique: true 
    },
    url: { 
      type: String, 
      required: true, 
    }
  },
  
);

export const Hero = mongoose.models.Hero || mongoose.model('Hero', productSchema);