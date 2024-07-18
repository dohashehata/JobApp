// import { connect } from 'mongoose';

// const MONGO_URI = 'mongodb://localhost:27017/AppJop'; 

// const dbConnection = async () => {
//   try {
//     await connect(MONGO_URI);
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// };

// export default dbConnection;




import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI; 

const dbConnection = async () => {
  try {
    await connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default dbConnection;
