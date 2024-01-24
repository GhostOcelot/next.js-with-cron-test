import { connectToDB } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

const handler = async (req, res) => {
  let client;
  let db;
  try {
    client = await connectToDB();
    db = client.db('api');
  } catch (error) {
    res.send({ error: 'db error' });
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });

    if (user) {
      res.status(422).send({ message: 'this email is already registered' });
      client.close();
      return;
    }

    if (!email || !email.includes('@') || !password || password.length < 7) {
      res.status(422).send({ message: 'invalid data' });
      client.close();
      return;
    }

    try {
      const hashedPassword = await hashPassword(password);
      await db.collection('users').insertOne({ email, hashedPassword });
      client.close();
    } catch (error) {
      res.status(400).send({ message: 'error while saving to database' });
      client.close();
      return;
    }

    res.send({ message: 'user created' });
  }
};

export default handler;
