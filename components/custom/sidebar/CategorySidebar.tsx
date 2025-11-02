'use client';

import React, { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { categories } from '@/lib/categories';
import { subcategories } from '@/lib/mockData';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

type CategorySidebarProps = {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategoryChange?: (category: string, subcategory?: string) => void;
};

export function CategorySidebar({
  selectedCategory: selectedCategoryProp,
  selectedSubcategory: selectedSubcategoryProp,
  onCategoryChange,
}: CategorySidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use searchParams from Next instead of reading window.location or patching history
  const searchCategory = (searchParams?.get('category') as string) ?? undefined;
  const searchSubcategory = searchParams?.get('subcategory') ?? undefined;

  const selectedCategory = selectedCategoryProp ?? (searchCategory as string) ?? 'sell';
  const selectedSubcategory = selectedSubcategoryProp ?? searchSubcategory ?? undefined;

  const navigate =
    onCategoryChange ?? ((cat: string, sub?: string) => router.push(`/categorii?category=${cat}${sub ? `&subcategory=${sub}` : ''}`));

  const [openCategory, setOpenCategory] = useState<string | null>(selectedCategory);

  useEffect(() => {
    setOpenCategory(selectedCategory);
  }, [selectedCategory]);

  const handleMainClick = (catKey: string) => {
    if (selectedCategory === catKey && !selectedSubcategory) {
      setOpenCategory(openCategory === catKey ? null : catKey);
    } else {
      navigate(catKey);
      setOpenCategory(catKey);
    }
  };

  return (
    <Sidebar variant='sidebar' collapsible='icon'>
      <SidebarHeader>
        <h2 className='text-lg font-semibold'>Categorii</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Alege Categoria</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
                <Collapsible key={cat.key} open={openCategory === cat.key} onOpenChange={(open) => setOpenCategory(open ? cat.key : null)}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => handleMainClick(cat.key)}
                        isActive={selectedCategory === cat.key && !selectedSubcategory}
                        className={`transition-all duration-300 hover:scale-105 ${
                          selectedCategory === cat.key ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-accent'
                        }`}
                      >
                        <cat.icon className={`h-4 w-4 ${selectedCategory === cat.key ? 'animate-pulse' : ''}`} />
                        <span>{cat.label}</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subcategories.map((sub) => (
                          <SidebarMenuSubItem key={sub.id}>
                            <SidebarMenuSubButton
                              onClick={() => navigate(cat.key, sub.title ? sub.title.toLowerCase().replace(' ', '-') : '')}
                              isActive={
                                selectedCategory === cat.key &&
                                selectedSubcategory === (sub.title ? sub.title.toLowerCase().replace(' ', '-') : '')
                              }
                              className={`transition-all duration-200 ${
                                selectedCategory === cat.key &&
                                selectedSubcategory === (sub.title ? sub.title.toLowerCase().replace(' ', '-') : '')
                                  ? 'bg-primary/20 text-primary font-medium'
                                  : 'hover:bg-accent/50'
                              }`}
                            >
                              <sub.icon />
                              <span>{sub.title || ''}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function CategoryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname !== '/categorii') return <>{children}</>;

  const childrenArray = React.Children.toArray(children);
  const mainContent = childrenArray[0] ?? null;
  const rest = childrenArray.slice(1);

  return (
    <SidebarProvider>
      <div className='w-full'>
        <div className='flex w-full items-start'>
          <div className='shrink-0'>
            <Suspense fallback={<LoadingIndicator />}>
              <CategorySidebar />
            </Suspense>
          </div>

          <div className='flex-1 flex flex-col gap-6'>
            <div>{mainContent}</div>

            {rest.length > 0 && <div className='w-full'>{rest}</div>}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
