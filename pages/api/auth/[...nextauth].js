import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { connectToDB } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      authorize: async (credentials) => {
        const client = await connectToDB();
        const db = client.db('api');
        const usersCollection = await db.collection('users');

        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          client.close();
          throw new Error('no user found');
        }

        const isValid = await verifyPassword(credentials.password, user.hashedPassword);

        if (!isValid) {
          client.close();
          throw new Error('password invalid');
        }

        client.close();
        return {
          email: user.email,
        };
      },
    }),
  ],
});
