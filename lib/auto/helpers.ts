import { ObjectId } from 'mongodb';

import type { RawCarDoc, Car, CarSell, CarBuy, CarRent, CarAuction, Post } from '../types';

export function getPriceValue(car: Car): string {
  if (car.category === 'buy') {
    return car.minPrice;
  }
  return car.price;
}

export function getPriceNumeric(car: Car): number {
  const priceStr = getPriceValue(car);
  const lastCommaIdx = priceStr.lastIndexOf(',');
  const lastDotIdx = priceStr.lastIndexOf('.');

  if (lastCommaIdx > lastDotIdx) {
    return parseFloat(priceStr.replace(/\./g, '').replace(',', '.'));
  } else {
    return parseFloat(priceStr.replace(/,/g, ''));
  }
}

export function getMaxPrice(car: Car): string {
  if (car.category === 'buy') {
    return car.maxPrice;
  }
  return car.price;
}

export function getMaxPriceNumeric(car: Car): number {
  const priceStr = getMaxPrice(car);
  const lastCommaIdx = priceStr.lastIndexOf(',');
  const lastDotIdx = priceStr.lastIndexOf('.');

  if (lastCommaIdx > lastDotIdx) {
    return parseFloat(priceStr.replace(/\./g, '').replace(',', '.'));
  } else {
    return parseFloat(priceStr.replace(/,/g, ''));
  }
}

export function getDisplayPrice(car: Car): string {
  if (car.category === 'buy') {
    return `${car.minPrice} - ${car.maxPrice}`;
  } else if (car.category === 'rent') {
    return `${car.price} / ${car.period}`;
  }
  return car.price;
}

export function getPriceWithCurrency(car: Car): string {
  return `${getDisplayPrice(car)} ${car.currency || 'RON'}`;
}

function parseNumberSafely(value: string | number | undefined): number {
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

export function mapRawCarToPost(doc: RawCarDoc, category: 'sell' | 'buy' | 'rent' | 'auction' = 'sell'): Post {
  const id = typeof doc._id === 'string' ? doc._id : doc._id.toString();

  let createdAt: string | undefined;
  if (typeof doc._id !== 'string' && 'getTimestamp' in doc._id) {
    createdAt = (doc._id as ObjectId).getTimestamp().toISOString();
  }

  // Location is now always an object with {lat, lng, address}
  const locationObj = typeof doc.location === 'object' ? doc.location : { lat: 44.4268, lng: 26.1025, address: doc.location || 'Unknown' };
  const location = locationObj.address;
  const lat = locationObj.lat;
  const lng = locationObj.lng;

  const baseProps = {
    id,
    title: doc.title || '',
    description: doc.description,
    location,
    lat,
    lng,
    brand: doc.brand || '',
    model: doc.model || '',
    fuel: doc.fuel || '',
    transmission: doc.transmission || '',
    color: doc.color || '',
    bodyType: doc.carType || '',
    traction: doc.traction,
    status: doc.status,
    steeringWheelPosition:
      doc.steeringWheelPosition === 'left' ? 'Stânga' : doc.steeringWheelPosition === 'right' ? 'Dreapta' : doc.steeringWheelPosition,
    features: typeof doc.features === 'string' ? doc.features.split(',').map((f) => f.trim()) : doc.features,
    images: (doc.uploadedFiles && doc.uploadedFiles.length > 0 ? doc.uploadedFiles : doc.images) || ['/placeholder.svg'],
    options: doc.options,
    history: doc.history,
    views: doc.views,
    userId: doc.userId,
    user: doc.user,
    sellerType: (doc.sellerType === 'firm' ? 'firm' : 'private') as 'private' | 'firm',
    contactPhone: doc.contactPhone || '',
    contactEmail: doc.contactEmail || '',
    currency: doc.currency || 'RON',
    createdAt: createdAt || new Date().toISOString(),
  };

  switch (category) {
    case 'buy': {
      return {
        ...baseProps,
        category: 'buy',
        minPrice: doc.minPrice || '',
        maxPrice: doc.maxPrice || '',
        minMileage: doc.minMileage,
        maxMileage: doc.maxMileage,
        minYear: doc.minYear ? parseInt(String(doc.minYear)) : undefined,
        maxYear: doc.maxYear ? parseInt(String(doc.maxYear)) : undefined,
        minEngineCapacity: doc.minEngineCapacity ? parseFloat(String(doc.minEngineCapacity)) : undefined,
        maxEngineCapacity: doc.maxEngineCapacity ? parseFloat(String(doc.maxEngineCapacity)) : undefined,
        minHorsePower: doc.minHorsePower ? parseInt(String(doc.minHorsePower)) : undefined,
        maxHorsePower: doc.maxHorsePower ? parseInt(String(doc.maxHorsePower)) : undefined,
      } as CarBuy;
    }

    case 'rent': {
      return {
        ...baseProps,
        category: 'rent',
        price: String(doc.price || ''),
        period: doc.period || 'week',
        startDate: doc.startDate || '',
        endDate: doc.endDate || '',
        withDriver: doc.withDriver || false,
        driverName: doc.driverName,
        driverContact: doc.driverContact,
        driverTelephone: doc.driverTelephone,
        year: parseNumberSafely(doc.year),
        mileage: String(doc.mileage || ''),
        engineCapacity: parseNumberSafely(doc.engineCapacity),
        horsePower: parseNumberSafely(doc.horsePower),
      } as CarRent;
    }

    case 'auction': {
      return {
        ...baseProps,
        category: 'auction',
        price: String(doc.price || ''),
        endDate: doc.endDate || '',
        year: parseNumberSafely(doc.year),
        mileage: String(doc.mileage || ''),
        engineCapacity: parseNumberSafely(doc.engineCapacity),
        horsePower: parseNumberSafely(doc.horsePower),
      } as CarAuction;
    }

    case 'sell':
    default: {
      return {
        ...baseProps,
        category: 'sell',
        price: String(doc.price || ''),
        year: parseNumberSafely(doc.year),
        mileage: String(doc.mileage || ''),
        engineCapacity: parseNumberSafely(doc.engineCapacity),
        horsePower: parseNumberSafely(doc.horsePower),
      } as CarSell;
    }
  }
}

export function mapRawCarToCar(doc: RawCarDoc, category: 'sell' | 'buy' | 'rent' | 'auction' = 'sell'): Car {
  return mapRawCarToPost(doc, category);
}

export function normalizeNumberString(value: string | number | undefined): number {
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
