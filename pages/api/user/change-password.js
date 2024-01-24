import { getSession } from 'next-auth/client';
import { connectToDB } from '../../../lib/db';
import { hashPassword, verifyPassword } from '../../../lib/auth';

const handler = async (req, res) => {
  if (req.method === 'PATCH') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).send({ message: 'Only authenticated users can change password' });
      return;
    }

    const { oldPassword, newPassword } = req.body;

    let client;
    let db;
    try {
      client = await connectToDB();
      db = client.db('api');
    } catch (error) {
      res.send({ error: 'db error' });
    }

    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: session.user.email });

    if (!user) {
      res.status(400).send({ message: 'Something went wrong' });
      client.close();
      return;
    }

    const isValid = await verifyPassword(oldPassword, user.hashedPassword);

    if (!isValid) {
      res.status(400).send({ message: 'Old password incorrect' });
      client.close();
      return;
    }

    const newHashedPassword = await hashPassword(newPassword);

    await usersCollection.updateOne(
      { email: session.user.email },
      {
        $set: { hashedPassword: newHashedPassword },
      },
    );

    res.status(200).send({ message: 'Password updated' });

    client.close();
  }
};

export default handler;
