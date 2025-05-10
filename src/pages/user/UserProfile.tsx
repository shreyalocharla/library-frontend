import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Book, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchCurrentUser } from '../../services/userService';
import { fetchMockBorrowedBooks, returnBook } from '../../services/bookService';
import { BorrowedBook } from '../../types/Book';

const UserProfile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [userDetails, setUserDetails] = useState(authUser);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [returnStatus, setReturnStatus] = useState<{
    bookId: string;
    status: 'returning' | 'success' | 'error';
    message?: string;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (authUser) {
          const [userData, booksData] = await Promise.all([
            fetchCurrentUser(),
            fetchMockBorrowedBooks()
          ]);
          
          if (userData) {
            setUserDetails(userData);
          }
          
          setBorrowedBooks(booksData);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authUser]);

  const handleReturnBook = async (bookId: string) => {
    setReturnStatus({
      bookId,
      status: 'returning'
    });
    
    try {
      const result = await returnBook(bookId);
      
      if (result.success) {
        setBorrowedBooks(prevBooks => 
          prevBooks.filter(book => book.id !== bookId)
        );
        
        setReturnStatus({
          bookId,
          status: 'success',
          message: result.message
        });
        
        // Auto-hide the success message after 3 seconds
        setTimeout(() => {
          setReturnStatus(null);
        }, 3000);
      } else {
        setReturnStatus({
          bookId,
          status: 'error',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Error returning book:', error);
      setReturnStatus({
        bookId,
        status: 'error',
        message: 'An error occurred while returning the book'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <User className="mr-2 h-6 w-6 text-indigo-600" />
          My Profile
        </h1>
        <p className="text-gray-600 mt-1">
          View and manage your personal information and borrowed books.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-indigo-50 border-b border-indigo-100">
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                  {userDetails?.profileImage ? (
                    <img
                      src={userDetails.profileImage}
                      alt={userDetails.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                      <User className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{userDetails?.name}</h3>
                <p className="text-gray-600">Member since {userDetails?.memberSince}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{userDetails?.email}</p>
                  </div>
                </div>
                
                {userDetails?.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-800">{userDetails.phoneNumber}</p>
                    </div>
                  </div>
                )}
                
                {userDetails?.address && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-800">{userDetails.address}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Library Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-semibold text-indigo-600">{userDetails?.borrowedBooks}</p>
                    <p className="text-xs text-gray-600">Borrowed</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-semibold text-green-600">{userDetails?.returnedBooks}</p>
                    <p className="text-xs text-gray-600">Returned</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-semibold text-amber-600">{userDetails?.overdueBooks}</p>
                    <p className="text-xs text-gray-600">Overdue</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-semibold text-red-600">${userDetails?.fines.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Fines</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-indigo-50 border-b border-indigo-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Book className="h-5 w-5 mr-2 text-indigo-600" />
                My Borrowed Books
              </h2>
            </div>

            {borrowedBooks.length === 0 ? (
              <div className="p-6 text-center">
                <Book className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Borrowed Books</h3>
                <p className="mt-1 text-gray-500">You haven't borrowed any books yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {borrowedBooks.map((book) => (
                  <div key={book.id} className="p-4 hover:bg-gray-50">
                    <div className="sm:flex items-center">
                      <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-24 w-16 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-800">{book.title}</h3>
                        <p className="text-gray-600">{book.author}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            <span>Borrowed: {book.borrowDate}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <AlertCircle className="h-4 w-4 mr-1 text-gray-400" />
                            <span className={book.isOverdue ? 'text-red-600 font-medium' : ''}>
                              Due: {book.dueDate}
                              {book.isOverdue && ` (Overdue by ${book.overdueBy} days)`}
                            </span>
                          </div>
                          {book.isOverdue && book.fine && (
                            <div className="flex items-center text-sm text-red-600 font-medium">
                              <span>Fine: ${book.fine.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-4">
                        {returnStatus && returnStatus.bookId === book.id ? (
                          returnStatus.status === 'returning' ? (
                            <div className="animate-pulse flex items-center text-sm text-indigo-600">
                              <svg className="animate-spin h-4 w-4 mr-1 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Returning...
                            </div>
                          ) : (
                            <div className={`text-sm ${returnStatus.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                              {returnStatus.message}
                            </div>
                          )
                        ) : (
                          <button
                            onClick={() => handleReturnBook(book.id)}
                            className="inline-flex items-center px-3 py-1 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                          >
                            Return Book
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;