import { connectToDB } from '../../../lib/db';

const handler = async (req, res) => {
  let client;
  let db;
  try {
    client = await connectToDB();
    db = client.db('api');
  } catch (error) {
    res.send({ error: 'db error' });
  }

  try {
    await db
      .collection('users')
      .insertOne({ email: 'test@gmail.com', hashedPassword: 'test-cron-on-vercel' });
    client.close();
  } catch (error) {
    res.status(400).send({ message: 'error while saving to database' });
    client.close();
    return;
  }

  res.send({ message: 'user created' });
};

export default handler;
