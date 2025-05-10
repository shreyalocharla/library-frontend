import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Edit, Trash, Mail, User, X, Check } from 'lucide-react';
import { fetchMockUsers } from '../../services/userService';
import { User as UserType } from '../../types/User';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [overdueFilter, setOverdueFilter] = useState(false);
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  
  // Form state for add/edit
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchMockUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...users];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.name.toLowerCase().includes(term) || 
          user.email.toLowerCase().includes(term)
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    if (overdueFilter) {
      filtered = filtered.filter(user => user.overdueBooks > 0);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, overdueFilter, users]);

  const handleOpenModal = (type: 'add' | 'edit' | 'delete', user: UserType | null = null) => {
    setOpenModal(type);
    setCurrentUser(user);
    
    if (type === 'add') {
      // Reset form for new user
      setUserForm({
        name: '',
        email: '',
        role: 'user',
        phoneNumber: '',
        address: ''
      });
    } else if (type === 'edit' && user) {
      // Populate form with user data
      setUserForm({
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = () => {
    // For a real app, this would call an API
    
    if (openModal === 'add') {
      // Create new user
      const newUser: UserType = {
        id: `user_${Date.now()}`,
        ...userForm,
        memberSince: new Date().toISOString().split('T')[0],
        borrowedBooks: 0,
        returnedBooks: 0,
        overdueBooks: 0,
        fines: 0
      };
      
      setUsers(prev => [...prev, newUser]);
    } else if (openModal === 'edit' && currentUser) {
      // Update existing user
      setUsers(prev => 
        prev.map(user => 
          user.id === currentUser.id
            ? { 
                ...user, 
                ...userForm
              }
            : user
        )
      );
    }
    
    setOpenModal(null);
  };

  const handleDeleteUser = () => {
    // For a real app, this would call an API
    if (currentUser) {
      setUsers(prev => 
        prev.filter(user => user.id !== currentUser.id)
      );
    }
    
    setOpenModal(null);
  };

  const renderModal = () => {
    switch (openModal) {
      case 'add':
      case 'edit':
        return (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {openModal === 'add' ? 'Add New User' : 'Edit User'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={userForm.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={userForm.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                          <select
                            name="role"
                            id="role"
                            value={userForm.role}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={userForm.phoneNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={userForm.address}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSaveUser}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {openModal === 'add' ? 'Add User' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenModal(null)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'delete':
        return (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Delete User
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete the user "{currentUser?.name}"? This action cannot be undone.
                        </p>
                        {currentUser?.borrowedBooks && currentUser.borrowedBooks > 0 && (
                          <p className="mt-2 text-sm text-red-600">
                            Warning: This user currently has {currentUser.borrowedBooks} borrowed book(s).
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenModal(null)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Users className="mr-2 h-6 w-6 text-teal-600" />
            Manage Users
          </h1>
          <p className="text-gray-600 mt-1">
            Add, edit, or remove library users
          </p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">Users Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="overdueFilter"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                checked={overdueFilter}
                onChange={(e) => setOverdueFilter(e.target.checked)}
              />
              <label htmlFor="overdueFilter" className="ml-2 text-sm text-gray-700">
                Has Overdue Books
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-12 gap-3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3 md:col-span-2">User</div>
              <div className="col-span-4 md:col-span-3">Email</div>
              <div className="col-span-2 md:col-span-1">Role</div>
              <div className="col-span-1 hidden md:block">Joined</div>
              <div className="col-span-1 hidden md:block">Borrowed</div>
              <div className="col-span-1 hidden md:block">Overdue</div>
              <div className="col-span-1 hidden md:block">Fines</div>
              <div className="col-span-3 md:col-span-2">Actions</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Users Found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search criteria.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-3 px-6 py-4 text-sm">
                    <div className="col-span-3 md:col-span-2 flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-teal-100 text-teal-500">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3 font-medium text-gray-900 truncate">{user.name}</div>
                    </div>
                    <div className="col-span-4 md:col-span-3 flex items-center text-gray-600 truncate">
                      <Mail className="h-4 w-4 mr-1 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                    <div className="col-span-1 items-center text-gray-600 hidden md:flex">
                      {user.memberSince}
                    </div>
                    <div className="col-span-1 items-center text-gray-600 hidden md:flex">
                      {user.borrowedBooks}
                    </div>
                    <div className="col-span-1 items-center hidden md:flex">
                      {user.overdueBooks > 0 ? (
                        <span className="text-red-600 font-medium">{user.overdueBooks}</span>
                      ) : (
                        <span className="text-green-600 font-medium">0</span>
                      )}
                    </div>
                    <div className="col-span-1 items-center hidden md:flex">
                      {user.fines > 0 ? (
                        <span className="text-red-600 font-medium">${user.fines.toFixed(2)}</span>
                      ) : (
                        <span className="text-green-600 font-medium">$0.00</span>
                      )}
                    </div>
                    <div className="col-span-3 md:col-span-2 flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal('edit', user)}
                        className="text-teal-600 hover:text-teal-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal('delete', user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      {user.overdueBooks > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          <X className="h-3 w-3 mr-1" />
                          Overdue
                        </span>
                      )}
                      {user.fines > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          ${user.fines.toFixed(2)} Due
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
};

export default ManageUsers;