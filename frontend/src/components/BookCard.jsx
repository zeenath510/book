import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    return (
        <div className="book-card">
            <img src={book.coverImage || 'https://via.placeholder.com/150'} alt={book.title} className="book-cover" />
            <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <Link to={`/book/${book._id}`} className="details-link">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default BookCard;
