import { 
  ShoppingCart, 
  Pill, 
  Fuel, 
  Coffee, 
  UtensilsCrossed, 
  Landmark, 
  Hammer, 
  ShoppingBag, 
  MapPin,
  Store,
  Car,
  Building2,
  Package,
  Dumbbell,
  Shirt,
  Scissors,
  Book,
  Heart,
  GraduationCap,
  Home,
  Wrench,
  Pizza,
  Zap,
  Wifi,
  Phone,
  Camera,
  Music,
  Gamepad2,
  Flower,
  TreePine,
  Dog,
  Baby,
  Glasses,
  Watch,
  PaintBucket,
  Briefcase
} from 'lucide-react';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Add the missing STEPS export
export const STEPS = {
  understanding: 'Understanding',
  searching: 'Searching', 
  validating: 'Validating',
  optimizing: 'Optimizing',
  finalizing: 'Finalizing'
};

// Add the missing STEP_MESSAGES export
export const STEP_MESSAGES = {
  understanding: 'Understanding your request...',
  searching: 'Searching for places...',
  validating: 'Validating options...',
  optimizing: 'Optimizing your route...',
  finalizing: 'Finalizing your plan...',
  complete: 'Your plan is ready!'
};

export const CATEGORY_ICONS = {
  // Grocery variants
  grocery: ShoppingCart,
  groceries: ShoppingCart,
  supermarket: ShoppingCart,
  grocerystore: ShoppingCart,
  market: ShoppingCart,
  
  // Pharmacy variants
  pharmacy: Pill,
  medical: Pill,
  drugstore: Pill,
  chemist: Pill,
  medicine: Pill,
  
  // Gas station variants
  gas: Fuel,
  gasstation: Fuel,
  fuel: Fuel,
  petrol: Fuel,
  indianoil: Fuel,
  bp: Fuel,
  shell: Fuel,
  
  // Coffee variants
  coffee: Coffee,
  cafe: Coffee,
  coffeeshop: Coffee,
  starbucks: Coffee,
  
  // Restaurant variants
  restaurant: UtensilsCrossed,
  food: UtensilsCrossed,
  dining: UtensilsCrossed,
  pizza: Pizza,
  
  // Banking variants
  bank: Landmark,
  banking: Landmark,
  atm: Landmark,
  
  // Hardware variants
  hardware: Hammer,
  tools: Hammer,
  
  // Shopping variants
  shopping: ShoppingBag,
  mall: ShoppingBag,
  retail: ShoppingBag,
  
  // Store variants
  store: Store,
  shop: Store,
  
  // Automotive variants
  automotive: Car,
  car: Car,
  vehicle: Car,
  garage: Car,
  
  // Building variants
  building: Building2,
  office: Building2,
  
  // Package variants
  package: Package,
  delivery: Package,
  courier: Package,
  
  // Fitness & Health
  gym: Dumbbell,
  fitness: Dumbbell,
  workout: Dumbbell,
  health: Heart,
  hospital: Heart,
  clinic: Heart,
  
  // Personal Care
  laundry: Shirt,
  laundromat: Shirt,
  dryclean: Shirt,
  salon: Scissors,
  barber: Scissors,
  spa: Scissors,
  
  // Education & Books
  library: Book,
  bookstore: Book,
  school: GraduationCap,
  education: GraduationCap,
  
  // Home & Garden
  home: Home,
  garden: TreePine,
  nursery: Flower,
  florist: Flower,
  
  // Electronics & Tech
  electronics: Zap,
  mobile: Phone,
  phone: Phone,
  computer: Wifi,
  internet: Wifi,
  camera: Camera,
  
  // Entertainment
  music: Music,
  gaming: Gamepad2,
  games: Gamepad2,
  
  // Pet Care
  pet: Dog,
  veterinary: Dog,
  vet: Dog,
  
  // Baby & Kids
  baby: Baby,
  kids: Baby,
  
  // Fashion & Accessories
  fashion: Glasses,
  clothing: Shirt,
  shoes: Watch,
  accessories: Watch,
  
  // Art & Crafts
  art: PaintBucket,
  paint: PaintBucket,
  crafts: PaintBucket,
  
  // Professional Services
  business: Briefcase,
  service: Wrench,
  repair: Wrench,
  
  // Default fallback
  default: MapPin
};

console.log('🔧 CONSTANTS: Available icons:', Object.keys(CATEGORY_ICONS));