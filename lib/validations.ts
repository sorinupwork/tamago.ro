import * as z from 'zod';

export const auto = {
  sellSchema: z.object({
    title: z.string().min(1, 'Titlul este obligatoriu'),
    description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
    price: z.coerce.number().positive({ message: 'Prețul trebuie să fie un număr pozitiv' }),
    location: z.string().min(1, 'Locația este obligatorie'),
    features: z.string().min(1, 'Caracteristicile sunt obligatorii'),
    status: z.string().optional(),
    fuel: z.string().min(1, 'Combustibilul este obligatoriu'),
    mileage: z.coerce.number().int({ message: 'Kilometrajul trebuie să fie un număr întreg' }).min(1, { message: 'Kilometrajul trebuie să fie >= 1' }),
    year: z.preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) return undefined;
        return Number(val);
      },
      z
        .number()
        .int({ message: 'Anul trebuie să fie un număr întreg' })
        .min(1900, { message: 'Anul trebuie să fie >= 1900' })
        .max(new Date().getFullYear(), { message: `Anul nu poate fi mai mare decât ${new Date().getFullYear()}` })
        .optional()
    ),
    uploadedFiles: z.array(z.string()).min(1, { message: 'Trebuie încărcată cel puțin o fotografie' }),
    options: z.array(z.string()).optional(),
  }),
  buySchema: z.object({
    title: z.string().min(1, 'Titlul este obligatoriu'),
    description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
    price: z.coerce.number().positive({ message: 'Prețul trebuie să fie un număr pozitiv' }),
    location: z.string().min(1, 'Locația este obligatorie'),
    features: z.string().optional(),
    status: z.string().optional(),
    fuel: z.string().optional(),
    uploadedFiles: z.array(z.string()).min(1, { message: 'Trebuie încărcată cel puțin o fotografie' }),
    options: z.array(z.string()).optional(),
  }),
  rentSchema: z.object({
    title: z.string().min(1, 'Titlul este obligatoriu'),
    description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
    price: z.coerce.number().positive({ message: 'Prețul trebuie să fie un număr pozitiv' }),
    location: z.string().min(1, 'Locația este obligatorie'),
    duration: z.string().min(1, 'Durata este obligatorie'),
    type: z.string().optional(),
    features: z.string().optional(),
    status: z.string().optional(),
    fuel: z.string().optional(),
    uploadedFiles: z.array(z.string()).min(1, { message: 'Trebuie încărcată cel puțin o fotografie' }),
    options: z.array(z.string()).optional(),
  }),
  auctionSchema: z.object({
    title: z.string().min(1, 'Titlul este obligatoriu'),
    description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
    startingBid: z.coerce.number().positive({ message: 'Licitația de start trebuie să fie pozitivă' }),
    location: z.string().min(1, 'Locația este obligatorie'),
    endDate: z.string().optional(),
    features: z.string().optional(),
    status: z.string().optional(),
    fuel: z.string().optional(),
    uploadedFiles: z.array(z.string()).min(1, { message: 'Trebuie încărcată cel puțin o fotografie' }),
    options: z.array(z.string()).optional(),
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
