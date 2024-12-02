// import mongoose from 'mongoose';

// type MongooseCache = {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// }

// // Extend the global namespace
// declare global {
//   var mongoose: MongooseCache | undefined;
// }

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable');
// }

// // Use the global variable directly since we've properly typed it
// const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// if (!global.mongoose) {
//   global.mongoose = cached;
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
//       return mongoose;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;


import mongoose, { Mongoose } from 'mongoose';

// Ensure that the MONGODB_URL is present.
const MONGODB_URL = process.env.MONGODB_URI;
if (!MONGODB_URL) {
  throw new Error('Missing MONGODB_URL');
}

// Define the interface for the Mongoose connection object.
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Retrieve or initialize the cached connection object.
// let cached: MongooseConnection = (global as any).mongoose;
let cached: MongooseConnection = (global as unknown as { mongoose: MongooseConnection }).mongoose;

if (!cached) {
  // cached = (global as any).mongoose = { conn: null, promise: null };
  cached = (global as unknown as { mongoose: MongooseConnection }).mongoose = { conn: null, promise: null };
}

// Function to connect to the database.
export const dbConnect = async () => {
  // Return the existing connection if it's already established.
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no promise of a connection, create a new connection promise.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: 'test',
      bufferCommands: false, // Disable buffering of commands.
    });
  }

  // Await the connection promise and cache the resolved connection.
  cached.conn = await cached.promise;

  // Return the established connection.
  return cached.conn;
};