import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    quality: { 
      type: String, 
      required: true, 
        unique: true
    },
    price: { 
      type: Number, 
      required: true, 
    },
  },
  
);

export const Quality = mongoose.models.Quality || mongoose.model('Quality', productSchema);