'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { categories } from '@/lib/categories';
import { subcategories } from '@/lib/subcategories';

type CategorySidebarProps = {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategoryChange?: (category: string, subcategory?: string) => void;
};

const categoryMapping = {
  oferta: 'sell',
  cerere: 'buy',
  inchiriere: 'rent',
  licitatie: 'auction',
} as const;

const reverseMapping = {
  sell: 'oferta',
  buy: 'cerere',
  rent: 'inchiriere',
  auction: 'licitatie',
} as const;

export function CategorySidebar({
  selectedCategory: selectedCategoryProp,
  selectedSubcategory: selectedSubcategoryProp,
  onCategoryChange,
}: CategorySidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchCategory = (searchParams?.get('tip') as string) ?? undefined;
  const searchSubcategory = searchParams?.get('subcategorie') ?? undefined;

  const selectedCategory =
    selectedCategoryProp ?? (searchCategory ? categoryMapping[searchCategory as keyof typeof categoryMapping] : 'sell') ?? 'sell';
  const selectedSubcategory = selectedSubcategoryProp ?? searchSubcategory ?? undefined;

  const navigate =
    onCategoryChange ??
    ((cat: string, sub?: string) => {
      const tipValue = reverseMapping[cat as keyof typeof reverseMapping] || cat;
      router.push(`/categorii?tip=${tipValue}${sub ? `&subcategorie=${sub}` : ''}`);
    });

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
    <Sidebar variant='sidebar' collapsible='icon' className='top-[52px]'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
                <Collapsible key={cat.key} open={openCategory === cat.key} onOpenChange={(open) => setOpenCategory(open ? cat.key : null)}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => handleMainClick(cat.key)}
                        isActive={selectedCategory === cat.key && !selectedSubcategory}
                        tooltip={cat.label}
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
                              tooltip={sub.title || ''}
                              className={`transition-all duration-200 ${
                                selectedCategory === cat.key &&
                                selectedSubcategory === (sub.title ? sub.title.toLowerCase().replace(' ', '-') : '')
                                  ? 'bg-primary/20 text-primary font-medium'
                                  : 'hover:bg-accent/50'
                              }`}
                            >
                              <sub.icon />
                              <span className='pointer-events-none'>{sub.title || ''}</span>
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
