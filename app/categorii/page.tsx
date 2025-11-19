import CategoriesClient from '@/components/custom/categories/CategoriesClient';

export default async function CategoryPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const tip = typeof params.tip === 'string' ? params.tip : undefined;
  const subcategorie = typeof params.subcategorie === 'string' ? params.subcategorie : undefined;

  return <CategoriesClient initialCategory={tip} initialSubcategory={subcategorie} />;
}
