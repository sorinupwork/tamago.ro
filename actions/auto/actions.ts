'use server';

import { insertDocument } from '@/lib/mongo';
import { auto, AutoSellFormData, AutoBuyFormData, AutoRentFormData, AutoAuctionFormData } from '@/lib/validations';

export async function submitSellAutoForm(data: AutoSellFormData & { uploadedFiles: string[]; options?: string[] }) {
  try {
    const validatedData = auto.sellSchema.parse(data);
    const result = await insertDocument('sell_auto_cars', validatedData);
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting sell auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitBuyAutoForm(data: AutoBuyFormData & { uploadedFiles: string[]; options?: string[] }) {
  try {
    const validatedData = auto.buySchema.parse(data);
    const result = await insertDocument('buy_auto_cars', validatedData);
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting buy auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitRentAutoForm(data: AutoRentFormData & { uploadedFiles: string[]; options?: string[] }) {
  try {
    const validatedData = auto.rentSchema.parse(data);
    const result = await insertDocument('rent_auto_cars', validatedData);
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting rent auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function submitAuctionAutoForm(data: AutoAuctionFormData & { uploadedFiles: string[]; options?: string[] }) {
  try {
    const validatedData = auto.auctionSchema.parse(data);
    const result = await insertDocument('auction_auto_cars', validatedData);
    return { success: true, insertedId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error submitting auction auto form:', error);
    return { success: false, error: 'Failed to save data' };
  }
}
