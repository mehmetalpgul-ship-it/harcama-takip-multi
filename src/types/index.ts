export type Currency = 'TRY' | 'USD' | 'EUR';

export interface Transaction {
  id?: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: any; // Firestore Timestamp
  note?: string;
  currency: Currency;
  createdAt?: any;
}
