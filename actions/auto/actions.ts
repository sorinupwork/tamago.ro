'use server';

import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';

import { db } from '@/lib/mongo';
import { auto, AutoSellFormData, AutoBuyFormData, AutoRentFormData, AutoAuctionFormData } from '@/lib/validations';
import { Post, RawCarDoc, CarHistoryItem, Car, AutoFilterState, SortCriteria, LocationFilter } from '@/lib/types';
import { auth } from '@/lib/auth/auth';

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

export async function getCarById(category: string, carId: string): Promise<RawCarDoc | null> {
  try {
    const categoryMappings: Record<string, string> = {
      oferta: 'sell_auto_cars',
      cerere: 'buy_auto_cars',
      inchiriere: 'rent_auto_cars',
      licitatie: 'auction_auto_cars',
    };

    const collectionName = categoryMappings[category];
    if (!collectionName) return null;

    const car = await db.collection(collectionName).findOne({ _id: new ObjectId(carId) });
    return car ? JSON.parse(JSON.stringify(car)) : null;
  } catch (error) {
    console.error('Error fetching car by ID:', error);
    return null;
  }
}

export async function getSimilarCars(category: string, excludeCarId: string, limit: number = 3): Promise<RawCarDoc[]> {
  try {
    const categoryMappings: Record<string, string> = {
      oferta: 'sell_auto_cars',
      cerere: 'buy_auto_cars',
      inchiriere: 'rent_auto_cars',
      licitatie: 'auction_auto_cars',
    };

    const collectionName = categoryMappings[category];
    if (!collectionName) return [];

    const cars = await db
      .collection(collectionName)
      .find({ _id: { $ne: new ObjectId(excludeCarId) } })
      .sort({ _id: -1 })
      .limit(limit)
      .toArray();

    return JSON.parse(JSON.stringify(cars));
  } catch (error) {
    console.error('Error fetching similar cars:', error);
    return [];
  }
}

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
      limit = 100;
    }
    const skipVal = typeof params.skip === 'number' ? params.skip : (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (params.status && params.status !== 'all') {
      filter.status = params.status;
    }
    if (params.search)
      filter.$or = [{ title: { $regex: params.search, $options: 'i' } }, { description: { $regex: params.search, $options: 'i' } }];
    if (params.brand) filter.brand = params.brand;
    if (params.fuel && params.fuel.length > 0) filter.fuel = { $in: params.fuel };
    if (params.transmission && params.transmission.length > 0) filter.transmission = { $in: params.transmission };
    if (params.bodyType && params.bodyType.length > 0) filter.carType = { $in: params.bodyType };
    if (params.color && params.color.length > 0) filter.color = { $in: params.color };

    const coll = db.collection(collectionName);
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
      { collection: 'sell_auto_cars', urlCategory: 'oferta', carCategory: 'sell' as const },
      { collection: 'buy_auto_cars', urlCategory: 'cerere', carCategory: 'buy' as const },
      { collection: 'rent_auto_cars', urlCategory: 'inchiriere', carCategory: 'rent' as const },
      { collection: 'auction_auto_cars', urlCategory: 'licitatie', carCategory: 'auction' as const },
    ];

    const allCarsPromises = categoryMappings.map(({ collection, urlCategory, carCategory }) =>
      db
        .collection(collection)
        .find({})
        .sort({ _id: -1 })
        .limit(2)
        .toArray()
        .then((cars) => cars.map((car) => ({ ...car, urlCategory, carCategory }) as ExtendedRawCarDoc))
    );
    const allCarsArrays = await Promise.all(allCarsPromises);
    const allCars = allCarsArrays.flat();

    const topCars = allCars.sort((a, b) => (b._id > a._id ? 1 : -1)).slice(0, 6);

    const posts: Post[] = topCars.map((carDoc: ExtendedRawCarDoc) => {
      const createdAt = (carDoc._id as ObjectId).getTimestamp();
      const isNew = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000;

      return {
        id: carDoc._id.toString(),
        title: carDoc.title || '',
        desc: carDoc.description || 'No description available',
        verified: true,
        isNew,
        imageUrl: carDoc.uploadedFiles && carDoc.uploadedFiles.length > 0 ? carDoc.uploadedFiles[0] : '/placeholder.svg',
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
      { collection: 'sell_auto_cars', urlCategory: 'oferta', carCategory: 'sell' as const },
      { collection: 'buy_auto_cars', urlCategory: 'cerere', carCategory: 'buy' as const },
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
      return {
        id: carDoc._id.toString(),
        title: carDoc.title || '',
        category: carDoc.urlCategory || '',
        price: carDoc.price || null,
        currency: carDoc.currency || 'RON',
        images: carDoc.images,
        status: carDoc.status as 'active' | 'sold' | 'draft',
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

export async function fetchCarsServerAction(params: {
  activeTab: string;
  searchQuery: string;
  filters: AutoFilterState;
  sortCriteria: SortCriteria;
  locationFilter: LocationFilter;
}): Promise<Car[]> {
  const { activeTab, searchQuery, filters, sortCriteria, locationFilter } = params;

  const fetchParams = {
    page: 1,
    limit: 100,
    search: searchQuery,
    status: filters.status || undefined,
    sortBy: Object.keys(sortCriteria).find((key) => sortCriteria[key as keyof SortCriteria])
      ? `${Object.keys(sortCriteria).find((key) => sortCriteria[key as keyof SortCriteria])}_${sortCriteria[Object.keys(sortCriteria).find((key) => sortCriteria[key as keyof SortCriteria]) as keyof SortCriteria]}`
      : undefined,
    brand: filters.brand || undefined,
    fuel: filters.fuel.length > 0 ? filters.fuel : undefined,
    transmission: filters.transmission.length > 0 ? filters.transmission : undefined,
    bodyType: filters.bodyType.length > 0 ? filters.bodyType : undefined,
    priceMin: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    priceMax: filters.priceRange[1] < 1000000 ? filters.priceRange[1] : undefined,
    yearMin: filters.yearRange[0] > 1900 ? filters.yearRange[0] : undefined,
    yearMax: filters.yearRange[1] < 2025 ? filters.yearRange[1] : undefined,
    mileageMin: filters.mileageRange[0] > 0 ? filters.mileageRange[0] : undefined,
    mileageMax: filters.mileageRange[1] < 1000000 ? filters.mileageRange[1] : undefined,
    engineCapacityMin: filters.engineCapacityRange[0] > 0 ? filters.engineCapacityRange[0] : undefined,
    engineCapacityMax: filters.engineCapacityRange[1] < 10 ? filters.engineCapacityRange[1] : undefined,
    horsepowerMin: filters.horsepowerRange[0] > 0 ? filters.horsepowerRange[0] : undefined,
    horsepowerMax: filters.horsepowerRange[1] < 1000 ? filters.horsepowerRange[1] : undefined,
    lat: locationFilter.location?.lat,
    lng: locationFilter.location?.lng,
    radius: locationFilter.radius,
  };

  let result;
  switch (activeTab) {
    case 'oferta':
      result = await getSellAutoCars(fetchParams);
      break;
    case 'cerere':
      result = await getBuyAutoCars(fetchParams);
      break;
    case 'inchiriere':
      result = await getRentAutoCars(fetchParams);
      break;
    case 'licitatie':
      result = await getAuctionAutoCars(fetchParams);
      break;
    default:
      result = { items: [], total: 0, hasMore: false };
      break;
  }

  const mappedCars: Car[] = result.items.map((doc: RawCarDoc) => ({
    id: doc._id.toString(),
    title: doc.title || '',
    price: String(doc.price || '0'),
    currency: doc.currency || 'RON',
    period: doc.period || '',
    startDate: doc.startDate || '',
    endDate: doc.endDate || '',
    year: parseInt(doc.year || '2020') || 2020,
    brand: doc.brand || '',
    category: (activeTab === 'oferta' ? 'sell' : activeTab === 'cerere' ? 'buy' : activeTab === 'inchiriere' ? 'rent' : 'auction') as
      | 'sell'
      | 'buy'
      | 'rent'
      | 'auction',
    mileage: parseInt(doc.mileage || '0') || 0,
    fuel: doc.fuel || '',
    transmission: doc.transmission || '',
    location: typeof doc.location === 'string' ? doc.location : doc.location?.address || '',
    images: doc.uploadedFiles && doc.uploadedFiles.length > 0 ? doc.uploadedFiles : ['/placeholder.svg'],
    dateAdded: new Date().toISOString(),
    sellerType: 'private' as const,
    contactPhone: '123456789',
    contactEmail: 'email@example.com',
    bodyType: doc.carType || '',
    color: doc.color || '',
    engineCapacity: doc.engineCapacity ? parseFloat(doc.engineCapacity) : undefined,
    horsepower: doc.horsePower ? parseInt(doc.horsePower) : undefined,
    status: doc.status || 'used',
    description: doc.description,
    features: doc.features ? (typeof doc.features === 'string' ? doc.features.split(',') : doc.features) : [],
    traction: doc.traction || '',
    withDriver: doc.withDriver || false,
    driverName: doc.driverName || '',
    driverContact: doc.driverContact || '',
    driverTelephone: doc.driverTelephone || '',
    options: doc.options || [],
    lat: typeof doc.location === 'object' ? doc.location?.lat : undefined,
    lng: typeof doc.location === 'object' ? doc.location?.lng : undefined,
    minPrice: doc.minPrice,
    maxPrice: doc.maxPrice,
    userId: doc.userId ? doc.userId.toString() : '',
    history: doc.history || [],
  }));

  return mappedCars;
}
