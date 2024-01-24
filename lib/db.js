import { MongoClient } from 'mongodb';

export const connectToDB = async () => {
  const client = await MongoClient.connect(
    'mongodb+srv://houseplayer:rb7MijuSnVE8pZoE@cluster0.rjv3f8p.mongodb.net/?retryWrites=true&w=majority',
  );

  return client;
};
