import React, {useState, useRef, useEffect} from "react";
import {Search, Upload, BookOpen} from "lucide-react";
import {useNavigate} from "react-router-dom";
import SearchDropdown from "./SearchDropdown";

interface SearchItem {
    id: string;
    name: string;
    type: string;
}


const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate(); // ✅ hook for navigation

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/home/search");
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data: SearchItem[] = await response.json();

                const filtered = data
                    .filter((item) =>
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 8);

                setSuggestions(filtered);
                setShowDropdown(filtered.length > 0);
            } catch (error) {
                console.error("Error fetching search suggestions:", error);
            }
        };

        fetchSuggestions();
    }, [searchQuery]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery);
            navigate(`/book/${encodeURIComponent(searchQuery)}`);
            setShowDropdown(false);
        }
    };

    const handleSuggestionClick = (suggestion: SearchItem) => {
        setSearchQuery(suggestion.name);
        setShowDropdown(false);
        searchInputRef.current?.focus();
        console.log("Selected:", suggestion);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <BookOpen className="w-8 h-8 text-purple-400"/>
                        <span className="text-xl font-bold text-white">Shelf</span>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-8 relative">
                        <div className="relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Search books, authors, publishers..."
                                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-600 transition-all duration-200"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-400 transition-colors"
                            >
                                <Search className="w-4 h-4"/>
                            </button>
                        </div>

                        {/* Search Dropdown */}
                        {showDropdown && (
                            <SearchDropdown
                                suggestions={suggestions}
                                onSuggestionClick={handleSuggestionClick}
                            />
                        )}
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={() => navigate("/uploadbook")} // ✅ navigate to route
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Upload className="w-4 h-4"/>
                        <span>Upload</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
