import mongoose from 'mongoose';

const stopperSchema = new mongoose.Schema(
  {
    x: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const Stopper = mongoose.models.Stopper || mongoose.model('Stopper', stopperSchema);
export default Stopper;