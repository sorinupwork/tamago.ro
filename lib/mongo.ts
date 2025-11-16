import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);

let db: Db;

async function connectToDatabase(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db('tamago');
  }
  return db;
}

export default await connectToDatabase();
