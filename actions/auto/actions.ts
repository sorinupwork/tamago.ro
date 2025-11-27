'use server';

import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';

import { db } from '@/lib/mongo';
import { auto, AutoSellFormData, AutoBuyFormData, AutoRentFormData, AutoAuctionFormData } from '@/lib/validations';
import { Post, RawCarDoc, CarHistoryItem, Car, CarBuy, CarSell, AutoFilterState, SortCriteria, LocationFilter } from '@/lib/types';
import { mapRawCarToPost } from '@/lib/auto/car-mapper';
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

export async function getCarById(category: string, carId: string): Promise<Car | null> {
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
    if (!car) return null;

    const categoryMap = {
      sell_auto_cars: 'sell',
      buy_auto_cars: 'buy',
      rent_auto_cars: 'rent',
      auction_auto_cars: 'auction',
    } as const;

    return mapRawCarToPost(car as RawCarDoc, categoryMap[collectionName as keyof typeof categoryMap]);
  } catch (error) {
    console.error('Error fetching car by ID:', error);
    return null;
  }
}

export async function getSimilarCars(category: string, excludeCarId: string, limit: number = 3): Promise<Car[]> {
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

    const categoryMap = {
      sell_auto_cars: 'sell',
      buy_auto_cars: 'buy',
      rent_auto_cars: 'rent',
      auction_auto_cars: 'auction',
    } as const;

    return (cars as RawCarDoc[]).map((car) => mapRawCarToPost(car, categoryMap[collectionName as keyof typeof categoryMap]));
  } catch (error) {
    console.error('Error fetching similar cars:', error);
    return [];
  }
}

function normalizeNumberString(value: string | number | undefined): number {
  if (!value) return 0;

  const str = String(value).trim();
  if (!str) return 0;

  const lastCommaIdx = str.lastIndexOf(',');
  const lastDotIdx = str.lastIndexOf('.');

  if (lastCommaIdx > lastDotIdx) {
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
  } else {
    return parseFloat(str.replace(/,/g, ''));
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

    const isBuyCategory = collectionName === 'buy_auto_cars';

    const query: Record<string, unknown> = {};

    if (params.status && params.status !== 'all') {
      query.status = params.status;
    }

    if (params.search) {
      query.$or = [{ title: { $regex: params.search, $options: 'i' } }, { description: { $regex: params.search, $options: 'i' } }];
    }

    if (params.brand) query.brand = params.brand;

    if (params.fuel && params.fuel.length > 0) query.fuel = { $in: params.fuel };

    if (params.transmission && params.transmission.length > 0) query.transmission = { $in: params.transmission };

    if (params.bodyType && params.bodyType.length > 0) query.carType = { $in: params.bodyType };

    if (params.color && params.color.length > 0) query.color = { $in: params.color };

    const coll = db.collection(collectionName);
    const allDocs = await coll.find(query).toArray();

    const filtered = allDocs.filter((doc: RawCarDoc) => {
      if (params.priceMin !== undefined || params.priceMax !== undefined) {
        if (isBuyCategory) {
          const minPrice = normalizeNumberString(doc.minPrice);
          const maxPrice = normalizeNumberString(doc.maxPrice);
          if (params.priceMin !== undefined && maxPrice < params.priceMin) return false;
          if (params.priceMax !== undefined && minPrice > params.priceMax) return false;
        } else {
          const price = normalizeNumberString(doc.price);
          if (params.priceMin !== undefined && price < params.priceMin) return false;
          if (params.priceMax !== undefined && price > params.priceMax) return false;
        }
      }

      if (params.yearMin !== undefined || params.yearMax !== undefined) {
        if (isBuyCategory) {
          const minYear = normalizeNumberString(doc.minYear);
          const maxYear = normalizeNumberString(doc.maxYear);
          if (params.yearMin !== undefined && maxYear < params.yearMin) return false;
          if (params.yearMax !== undefined && minYear > params.yearMax) return false;
        } else {
          const year = normalizeNumberString(doc.year);
          if (params.yearMin !== undefined && year < params.yearMin) return false;
          if (params.yearMax !== undefined && year > params.yearMax) return false;
        }
      }

      if (params.mileageMin !== undefined || params.mileageMax !== undefined) {
        if (isBuyCategory) {
          const minMileage = normalizeNumberString(doc.minMileage);
          const maxMileage = normalizeNumberString(doc.maxMileage);
          if (params.mileageMin !== undefined && maxMileage < params.mileageMin) return false;
          if (params.mileageMax !== undefined && minMileage > params.mileageMax) return false;
        } else {
          const mileage = normalizeNumberString(doc.mileage);
          if (params.mileageMin !== undefined && mileage < params.mileageMin) return false;
          if (params.mileageMax !== undefined && mileage > params.mileageMax) return false;
        }
      }

      if (params.engineCapacityMin !== undefined || params.engineCapacityMax !== undefined) {
        const capacityMinCC = params.engineCapacityMin ? params.engineCapacityMin * 1000 : undefined;
        const capacityMaxCC = params.engineCapacityMax ? params.engineCapacityMax * 1000 : undefined;

        if (isBuyCategory) {
          const minCapacity = normalizeNumberString(doc.minEngineCapacity);
          const maxCapacity = normalizeNumberString(doc.maxEngineCapacity);
          if (capacityMinCC !== undefined && maxCapacity < capacityMinCC) return false;
          if (capacityMaxCC !== undefined && minCapacity > capacityMaxCC) return false;
        } else {
          const capacity = normalizeNumberString(doc.engineCapacity);
          if (capacityMinCC !== undefined && capacity < capacityMinCC) return false;
          if (capacityMaxCC !== undefined && capacity > capacityMaxCC) return false;
        }
      }

      if (params.horsepowerMin !== undefined || params.horsepowerMax !== undefined) {
        const horsePower = normalizeNumberString(doc.horsePower);
        if (params.horsepowerMin !== undefined && horsePower < params.horsepowerMin) return false;
        if (params.horsepowerMax !== undefined && horsePower > params.horsepowerMax) return false;
      }

      return true;
    });

    if (params.sortBy) {
      filtered.sort((a: RawCarDoc, b: RawCarDoc) => {
        let aVal: number, bVal: number;

        switch (params.sortBy) {
          case 'title':
            return (a.title || '').localeCompare(b.title || '');
          case 'price_asc':
            aVal = normalizeNumberString(isBuyCategory ? a.minPrice : a.price);
            bVal = normalizeNumberString(isBuyCategory ? b.minPrice : b.price);
            return aVal - bVal;
          case 'price_desc':
            aVal = normalizeNumberString(isBuyCategory ? a.minPrice : a.price);
            bVal = normalizeNumberString(isBuyCategory ? b.minPrice : b.price);
            return bVal - aVal;
          case 'year_asc':
            aVal = normalizeNumberString(isBuyCategory ? a.minYear : a.year);
            bVal = normalizeNumberString(isBuyCategory ? b.minYear : b.year);
            return aVal - bVal;
          case 'year_desc':
            aVal = normalizeNumberString(isBuyCategory ? a.minYear : a.year);
            bVal = normalizeNumberString(isBuyCategory ? b.minYear : b.year);
            return bVal - aVal;
          case 'mileage_asc':
            aVal = normalizeNumberString(isBuyCategory ? a.minMileage : a.mileage);
            bVal = normalizeNumberString(isBuyCategory ? b.minMileage : b.mileage);
            return aVal - bVal;
          case 'mileage_desc':
            aVal = normalizeNumberString(isBuyCategory ? a.minMileage : a.mileage);
            bVal = normalizeNumberString(isBuyCategory ? b.minMileage : b.mileage);
            return bVal - aVal;
          case 'date_asc': {
            const aTime = (a._id as ObjectId).getTimestamp().getTime();
            const bTime = (b._id as ObjectId).getTimestamp().getTime();
            return aTime - bTime;
          }
          case 'date_desc': {
            const aTime = (a._id as ObjectId).getTimestamp().getTime();
            const bTime = (b._id as ObjectId).getTimestamp().getTime();
            return bTime - aTime;
          }
          default:
            return 0;
        }
      });
    } else {
      filtered.sort((a: RawCarDoc, b: RawCarDoc) => {
        const aTime = (a._id as ObjectId).getTimestamp().getTime();
        const bTime = (b._id as ObjectId).getTimestamp().getTime();
        return bTime - aTime;
      });
    }

    const total = filtered.length;
    const paginatedItems = filtered.slice(skipVal, skipVal + limit);
    const hasMore = page * limit < total;

    return { items: JSON.parse(JSON.stringify(paginatedItems)), total, hasMore };
  } catch (error) {
    console.error('[getCarsWithOptionalPagination] ERROR:', error);
    return { items: [], total: 0, hasMore: false };
  }
}

export async function getGoldenSectionPosts() {
  try {
    const categoryMappings = [
      { collection: 'sell_auto_cars', carCategory: 'sell' as const },
      { collection: 'buy_auto_cars', carCategory: 'buy' as const },
      { collection: 'rent_auto_cars', carCategory: 'rent' as const },
      { collection: 'auction_auto_cars', carCategory: 'auction' as const },
    ];

    const allCarsPromises = categoryMappings.map(({ collection, carCategory }) =>
      db
        .collection(collection)
        .find({})
        .sort({ _id: -1 })
        .limit(2)
        .toArray()
        .then((cars) => cars.map((car) => ({ ...car, carCategory })))
    );
    const allCarsArrays = await Promise.all(allCarsPromises);
    const allCars = allCarsArrays.flat();

    const topCars = allCars.sort((a, b) => (b._id > a._id ? 1 : -1)).slice(0, 6);

    const userIds = topCars
      .map((car) => (car as RawCarDoc & { carCategory: 'sell' | 'buy' | 'rent' | 'auction' }).userId)
      .filter((id): id is string => !!id)
      .map((id) => new ObjectId(id));

    const usersCollection = db.collection('user');
    const users = userIds.length > 0 ? await usersCollection.find({ _id: { $in: userIds } }).toArray() : [];
    const userVerificationMap = new Map(users.map((user) => [user._id.toString(), !!user.emailVerified]));

    const posts: Post[] = topCars.map((carDoc: RawCarDoc & { carCategory: 'sell' | 'buy' | 'rent' | 'auction' }) => {
      const post = mapRawCarToPost(carDoc, carDoc.carCategory);
      post.verified = carDoc.userId ? (userVerificationMap.get(carDoc.userId) ?? false) : false;
      return post;
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
    const allCars: (RawCarDoc & { carCategory: 'sell' | 'buy' | 'rent' | 'auction' })[] = [];
    let total = 0;

    results.forEach(({ cars, total: collTotal, carCategory }) => {
      total += collTotal;
      cars.forEach((car) => allCars.push({ ...car, carCategory } as RawCarDoc & { carCategory: 'sell' | 'buy' | 'rent' | 'auction' }));
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

    const posts: Post[] = pageCars.map((carDoc) => mapRawCarToPost(carDoc, carDoc.carCategory));

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
  try {
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
      horsepowerMax: filters.horsepowerRange[1] < 10000 ? filters.horsepowerRange[1] : undefined,
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

    const tabToCategoryMap = {
      oferta: 'sell',
      cerere: 'buy',
      inchiriere: 'rent',
      licitatie: 'auction',
    } as const;

    const mappedCars: Car[] = result.items.map((doc: RawCarDoc) =>
      mapRawCarToPost(doc, (tabToCategoryMap[activeTab as keyof typeof tabToCategoryMap] as 'sell' | 'buy' | 'rent' | 'auction') || 'sell')
    );

    return mappedCars;
  } catch (error) {
    console.error('[fetchCarsServerAction] ERROR:', error);
    return [];
  }
}
