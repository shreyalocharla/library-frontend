import React, { useState, useEffect } from 'react';
import { Book, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardStats from '../../components/DashboardStats';
import { fetchMockBorrowedBooks, fetchMockStats } from '../../services/bookService';
import { BorrowedBook } from '../../types/Book';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [stats, setStats] = useState({
    borrowed: 0,
    overdue: 0,
    available: 0,
    wishlist: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const booksData = await fetchMockBorrowedBooks();
        const statsData = await fetchMockStats();
        
        setBorrowedBooks(booksData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">
          Here's an overview of your library activities.
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Book className="h-5 w-5 mr-2 text-indigo-600" />
            Currently Borrowed Books
          </h2>
          <Link
            to="/user/profile"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {borrowedBooks.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              You haven't borrowed any books yet.
            </p>
            <Link
              to="/user/books"
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {borrowedBooks.slice(0, 3).map((book) => (
              <div key={book.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-14 w-10 bg-gray-200 rounded overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/user/books/${book.id}`}
                      className="text-base font-medium text-gray-800 hover:text-indigo-600"
                    >
                      {book.title}
                    </Link>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${book.isOverdue
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {book.isOverdue ? 'Overdue' : `Due ${book.dueDate}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-amber-50 border-b border-amber-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-600" />
              Due Soon
            </h2>
          </div>
          {borrowedBooks.filter(book => !book.isOverdue).length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                You don't have any books due soon.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {borrowedBooks
                .filter(book => !book.isOverdue)
                .slice(0, 2)
                .map((book) => (
                  <div key={book.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-10 w-8 object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{book.title}</p>
                        <p className="text-xs text-gray-500">Due {book.dueDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <AlertCircleIcon className="h-5 w-5 mr-2 text-red-600" />
              Overdue Books
            </h2>
          </div>
          {borrowedBooks.filter(book => book.isOverdue).length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                You don't have any overdue books.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {borrowedBooks
                .filter(book => book.isOverdue)
                .slice(0, 2)
                .map((book) => (
                  <div key={book.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-10 w-8 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{book.title}</p>
                        <p className="text-xs text-red-600">Overdue by {book.overdueBy} days</p>
                      </div>
                      <Link
                        to="/user/payment"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Pay Fine
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Separate component for the alert icon to avoid naming conflicts
const AlertCircleIcon = Clock;

export default UserDashboard;