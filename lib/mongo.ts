import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);
let _db: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (!_db) {
    await client.connect();
    _db = client.db(process.env.MONGODB_DB_NAME || 'tamago');
  }
  return _db as Db;
}

export const db = await connectToDatabase();
export { client };
