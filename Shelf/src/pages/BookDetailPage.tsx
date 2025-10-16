    import React, { useEffect, useState } from "react";
    import { useParams, useNavigate } from "react-router-dom";
    import HistorySection from "../components/HistorySection.tsx";

    interface BookDetail {
        id: string;
        title: string;
        author: string;
        publisher: string;
        pubDate: string;
        totalPages: number;
        language: string;
        filetype: string;
        readPages: number;
        image: string;
        location: string;
    }

    const BookDetailPage: React.FC = () => {
        const { title } = useParams<{ title: string }>();
        const navigate = useNavigate();

        const [book, setBook] = useState<BookDetail | null>(null);
        const [otherBooks, setOtherBooks] = useState<BookDetail[]>([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchBookDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/book/${title}`);
                    if (!response.ok) throw new Error("Failed to fetch book details");
                    const data = await response.json();
                    const img = await fetch(`http://localhost:8080/api/download/cover/${data.image}`);
                    const blob = await img.blob();
                    const imageUrl = URL.createObjectURL(blob);

                    setBook({
                        ...data,
                        readpages: data.readpages ?? 0,
                        image: imageUrl
                    });
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

            const fetchOtherBooks = async () => {
                try {
                    const response = await fetch("http://localhost:8080/api/home/books");
                    if (!response.ok) throw new Error("Failed to fetch other books");

                    const data = await response.json(); // data is an array of books

                    // For each book, fetch its image and attach blob URL
                    const booksWithImages = await Promise.all(
                        data.map(async (book: BookDetail) => {
                            try {
                                const imgResponse = await fetch(`http://localhost:8080/api/download/cover/${book.image}`);
                                if (!imgResponse.ok) throw new Error("Failed to fetch book image");

                                const blob = await imgResponse.blob();
                                const imageUrl = URL.createObjectURL(blob);

                                return { ...book, image: imageUrl }; // replace image filename with blob URL
                            } catch (err) {
                                console.error(`Error fetching image for book ${book.id}:`, err);
                                return { ...book, image: null }; // fallback if image fails
                            }
                        })
                    );

                    setOtherBooks(booksWithImages);
                } catch (error) {
                    console.error(error);
                }
            };


            fetchBookDetails();
            fetchOtherBooks();
        }, [title]);

        const handleRead = () => {
            if (!book) return;
            navigate(`/reader/${book.id}`, { state: {
                    location: book.location,
                    title: book.title,
                    pageNo: book.readPages
                } });
        };

        if (loading) return <p className="text-white p-4">Loading...</p>;
        if (!book) return <p className="text-red-400 p-4">Book not found.</p>;

        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
                {/* Book Details Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <img
                        src={book.image}
                        alt={book.title}
                        className="w-60 h-80 object-cover rounded-lg shadow-lg text-gray-600"
                    />
                    <div className="flex-1 text-white space-y-4">
                        <h1 className="text-3xl font-bold">{book.title}</h1>
                        <p className="text-gray-300 text-sm">by {book.author}</p>
                        <p className="text-gray-400 text-sm">Publisher: {book.publisher}</p>
                        <p className="text-gray-400 text-sm">Language: {book.language}</p>
                        <p className="text-gray-400 text-sm">Type: {book.filetype}</p>
                        <p className="text-gray-400 text-sm">
                            Published on: {new Date(book.pubDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300 text-sm">
                            Pages: {book.readPages}/{book.totalPages}
                        </p>
                        <button
                            onClick={handleRead}
                            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded font-medium transition-all duration-200"
                        >
                            Read
                        </button>
                    </div>
                </div>

                <HistorySection/>

                {/* Other Books Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Other Books</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {otherBooks.map((b) => (
                            <div
                                key={b.id}
                                className="min-w-[200px] bg-gray-800/60 rounded-lg p-4 flex-shrink-0 cursor-pointer"
                                onClick={() => navigate(`/book/${encodeURIComponent(b.title)}`)}
                            >
                                <img
                                    src={b.image}
                                    alt={b.title}
                                    className="h-40 w-full object-cover rounded mb-2 text-gray-500"
                                />
                                <p className="text-white text-sm font-medium truncate">
                                    {b.title}
                                </p>
                                <p className="text-gray-400 text-xs truncate">by {b.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    export default BookDetailPage;
