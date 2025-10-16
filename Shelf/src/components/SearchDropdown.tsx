import React from 'react';
import { BookOpen, User, Building } from 'lucide-react';

interface SearchItem {
  type: string;
  name: string;
  id: string;
}

interface SearchDropdownProps {
  suggestions: SearchItem[];
  onSuggestionClick: (suggestion: SearchItem) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ suggestions, onSuggestionClick }) => {
  const getIconByType = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'author':
        return <User className="w-4 h-4 text-purple-400" />;
      case 'publisher':
        return <Building className="w-4 h-4 text-purple-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-80 overflow-y-auto z-50 scrollbar-hide">
      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.type}-${suggestion.id}-${index}`}
          onClick={() => onSuggestionClick(suggestion)}
          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
        >
          {getIconByType(suggestion.type)}
          <div>
            <div className="text-white font-medium">{suggestion.name}</div>
            <div className="text-gray-400 text-sm capitalize">{suggestion.type}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchDropdown;