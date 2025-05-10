export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  publisher: string;
  genre: string;
  description: string;
  available: boolean;
  coverImage: string;
  totalCopies: number;
  availableCopies: number;
}

export interface BorrowedBook extends Book {
  borrowDate: string;
  dueDate: string;
  isOverdue: boolean;
  overdueBy?: number; // days
  fine?: number;
}

export interface UserBook {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  fine?: number;
}

export interface BookReservation {
  id: string;
  bookId: string;
  userId: string;
  reservationDate: string;
  status: 'pending' | 'fulfilled' | 'canceled';
}