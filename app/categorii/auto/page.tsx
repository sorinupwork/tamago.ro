import AutoPageClient from '@/components/custom/auto/AutoPageClient';
import { getSellAutoCars, getBuyAutoCars, getRentAutoCars, getAuctionAutoCars } from '@/actions/auto/actions';

export default async function AutoPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const tip = (searchParams.tip as string) || 'vanzare';
  const pagina = parseInt(searchParams.pagina as string) || 1;
  const cautare = searchParams.cautare as string;
  const marca = searchParams.marca as string;
  const combustibil = (searchParams.combustibil as string)?.split(',') || [];
  const transmisie = (searchParams.transmisie as string)?.split(',') || [];
  const tipCaroserie = (searchParams.tipCaroserie as string)?.split(',') || [];
  const status = searchParams.status as string;
  const pretMin = parseInt(searchParams.pretMin as string);
  const pretMax = parseInt(searchParams.pretMax as string);
  const anMin = parseInt(searchParams.anMin as string);
  const anMax = parseInt(searchParams.anMax as string);
  const kilometrajMin = parseInt(searchParams.kilometrajMin as string);
  const kilometrajMax = parseInt(searchParams.kilometrajMax as string);
  const capacitateMin = parseFloat(searchParams.capacitateMin as string);
  const capacitateMax = parseFloat(searchParams.capacitateMax as string);
  const caiPutereMin = parseInt(searchParams.caiPutereMin as string);
  const caiPutereMax = parseInt(searchParams.caiPutereMax as string);

  let sortBy = 'createdAt';
  if (searchParams.pret) sortBy = searchParams.pret === 'asc' ? 'price_asc' : 'price_desc';
  if (searchParams.an) sortBy = searchParams.an === 'asc' ? 'year_asc' : 'year_desc';
  if (searchParams.kilometraj) sortBy = searchParams.kilometraj === 'asc' ? 'mileage_asc' : 'mileage_desc';

  const params = {
    page: 1,
    limit: 100,
    search: cautare,
    status,
    sortBy,
    brand: marca,
    fuel: combustibil,
    transmission: transmisie,
    bodyType: tipCaroserie,
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
  };

  const initialResult = (() => {
    switch (tip) {
      case 'vanzare':
        return getSellAutoCars(params);
      case 'cumparare':
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
