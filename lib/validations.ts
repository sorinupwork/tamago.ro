import * as z from 'zod';

const baseSchema = z.object({
  title: z.string().min(1, 'Titlul este obligatoriu'),
  description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
  price: z.number().min(0, 'Prețul trebuie să fie pozitiv'),
  location: z.string().min(1, 'Locația este obligatorie'),
});

export const sellSchema = baseSchema.extend({
  features: z.string().optional(),
  status: z.string().optional(),
  fuel: z.string().optional(),
});

export const buySchema = baseSchema.extend({
  budget: z.number().min(0, 'Bugetul trebuie să fie pozitiv'),
  preferences: z.string().optional(),
});

export const rentSchema = baseSchema.extend({
  duration: z.string().min(1, 'Durata este obligatorie'),
  type: z.string().optional(),
});

export const auctionSchema = baseSchema.extend({
  startingBid: z.number().min(0, 'Licitația de start trebuie să fie pozitivă'),
  endDate: z.string().min(1, 'Data de sfârșit este obligatorie'),
});

export type SellFormData = z.infer<typeof sellSchema>;
export type BuyFormData = z.infer<typeof buySchema>;
export type RentFormData = z.infer<typeof rentSchema>;
export type AuctionFormData = z.infer<typeof auctionSchema>;
