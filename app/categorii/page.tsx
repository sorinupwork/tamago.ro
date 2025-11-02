import CategoriesClient from '@/components/custom/categories/CategoriesClient';

type PageProps = {
  searchParams: Promise<{ tip?: string; subcategory?: string }>;
};

export default async function CategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <CategoriesClient initialCategory={params?.tip} initialSubcategory={params?.subcategory} />;
}
