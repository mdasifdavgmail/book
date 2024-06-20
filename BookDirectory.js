import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookDirectory = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:9100/user')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genere.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search by title, author, or genre"
                value={searchTerm}
                onChange={handleSearch}
            />
            <ul>
                {filteredBooks.map(book => (
                    <li key={book._id}>
                        {book.title} by {book.author} ({book.genere}, {book.publishedyear}) 
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookDirectory;
