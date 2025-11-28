import { 
  Wrench, 
  FileText, 
  Droplet, 
  Calendar, 
  Star,
  Fuel,
  Car,
  Palette,
  Zap,
  Gauge,
  Power,
  Cog,
  Axe,
  LoaderPinwheel,
  MapPin
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Maintenance & Service Icons
export const maintenanceIcons: Record<string, LucideIcon> = {
  Wrench,
  FileText,
  Droplet,
  Calendar,
  Other: Star,
};

// Car Specification Icons
export const carSpecIcons: Record<string, LucideIcon> = {
  Fuel,
  Brand: Car,
  Model: Car,
  Color: Palette,
  EngineCapacity: Zap,
  Mileage: Gauge,
  Power,
  Transmission: Cog,
  Traction: Axe,
  SteeringWheel: LoaderPinwheel,
  Location: MapPin,
};

// Combined icon map for backward compatibility
export const iconMap: Record<string, LucideIcon> = {
  // Maintenance
  Wrench,
  FileText,
  Droplet,
  Calendar,
  Other: Star,
  // Car Specs
  Fuel,
  Car,
  Palette,
  Zap,
  Gauge,
  Power,
  Cog,
  Axe,
  LoaderPinwheel,
  MapPin,
};

export default iconMap;
