import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';

import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    Home,
    Maximize,
    Minimize,
    Search,
    BookOpen,
    Bookmark,
    BookmarkCheck,
    Moon,
    Sun,
    X
} from 'lucide-react';

interface LocationState {
    pageNo: number;
    location: string;
    title: string;
}

interface BookmarkData {
    pageNumber: number;
    note?: string;
    timestamp: string;
}

const PdfReaderPage: React.FC = () => {
    const { id: bookId } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;

    const [pdfFile, setPdfFile] = useState<ArrayBuffer | null>(null);
    const [currentPage, setCurrentPage] = useState(state.pageNo || 1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.2);
    const [rotation, setRotation] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [sessionId] = useState(() => generateSessionId());
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);

    // Bookmark states
    const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
    const [showBookmarkPanel, setShowBookmarkPanel] = useState(false);
    const [bookmarkNote, setBookmarkNote] = useState('');
    const [showAddBookmark, setShowAddBookmark] = useState(false);

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const lastSavedPage = useRef(1);
    const saveTimeoutRef = useRef<NodeJS.Timeout>();

    function generateSessionId(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 16; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Save reading history with debouncing
    const saveHistory = useCallback(async (pageNumber: number, force = false) => {
        if (!bookId || (!force && pageNumber === lastSavedPage.current)) return;

        try {
            await fetch('http://localhost:8080/api/book/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: sessionId,
                    bookId: bookId,
                    readPages: pageNumber,
                    updatedDate: new Date().toISOString(),
                }),
            });
            lastSavedPage.current = pageNumber;
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    }, [bookId, sessionId]);

    // Save bookmark to API
    const saveBookmark = async (bookmark: BookmarkData) => {
        if (!bookId) return;

        try {
            await fetch('http://localhost:8080/api/book/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: sessionId,
                    bookId: bookId,
                    readPages: bookmark.pageNumber,
                    bookmark: bookmark,
                    updatedDate: new Date().toISOString(),
                }),
            });
        } catch (error) {
            console.error('Failed to save bookmark:', error);
        }
    };

    // Add bookmark
    const addBookmark = () => {
        const newBookmark: BookmarkData = {
            pageNumber: currentPage,
            note: bookmarkNote.trim(),
            timestamp: new Date().toISOString(),
        };

        const updatedBookmarks = [...bookmarks, newBookmark].sort((a, b) => a.pageNumber - b.pageNumber);
        setBookmarks(updatedBookmarks);
        saveBookmark(newBookmark);
        setBookmarkNote('');
        setShowAddBookmark(false);
    };

    // Remove bookmark
    const removeBookmark = (pageNumber: number) => {
        setBookmarks(prev => prev.filter(b => b.pageNumber !== pageNumber));
    };

    // Check if current page is bookmarked
    const isCurrentPageBookmarked = bookmarks.some(b => b.pageNumber === currentPage);

    // Jump to bookmark
    const jumpToBookmark = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setShowBookmarkPanel(false);
    };

    // Toggle theme
    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // Theme colors
    const theme = {
        bg: isDarkMode ? '#202124' : '#f5f5f5',
        surface: isDarkMode ? '#2d2e30' : '#ffffff',
        border: isDarkMode ? '#3c4043' : '#e0e0e0',
        text: isDarkMode ? '#e8eaed' : '#202124',
        textSecondary: isDarkMode ? '#9aa0a6' : '#5f6368',
        hover: isDarkMode ? '#3c4043' : '#f1f3f4',
        pdfBg: isDarkMode ? '#2d2e30' : '#ffffff',
    };

    // Fetch PDF file
    useEffect(() => {
        if (!state?.location) {
            setError('No book location provided');
            setIsLoading(false);
            return;
        }

        const fetchPdf = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8080/api/download/book/${state.location}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                setPdfFile(arrayBuffer);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load PDF');
                setIsLoading(false);
            }
        };

        fetchPdf();
    }, [state?.location]);

    // Save history on page change with debouncing
    useEffect(() => {
        if (currentPage > 0) {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(() => {
                saveHistory(currentPage);
            }, 2000);

            return () => {
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
            };
        }
    }, [currentPage, saveHistory]);

    // Handle page unload/navigation
    useEffect(() => {
        const handleBeforeUnload = () => {
            saveHistory(currentPage, true);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                saveHistory(currentPage, true);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            saveHistory(currentPage, true);
        };
    }, [currentPage, saveHistory]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;

            switch (e.key) {
                case 'ArrowLeft':
                    handlePageChange(currentPage - 1);
                    break;
                case 'ArrowRight':
                    handlePageChange(currentPage + 1);
                    break;
                case '=':
                case '+':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        handleZoomIn();
                    }
                    break;
                case '-':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        handleZoomOut();
                    }
                    break;
                case 'f':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        setShowSearch(!showSearch);
                    }
                    break;
                case 'b':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        setShowAddBookmark(true);
                    }
                    break;
                case 'Escape':
                    setShowSearch(false);
                    setShowAddBookmark(false);
                    setShowBookmarkPanel(false);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPage, showSearch]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleDownload = () => {
        if (pdfFile) {
            const blob = new Blob([pdfFile], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `book_${bookId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setTotalPages(numPages);
        setIsLoading(false);
    };

    const onDocumentLoadError = (error: Error) => {
        setError(`Failed to load PDF: ${error.message}`);
        setIsLoading(false);
    };

    useEffect(() => {
        const updatePageWidth = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                setPageWidth(containerWidth * 0.8);
            }
        };

        updatePageWidth();
        window.addEventListener('resize', updatePageWidth);
        return () => window.removeEventListener('resize', updatePageWidth);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg" style={{ color: theme.text }}>Loading PDF...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
                <div className="text-center max-w-md">
                    <div className="text-red-400 text-6xl mb-4">📄</div>
                    <h2 className="text-xl mb-2" style={{ color: theme.text }}>PDF Load Error</h2>
                    <p className="text-red-400 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen flex flex-col" style={{ backgroundColor: theme.bg }}>
            {/* Header Toolbar */}
            <div className="px-4 py-3 flex items-center justify-between relative z-10" style={{ backgroundColor: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded transition-colors"
                        style={{ color: theme.text }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Home"
                    >
                        <Home size={20} />
                    </button>
                    <div className="flex items-center space-x-2">
                        <BookOpen size={20} className="text-blue-400" />
                        <span className="font-medium" style={{ color: theme.text }}>{state.title}</span>
                    </div>
                </div>

                {showSearch && (
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center rounded-lg px-3 py-2" style={{ backgroundColor: theme.hover }}>
                            <Search size={16} className="mr-2" style={{ color: theme.textSecondary }} />
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search in PDF..."
                                className="bg-transparent outline-none w-64"
                                style={{ color: theme.text }}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-4">
                    {/* Page Navigation */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: theme.text }}
                            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = theme.hover)}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Previous Page (←)"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                value={currentPage}
                                onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 rounded text-center focus:outline-none focus:border-blue-500"
                                style={{ backgroundColor: theme.hover, color: theme.text, border: `1px solid ${theme.border}` }}
                                min="1"
                                max={totalPages}
                            />
                            <span className="text-sm" style={{ color: theme.textSecondary }}>of {totalPages}</span>
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: theme.text }}
                            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = theme.hover)}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Next Page (→)"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center space-x-2 pl-4" style={{ borderLeft: `1px solid ${theme.border}` }}>
                        <button
                            onClick={handleZoomOut}
                            className="p-2 rounded transition-colors"
                            style={{ color: theme.text }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Zoom Out (Ctrl+-)"
                        >
                            <ZoomOut size={18} />
                        </button>

                        <span className="min-w-[60px] text-center text-sm" style={{ color: theme.textSecondary }}>
                            {Math.round(scale * 100)}%
                        </span>

                        <button
                            onClick={handleZoomIn}
                            className="p-2 rounded transition-colors"
                            style={{ color: theme.text }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Zoom In (Ctrl++)"
                        >
                            <ZoomIn size={18} />
                        </button>
                    </div>

                    {/* Additional Controls */}
                    <div className="flex items-center space-x-2 pl-4" style={{ borderLeft: `1px solid ${theme.border}` }}>
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="p-2 rounded transition-colors"
                            style={{ color: showSearch ? '#60a5fa' : theme.text, backgroundColor: showSearch ? theme.hover : 'transparent' }}
                            onMouseEnter={(e) => !showSearch && (e.currentTarget.style.backgroundColor = theme.hover)}
                            onMouseLeave={(e) => !showSearch && (e.currentTarget.style.backgroundColor = 'transparent')}
                            title="Search (Ctrl+F)"
                        >
                            <Search size={18} />
                        </button>

                        <button
                            onClick={() => setShowBookmarkPanel(!showBookmarkPanel)}
                            className="p-2 rounded transition-colors"
                            style={{ color: isCurrentPageBookmarked ? '#fbbf24' : theme.text, backgroundColor: showBookmarkPanel ? theme.hover : 'transparent' }}
                            onMouseEnter={(e) => !showBookmarkPanel && (e.currentTarget.style.backgroundColor = theme.hover)}
                            onMouseLeave={(e) => !showBookmarkPanel && (e.currentTarget.style.backgroundColor = 'transparent')}
                            title="Bookmarks"
                        >
                            {isCurrentPageBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded transition-colors"
                            style={{ color: theme.text }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title={isDarkMode ? "Light Mode" : "Dark Mode"}
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button
                            onClick={handleRotate}
                            className="p-2 rounded transition-colors"
                            style={{ color: theme.text }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Rotate 90°"
                        >
                            <RotateCw size={18} />
                        </button>

                        <button
                            onClick={toggleFullscreen}
                            className="p-2 rounded transition-colors"
                            style={{ color: theme.text }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Fullscreen"
                        >
                            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button>

                        <button
                            onClick={handleDownload}
                            className="p-2 rounded transition-colors"
                            style={{ color: theme.text }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Download PDF"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bookmark Panel */}
            {showBookmarkPanel && (
                <div className="absolute right-4 top-16 w-80 rounded-lg shadow-2xl z-20 max-h-96 overflow-y-auto" style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center" style={{ color: theme.text }}>
                                <Bookmark size={18} className="mr-2" />
                                Bookmarks ({bookmarks.length})
                            </h3>
                            <button
                                onClick={() => setShowBookmarkPanel(false)}
                                className="p-1 rounded transition-colors"
                                style={{ color: theme.textSecondary }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <button
                            onClick={() => setShowAddBookmark(true)}
                            className="w-full py-2 px-4 rounded mb-4 text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Add Bookmark (Ctrl+B)
                        </button>

                        {bookmarks.length === 0 ? (
                            <p className="text-center py-8 text-sm" style={{ color: theme.textSecondary }}>
                                No bookmarks yet
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {bookmarks.map((bookmark) => (
                                    <div
                                        key={bookmark.pageNumber}
                                        className="p-3 rounded cursor-pointer transition-colors"
                                        style={{ backgroundColor: bookmark.pageNumber === currentPage ? theme.hover : 'transparent', border: `1px solid ${theme.border}` }}
                                        onMouseEnter={(e) => bookmark.pageNumber !== currentPage && (e.currentTarget.style.backgroundColor = theme.hover)}
                                        onMouseLeave={(e) => bookmark.pageNumber !== currentPage && (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div
                                                className="flex-1"
                                                onClick={() => jumpToBookmark(bookmark.pageNumber)}
                                            >
                                                <div className="flex items-center mb-1">
                                                    <span className="font-medium" style={{ color: theme.text }}>
                                                        Page {bookmark.pageNumber}
                                                    </span>
                                                </div>
                                                {bookmark.note && (
                                                    <p className="text-sm" style={{ color: theme.textSecondary }}>
                                                        {bookmark.note}
                                                    </p>
                                                )}
                                                <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                                                    {new Date(bookmark.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeBookmark(bookmark.pageNumber);
                                                }}
                                                className="ml-2 p-1 rounded text-red-400 hover:bg-red-500 hover:bg-opacity-20 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Bookmark Dialog */}
            {showAddBookmark && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="w-96 rounded-lg shadow-2xl p-6" style={{ backgroundColor: theme.surface }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                            Add Bookmark - Page {currentPage}
                        </h3>
                        <textarea
                            value={bookmarkNote}
                            onChange={(e) => setBookmarkNote(e.target.value)}
                            placeholder="Add a note (optional)"
                            className="w-full px-3 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: theme.hover, color: theme.text, border: `1px solid ${theme.border}` }}
                            rows={3}
                            autoFocus
                        />
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={() => {
                                    setShowAddBookmark(false);
                                    setBookmarkNote('');
                                }}
                                className="px-4 py-2 rounded transition-colors"
                                style={{ backgroundColor: theme.hover, color: theme.text }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addBookmark}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                Save Bookmark
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Viewer Container */}
            <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: theme.bg }}>
                <div className="flex justify-center min-h-full">
                    <div className="rounded-lg shadow-2xl p-4 max-w-full" style={{ backgroundColor: theme.pdfBg }}>
                        {pdfFile && (
                            <Document
                                file={pdfFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                loading={
                                    <div className="flex items-center justify-center h-96">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                            <p style={{ color: theme.textSecondary }}>Loading document...</p>
                                        </div>
                                    </div>
                                }
                                error={
                                    <div className="flex items-center justify-center h-96">
                                        <div className="text-center">
                                            <div className="text-red-400 text-4xl mb-4">⚠️</div>
                                            <p className="text-red-400">Failed to load PDF document</p>
                                        </div>
                                    </div>
                                }
                                className="react-pdf__Document"
                            >
                                <Page
                                    pageNumber={currentPage}
                                    scale={scale}
                                    rotate={rotation}
                                    width={pageWidth}
                                    loading={
                                        <div className="flex items-center justify-center h-96 bg-white rounded">
                                            <div className="text-center">
                                                <div className="animate-pulse bg-gray-300 h-4 w-32 rounded mb-2"></div>
                                                <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
                                            </div>
                                        </div>
                                    }
                                    error={
                                        <div className="flex items-center justify-center h-96 bg-gray-100 rounded">
                                            <p className="text-gray-500">Failed to load page</p>
                                        </div>
                                    }
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="react-pdf__Page shadow-lg mx-auto"
                                />
                            </Document>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="px-4 py-3" style={{ backgroundColor: theme.surface, borderTop: `1px solid ${theme.border}` }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-sm" style={{ color: theme.textSecondary }}>
                            Book ID: {bookId}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="text-sm" style={{ color: theme.textSecondary }}>
                            Scale: {Math.round(scale * 100)}%
                        </div>
                        {rotation !== 0 && (
                            <div className="text-sm" style={{ color: theme.textSecondary }}>
                                Rotation: {rotation}°
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm" style={{ color: theme.textSecondary }}>Page:</span>
                            <span className="font-medium" style={{ color: theme.text }}>{currentPage} / {totalPages}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Page Jump */}
            <div className="fixed bottom-20 right-6 flex flex-col space-y-2">
                <button
                    onClick={() => setCurrentPage(1)}
                    className="p-3 rounded-full shadow-lg transition-colors"
                    style={{ backgroundColor: theme.hover, color: theme.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.border}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                    title="Go to first page"
                >
                    ⇈
                </button>
                <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="p-3 rounded-full shadow-lg transition-colors"
                    style={{ backgroundColor: theme.hover, color: theme.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.border}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                    title="Go to last page"
                >
                    ⇊
                </button>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-opacity-90 flex items-center justify-center z-50" style={{ backgroundColor: theme.bg }}>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                        <h3 className="text-xl mb-2" style={{ color: theme.text }}>Loading PDF Reader</h3>
                        <p style={{ color: theme.textSecondary }}>Preparing your document...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PdfReaderPage;