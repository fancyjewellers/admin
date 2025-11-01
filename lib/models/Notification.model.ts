import  { Schema, model, models } from "mongoose";

const AppNotificationSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // Optional metadata/object from the client. Use Mixed to allow arbitrary JSON.
  meta: {
    type: Schema.Types.Mixed,
    default: null,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const AppNotification = models?.AppNotification || model("AppNotification", AppNotificationSchema);

export default AppNotification;