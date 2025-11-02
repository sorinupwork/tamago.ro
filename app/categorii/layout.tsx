import { SidebarProvider } from '@/components/ui/sidebar';

export default function CategoriiLayout({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
