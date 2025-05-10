import React, { useState, useEffect } from 'react';
import { DollarSign, Filter, RefreshCw, Check } from 'lucide-react';
import { fetchMockBorrowedBooks } from '../../services/bookService';
import { fetchMockUsers } from '../../services/userService';
import { BorrowedBook } from '../../types/Book';
import { User } from '../../types/User';

const ManageDues: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overdueBooks, setOverdueBooks] = useState<(BorrowedBook & { userName: string })[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'unpaid'
  const [userFilter, setUserFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, usersData] = await Promise.all([
          fetchMockBorrowedBooks(),
          fetchMockUsers()
        ]);
        
        setUsers(usersData);
        
        // Only get overdue books and add user name to them
        const overdue = booksData
          .filter(book => book.isOverdue)
          .map(book => {
            const user = usersData.find(u => u.id === '1'); // Mock: assuming all books are borrowed by user id 1
            return {
              ...book,
              userName: user ? user.name : 'Unknown User'
            };
          });
        
        setOverdueBooks(overdue);
      } catch (error) {
        console.error('Error loading dues data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handlePaymentProcess = (bookId: string) => {
    setProcessingPayment(bookId);
    
    // Simulate API call delay
    setTimeout(() => {
      setProcessingPayment(null);
      setPaymentSuccess(bookId);
      
      // Remove the book from the list after showing success for 2 seconds
      setTimeout(() => {
        setPaymentSuccess(null);
        setOverdueBooks(prev => prev.filter(book => book.id !== bookId));
      }, 2000);
    }, 1500);
  };

  const getTotalFines = () => {
    return overdueBooks
      .reduce((sum, book) => sum + (book.fine || 0), 0)
      .toFixed(2);
  };

  const getFilteredBooks = () => {
    let filtered = [...overdueBooks];
    
    if (userFilter) {
      filtered = filtered.filter(book => 
        book.userName.toLowerCase().includes(userFilter.toLowerCase())
      );
    }
    
    if (amountFilter) {
      const amount = parseFloat(amountFilter);
      filtered = filtered.filter(book => book.fine && book.fine >= amount);
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <DollarSign className="mr-2 h-6 w-6 text-teal-600" />
          Manage Dues
        </h1>
        <p className="text-gray-600 mt-1">
          Track and manage overdue books and fines
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-teal-100 text-teal-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Total Dues</h2>
              <p className="text-2xl font-semibold text-teal-600">${getTotalFines()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-red-100 text-red-600">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Overdue Books</h2>
              <p className="text-2xl font-semibold text-red-600">{overdueBooks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-amber-100 text-amber-600">
              <Filter className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Avg. Fine</h2>
              <p className="text-2xl font-semibold text-amber-600">
                ${overdueBooks.length > 0 
                  ? (overdueBooks.reduce((sum, book) => sum + (book.fine || 0), 0) / overdueBooks.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <label htmlFor="userFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by User
            </label>
            <input
              type="text"
              id="userFilter"
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="User name..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
          </div>
          
          <div className="md:w-48">
            <label htmlFor="amountFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Min. Fine Amount
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="amountFilter"
                min="0"
                step="0.01"
                className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="0.00"
                value={amountFilter}
                onChange={(e) => setAmountFilter(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-48 flex items-end">
            <button
              onClick={() => {
                setUserFilter('');
                setAmountFilter('');
              }}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-12 gap-3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-5 md:col-span-3">Book</div>
              <div className="col-span-3 md:col-span-2">User</div>
              <div className="col-span-2 hidden md:block">Borrow Date</div>
              <div className="col-span-2 hidden md:block">Due Date</div>
              <div className="col-span-2 md:col-span-1">Days Late</div>
              <div className="col-span-2 md:col-span-1">Fine</div>
              <div className="col-span-2 md:col-span-1">Action</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {getFilteredBooks().length === 0 ? (
              <div className="px-6 py-10 text-center">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Overdue Books Found</h3>
                <p className="mt-1 text-gray-500">There are no outstanding fines that match your filters.</p>
              </div>
            ) : (
              getFilteredBooks().map((book) => (
                <div key={book.id} className="hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-3 px-6 py-4 text-sm">
                    <div className="col-span-5 md:col-span-3 flex items-center">
                      <div className="flex-shrink-0 h-10 w-7 mr-3 bg-gray-200 rounded overflow-hidden hidden md:block">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="font-medium text-gray-900 truncate">
                        {book.title}
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-2 flex items-center text-gray-600">
                      {book.userName}
                    </div>
                    <div className="col-span-2 items-center text-gray-600 hidden md:flex">
                      {book.borrowDate}
                    </div>
                    <div className="col-span-2 items-center text-gray-600 hidden md:flex">
                      {book.dueDate}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center text-red-600 font-medium">
                      {book.overdueBy}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center text-red-600 font-semibold">
                      ${book.fine?.toFixed(2)}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center">
                      {processingPayment === book.id ? (
                        <span className="text-teal-600 flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing
                        </span>
                      ) : paymentSuccess === book.id ? (
                        <span className="text-green-600 flex items-center">
                          <Check className="h-4 w-4 mr-1" />
                          Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePaymentProcess(book.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-teal-700 text-xs font-medium rounded text-teal-700 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDues;