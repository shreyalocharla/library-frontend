import React, { useState, useEffect } from 'react';
import { Book as BookIcon } from 'lucide-react';
import BookCard from '../../components/BookCard';
import FilterBar from '../../components/FilterBar';
import { fetchMockBooks } from '../../services/bookService';
import { Book } from '../../types/Book';

const BookCatalog: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await fetchMockBooks();
        setBooks(booksData);
        setFilteredBooks(booksData);
        
        // Extract unique genres
        const uniqueGenres = Array.from(new Set(booksData.map(book => book.genre)));
        setGenres(uniqueGenres);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleFilterChange = (filters: { searchTerm: string; genre: string }) => {
    let filtered = [...books];
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        book => 
          book.title.toLowerCase().includes(term) || 
          book.author.toLowerCase().includes(term)
      );
    }
    
    if (filters.genre) {
      filtered = filtered.filter(book => book.genre === filters.genre);
    }
    
    setFilteredBooks(filtered);
  };

  const handleBorrow = (bookId: string) => {
    // In a real app, this would call an API to borrow the book
    console.log(`Borrowing book with ID: ${bookId}`);
    // For demo purposes, update the UI to show book as unavailable
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === bookId ? { ...book, available: false } : book
      )
    );
    setFilteredBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === bookId ? { ...book, available: false } : book
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <BookIcon className="mr-2 h-6 w-6 text-indigo-600" />
          Book Catalog
        </h1>
        <p className="text-gray-600 mt-1">
          Browse our collection of books and borrow what interests you.
        </p>
      </div>

      <FilterBar onFilterChange={handleFilterChange} genres={genres} />

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <BookIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Books Found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              showActions={true}
              onBorrow={handleBorrow}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCatalog;