export type OrderStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export interface Order {
  id: string;
  customer: string;
  product: string;
  // Amount in US dollars
  amount: number;
  status: OrderStatus;
  // ISO date (yyyy-mm-dd)
  date: string;
}

export interface TopProduct {
  name: string;
  unitsSold: number;
  revenue: number;
}
