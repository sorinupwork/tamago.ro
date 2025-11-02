import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectToDatabase() {
  try {
    await client.connect();
    return client.db('tamago');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function insertDocument(collectionName: string, document: Record<string, unknown>) {
  const db = await connectToDatabase();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(document);
  return result;
}
