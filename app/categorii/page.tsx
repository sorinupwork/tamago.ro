import CategoriesClient from '@/components/custom/categories/CategoriesClient';

interface PageProps {
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}

export default async function CategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <CategoriesClient initialCategory={params.category} initialSubcategory={params.subcategory} />;
}
