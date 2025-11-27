import AutoPageClient from '@/components/custom/auto/AutoPageClient';
import { getSellAutoCars, getBuyAutoCars, getRentAutoCars, getAuctionAutoCars } from '@/actions/auto/actions';

export default async function AutoPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = await searchParams;
  const tip = (resolvedSearchParams.tip as string) || 'oferta';
  const pagina = parseInt(resolvedSearchParams.pagina as string) || 1;
  const cautare = resolvedSearchParams.cautare as string;
  const marca = resolvedSearchParams.marca as string;
  const combustibil = Array.isArray(resolvedSearchParams.combustibil) ? resolvedSearchParams.combustibil : (resolvedSearchParams.combustibil as string)?.split(',') || [];
  const transmisie = Array.isArray(resolvedSearchParams.transmisie) ? resolvedSearchParams.transmisie : (resolvedSearchParams.transmisie as string)?.split(',') || [];
  const caroserie = Array.isArray(resolvedSearchParams.caroserie) ? resolvedSearchParams.caroserie : (resolvedSearchParams.caroserie as string)?.split(',') || [];
  const culoare = Array.isArray(resolvedSearchParams.culoare) ? resolvedSearchParams.culoare : (resolvedSearchParams.culoare as string)?.split(',') || [];
  const statusMapLocal = { nou: 'new', folosit: 'used', deteriorat: 'damaged' } as const;
  const status = (resolvedSearchParams.stare as string && statusMapLocal[resolvedSearchParams.stare as keyof typeof statusMapLocal]) || resolvedSearchParams.stare as string;
  const pretMin = parseInt(resolvedSearchParams.pretMin as string);
  const pretMax = parseInt(resolvedSearchParams.pretMax as string);
  const anMin = parseInt(resolvedSearchParams.anMin as string);
  const anMax = parseInt(resolvedSearchParams.anMax as string);
  const kilometrajMin = parseInt(resolvedSearchParams.kilometrajMin as string);
  const kilometrajMax = parseInt(resolvedSearchParams.kilometrajMax as string);
  const capacitateMin = parseFloat(resolvedSearchParams.capacitateMin as string);
  const capacitateMax = parseFloat(resolvedSearchParams.capacitateMax as string);
  const caiPutereMin = parseInt(resolvedSearchParams.caiPutereMin as string);
  const caiPutereMax = parseInt(resolvedSearchParams.caiPutereMax as string);
  const lat = parseFloat(resolvedSearchParams.lat as string);
  const lng = parseFloat(resolvedSearchParams.lng as string);
  const raza = parseInt(resolvedSearchParams.raza as string);

  let sortBy = 'createdAt';
  if (resolvedSearchParams.pret) sortBy = resolvedSearchParams.pret === 'asc' ? 'price_asc' : 'price_desc';
  if (resolvedSearchParams.an) sortBy = resolvedSearchParams.an === 'asc' ? 'year_asc' : 'year_desc';
  if (resolvedSearchParams.kilometraj) sortBy = resolvedSearchParams.kilometraj === 'asc' ? 'mileage_asc' : 'mileage_desc';

  const params = {
    page: 1,
    limit: 100,
    search: cautare,
    status,
    sortBy,
    brand: marca,
    fuel: combustibil,
    transmission: transmisie,
    bodyType: caroserie,
    color: culoare,
    priceMin: isNaN(pretMin) ? undefined : pretMin,
    priceMax: isNaN(pretMax) ? undefined : pretMax,
    yearMin: isNaN(anMin) ? undefined : anMin,
    yearMax: isNaN(anMax) ? undefined : anMax,
    mileageMin: isNaN(kilometrajMin) ? undefined : kilometrajMin,
    mileageMax: isNaN(kilometrajMax) ? undefined : kilometrajMax,
    engineCapacityMin: isNaN(capacitateMin) ? undefined : capacitateMin,
    engineCapacityMax: isNaN(capacitateMax) ? undefined : capacitateMax,
    horsepowerMin: isNaN(caiPutereMin) ? undefined : caiPutereMin,
    horsepowerMax: isNaN(caiPutereMax) ? undefined : caiPutereMax,
    lat: isNaN(lat) ? undefined : lat,
    lng: isNaN(lng) ? undefined : lng,
    radius: isNaN(raza) ? undefined : raza,
  };

  const initialResult = (() => {
    switch (tip) {
      case 'oferta':
        return getSellAutoCars(params);
      case 'cerere':
        return getBuyAutoCars(params);
      case 'inchiriere':
        return getRentAutoCars(params);
      case 'licitatie':
        return getAuctionAutoCars(params);
      default:
        return Promise.resolve({ items: [], total: 0, hasMore: false });
    }
  })();

  return <AutoPageClient initialResult={initialResult} initialPage={pagina} initialTip={tip} />;
}
