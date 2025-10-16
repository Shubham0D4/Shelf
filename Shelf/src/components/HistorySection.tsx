import React, { useEffect, useState } from "react";
import HistoryCard from "./HistoryCard";

interface HistoryItem {
  bookId: string;
  title: string;
  author: string;
  publisher: string;
  totalPages: number;
  image: string;
  readPages: number;
}

const HistorySection: React.FC = () => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/home/history");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">History</h2>

          {loading ? (
              <p className="text-gray-300">Loading...</p>
          ) : (
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-6 pb-4 w-full">
                  {historyData.length > 0 ? (
                      historyData.map((book) => (
                          <HistoryCard key={book.bookId} book={book} />
                      ))
                  ) : (
                      <p className="text-gray-300">No history found.</p>
                  )}
                </div>
              </div>

          )}
        </div>
      </section>
  );
};

export default HistorySection;
