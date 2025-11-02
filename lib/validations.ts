import * as z from 'zod';

const baseSchema = z.object({
  title: z.string().min(1, 'Titlul este obligatoriu'),
  description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
  price: z.number().min(0, 'Prețul trebuie să fie pozitiv'),
  location: z.string().min(1, 'Locația este obligatorie'),
});

export const auto = {
  sellSchema: baseSchema.extend({
    features: z.string().optional(),
    status: z.string().optional(),
    fuel: z.string().optional(),
    mileage: z.number().min(0).optional(),
    year: z.number().min(1900).optional(),
  }),
  buySchema: baseSchema.extend({
    features: z.string().optional(),
    status: z.string().optional(),
    fuel: z.string().optional(),
  }),
  rentSchema: baseSchema.extend({
    duration: z.string().min(1, 'Durata este obligatorie'),
    type: z.string().optional(),
    features: z.string().optional(),
    status: z.string().optional(),
    fuel: z.string().optional(),
  }),
  auctionSchema: baseSchema.extend({
    startingBid: z.number().min(0, 'Licitația de start trebuie să fie pozitivă'),
    endDate: z.string().optional(),
    features: z.string().optional(),
    status: z.string().optional(),
    fuel: z.string().optional(),
  }),
};

export const loginSchema = z.object({
  email: z.email('Email invalid'),
  password: z.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  email: z.email('Email invalid'),
  password: z.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere'),
});

export type AutoSellFormData = z.infer<typeof auto.sellSchema>;
export type AutoBuyFormData = z.infer<typeof auto.buySchema>;
export type AutoRentFormData = z.infer<typeof auto.rentSchema>;
export type AutoAuctionFormData = z.infer<typeof auto.auctionSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
