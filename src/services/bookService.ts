import { Book, BorrowedBook } from '../types/Book';

// Mock data for books
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    publicationYear: 1925,
    publisher: 'Scribner',
    genre: 'Classic',
    description: 'A novel of disillusionment and thwarted romance set during the Roaring Twenties.',
    available: true,
    coverImage: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    totalCopies: 5,
    availableCopies: 3,
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    publicationYear: 1960,
    publisher: 'HarperCollins',
    genre: 'Classic',
    description: 'A novel about racial inequality and moral growth set in the American South.',
    available: true,
    coverImage: 'https://images.pexels.com/photos/4170629/pexels-photo-4170629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    totalCopies: 8,
    availableCopies: 2,
  },
  {
    id: '3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    publicationYear: 2014,
    publisher: 'Harper',
    genre: 'Non-fiction',
    description: 'A survey of the history of humankind from the evolution of archaic human species in the Stone Age up to the twenty-first century.',
    available: false,
    coverImage: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    totalCopies: 3,
    availableCopies: 0,
  },
  {
    id: '4',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    isbn: '9780618640157',
    publicationYear: 1954,
    publisher: 'Mariner Books',
    genre: 'Fantasy',
    description: 'An epic high-fantasy novel set in Middle-earth, following the quest to destroy the One Ring.',
    available: true,
    coverImage: 'https://images.pexels.com/photos/2099266/pexels-photo-2099266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    totalCopies: 6,
    availableCopies: 4,
  },
  {
    id: '5',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    isbn: '9781408855652',
    publicationYear: 1997,
    publisher: 'Bloomsbury',
    genre: 'Fantasy',
    description: 'The first novel in the Harry Potter series, featuring a young wizard\'s education at Hogwarts School of Witchcraft and Wizardry.',
    available: true,
    coverImage: 'https://images.pexels.com/photos/1005012/pexels-photo-1005012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    totalCopies: 10,
    availableCopies: 7,
  },
  {
    id: '6',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780316769488',
    publicationYear: 1951,
    publisher: 'Little, Brown and Company',
    genre: 'Classic',
    description: 'A novel portraying teenage alienation and loss of innocence through the eyes of Holden Caulfield.',
    available: true,
    coverImage: 'https://images.pexels.com/photos/12064/pexels-photo-12064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    totalCopies: 4,
    availableCopies: 2,
  },
  {
    id: '7',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928227',
    publicationYear: 1937,
    publisher: 'Houghton Mifflin Harcourt',
    genre: 'Fantasy',
    description: 'A children\'s fantasy novel set in Middle-earth, following the quest of Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.',
    available: false,
    coverImage: 'https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    totalCopies: 5,
    availableCopies: 0,
  },
  {
    id: '8',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    publicationYear: 1813,
    publisher: 'Penguin Classics',
    genre: 'Classic',
    description: 'A romantic novel of manners following Elizabeth Bennet\'s personal growth and romance with Mr. Darcy.',
    available: true,
    coverImage: 'https://images.pexels.com/photos/3747279/pexels-photo-3747279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    totalCopies: 7,
    availableCopies: 3,
  }
];

// Mock borrowed books data
const mockBorrowedBooks: BorrowedBook[] = [
  {
    ...mockBooks[2],
    borrowDate: '2023-05-15',
    dueDate: '2023-06-15',
    isOverdue: true,
    overdueBy: 5,
    fine: 5.00
  },
  {
    ...mockBooks[6],
    borrowDate: '2023-05-20',
    dueDate: '2023-06-20',
    isOverdue: true,
    overdueBy: 3,
    fine: 3.00
  },
  {
    ...mockBooks[1],
    borrowDate: '2023-06-01',
    dueDate: '2023-07-01',
    isOverdue: false
  }
];

// Mock statistics data
const mockStats = {
  borrowed: 3,
  overdue: 2,
  available: 30,
  wishlist: 5
};

// Simulate API calls with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchMockBooks = async (): Promise<Book[]> => {
  await delay(800); // Simulate network delay
  return [...mockBooks];
};

export const fetchMockBorrowedBooks = async (): Promise<BorrowedBook[]> => {
  await delay(600);
  return [...mockBorrowedBooks];
};

export const fetchMockStats = async () => {
  await delay(500);
  return { ...mockStats };
};

export const fetchBookById = async (id: string): Promise<Book | null> => {
  await delay(300);
  const book = mockBooks.find(book => book.id === id);
  return book || null;
};

export const borrowBook = async (bookId: string): Promise<{ success: boolean; message: string }> => {
  await delay(500);
  
  const bookIndex = mockBooks.findIndex(book => book.id === bookId);
  
  if (bookIndex === -1) {
    return { success: false, message: 'Book not found' };
  }
  
  if (!mockBooks[bookIndex].available) {
    return { success: false, message: 'Book is not available' };
  }
  
  // In a real application, you would update the database here
  // For this demo, we're just updating our mock data
  mockBooks[bookIndex] = {
    ...mockBooks[bookIndex],
    available: false,
    availableCopies: mockBooks[bookIndex].availableCopies - 1
  };
  
  return { success: true, message: 'Book borrowed successfully' };
};

export const returnBook = async (bookId: string): Promise<{ success: boolean; message: string; fine?: number }> => {
  await delay(500);
  
  const borrowedBookIndex = mockBorrowedBooks.findIndex(book => book.id === bookId);
  
  if (borrowedBookIndex === -1) {
    return { success: false, message: 'Borrowed book record not found' };
  }
  
  const fine = mockBorrowedBooks[borrowedBookIndex].fine || 0;
  
  // In a real application, you would update the database here
  
  return { 
    success: true, 
    message: fine > 0 ? `Book returned with a fine of $${fine.toFixed(2)}` : 'Book returned successfully',
    fine: fine > 0 ? fine : undefined
  };
};