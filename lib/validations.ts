import * as z from 'zod';

export const auto = {
  sellSchema: z.object({
    title: z.string().min(1, 'Titlul este obligatoriu'),
    description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
    price: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Prețul trebuie să fie un număr pozitiv' }),
    currency: z.enum(['EUR', 'USD', 'RON'], { message: 'Moneda trebuie să fie EUR, USD sau RON' }),
    location: z.string().min(1, 'Locația este obligatorie'),
    features: z.string().optional(),
    status: z.string().optional(),
    fuel: z.string().min(1, 'Combustibilul este obligatoriu'),
    mileage: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Kilometrajul trebuie să fie un număr' }),
    year: z.string().regex(/^\d+$/, { message: 'Anul trebuie să fie un număr întreg' }),
    brand: z.string().min(1, 'Marca este obligatorie'),
    color: z.string().min(1, 'Culoarea este obligatorie'),
    engineCapacity: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Capacitatea cilindrică trebuie să fie un număr' }),
    carType: z.enum(['SUV', 'Coupe', 'Sedan', 'Hatchback', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Other'], {
      message: 'Tipul mașinii este obligatoriu',
    }),
    horsePower: z.string().regex(/^\d+$/, { message: 'Puterea trebuie să fie un număr întreg' }),
    transmission: z.enum(['Manual', 'Automatic', 'Semi-Automatic'], { message: 'Transmisia este obligatorie' }),
    is4x4: z.boolean(),
    uploadedFiles: z.array(z.string()).min(1, 'Fișierele sunt necesare.'),
    options: z.array(z.string()).optional(),
  }),
  buySchema: z.object({
    title: z.string().min(1, 'Titlul este obligatoriu'),
    description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
    minPrice: z
      .string()
      .min(1, 'Prețul minim este obligatoriu')
      .regex(/^\d+([.,]\d+)?$/, { message: 'Prețul minim trebuie să fie un număr pozitiv' }),
    maxPrice: z
      .string()
      .min(1, 'Prețul maxim este obligatoriu')
      .regex(/^\d+([.,]\d+)?$/, { message: 'Prețul maxim trebuie să fie un număr pozitiv' }),
    currency: z.enum(['EUR', 'USD', 'RON'], { message: 'Moneda trebuie să fie EUR, USD sau RON' }),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
      address: z.string().min(1, 'Adresa este obligatorie'),
      fullAddress: z.string(),
    }),
    features: z.string().optional(),
    status: z.string().min(1, 'Statusul este obligatoriu'),
    fuel: z.string().min(1, 'Combustibilul este obligatoriu'),
    minMileage: z
      .string()
      .min(1, 'Kilometrajul minim este obligatoriu')
      .regex(/^\d+([.,]\d+)?$/, { message: 'Kilometrajul minim trebuie să fie un număr' }),
    maxMileage: z
      .string()
      .min(1, 'Kilometrajul maxim este obligatoriu')
      .regex(/^\d+([.,]\d+)?$/, { message: 'Kilometrajul maxim trebuie să fie un număr' }),
    minYear: z.string().min(1, 'Anul minim este obligatoriu').regex(/^\d+$/, { message: 'Anul minim trebuie să fie un număr întreg' }),
    maxYear: z.string().min(1, 'Anul maxim este obligatoriu').regex(/^\d+$/, { message: 'Anul maxim trebuie să fie un număr întreg' }),
    brand: z.string().min(1, 'Marca este obligatorie'),
    color: z.string().min(1, 'Culoarea este obligatorie'),
    minEngineCapacity: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Capacitatea cilindrică minimă trebuie să fie un număr' }),
    maxEngineCapacity: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Capacitatea cilindrică maximă trebuie să fie un număr' }),
    carType: z.enum(['SUV', 'Coupe', 'Sedan', 'Hatchback', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Other'], {
      message: 'Tipul mașinii este obligatoriu',
    }),
    horsePower: z.string().regex(/^\d+$/, { message: 'Puterea trebuie să fie un număr întreg' }),
    transmission: z.enum(['Manual', 'Automatic', 'Semi-Automatic'], { message: 'Transmisia este obligatorie' }),
    is4x4: z.boolean(),
    uploadedFiles: z.array(z.string()).optional(),
    options: z.array(z.string()).optional(),
  }),
  rentSchema: z
    .object({
      title: z.string().min(1, 'Titlul este obligatoriu'),
      description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
      price: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Prețul trebuie să fie un număr pozitiv' }),
      currency: z.enum(['EUR', 'USD', 'RON'], { message: 'Moneda trebuie să fie EUR, USD sau RON' }),
      period: z.enum(['day', 'week', 'month'], { message: 'Perioada trebuie să fie zi, săptămână sau lună' }),
      location: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string().min(1, 'Adresa este obligatorie'),
        fullAddress: z.string(),
      }),
      startDate: z.string().min(1, 'Data de început este obligatorie'),
      endDate: z.string().min(1, 'Data de sfârșit este obligatorie'),
      type: z.string().optional(),
      features: z.string().optional(),
      status: z.string().min(1, 'Statusul este obligatoriu'),
      fuel: z.string().min(1, 'Combustibilul este obligatoriu'),
      mileage: z.string().min(1, 'Kilometrajul este obligatoriu').regex(/^\d+([.,]\d+)?$/, { message: 'Kilometrajul trebuie să fie un număr' }),
      year: z.string().min(1, 'Anul este obligatoriu').regex(/^\d+$/, { message: 'Anul trebuie să fie un număr întreg' }),
      brand: z.string().min(1, 'Marca este obligatorie'),
      color: z.string().min(1, 'Culoarea este obligatorie'),
      engineCapacity: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Capacitatea cilindrică trebuie să fie un număr' }),
      carType: z.enum(['SUV', 'Coupe', 'Sedan', 'Hatchback', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Other'], {
        message: 'Tipul mașinii este obligatoriu',
      }),
      horsePower: z.string().regex(/^\d+$/, { message: 'Puterea trebuie să fie un număr întreg' }),
      transmission: z.enum(['Manual', 'Automatic', 'Semi-Automatic'], { message: 'Transmisia este obligatorie' }),
      is4x4: z.boolean(),
      withDriver: z.boolean().optional(),
      driverName: z.string().optional(),
      driverContact: z.string().optional(),
      driverTelephone: z.string().optional(),
      uploadedFiles: z.array(z.string()).min(1, 'Fișierele sunt necesare.'),
      options: z.array(z.string()).optional(),
    })
    .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
      message: 'Data de sfârșit trebuie să fie după data de început',
      path: ['endDate'],
    })
    .refine((data) => !data.withDriver || (data.driverName && data.driverName.length > 0), {
      message: 'Numele șoferului este obligatoriu când este selectat cu șofer',
      path: ['driverName'],
    })
    .refine((data) => !data.withDriver || (data.driverContact && data.driverContact.length > 0), {
      message: 'Contactul șoferului este obligatoriu când este selectat cu șofer',
      path: ['driverContact'],
    })
    .refine((data) => !data.withDriver || (data.driverTelephone && data.driverTelephone.length > 0), {
      message: 'Telefonul șoferului este obligatoriu când este selectat cu șofer',
      path: ['driverTelephone'],
    }),
  auctionSchema: z.object({
    title: z.string().min(1, 'Titlul este obligatoriu'),
    description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
    price: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Prețul trebuie să fie un număr pozitiv' }),
    currency: z.enum(['EUR', 'USD', 'RON'], { message: 'Moneda trebuie să fie EUR, USD sau RON' }),
    location: z.string().min(1, 'Locația este obligatorie'),
    endDate: z.string().min(1, 'Data de sfârșit a licitației este obligatorie'),
    features: z.string().optional(),
    status: z.string().min(1, 'Statusul este obligatoriu'),
    fuel: z.string().min(1, 'Combustibilul este obligatoriu'),
    mileage: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Kilometrajul trebuie să fie un număr' }),
    year: z.string().regex(/^\d+$/, { message: 'Anul trebuie să fie un număr întreg' }),
    brand: z.string().min(1, 'Marca este obligatorie'),
    color: z.string().min(1, 'Culoarea este obligatorie'),
    engineCapacity: z.string().regex(/^\d+([.,]\d+)?$/, { message: 'Capacitatea cilindrică trebuie să fie un număr' }),
    carType: z.enum(['SUV', 'Coupe', 'Sedan', 'Hatchback', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Other'], {
      message: 'Tipul mașinii este obligatoriu',
    }),
    horsePower: z.string().regex(/^\d+$/, { message: 'Puterea trebuie să fie un număr întreg' }),
    transmission: z.enum(['Manual', 'Automatic', 'Semi-Automatic'], { message: 'Transmisia este obligatorie' }),
    is4x4: z.boolean(),
    uploadedFiles: z.array(z.string()).min(1, 'Fișierele sunt necesare.'),
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

export const forgotPasswordSchema = z.object({
  email: z.email('Email invalid'),
});

export type AutoSellFormData = z.infer<typeof auto.sellSchema>;
export type AutoBuyFormData = z.infer<typeof auto.buySchema>;
export type AutoRentFormData = z.infer<typeof auto.rentSchema>;
export type AutoAuctionFormData = z.infer<typeof auto.auctionSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
