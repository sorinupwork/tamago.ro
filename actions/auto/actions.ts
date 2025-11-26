'use server';

import { headers } from 'next/headers';
import { Car as CarIcon } from 'lucide-react';
import { ObjectId } from 'mongodb';

import { db } from '@/lib/mongo';
import { auto, AutoSellFormData, AutoBuyFormData, AutoRentFormData, AutoAuctionFormData } from '@/lib/validations';
import { Car, Post, RawCarDoc, CarHistoryItem } from '@/lib/types';
import { auth } from '@/lib/auth/auth';

export async function submitSellAutoForm(
  data: AutoSellFormData & { uploadedFiles: string[]; options?: string[]; history?: CarHistoryItem[] }
) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const userId = session?.user?.id ?? null;
  try {
    const validatedData = auto.sellSchema.parse(data);
    const result = await db.collection('sell_auto_cars').insertOne({ ...validatedData, userId });
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting sell auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitBuyAutoForm(
  data: AutoBuyFormData & { uploadedFiles: string[]; options?: string[]; history?: CarHistoryItem[] }
) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const userId = session?.user?.id ?? null;
  try {
    const validatedData = auto.buySchema.parse(data);
    const result = await db.collection('buy_auto_cars').insertOne({ ...validatedData, userId });
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting buy auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitRentAutoForm(
  data: AutoRentFormData & { uploadedFiles: string[]; options?: string[]; history?: CarHistoryItem[] }
) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const userId = session?.user?.id ?? null;
  try {
    const validatedData = auto.rentSchema.parse(data);
    const result = await db.collection('rent_auto_cars').insertOne({ ...validatedData, userId });
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting rent auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitAuctionAutoForm(
  data: AutoAuctionFormData & { uploadedFiles: string[]; options?: string[]; history?: CarHistoryItem[] }
) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const userId = session?.user?.id ?? null;
  try {
    const validatedData = auto.auctionSchema.parse(data);
    const result = await db.collection('auction_auto_cars').insertOne({ ...validatedData, userId });
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting auction auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function getSellAutoCars(params?: CarFetchParams) {
  return getCarsWithOptionalPagination('sell_auto_cars', params);
}

export async function getBuyAutoCars(params?: CarFetchParams) {
  return getCarsWithOptionalPagination('buy_auto_cars', params);
}

export async function getRentAutoCars(params?: CarFetchParams) {
  return getCarsWithOptionalPagination('rent_auto_cars', params);
}

export async function getAuctionAutoCars(params?: CarFetchParams) {
  return getCarsWithOptionalPagination('auction_auto_cars', params);
}

type CarFetchParams = {
  page?: number;
  limit?: number;
  skip?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  brand?: string;
  fuel?: string[];
  transmission?: string[];
  bodyType?: string[];
  color?: string[];
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  engineCapacityMin?: number;
  engineCapacityMax?: number;
  horsepowerMin?: number;
  horsepowerMax?: number;
  lat?: number;
  lng?: number;
  radius?: number;
};

async function getCarsWithOptionalPagination(collectionName: string, maybeParams?: CarFetchParams | unknown) {
  try {
    const params = (maybeParams as CarFetchParams) || undefined;
    if (!params) {
      const cars = await db.collection(collectionName).find({}).toArray();
      return JSON.parse(JSON.stringify(cars));
    }

    const page = Math.max(1, params.page || 1);
    let limit = Math.max(1, params.limit || 20);
    if (params.lat && params.lng && params.radius) {
      limit = 1000;
    }
    const skipVal = typeof params.skip === 'number' ? params.skip : (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (params.status && params.status !== 'all') {
      console.log('params.status:', params.status);
      filter.status = params.status;
      console.log('filter.status set to:', filter.status);
    }
    if (params.search)
      filter.$or = [{ title: { $regex: params.search, $options: 'i' } }, { description: { $regex: params.search, $options: 'i' } }];
    if (params.brand) filter.brand = params.brand;
    if (params.fuel && params.fuel.length > 0) filter.fuel = { $in: params.fuel };
    if (params.transmission && params.transmission.length > 0) filter.transmission = { $in: params.transmission };
    if (params.bodyType && params.bodyType.length > 0) filter.carType = { $in: params.bodyType };
    if (params.color && params.color.length > 0) filter.color = { $in: params.color };

    const coll = db.collection(collectionName);
    console.log('Final filter object:', filter);
    const total = await coll.countDocuments(filter);
    let sortArray: [string, 1 | -1][] = [['_id', -1]];
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'title':
          sortArray = [['title', 1]];
          break;
        case 'price_asc':
          sortArray = [['price', 1]];
          break;
        case 'price_desc':
          sortArray = [['price', -1]];
          break;
        case 'year_asc':
          sortArray = [['year', 1]];
          break;
        case 'year_desc':
          sortArray = [['year', -1]];
          break;
        case 'mileage_asc':
          sortArray = [['mileage', 1]];
          break;
        case 'mileage_desc':
          sortArray = [['mileage', -1]];
          break;
        default:
          sortArray = [['_id', -1]];
      }
    }

    const items = await coll.find(filter).sort(sortArray).skip(skipVal).limit(limit).toArray();
    console.log(`Fetched ${items.length} items from ${collectionName}`);
    items.forEach((item, index) => {
      if (item.location && typeof item.location === 'object') {
        console.log(`Item ${index}: lat=${item.location.lat}, lng=${item.location.lng}, address=${item.location.address}`);
      } else {
        console.log(`Item ${index}: no location object`);
      }
    });
    const hasMore = page * limit < total;
    return { items: JSON.parse(JSON.stringify(items)), total, hasMore };
  } catch (error) {
    console.error('Error retrieving cars from', collectionName, error);
    if (!maybeParams) return [];
    return { items: [], total: 0, hasMore: false };
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
      const createdAt = (carDoc._id as ObjectId).getTimestamp();
      const isNew = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000;

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
        traction: carDoc.traction || '',
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
        isNew,
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

      const coll = db.collection(collection);
      await coll.createIndex({ userId: 1 });
      const total = await coll.countDocuments(query);
      const cars = await coll.find(query).sort(sort).toArray();

      return { cars, total, urlCategory, carCategory };
    });

    const results = await Promise.all(allPromises);
    const allCars: RawCarDoc[] = [];
    let total = 0;

    results.forEach(({ cars, total: collTotal, urlCategory, carCategory }) => {
      total += collTotal;
      cars.forEach((car) => allCars.push({ ...car, urlCategory, carCategory } as RawCarDoc));
    });

    if (sortBy === 'createdAt') {
      allCars.sort((a, b) => {
        try {
          const aTs = (a._id as ObjectId).getTimestamp().getTime();
          const bTs = (b._id as ObjectId).getTimestamp().getTime();
          return bTs - aTs;
        } catch {
          return 0;
        }
      });
    } else if (sortBy === 'title') {
      allCars.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const pageCars = allCars.slice(start, end);

    const posts: Post[] = pageCars.map((carDoc: RawCarDoc) => {
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
        traction: carDoc.traction || '',
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
        createdAt: (carDoc._id as ObjectId).getTimestamp().toISOString(),
      };
    });

    const hasMore = page * limit < total;

    return { posts, total, page, limit, hasMore };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { posts: [], total: 0, page, limit, hasMore: false };
  }
}
