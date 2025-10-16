import React from 'react';
import Navbar from '../components/Navbar.tsx';
import HistorySection from '../components/HistorySection.tsx';
import BooksSection from '../components/BooksSection.tsx';

interface HomepageProps {
  onNavigateToUpload: () => void;
}

const Homepage: React.FC<HomepageProps> = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      {/* Main Content */}
      <div className="pt-16">
        <HistorySection />
        <BooksSection />
      </div>
    </div>
  );
};

export default Homepage;