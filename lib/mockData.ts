export const availableOptions: string[] = [
  'GPS',
  'Aer Conditionat',
  'Scaune Încălzite',
  'Cameră 360°',
  'Bluetooth',
  'Pilot Automat',
  'Senzori Parcare',
  'Cameră Marsarier',
  'Lumini LED',
  'Interior Piele',
  'Keyless Entry',
  'Cruise Control',
];

export const brandOptions = [
  { value: 'BMW', label: 'BMW' },
  { value: 'Audi', label: 'Audi' },
  { value: 'Mercedes', label: 'Mercedes' },
  { value: 'Volkswagen', label: 'Volkswagen' },
  { value: 'Opel', label: 'Opel' },
  { value: 'Ford', label: 'Ford' },
  { value: 'Dacia', label: 'Dacia' },
  { value: 'Dodge', label: 'Dodge' },
  { value: 'Peugeot', label: 'Peugeot' },
  { value: 'Renault', label: 'Renault' },
];

export const colorOptions = [
  { value: 'Alb', label: 'Alb' },
  { value: 'Negru', label: 'Negru' },
  { value: 'Gri', label: 'Gri' },
  { value: 'Albastru', label: 'Albastru' },
  { value: 'Rosu', label: 'Rosu' },
  { value: 'Verde', label: 'Verde' },
  { value: 'Galben', label: 'Galben' },
  { value: 'Portocaliu', label: 'Portocaliu' },
  { value: 'Violet', label: 'Violet' },
  { value: 'Maro', label: 'Maro' },
  { value: 'Argintiu', label: 'Argintiu' },
  { value: 'Auriu', label: 'Auriu' },
  { value: 'Alta', label: 'Alta' },
];

export const carTypeOptions = [
  { value: 'SUV', label: 'SUV' },
  { value: 'Coupe', label: 'Coupe' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Convertible', label: 'Convertible' },
  { value: 'Wagon', label: 'Wagon' },
  { value: 'Pickup', label: 'Pickup' },
  { value: 'Van', label: 'Van' },
  { value: 'Other', label: 'Altul' },
];

export const transmissionOptions = [
  { value: 'Manual', label: 'Manuală' },
  { value: 'Automatic', label: 'Automată' },
  { value: 'Semi-Automatic', label: 'Semi-automată' },
];

export const iconOptions = [
  { value: 'Droplet', label: 'Revizie' },
  { value: 'FileText', label: 'RAR' },
  { value: 'Wrench', label: 'ITP' },
  { value: 'Calendar', label: 'Eveniment' },
  { value: 'Other', label: 'Altul' },
];

export const tractionOptions = [
  { value: 'integrala', label: 'Integrala (4x4)' },
  { value: 'fata', label: 'Față' },
  { value: 'spate', label: 'Spate' },
];

export const steeringWheelOptions = [
  { value: 'left', label: 'Stânga (Obișnuit)' },
  { value: 'right', label: 'Dreapta (UK)' },
];

export const carModelsByBrand: Record<string, { value: string; label: string }[]> = {
  BMW: [
    // 1 Series
    { value: '1', label: '1 Series' },
    { value: '118', label: '118' },
    { value: '120', label: '120' },
    { value: '125', label: '125' },
    { value: '130', label: '130' },
    { value: '135', label: '135' },
    // 3 Series
    { value: '3', label: '3 Series' },
    { value: '318', label: '318' },
    { value: '320', label: '320' },
    { value: '325', label: '325' },
    { value: '330', label: '330' },
    { value: '335', label: '335' },
    { value: 'M340', label: 'M340' },
    // 5 Series
    { value: '5', label: '5 Series' },
    { value: '520', label: '520' },
    { value: '525', label: '525' },
    { value: '530', label: '530' },
    { value: '535', label: '535' },
    { value: '545', label: '545' },
    { value: '550', label: '550' },
    { value: 'M550', label: 'M550' },
    // 7 Series
    { value: '7', label: '7 Series' },
    { value: '730', label: '730' },
    { value: '740', label: '740' },
    { value: '750', label: '750' },
    { value: '760', label: '760' },
    { value: 'M760', label: 'M760' },
    // X1
    { value: 'X1', label: 'X1' },
    // X3
    { value: 'X3', label: 'X3' },
    // X5
    { value: 'X5', label: 'X5' },
    // X6
    { value: 'X6', label: 'X6' },
    // X7
    { value: 'X7', label: 'X7' },
    // Z4
    { value: 'Z4', label: 'Z4' },
    // M Performance
    { value: 'M3', label: 'M3' },
    { value: 'M4', label: 'M4' },
    { value: 'M5', label: 'M5' },
    { value: 'M6', label: 'M6' },
  ],
  Audi: [
    // A1
    { value: 'A1', label: 'A1' },
    // A3
    { value: 'A3', label: 'A3' },
    // A4
    { value: 'A4', label: 'A4' },
    { value: 'A4 Allroad', label: 'A4 Allroad' },
    { value: 'A4 Avant', label: 'A4 Avant' },
    // A5
    { value: 'A5', label: 'A5' },
    { value: 'A5 Cabriolet', label: 'A5 Cabriolet' },
    { value: 'A5 Sportback', label: 'A5 Sportback' },
    // A6
    { value: 'A6', label: 'A6' },
    { value: 'A6 Allroad', label: 'A6 Allroad' },
    { value: 'A6 Avant', label: 'A6 Avant' },
    // A7
    { value: 'A7', label: 'A7' },
    { value: 'A7 Sportback', label: 'A7 Sportback' },
    // A8
    { value: 'A8', label: 'A8' },
    // Q2
    { value: 'Q2', label: 'Q2' },
    // Q3
    { value: 'Q3', label: 'Q3' },
    // Q4
    { value: 'Q4', label: 'Q4' },
    // Q5
    { value: 'Q5', label: 'Q5' },
    { value: 'Q5 Sportback', label: 'Q5 Sportback' },
    // Q7
    { value: 'Q7', label: 'Q7' },
    // Q8
    { value: 'Q8', label: 'Q8' },
    // TT
    { value: 'TT', label: 'TT' },
    { value: 'TT Coupe', label: 'TT Coupe' },
    { value: 'TT Roadster', label: 'TT Roadster' },
    // S-line & RS models
    { value: 'RS3', label: 'RS3' },
    { value: 'RS4', label: 'RS4' },
    { value: 'RS5', label: 'RS5' },
    { value: 'RS6', label: 'RS6' },
    { value: 'RS7', label: 'RS7' },
    { value: 'RS Q3', label: 'RS Q3' },
    { value: 'RS Q8', label: 'RS Q8' },
  ],
  Mercedes: [
    // A-Class
    { value: 'A-Class', label: 'A-Class' },
    { value: 'A140', label: 'A140' },
    { value: 'A150', label: 'A150' },
    { value: 'A160', label: 'A160' },
    { value: 'A170', label: 'A170' },
    // B-Class
    { value: 'B-Class', label: 'B-Class' },
    { value: 'B150', label: 'B150' },
    { value: 'B160', label: 'B160' },
    { value: 'B170', label: 'B170' },
    { value: 'B180', label: 'B180' },
    // C-Class
    { value: 'C-Class', label: 'C-Class' },
    { value: 'C180', label: 'C180' },
    { value: 'C200', label: 'C200' },
    { value: 'C220', label: 'C220' },
    { value: 'C250', label: 'C250' },
    { value: 'C300', label: 'C300' },
    { value: 'C63', label: 'C63' },
    { value: 'C63 AMG', label: 'C63 AMG' },
    // CLA
    { value: 'CLA', label: 'CLA' },
    { value: 'CLA180', label: 'CLA180' },
    { value: 'CLA200', label: 'CLA200' },
    { value: 'CLA220', label: 'CLA220' },
    { value: 'CLA250', label: 'CLA250' },
    // E-Class
    { value: 'E-Class', label: 'E-Class' },
    { value: 'E200', label: 'E200' },
    { value: 'E220', label: 'E220' },
    { value: 'E250', label: 'E250' },
    { value: 'E300', label: 'E300' },
    { value: 'E350', label: 'E350' },
    { value: 'E63', label: 'E63' },
    { value: 'E63 AMG', label: 'E63 AMG' },
    // S-Class
    { value: 'S-Class', label: 'S-Class' },
    { value: 'S200', label: 'S200' },
    { value: 'S280', label: 'S280' },
    { value: 'S320', label: 'S320' },
    { value: 'S350', label: 'S350' },
    { value: 'S400', label: 'S400' },
    { value: 'S500', label: 'S500' },
    { value: 'S600', label: 'S600' },
    { value: 'S63 AMG', label: 'S63 AMG' },
    { value: 'S65 AMG', label: 'S65 AMG' },
    // G-Class
    { value: 'G-Class', label: 'G-Class' },
    { value: 'G250', label: 'G250' },
    { value: 'G280', label: 'G280' },
    { value: 'G320', label: 'G320' },
    { value: 'G350', label: 'G350' },
    { value: 'G400', label: 'G400' },
    { value: 'G500', label: 'G500' },
    { value: 'G55 AMG', label: 'G55 AMG' },
    { value: 'G63 AMG', label: 'G63 AMG' },
    // GLE
    { value: 'GLE', label: 'GLE' },
    { value: 'GLE250', label: 'GLE250' },
    { value: 'GLE300', label: 'GLE300' },
    { value: 'GLE350', label: 'GLE350' },
    { value: 'GLE450', label: 'GLE450' },
    { value: 'GLE53 AMG', label: 'GLE53 AMG' },
    { value: 'GLE63 AMG', label: 'GLE63 AMG' },
    // GLC
    { value: 'GLC', label: 'GLC' },
    { value: 'GLC200', label: 'GLC200' },
    { value: 'GLC250', label: 'GLC250' },
    { value: 'GLC300', label: 'GLC300' },
    { value: 'GLC63', label: 'GLC63' },
    { value: 'GLC63 AMG', label: 'GLC63 AMG' },
    // GLA
    { value: 'GLA', label: 'GLA' },
    { value: 'GLA180', label: 'GLA180' },
    { value: 'GLA200', label: 'GLA200' },
    { value: 'GLA220', label: 'GLA220' },
    { value: 'GLA250', label: 'GLA250' },
    { value: 'GLA45 AMG', label: 'GLA45 AMG' },
  ],
  Volkswagen: [
    // Polo
    { value: 'Polo', label: 'Polo' },
    { value: 'Polo 1.0', label: 'Polo 1.0' },
    { value: 'Polo 1.2', label: 'Polo 1.2' },
    { value: 'Polo 1.4', label: 'Polo 1.4' },
    { value: 'Polo 1.6', label: 'Polo 1.6' },
    { value: 'Polo 1.8', label: 'Polo 1.8' },
    // Golf
    { value: 'Golf', label: 'Golf' },
    { value: 'Golf I', label: 'Golf I' },
    { value: 'Golf II', label: 'Golf II' },
    { value: 'Golf III', label: 'Golf III' },
    { value: 'Golf IV', label: 'Golf IV' },
    { value: 'Golf V', label: 'Golf V' },
    { value: 'Golf VI', label: 'Golf VI' },
    { value: 'Golf VII', label: 'Golf VII' },
    { value: 'Golf VIII', label: 'Golf VIII' },
    { value: 'Golf 1.4', label: 'Golf 1.4' },
    { value: 'Golf 1.6', label: 'Golf 1.6' },
    { value: 'Golf 1.8', label: 'Golf 1.8' },
    { value: 'Golf 2.0', label: 'Golf 2.0' },
    { value: 'Golf 2.3', label: 'Golf 2.3' },
    { value: 'Golf GTI', label: 'Golf GTI' },
    { value: 'Golf R', label: 'Golf R' },
    // Jetta
    { value: 'Jetta', label: 'Jetta' },
    { value: 'Jetta 1.4', label: 'Jetta 1.4' },
    { value: 'Jetta 1.6', label: 'Jetta 1.6' },
    { value: 'Jetta 1.8', label: 'Jetta 1.8' },
    // Passat
    { value: 'Passat', label: 'Passat' },
    { value: 'Passat B3', label: 'Passat B3' },
    { value: 'Passat B4', label: 'Passat B4' },
    { value: 'Passat B5', label: 'Passat B5' },
    { value: 'Passat B6', label: 'Passat B6' },
    { value: 'Passat B7', label: 'Passat B7' },
    { value: 'Passat B8', label: 'Passat B8' },
    { value: 'Passat 1.6', label: 'Passat 1.6' },
    { value: 'Passat 1.8', label: 'Passat 1.8' },
    { value: 'Passat 2.0', label: 'Passat 2.0' },
    // Tiguan
    { value: 'Tiguan', label: 'Tiguan' },
    { value: 'Tiguan 1.4', label: 'Tiguan 1.4' },
    { value: 'Tiguan 2.0', label: 'Tiguan 2.0' },
    { value: 'Tiguan Allspace', label: 'Tiguan Allspace' },
    // Touareg
    { value: 'Touareg', label: 'Touareg' },
    // Beetle
    { value: 'Beetle', label: 'Beetle' },
    { value: 'Beetle Classic', label: 'Beetle Classic' },
    // Transporter
    { value: 'Transporter', label: 'Transporter' },
  ],
  Opel: [
    // Corsa
    { value: 'Corsa', label: 'Corsa' },
    { value: 'Corsa A', label: 'Corsa A' },
    { value: 'Corsa B', label: 'Corsa B' },
    { value: 'Corsa C', label: 'Corsa C' },
    { value: 'Corsa D', label: 'Corsa D' },
    { value: 'Corsa E', label: 'Corsa E' },
    { value: 'Corsa 1.0', label: 'Corsa 1.0' },
    { value: 'Corsa 1.2', label: 'Corsa 1.2' },
    { value: 'Corsa 1.4', label: 'Corsa 1.4' },
    { value: 'Corsa 1.6', label: 'Corsa 1.6' },
    // Astra
    { value: 'Astra', label: 'Astra' },
    { value: 'Astra F', label: 'Astra F' },
    { value: 'Astra G', label: 'Astra G' },
    { value: 'Astra H', label: 'Astra H' },
    { value: 'Astra J', label: 'Astra J' },
    { value: 'Astra K', label: 'Astra K' },
    { value: 'Astra 1.4', label: 'Astra 1.4' },
    { value: 'Astra 1.6', label: 'Astra 1.6' },
    { value: 'Astra 1.8', label: 'Astra 1.8' },
    { value: 'Astra 2.0', label: 'Astra 2.0' },
    // Vectra
    { value: 'Vectra', label: 'Vectra' },
    { value: 'Vectra A', label: 'Vectra A' },
    { value: 'Vectra B', label: 'Vectra B' },
    { value: 'Vectra C', label: 'Vectra C' },
    // Insignia
    { value: 'Insignia', label: 'Insignia' },
    // Grandland X
    { value: 'Grandland X', label: 'Grandland X' },
    // Mokka
    { value: 'Mokka', label: 'Mokka' },
    // Zafira
    { value: 'Zafira', label: 'Zafira' },
    // Combo
    { value: 'Combo', label: 'Combo' },
  ],
  Ford: [
    // Fiesta
    { value: 'Fiesta', label: 'Fiesta' },
    { value: 'Fiesta Mk1', label: 'Fiesta Mk1' },
    { value: 'Fiesta Mk2', label: 'Fiesta Mk2' },
    { value: 'Fiesta Mk3', label: 'Fiesta Mk3' },
    { value: 'Fiesta Mk4', label: 'Fiesta Mk4' },
    { value: 'Fiesta Mk5', label: 'Fiesta Mk5' },
    { value: 'Fiesta Mk6', label: 'Fiesta Mk6' },
    { value: 'Fiesta Mk7', label: 'Fiesta Mk7' },
    { value: 'Fiesta Mk8', label: 'Fiesta Mk8' },
    { value: 'Fiesta 1.0', label: 'Fiesta 1.0' },
    { value: 'Fiesta 1.25', label: 'Fiesta 1.25' },
    { value: 'Fiesta 1.4', label: 'Fiesta 1.4' },
    { value: 'Fiesta 1.6', label: 'Fiesta 1.6' },
    // Focus
    { value: 'Focus', label: 'Focus' },
    { value: 'Focus Mk1', label: 'Focus Mk1' },
    { value: 'Focus Mk2', label: 'Focus Mk2' },
    { value: 'Focus Mk3', label: 'Focus Mk3' },
    { value: 'Focus Mk4', label: 'Focus Mk4' },
    { value: 'Focus 1.4', label: 'Focus 1.4' },
    { value: 'Focus 1.6', label: 'Focus 1.6' },
    { value: 'Focus 1.8', label: 'Focus 1.8' },
    { value: 'Focus 2.0', label: 'Focus 2.0' },
    { value: 'Focus ST', label: 'Focus ST' },
    { value: 'Focus RS', label: 'Focus RS' },
    // Mondeo
    { value: 'Mondeo', label: 'Mondeo' },
    { value: 'Mondeo Mk1', label: 'Mondeo Mk1' },
    { value: 'Mondeo Mk2', label: 'Mondeo Mk2' },
    { value: 'Mondeo Mk3', label: 'Mondeo Mk3' },
    { value: 'Mondeo Mk4', label: 'Mondeo Mk4' },
    { value: 'Mondeo Mk5', label: 'Mondeo Mk5' },
    // Mustang
    { value: 'Mustang', label: 'Mustang' },
    { value: 'Mustang 2.3', label: 'Mustang 2.3' },
    { value: 'Mustang 5.0', label: 'Mustang 5.0' },
    // F-150
    { value: 'F-150', label: 'F-150' },
    // Explorer
    { value: 'Explorer', label: 'Explorer' },
    // Edge
    { value: 'Edge', label: 'Edge' },
    // Kuga
    { value: 'Kuga', label: 'Kuga' },
    // Ranger
    { value: 'Ranger', label: 'Ranger' },
  ],
  Dacia: [
    // Sandero
    { value: 'Sandero', label: 'Sandero' },
    { value: 'Sandero Gen 1', label: 'Sandero Gen 1' },
    { value: 'Sandero Gen 2', label: 'Sandero Gen 2' },
    { value: 'Sandero Gen 3', label: 'Sandero Gen 3' },
    { value: 'Sandero 1.2', label: 'Sandero 1.2' },
    { value: 'Sandero 1.4', label: 'Sandero 1.4' },
    { value: 'Sandero 1.6', label: 'Sandero 1.6' },
    // Duster
    { value: 'Duster', label: 'Duster' },
    { value: 'Duster Gen 1', label: 'Duster Gen 1' },
    { value: 'Duster Gen 2', label: 'Duster Gen 2' },
    { value: 'Duster 1.2', label: 'Duster 1.2' },
    { value: 'Duster 1.4', label: 'Duster 1.4' },
    { value: 'Duster 1.5', label: 'Duster 1.5' },
    { value: 'Duster 2.0', label: 'Duster 2.0' },
    // Logan
    { value: 'Logan', label: 'Logan' },
    { value: 'Logan 1.4', label: 'Logan 1.4' },
    { value: 'Logan 1.6', label: 'Logan 1.6' },
    // Logan MCV
    { value: 'Logan MCV', label: 'Logan MCV' },
    // Lodgy
    { value: 'Lodgy', label: 'Lodgy' },
    // Dokker
    { value: 'Dokker', label: 'Dokker' },
    // Spring
    { value: 'Spring', label: 'Spring' },
    // Jogger
    { value: 'Jogger', label: 'Jogger' },
  ],
  Peugeot: [
    // 106
    { value: '106', label: '106' },
    // 205
    { value: '205', label: '205' },
    // 206
    { value: '206', label: '206' },
    // 207
    { value: '207', label: '207' },
    // 208
    { value: '208', label: '208' },
    { value: '208 Gen 1', label: '208 Gen 1' },
    { value: '208 Gen 2', label: '208 Gen 2' },
    // 301
    { value: '301', label: '301' },
    // 306
    { value: '306', label: '306' },
    // 307
    { value: '307', label: '307' },
    // 308
    { value: '308', label: '308' },
    { value: '308 Gen 1', label: '308 Gen 1' },
    { value: '308 Gen 2', label: '308 Gen 2' },
    // 309
    { value: '309', label: '309' },
    // 405
    { value: '405', label: '405' },
    // 406
    { value: '406', label: '406' },
    // 407
    { value: '407', label: '407' },
    // 408
    { value: '408', label: '408' },
    // 505
    { value: '505', label: '505' },
    // 2008
    { value: '2008', label: '2008' },
    // 3008
    { value: '3008', label: '3008' },
    // 5008
    { value: '5008', label: '5008' },
    // Partner
    { value: 'Partner', label: 'Partner' },
    // Rifter
    { value: 'Rifter', label: 'Rifter' },
    // Expert
    { value: 'Expert', label: 'Expert' },
  ],
  Renault: [
    // Clio
    { value: 'Clio', label: 'Clio' },
    { value: 'Clio Gen 1', label: 'Clio Gen 1' },
    { value: 'Clio Gen 2', label: 'Clio Gen 2' },
    { value: 'Clio Gen 3', label: 'Clio Gen 3' },
    { value: 'Clio Gen 4', label: 'Clio Gen 4' },
    { value: 'Clio Gen 5', label: 'Clio Gen 5' },
    { value: 'Clio 1.2', label: 'Clio 1.2' },
    { value: 'Clio 1.4', label: 'Clio 1.4' },
    { value: 'Clio 1.6', label: 'Clio 1.6' },
    // Megane
    { value: 'Megane', label: 'Megane' },
    { value: 'Megane Gen 1', label: 'Megane Gen 1' },
    { value: 'Megane Gen 2', label: 'Megane Gen 2' },
    { value: 'Megane Gen 3', label: 'Megane Gen 3' },
    { value: 'Megane Gen 4', label: 'Megane Gen 4' },
    { value: 'Megane 1.4', label: 'Megane 1.4' },
    { value: 'Megane 1.6', label: 'Megane 1.6' },
    { value: 'Megane 1.9', label: 'Megane 1.9' },
    { value: 'Megane 2.0', label: 'Megane 2.0' },
    { value: 'Megane RS', label: 'Megane RS' },
    // Scenic
    { value: 'Scenic', label: 'Scenic' },
    { value: 'Scenic Gen 1', label: 'Scenic Gen 1' },
    { value: 'Scenic Gen 2', label: 'Scenic Gen 2' },
    { value: 'Scenic Gen 3', label: 'Scenic Gen 3' },
    // Grand Scenic
    { value: 'Grand Scenic', label: 'Grand Scenic' },
    // Laguna
    { value: 'Laguna', label: 'Laguna' },
    { value: 'Laguna Gen 1', label: 'Laguna Gen 1' },
    { value: 'Laguna Gen 2', label: 'Laguna Gen 2' },
    { value: 'Laguna Gen 3', label: 'Laguna Gen 3' },
    // Latitude
    { value: 'Latitude', label: 'Latitude' },
    // Modus
    { value: 'Modus', label: 'Modus' },
    // Kangoo
    { value: 'Kangoo', label: 'Kangoo' },
    // Master
    { value: 'Master', label: 'Master' },
    // Talisman
    { value: 'Talisman', label: 'Talisman' },
    // Duster
    { value: 'Duster', label: 'Duster' },
    // Captur
    { value: 'Captur', label: 'Captur' },
    // Koleos
    { value: 'Koleos', label: 'Koleos' },
  ],
  Dodge: [
    // Dart
    { value: 'Dart', label: 'Dart' },
    // Charger
    { value: 'Charger', label: 'Charger' },
    { value: 'Charger 3.5', label: 'Charger 3.5' },
    { value: 'Charger 5.7', label: 'Charger 5.7' },
    { value: 'Charger 6.1', label: 'Charger 6.1' },
    // Challenger
    { value: 'Challenger', label: 'Challenger' },
    { value: 'Challenger 3.6', label: 'Challenger 3.6' },
    { value: 'Challenger 5.7', label: 'Challenger 5.7' },
    { value: 'Challenger 6.4', label: 'Challenger 6.4' },
    // Durango
    { value: 'Durango', label: 'Durango' },
    { value: 'Durango 3.6', label: 'Durango 3.6' },
    { value: 'Durango 5.7', label: 'Durango 5.7' },
    // Ram
    { value: 'Ram', label: 'Ram' },
    { value: 'Ram 1500', label: 'Ram 1500' },
    { value: 'Ram 2500', label: 'Ram 2500' },
    { value: 'Ram 3500', label: 'Ram 3500' },
    // Journey
    { value: 'Journey', label: 'Journey' },
    // Caliber
    { value: 'Caliber', label: 'Caliber' },
    // Neon
    { value: 'Neon', label: 'Neon' },
  ],
};

export const quests = [
  {
    id: 'post-quest',
    title: 'Postează 5 articole',
    description: 'Creează și postează 5 articole pentru a câștiga recompense.',
    progress: 15,
    total: 20,
    reward: '5 Postări Gratuite',
    type: 'posts',
  },
  {
    id: 'friends-quest',
    title: 'Adaugă 10 prieteni',
    description: 'Conectează-te cu 10 prieteni pentru a crește rețeaua socială.',
    progress: 8,
    total: 10,
    reward: 'Insignă "Social"',
    type: 'friends',
  },
  {
    id: 'points-quest',
    title: 'Acumulează 200 puncte',
    description: 'Cumpără sau vinde articole pentru a acumula 200 puncte.',
    progress: 120,
    total: 200,
    reward: 'Acces Premium',
    type: 'points',
  },
  {
    id: 'verify-email',
    title: 'Verifică email-ul',
    description: 'Verifică adresa de email pentru securitate crescută.',
    progress: 0,
    total: 1,
    reward: 'Insignă "Verificat"',
    type: 'verification',
  },
];

export const rewards = [
  {
    id: 'free-posts',
    title: 'Postări Gratuite',
    description: 'Primești 5 postări gratuite pentru vânzări.',
    claimed: false,
    available: true,
  },
  {
    id: 'premium-access',
    title: 'Acces Premium',
    description: 'Acces nelimitat la vânzări și funcții premium.',
    claimed: false,
    available: false,
  },
  {
    id: 'badge-social',
    title: 'Insignă Social',
    description: 'Insignă specială pentru conexiuni sociale.',
    claimed: false,
    available: true,
  },
  {
    id: 'verify-email',
    title: 'Insignă Verificat',
    description: 'Insignă pentru cont verificat.',
    claimed: false,
    available: false,
  },
];

export const proTips = [
  'Postează anunțuri gratuite pentru vânzarea mașinilor tale!',
  'Conectează-te cu alți pasionați de auto pe platformă!',
  'Folosește filtrele pentru a găsi mașina perfectă!',
  'Participă la evenimente și târguri auto!',
  'Verifică-ți email-ul pentru securitate maximă!',
  'Adaugă fotografii de înaltă calitate pentru anunțurile tale!',
  'Comentează și interacționează cu alți utilizatori!',
  'Creează povești pentru a împărtăși experiențele tale!',
  'Folosește funcția de favorite pentru a salva anunțuri interesante!',
  'Actualizează-ți profilul pentru a atrage mai mulți cumpărători!',
  'Explorează categoriile pentru a descoperi oferte speciale!',
  'Împărtășește profilul tău pentru a crește vizibilitatea!',
  'Folosește chat-ul pentru a negocia direct cu vânzătorii!',
  'Creează liste de dorințe pentru viitorul tău vehicul!',
  'Participă la sondaje pentru a câștiga recompense!',
];
