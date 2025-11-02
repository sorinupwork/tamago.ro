'use client';

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
} from '@/components/ui/sidebar';
import { ShoppingCart, HandHeart, Calendar, Gavel } from 'lucide-react';

const categories = [
  { key: 'sell', label: 'Vânzare', icon: ShoppingCart },
  { key: 'buy', label: 'Cumpărare', icon: HandHeart },
  { key: 'rent', label: 'Închiriere', icon: Calendar },
  { key: 'auction', label: 'Licitație', icon: Gavel },
];

interface AppSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function AppSidebar({ selectedCategory, onCategoryChange }: AppSidebarProps) {
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
                <SidebarMenuItem key={cat.key}>
                  <SidebarMenuButton
                    onClick={() => onCategoryChange(cat.key)}
                    isActive={selectedCategory === cat.key}
                    className='transition-all duration-300 hover:scale-105'
                  >
                    <cat.icon className='h-4 w-4' />
                    <span>{cat.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
