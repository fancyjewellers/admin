import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema(
  {
    x: { 
      type: String, 
      required: true, 
      trim: true 
    },
    
  },
  
);

export const Rate = mongoose.models.Rate || mongoose.model('Rate', rateSchema);



