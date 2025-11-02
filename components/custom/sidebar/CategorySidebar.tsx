'use client';

import { useState, useEffect } from 'react';
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
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { categories, subcategories } from '@/lib/categories';

interface CategorySidebarProps {
  selectedCategory: string;
  selectedSubcategory?: string;
  onCategoryChange: (category: string, subcategory?: string) => void;
}

export function CategorySidebar({ selectedCategory, selectedSubcategory, onCategoryChange }: CategorySidebarProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(selectedCategory);

  useEffect(() => {
    setOpenCategory(selectedCategory);
  }, [selectedCategory]);

  const handleMainClick = (catKey: string) => {
    if (selectedCategory === catKey && !selectedSubcategory) {
      // Toggle submenu if already on category page
      setOpenCategory(openCategory === catKey ? null : catKey);
    } else {
      // Navigate and open submenu
      onCategoryChange(catKey);
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
                              onClick={() => onCategoryChange(cat.key, sub.title ? sub.title.toLowerCase().replace(' ', '-') : '')}
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
