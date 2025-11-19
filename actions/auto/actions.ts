'use server';

import { headers } from 'next/headers';
import { Car as CarIcon } from 'lucide-react';

import { db } from '@/lib/mongo';
import { auto, AutoSellFormData, AutoBuyFormData, AutoRentFormData, AutoAuctionFormData } from '@/lib/validations';
import { Car, Post, RawCarDoc } from '@/lib/types';
import { auth } from '@/lib/auth/auth';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export async function submitSellAutoForm(data: AutoSellFormData & { uploadedFiles: string[]; options?: string[] }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }
  try {
    const validatedData = auto.sellSchema.parse(data);
    const result = await db.collection('sell_auto_cars').insertOne({ ...validatedData, userId: session.user.id });
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting sell auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitBuyAutoForm(data: AutoBuyFormData & { uploadedFiles: string[]; options?: string[] }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }
  try {
    const validatedData = auto.buySchema.parse(data);
    const result = await db.collection('buy_auto_cars').insertOne({ ...validatedData, userId: session.user.id });
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting buy auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitRentAutoForm(data: AutoRentFormData & { uploadedFiles: string[]; options?: string[] }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }
  try {
    const validatedData = auto.rentSchema.parse(data);
    const result = await db.collection('rent_auto_cars').insertOne({ ...validatedData, userId: session.user.id });
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting rent auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitAuctionAutoForm(data: AutoAuctionFormData & { uploadedFiles: string[]; options?: string[] }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }
  try {
    const validatedData = auto.auctionSchema.parse(data);
    const result = await db.collection('auction_auto_cars').insertOne({ ...validatedData, userId: session.user.id });
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting auction auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function getSellAutoCars() {
  try {
    const cars = await db.collection('sell_auto_cars').find({}).toArray();
    return JSON.parse(JSON.stringify(cars));
  } catch (error) {
    console.error('Error retrieving sell auto cars:', error);
    return [];
  }
}

export async function getBuyAutoCars() {
  try {
    const cars = await db.collection('buy_auto_cars').find({}).toArray();
    return JSON.parse(JSON.stringify(cars));
  } catch (error) {
    console.error('Error retrieving buy auto cars:', error);
    return [];
  }
}

export async function getRentAutoCars() {
  try {
    const cars = await db.collection('rent_auto_cars').find({}).toArray();
    return JSON.parse(JSON.stringify(cars));
  } catch (error) {
    console.error('Error retrieving rent auto cars:', error);
    return [];
  }
}

export async function getAuctionAutoCars() {
  try {
    const cars = await db.collection('auction_auto_cars').find({}).toArray();
    return JSON.parse(JSON.stringify(cars));
  } catch (error) {
    console.error('Error retrieving auction auto cars:', error);
    return [];
  }
}

export async function getGoldenSectionPosts() {
  try {
    type ExtendedRawCarDoc = RawCarDoc & {
      urlCategory: string;
      carCategory: 'sell' | 'buy' | 'rent' | 'auction';
    };
    const categoryMappings = [
      { collection: 'sell_auto_cars', urlCategory: 'vanzare', carCategory: 'sell' as const },
      { collection: 'buy_auto_cars', urlCategory: 'cumparare', carCategory: 'buy' as const },
      { collection: 'rent_auto_cars', urlCategory: 'inchiriere', carCategory: 'rent' as const },
      { collection: 'auction_auto_cars', urlCategory: 'licitatie', carCategory: 'auction' as const },
    ];

    const allCarsPromises = categoryMappings.map(({ collection, urlCategory, carCategory }) =>
      db
        .collection(collection)
        .find({})
        .sort({ _id: -1 })
        .limit(6)
        .toArray()
        .then((cars) => cars.map((car) => ({ ...car, urlCategory, carCategory }) as ExtendedRawCarDoc))
    );
    const allCarsArrays = await Promise.all(allCarsPromises);
    const allCars = allCarsArrays.flat();

    const topCars = allCars.sort((a, b) => (b._id > a._id ? 1 : -1)).slice(0, 6);

    const posts: Post[] = topCars.map((carDoc: ExtendedRawCarDoc) => {
      const mappedCar: Car = {
        id: carDoc._id.toString(),
        title: carDoc.title || '',
        price: String(carDoc.price || '0'),
        currency: carDoc.currency || 'RON',
        period: carDoc.period || '',
        startDate: carDoc.startDate || '',
        endDate: carDoc.endDate || '',
        year: parseInt(carDoc.year || '2020') || 2020,
        brand: carDoc.brand || 'Unknown',
        category: carDoc.carCategory,
        mileage: parseInt(carDoc.mileage || '0') || 0,
        fuel: carDoc.fuel || 'Petrol',
        transmission: carDoc.transmission || 'Manual',
        location: typeof carDoc.location === 'string' ? carDoc.location : carDoc.location?.address || '',
        images: carDoc.uploadedFiles && carDoc.uploadedFiles.length > 0 ? carDoc.uploadedFiles : ['/placeholder.svg'],
        dateAdded: new Date().toISOString(),
        sellerType: 'private',
        contactPhone: '123456789',
        contactEmail: 'email@example.com',
        bodyType: carDoc.carType || 'Sedan',
        color: carDoc.color || 'Alb',
        engineCapacity: carDoc.engineCapacity ? parseFloat(carDoc.engineCapacity) : undefined,
        horsepower: carDoc.horsePower ? parseInt(carDoc.horsePower) : undefined,
        status: carDoc.status || 'used',
        description: carDoc.description,
        features: carDoc.features ? (typeof carDoc.features === 'string' ? carDoc.features.split(',') : carDoc.features) : [],
        is4x4: carDoc.is4x4 || false,
        withDriver: carDoc.withDriver || false,
        driverName: carDoc.driverName || '',
        driverContact: carDoc.driverContact || '',
        driverTelephone: carDoc.driverTelephone || '',
        options: carDoc.options || [],
        lat: typeof carDoc.location === 'object' ? carDoc.location?.lat : 45.9432,
        lng: typeof carDoc.location === 'object' ? carDoc.location?.lng : 24.9668,
        minPrice: carDoc.minPrice,
        maxPrice: carDoc.maxPrice,
        userId: carDoc.userId || '',
      };

      return {
        id: carDoc._id.toString(),
        title: mappedCar.title,
        desc: mappedCar.description || 'No description available',
        icon: CarIcon,
        verified: true,
        isNew: false,
        imageUrl: mappedCar.images[0],
        category: carDoc.urlCategory,
      };
    });

    return posts;
  } catch (error) {
    console.error('Error fetching golden section posts:', error);
    return [];
  }
}

// New server action for fetching user posts with filters, sorting, searching, and pagination
export async function getUserCars({
  userId,
  category,
  status,
  sortBy = 'createdAt',
  search,
  page = 1,
  limit = 10,
}: {
  userId: string;
  category?: string;
  status?: string;
  sortBy?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const categoryMappings = [
      { collection: 'sell_auto_cars', urlCategory: 'vanzare', carCategory: 'sell' as const },
      { collection: 'buy_auto_cars', urlCategory: 'cumparare', carCategory: 'buy' as const },
      { collection: 'rent_auto_cars', urlCategory: 'inchiriere', carCategory: 'rent' as const },
      { collection: 'auction_auto_cars', urlCategory: 'licitatie', carCategory: 'auction' as const },
    ];

    const collectionsToQuery = category ? categoryMappings.filter((m) => m.carCategory === category) : categoryMappings;

    const allPromises = collectionsToQuery.map(async ({ collection, urlCategory, carCategory }) => {
      const query: { userId: string; status?: string; $or?: Array<{ [key: string]: { $regex: string; $options: string } }> } = { userId };

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search) {
        query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
      }

      const sort: { _id?: 1 | -1; title?: 1 | -1 } = {};
      if (sortBy === 'createdAt') {
        sort._id = -1;
      } else if (sortBy === 'title') {
        sort.title = 1;
      }

      const total = await db.collection(collection).countDocuments(query);
      const cars = await db
        .collection(collection)
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      return { cars, total, urlCategory, carCategory };
    });

    const results = await Promise.all(allPromises);
    const allCars: RawCarDoc[] = [];
    let total = 0;

    results.forEach(({ cars, total: collTotal, urlCategory, carCategory }) => {
      total += collTotal;
      cars.forEach((car) => allCars.push({ ...car, urlCategory, carCategory } as RawCarDoc));
    });

    const posts: Post[] = allCars.map((carDoc: RawCarDoc) => {
      const mappedCar: Car = {
        id: carDoc._id.toString(),
        title: carDoc.title || '',
        price: carDoc.price ? String(carDoc.price) : carDoc.minPrice && carDoc.maxPrice ? `${carDoc.minPrice}-${carDoc.maxPrice}` : '0',
        currency: carDoc.currency || 'RON',
        period: carDoc.period || '',
        startDate: carDoc.startDate || '',
        endDate: carDoc.endDate || '',
        year: parseInt(carDoc.year || '2020') || 2020,
        brand: carDoc.brand || 'Unknown',
        category: carDoc.carCategory || 'sell',
        mileage: parseInt(carDoc.mileage || '0') || 0,
        fuel: carDoc.fuel || 'Petrol',
        transmission: carDoc.transmission || 'Manual',
        location: typeof carDoc.location === 'string' ? carDoc.location : carDoc.location?.address || '',
        images: carDoc.uploadedFiles && carDoc.uploadedFiles.length > 0 ? carDoc.uploadedFiles : ['/placeholder.svg'],
        dateAdded: new Date().toISOString(),
        sellerType: 'private',
        contactPhone: '123456789',
        contactEmail: 'email@example.com',
        bodyType: carDoc.carType || 'Sedan',
        color: carDoc.color || 'Alb',
        engineCapacity: carDoc.engineCapacity ? parseFloat(carDoc.engineCapacity) : undefined,
        horsepower: carDoc.horsePower ? parseInt(carDoc.horsePower) : undefined,
        status: carDoc.status || 'active',
        description: carDoc.description,
        features: carDoc.features ? (typeof carDoc.features === 'string' ? carDoc.features.split(',') : carDoc.features) : [],
        is4x4: carDoc.is4x4 || false,
        withDriver: carDoc.withDriver || false,
        driverName: carDoc.driverName || '',
        driverContact: carDoc.driverContact || '',
        driverTelephone: carDoc.driverTelephone || '',
        options: carDoc.options || [],
        lat: typeof carDoc.location === 'object' ? carDoc.location?.lat : 45.9432,
        lng: typeof carDoc.location === 'object' ? carDoc.location?.lng : 24.9668,
        minPrice: carDoc.minPrice,
        maxPrice: carDoc.maxPrice,
        userId: carDoc.userId || '',
      };

      return {
        id: carDoc._id.toString(),
        title: mappedCar.title,
        category: carDoc.urlCategory || '',
        price: mappedCar.price || null,
        currency: mappedCar.currency || 'RON',
        images: mappedCar.images,
        status: mappedCar.status as 'active' | 'sold' | 'draft',
        views: carDoc.views || 0,
        createdAt: carDoc._id.toString(),
      };
    });

    const hasMore = page * limit < total;

    return { posts, total, page, limit, hasMore };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { posts: [], total: 0, page, limit, hasMore: false };
  }
}
