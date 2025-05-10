import { User, Payment } from '../types/User';

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'user',
    memberSince: '2022-05-15',
    borrowedBooks: 3,
    returnedBooks: 12,
    overdueBooks: 1,
    fines: 5.00,
    phoneNumber: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    memberSince: '2022-07-22',
    borrowedBooks: 1,
    returnedBooks: 5,
    overdueBooks: 0,
    fines: 0,
    phoneNumber: '555-987-6543',
    address: '456 Elm St, Othertown, USA',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '3',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
    memberSince: '2021-01-10',
    borrowedBooks: 0,
    returnedBooks: 0,
    overdueBooks: 0,
    fines: 0,
    phoneNumber: '555-555-5555',
    address: 'Library Admin Office',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

// Mock payments data
const mockPayments: Payment[] = [
  {
    id: '1',
    userId: '1',
    amount: 2.50,
    date: '2023-04-10',
    method: 'credit_card',
    status: 'completed',
    description: 'Overdue fine for "The Hobbit"'
  },
  {
    id: '2',
    userId: '1',
    amount: 5.00,
    date: '2023-06-05',
    method: 'paypal',
    status: 'completed',
    description: 'Overdue fine for "Sapiens"'
  },
  {
    id: '3',
    userId: '2',
    amount: 3.00,
    date: '2023-05-22',
    method: 'credit_card',
    status: 'completed',
    description: 'Overdue fine for "Pride and Prejudice"'
  }
];

// Simulate API calls with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchMockUsers = async (): Promise<User[]> => {
  await delay(800);
  return [...mockUsers];
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  await delay(300);
  const user = mockUsers.find(user => user.id === id);
  return user || null;
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  await delay(300);
  const userData = localStorage.getItem('libraryUser');
  if (!userData) return null;
  
  const user = JSON.parse(userData);
  const fullUserData = mockUsers.find(u => u.id === user.id);
  return fullUserData || null;
};

export const fetchUserPayments = async (userId: string): Promise<Payment[]> => {
  await delay(600);
  return mockPayments.filter(payment => payment.userId === userId);
};

export const processPayment = async (
  userId: string, 
  amount: number, 
  method: 'credit_card' | 'paypal' | 'cash', 
  description: string
): Promise<{ success: boolean; message: string }> => {
  await delay(1000);
  
  // In a real application, you would integrate with a payment gateway here
  
  const newPayment: Payment = {
    id: `payment_${Date.now()}`,
    userId,
    amount,
    date: new Date().toISOString().split('T')[0],
    method,
    status: 'completed',
    description
  };
  
  mockPayments.push(newPayment);
  
  // Update user's fines
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].fines = Math.max(0, mockUsers[userIndex].fines - amount);
  }
  
  return { success: true, message: 'Payment processed successfully' };
};