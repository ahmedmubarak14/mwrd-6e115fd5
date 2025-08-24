
export interface BOQItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  category?: string;
  specifications?: string;
  notes?: string;
}
