import  { Schema, model, models } from "mongoose";

const AppNotificationSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
    lastUpdated:{
      type: Date,
      default: Date.now,
    }})

const AppNotification = models?.AppNotification || model("AppNotification", AppNotificationSchema);

export default AppNotification;