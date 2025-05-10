import React from 'react';
import { Book as BookType } from '../types/Book';
import { Link } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: BookType;
  showActions?: boolean;
  onBorrow?: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, showActions = false, onBorrow }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:translate-y-[-4px]">
      <div className="relative h-56 bg-gray-200">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        {book.available ? (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            Available
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Unavailable
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{book.genre}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{book.publicationYear}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <Link 
            to={`/user/books/${book.id}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            View Details
          </Link>
          
          {showActions && book.available && (
            <button
              onClick={() => onBorrow && onBorrow(book.id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded-md transition-colors"
            >
              Borrow
            </button>
          )}
          
          {showActions && !book.available && (
            <span className="text-gray-500 text-sm">Not Available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;