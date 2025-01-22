import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema(
  {
    x: { 
      type: Number, 
      required: true, 
      trim: true 
    },
    
  },
  
);

export const Rate = mongoose.models.Rate || mongoose.model('Rate', rateSchema);



