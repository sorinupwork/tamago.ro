'use server';

import db from '@/lib/mongo';
import { auto, AutoSellFormData, AutoBuyFormData, AutoRentFormData, AutoAuctionFormData } from '@/lib/validations';
import { Car, Post } from '@/lib/types'; // Add type imports
import { Car as CarIcon } from 'lucide-react'; // Move import to top
import { ObjectId } from 'mongodb'; // Add import

type RawCarDoc = {
  _id: ObjectId | string; // Specify proper type
  title?: string;
  price?: string | number;
  year?: string; // Updated to string to match DB
  brand?: string;
  mileage?: string; // Updated to string to match DB
  fuel?: string;
  transmission?: string;
  location?: string | { lat: number; lng: number; address: string; fullAddress: string };
  uploadedFiles?: string[];
  carType?: string;
  color?: string;
  engineCapacity?: string; // Updated to string to match DB
  horsePower?: string; // Updated to string to match DB
  status?: string;
  description?: string;
  features?: string | string[];
  period?: string;
  startDate?: string;
  endDate?: string;
  currency?: string;
  is4x4?: boolean;
  withDriver?: boolean;
  driverName?: string;
  driverContact?: string;
  driverTelephone?: string;
  options?: string[];
  minPrice?: string;
  maxPrice?: string;
};

type ExtendedRawCarDoc = RawCarDoc & {
  urlCategory: string;
  carCategory: 'sell' | 'buy' | 'rent' | 'auction';
};

export async function submitSellAutoForm(data: AutoSellFormData & { uploadedFiles: string[]; options?: string[] }) {
  try {
    const validatedData = auto.sellSchema.parse(data);
    const result = await db.collection('sell_auto_cars').insertOne(validatedData);
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting sell auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitBuyAutoForm(data: AutoBuyFormData & { uploadedFiles: string[]; options?: string[] }) {
  try {
    const validatedData = auto.buySchema.parse(data);
    const result = await db.collection('buy_auto_cars').insertOne(validatedData);
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting buy auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitRentAutoForm(data: AutoRentFormData & { uploadedFiles: string[]; options?: string[] }) {
  try {
    const validatedData = auto.rentSchema.parse(data);
    const result = await db.collection('rent_auto_cars').insertOne(validatedData);
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting rent auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitAuctionAutoForm(data: AutoAuctionFormData & { uploadedFiles: string[]; options?: string[] }) {
  try {
    const validatedData = auto.auctionSchema.parse(data);
    const result = await db.collection('auction_auto_cars').insertOne(validatedData);
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
    const categoryMappings = [
      { collection: 'sell_auto_cars', urlCategory: 'vanzare', carCategory: 'sell' as const },
      { collection: 'buy_auto_cars', urlCategory: 'cumparare', carCategory: 'buy' as const },
      { collection: 'rent_auto_cars', urlCategory: 'inchiriere', carCategory: 'rent' as const },
      { collection: 'auction_auto_cars', urlCategory: 'licitatie', carCategory: 'auction' as const },
    ];

    // Fetch and attach categories
    const allCarsPromises = categoryMappings.map(({ collection, urlCategory, carCategory }) =>
      db.collection(collection).find({}).sort({ _id: -1 }).limit(6).toArray().then(cars =>
        cars.map(car => ({ ...car, urlCategory, carCategory } as ExtendedRawCarDoc))
      )
    );
    const allCarsArrays = await Promise.all(allCarsPromises);
    const allCars = allCarsArrays.flat();

    // Sort combined array by _id descending and take top 6
    const topCars = allCars
      .sort((a, b) => (b._id > a._id ? 1 : -1))
      .slice(0, 6);

    const posts: Post[] = topCars.map((carDoc: ExtendedRawCarDoc) => {
      const mappedCar: Car = {
        id: carDoc._id.toString(), // Use _id as string
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
