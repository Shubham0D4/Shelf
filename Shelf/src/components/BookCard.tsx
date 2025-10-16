import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    publisher: string;
    totalPages: number;
    language: string;
    image: string; // this is the filename stored in backend
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchCover = async () => {
      try {
        const response = await fetch(
            `http://localhost:8080/api/download/cover/${book.image}`
        );
        if (!response.ok) throw new Error("Failed to fetch cover image");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching cover:", error);
      }
    };

    if (book.image) {
      fetchCover();
    }
  }, [book.image]);

  const handleClick = () => {
    navigate(`/book/${encodeURIComponent(book.title)}`);
  };

  return (
      <div
          onClick={handleClick}
          className="cursor-pointer bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700/50"
      >
        <div className="flex h-40">
          <img
              src={imageUrl || "/fallback.jpg"} // fallback if image fails
              alt={book.title}
              className="w-28 h-full object-cover"
          />
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm">
                {book.title}
              </h3>
              <p className="text-gray-300 text-xs mb-1">by {book.author}</p>
              <p className="text-gray-400 text-xs mb-1">{book.publisher}</p>
              <p className="text-gray-400 text-xs mb-1">
                Language: {book.language}
              </p>
            </div>
            <div className="flex items-center justify-between">
            <span className="text-purple-400 text-xs font-medium">
              {book.totalPages} pages
            </span>
              {/*<button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200">*/}
              {/*  Read Now*/}
              {/*</button>*/}
            </div>
          </div>
        </div>
      </div>
  );
};

export default BookCard;
