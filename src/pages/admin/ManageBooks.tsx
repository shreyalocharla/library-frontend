import React, { useState, useEffect } from 'react';
import { Book, Search, Filter, Plus, Edit, Trash, Info, CheckCircle, XCircle } from 'lucide-react';
import { fetchMockBooks } from '../../services/bookService';
import { Book as BookType } from '../../types/Book';

const ManageBooks: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [currentBook, setCurrentBook] = useState<BookType | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  
  // Form state for add/edit
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: new Date().getFullYear(),
    publisher: '',
    genre: '',
    description: '',
    coverImage: '',
    totalCopies: 1,
    availableCopies: 1
  });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await fetchMockBooks();
        setBooks(booksData);
        setFilteredBooks(booksData);
        
        // Extract unique genres
        const uniqueGenres = Array.from(new Set(booksData.map(book => book.genre)));
        setGenres(uniqueGenres);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...books];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        book => 
          book.title.toLowerCase().includes(term) || 
          book.author.toLowerCase().includes(term) ||
          book.isbn.includes(term)
      );
    }
    
    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }
    
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(book => 
        availabilityFilter === 'available' ? book.available : !book.available
      );
    }
    
    setFilteredBooks(filtered);
  }, [searchTerm, selectedGenre, availabilityFilter, books]);

  const handleOpenModal = (type: 'add' | 'edit' | 'delete', book: BookType | null = null) => {
    setOpenModal(type);
    setCurrentBook(book);
    
    if (type === 'add') {
      // Reset form for new book
      setBookForm({
        title: '',
        author: '',
        isbn: '',
        publicationYear: new Date().getFullYear(),
        publisher: '',
        genre: '',
        description: '',
        coverImage: '',
        totalCopies: 1,
        availableCopies: 1
      });
    } else if (type === 'edit' && book) {
      // Populate form with book data
      setBookForm({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publicationYear: book.publicationYear,
        publisher: book.publisher,
        genre: book.genre,
        description: book.description,
        coverImage: book.coverImage,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookForm(prev => ({
      ...prev,
      [name]: name === 'publicationYear' || name === 'totalCopies' || name === 'availableCopies'
        ? parseInt(value, 10)
        : value
    }));
  };

  const handleSaveBook = () => {
    // For a real app, this would call an API
    
    if (openModal === 'add') {
      // Create new book
      const newBook: BookType = {
        id: `book_${Date.now()}`,
        ...bookForm,
        available: bookForm.availableCopies > 0
      };
      
      setBooks(prev => [...prev, newBook]);
    } else if (openModal === 'edit' && currentBook) {
      // Update existing book
      setBooks(prev => 
        prev.map(book => 
          book.id === currentBook.id
            ? { 
                ...book, 
                ...bookForm,
                available: bookForm.availableCopies > 0
              }
            : book
        )
      );
    }
    
    setOpenModal(null);
  };

  const handleDeleteBook = () => {
    // For a real app, this would call an API
    if (currentBook) {
      setBooks(prev => 
        prev.filter(book => book.id !== currentBook.id)
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
                        {openModal === 'add' ? 'Add New Book' : 'Edit Book'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              type="text"
                              name="title"
                              id="title"
                              value={bookForm.title}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                            <input
                              type="text"
                              name="author"
                              id="author"
                              value={bookForm.author}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">ISBN</label>
                            <input
                              type="text"
                              name="isbn"
                              id="isbn"
                              value={bookForm.isbn}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700">Year</label>
                            <input
                              type="number"
                              name="publicationYear"
                              id="publicationYear"
                              value={bookForm.publicationYear}
                              onChange={handleInputChange}
                              min="1000"
                              max={new Date().getFullYear()}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">Publisher</label>
                            <input
                              type="text"
                              name="publisher"
                              id="publisher"
                              value={bookForm.publisher}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                            <select
                              name="genre"
                              id="genre"
                              value={bookForm.genre}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            >
                              <option value="">Select Genre</option>
                              {genres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                              ))}
                              <option value="new">Other (Add New)</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={bookForm.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          ></textarea>
                        </div>
                        
                        <div>
                          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                          <input
                            type="text"
                            name="coverImage"
                            id="coverImage"
                            value={bookForm.coverImage}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700">Total Copies</label>
                            <input
                              type="number"
                              name="totalCopies"
                              id="totalCopies"
                              value={bookForm.totalCopies}
                              onChange={handleInputChange}
                              min="1"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="availableCopies" className="block text-sm font-medium text-gray-700">Available Copies</label>
                            <input
                              type="number"
                              name="availableCopies"
                              id="availableCopies"
                              value={bookForm.availableCopies}
                              onChange={handleInputChange}
                              min="0"
                              max={bookForm.totalCopies}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSaveBook}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {openModal === 'add' ? 'Add Book' : 'Save Changes'}
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
                        Delete Book
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete "{currentBook?.title}"? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDeleteBook}
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
            <Book className="mr-2 h-6 w-6 text-teal-600" />
            Manage Books
          </h1>
          <p className="text-gray-600 mt-1">
            Add, edit, or remove books from the library
          </p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Book
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
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">All Books</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-12 gap-3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3 md:col-span-4">Title</div>
              <div className="col-span-3 md:col-span-2">Author</div>
              <div className="col-span-2 hidden md:block">Genre</div>
              <div className="col-span-2 md:col-span-1">Year</div>
              <div className="col-span-2 md:col-span-1">Status</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {filteredBooks.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Book className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Books Found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search criteria.</p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <div key={book.id} className="hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-3 px-6 py-4 text-sm">
                    <div className="col-span-3 md:col-span-4 flex items-center">
                      <div className="flex-shrink-0 h-10 w-7 mr-3 bg-gray-200 rounded overflow-hidden hidden md:block">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        {book.title}
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-2 flex items-center text-gray-600 truncate">
                      {book.author}
                    </div>
                    <div className="col-span-2 flex items-center text-gray-600 hidden md:flex">
                      {book.genre}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center text-gray-600">
                      {book.publicationYear}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center">
                      {book.available ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="mr-1 h-3 w-3" />
                          Unavailable
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal('edit', book)}
                        className="text-teal-600 hover:text-teal-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal('delete', book)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Details"
                      >
                        <Info className="h-4 w-4" />
                      </button>
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

export default ManageBooks;