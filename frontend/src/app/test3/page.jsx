"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';

function SearchPage({ query }) {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;

      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(`http://localhost:8000/search?keywords=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (err) {
        setError('Failed to fetch results. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const extractVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]+)/);
    return match && match[1];
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            {/* Videos Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Video Lectures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.videos.map((video, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {extractVideoId(video.url) && (
                      <iframe
                        className="w-full aspect-video"
                        src={`https://www.youtube.com/embed/${extractVideoId(video.url)}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{video.channel}</p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm mt-2 inline-block"
                      >
                        Watch on YouTube →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Articles Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Research Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.articles.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
                  >
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{article.snippet}</p>
                      <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm mt-2">
                        <span>Read Article</span>
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Searching educational resources...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export { SearchPage };