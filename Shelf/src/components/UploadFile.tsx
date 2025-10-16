import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image } from 'lucide-react';

// Generate a simple UUID alternative since uuid package isn't available
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const UploadFile: React.FC = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    id: generateId(), // auto-generated
    title: "",
    author: "",
    publisher: "",
    pubDate: "",
    language: "English",
    totalPages: "",
    fileType: "",
    dateTime: new Date().toISOString().split("T")[0], // current date
  });

  const [message, setMessage] = useState<string | null>(null);

  // Handle navigation back
  const handleNavigateBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle Book File Drop
  const handleDropBook = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setBookFile(file);
      // Auto-detect filetype from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      const mimeToType: { [key: string]: string } = {
        'pdf': 'pdf',
        'epub': 'epub',
        'mobi': 'mobi',
        'txt': 'txt'
      };
      setFormData(prev => ({
        ...prev,
        fileType: extension ? (mimeToType[extension] || extension) : ''
      }));
    }
  };

  // Handle Book File Input
  const handleBookInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBookFile(file);
      // Auto-detect file type from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      const mimeToType: { [key: string]: string } = {
        'pdf': 'pdf',
        'epub': 'epub',
        'mobi': 'mobi',
        'txt': 'txt'
      };
      setFormData(prev => ({
        ...prev,
        fileType: extension ? (mimeToType[extension] || extension) : ''
      }));
    }
  };

  // Handle Cover File Upload
  const handleCoverInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  // Handle Form Data Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Upload function - Single API request
  const handleUpload = async () => {
    try {
      if (!bookFile || !formData.title) {
        setMessage("Please fill required fields and select book file.");
        return;
      }

      // Get file extensions
      const bookExtension = bookFile.name.split('.').pop();
      const coverExtension = coverFile ? coverFile.name.split('.').pop() : null;

      // Create a single FormData object for all data
      const uploadForm = new FormData();

      // Append book file with proper naming
      uploadForm.append("bookFile", new File([bookFile], `${formData.id}.${bookExtension}`, { type: bookFile.type }));

      // Append cover file if present with proper naming
      if (coverFile) {
        uploadForm.append("coverFile", new File([coverFile], `${formData.id}.${coverExtension}`, { type: coverFile.type }));
      }

      // Append form data as JSON string
      uploadForm.append("bookData", JSON.stringify(formData));

      // Single API request combining all uploads
      const response = await fetch("http://localhost:8080/api/upload/book", {
        method: "POST",
        body: uploadForm
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      setMessage("✅ Upload Successful!");

      // Reset form after successful upload
      setTimeout(() => {
        setBookFile(null);
        setCoverFile(null);
        setFormData({
          id: generateId(),
          title: "",
          author: "",
          publisher: "",
          pubDate: "",
          language: "English",
          totalPages: "",
          fileType: "",
          dateTime: new Date().toISOString().split("T")[0],
        });
        setMessage(null);
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setMessage(`❌ Upload Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <div className="bg-gray-800/95 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                  onClick={handleNavigateBack}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Home</span>
              </button>
              <h1 className="text-xl font-bold text-white">Upload Book</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </div>

        {/* Main Upload Area */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

          {/* Book File Upload */}
          <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  dragActive
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-600 hover:border-gray-500"
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDrop={handleDropBook}
          >
            <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-300 mb-2">
              {bookFile ? `Selected: ${bookFile.name}` : "Drag & drop book file here"}
            </p>
            <input
                type="file"
                accept=".pdf,.epub,.mobi,.txt"
                onChange={handleBookInput}
                className="hidden"
                id="book-file"
            />
            <label htmlFor="book-file" className="text-purple-500 cursor-pointer underline hover:text-purple-400">
              Browse Files
            </label>
          </div>

          {/* Cover Upload - Now Optional */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center border-gray-600 hover:border-gray-500 transition-colors duration-200">
            <Image className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-300 mb-2">
              {coverFile ? `Selected: ${coverFile.name}` : "Upload Cover Image (Optional)"}
            </p>
            <input
                type="file"
                accept="image/*"
                onChange={handleCoverInput}
                className="hidden"
                id="cover-file"
            />
            <label htmlFor="cover-file" className="text-purple-500 cursor-pointer underline hover:text-purple-400">
              Browse Images
            </label>
          </div>

          {/* Form Section */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Book Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                    type="text"
                    name="title"
                    placeholder="Title (required)"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
                    required
                />
              </div>
              <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
              />
              <input
                  type="text"
                  name="publisher"
                  placeholder="Publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
              />
              <input
                  type="date"
                  name="pubDate"
                  value={formData.pubDate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
              />
              <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Marathi">Marathi</option>
                <option value="Other">Other</option>
              </select>
              <input
                  type="number"
                  name="totalPages"
                  placeholder="Total Pages"
                  value={formData.totalPages}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
                  min="1"
              />
              <select
                  name="fileType"
                  value={formData.fileType}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
              >
                <option value="">Select File Type</option>
                <option value="pdf">PDF</option>
                <option value="epub">EPUB</option>
                <option value="mobi">MOBI</option>
                <option value="txt">TXT</option>
              </select>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex justify-end">
            <button
                onClick={handleUpload}
                disabled={!bookFile || !formData.title}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              Upload Book
            </button>
          </div>

          {/* Message */}
          {message && (
              <div className={`text-center text-lg font-semibold p-4 rounded-lg ${
                  message.includes('✅')
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
              }`}>
                {message}
              </div>
          )}
        </div>
      </div>
  );
};

export default UploadFile;