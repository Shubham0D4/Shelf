import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

interface HistoryCardProps {
  book: {
    bookId: string;
    title: string;
    author: string;
    publisher: string;
    totalPages: number;
    readPages: number;
    image: string;
  };
}

const HistoryCard: React.FC<HistoryCardProps> = ({ book }) => {
    const navigate = useNavigate();
  const getProgressPercentage = (readPages: number, totalPages: number) => {
    return Math.round((readPages / totalPages) * 100);
  };
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
          className="flex-shrink-0 w-72 sm:w-80 md:w-96 bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700/50"
      >
        <div className="flex">
          <img
              src={imageUrl || '/fallback.jpg'}
              alt={book.title}
              className="w-28  object-cover rounded-l-lg"
          />
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-1 text-sm line-clamp-2">
                {book.title}
              </h3>
              <p className="text-gray-300 text-xs mb-1 truncate">by {book.author}</p>
              <p className="text-gray-400 text-xs mb-3 truncate">{book.publisher}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Progress</span>
                <span className="text-purple-400 font-medium">
            {getProgressPercentage(book.readPages, book.totalPages)}%
          </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${getProgressPercentage(book.readPages, book.totalPages)}%`
                    }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{book.readPages} read</span>
                <span>{book.totalPages} total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default HistoryCard;