import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book as BookIcon, Calendar, User, Building, Tag, ArrowLeft, Clock, Check } from 'lucide-react';
import { fetchBookById, borrowBook } from '../../services/bookService';
import { Book } from '../../types/Book';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borrowing, setBorrowing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadBook = async () => {
      try {
        if (!id) {
          setError('Book ID is missing');
          setLoading(false);
          return;
        }

        const bookData = await fetchBookById(id);
        if (!bookData) {
          setError('Book not found');
        } else {
          setBook(bookData);
        }
      } catch (err) {
        setError('Failed to load book details');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!book || !book.available) return;
    
    try {
      setBorrowing(true);
      const result = await borrowBook(book.id);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Update local book state to reflect the change
        setBook(prev => prev ? { ...prev, available: false, availableCopies: prev.availableCopies - 1 } : null);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while borrowing the book' });
      console.error('Error borrowing book:', err);
    } finally {
      setBorrowing(false);
      
      // Auto-clear the message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !book) {
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
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Catalog
      </button>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <Check className="h-5 w-5 text-green-400" />
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-gray-200 md:w-1/3 h-64 md:h-auto">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h1>
              <div className={`ml-4 ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs font-semibold px-3 py-1 rounded-full`}>
                {book.available ? 'Available' : 'Unavailable'}
              </div>
            </div>
            
            <div className="mt-2 flex items-center text-gray-700">
              <User className="h-4 w-4 mr-1" />
              <span className="text-lg">{book.author}</span>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <Tag className="h-4 w-4 mr-2 text-indigo-500" />
                <span>Genre: {book.genre}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                <span>Published: {book.publicationYear}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Building className="h-4 w-4 mr-2 text-indigo-500" />
                <span>Publisher: {book.publisher}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BookIcon className="h-4 w-4 mr-2 text-indigo-500" />
                <span>ISBN: {book.isbn}</span>
              </div>
            </div>
            
            <div className="mt-4 text-gray-700">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p>{book.description}</p>
            </div>
            
            <div className="mt-6 flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Loan period: 30 days</span>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div>
                <span className="text-gray-600">{book.availableCopies} of {book.totalCopies} copies available</span>
                <div className="mt-1 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full" 
                    style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {book.available ? (
                <button
                  onClick={handleBorrow}
                  disabled={borrowing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {borrowing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Borrow Book'
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-500 bg-gray-100 cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;