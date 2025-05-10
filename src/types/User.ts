export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  memberSince: string;
  borrowedBooks: number;
  returnedBooks: number;
  overdueBooks: number;
  fines: number;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  date: string;
  method: 'credit_card' | 'paypal' | 'cash';
  status: 'completed' | 'pending' | 'failed';
  description: string;
}