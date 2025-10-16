import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  language: string;
  totalPages: number;
  image: string;
}

const BooksSection: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("title"); // default sort
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/home/books");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // sorting function
  const sortBooks = (a: Book, b: Book) => {
    let compareVal = 0;

    if (sortBy === "title" || sortBy === "author" || sortBy === "publisher" || sortBy === "language") {
      compareVal = a[sortBy].localeCompare(b[sortBy]);
    } else if (sortBy === "totalPages") {
      compareVal = a.totalPages - b.totalPages;
    }

    return sortOrder === "asc" ? compareVal : -compareVal;
  };

  return (
      <section className="py-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Books</h2>

            <div className="flex items-center space-x-3">
              <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-1 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="publisher">Publisher</option>
                <option value="language">Language</option>
                <option value="totalPages">Total Pages</option>
              </select>

              <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>
            </div>
          </div>

          {loading ? (
              <p className="text-gray-300">Loading...</p>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.length > 0 ? (
                    [...books].sort(sortBooks).map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))
                ) : (
                    <p className="text-gray-300">No books found.</p>
                )}
              </div>
          )}
        </div>
      </section>
  );
};

export default BooksSection;
