import React, { useState, useEffect } from 'react';
import { Users, Book, Clock, DollarSign } from 'lucide-react';
import DashboardStats from '../../components/DashboardStats';
import { fetchMockBooks } from '../../services/bookService';
import { fetchMockUsers } from '../../services/userService';
import { Book as BookType } from '../../types/Book';
import { User } from '../../types/User';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalFines: 0
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [lowStockBooks, setLowStockBooks] = useState<BookType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [books, users] = await Promise.all([
          fetchMockBooks(),
          fetchMockUsers()
        ]);
        
        // Calculate statistics
        const availableBooks = books.filter(book => book.available).length;
        const borrowedBooks = books.length - availableBooks;
        const overdueBooks = 2; // Mock data
        const activeUsers = users.filter(user => user.role === 'user').length;
        const totalFines = users.reduce((sum, user) => sum + user.fines, 0);
        
        setStats({
          totalBooks: books.length,
          availableBooks,
          borrowedBooks,
          overdueBooks,
          totalUsers: users.length,
          activeUsers,
          totalFines
        });
        
        // Sort users by join date (most recent first) and take the first 5
        const sortedUsers = [...users].sort((a, b) => 
          new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime()
        ).slice(0, 5);
        setRecentUsers(sortedUsers);
        
        // Find books with low stock (less than 30% available)
        const booksWithLowStock = books.filter(book => 
          book.availableCopies / book.totalCopies < 0.3
        ).slice(0, 5);
        setLowStockBooks(booksWithLowStock);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">
          Overview of library statistics and activities
        </p>
      </div>

      <DashboardStats 
        stats={{
          borrowed: stats.borrowedBooks,
          available: stats.availableBooks,
          overdue: stats.overdueBooks
        }}
        isAdmin={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-teal-50 border-b border-teal-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Users className="h-5 w-5 mr-2 text-teal-600" />
              Recently Added Users
            </h2>
            <span className="text-sm font-medium text-teal-600">
              Total: {stats.totalUsers}
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {recentUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-teal-100 text-teal-500">
                        <Users className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-800">{user.name}</h3>
                      <span className="text-xs text-gray-500">Joined {user.memberSince}</span>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-teal-50 border-b border-teal-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Book className="h-5 w-5 mr-2 text-teal-600" />
              Low Stock Books
            </h2>
            <span className="text-sm font-medium text-teal-600">
              Critical: {lowStockBooks.length}
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {lowStockBooks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No low stock books at the moment.
              </div>
            ) : (
              lowStockBooks.map((book) => (
                <div key={book.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-8 bg-gray-200 rounded overflow-hidden">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-800">{book.title}</h3>
                      <p className="text-xs text-gray-500">By {book.author}</p>
                      <div className="mt-1 flex items-center text-xs">
                        <span className="text-red-600 font-medium">
                          Only {book.availableCopies} of {book.totalCopies} copies available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-teal-50 border-b border-teal-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-teal-600" />
              Recent Activities
            </h2>
          </div>
          <div className="p-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
              </div>
              <ul className="-mb-8">
                {[
                  { id: 1, content: 'Jane Smith borrowed "The Great Gatsby"', time: '2 hours ago' },
                  { id: 2, content: 'New user John Doe registered', time: '5 hours ago' },
                  { id: 3, content: 'Added 5 copies of "The Hobbit"', time: '1 day ago' },
                  { id: 4, content: 'Sarah Johnson returned "Pride and Prejudice" with a $3 fine', time: '2 days ago' },
                  { id: 5, content: 'Updated library policies', time: '1 week ago' }
                ].map((activity, activityIdx) => (
                  <li key={activity.id} className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center ring-8 ring-white">
                          <span className="h-2.5 w-2.5 rounded-full bg-teal-600"></span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm text-gray-800">{activity.content}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-teal-50 border-b border-teal-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-teal-600" />
              Financial Summary
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Outstanding Fines</h3>
                  <span className="text-lg font-bold text-red-600">${stats.totalFines.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Fines Collected (This Month)</h3>
                  <span className="text-lg font-bold text-green-600">$120.50</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-teal-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Books Replaced</p>
                  <p className="text-xl font-semibold text-teal-700">15</p>
                  <p className="text-xs text-gray-500">Value: $345.75</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">New Acquisitions</p>
                  <p className="text-xl font-semibold text-teal-700">28</p>
                  <p className="text-xs text-gray-500">Cost: $1,245.50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;