import React, { useState } from 'react';
import axios from 'axios';

const AIPromptSearch = () => {
  const [prompt, setPrompt] = useState('');
  const [articles, setArticles] = useState([]);
  const [sql, setSQL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAIArticles = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/articles/ai', {
        userPrompt: prompt,
      });
      setSQL(response.data.sql);
      setArticles(response.data.results);
    } catch (err) {
      setError('AI query failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">🔍 AI-Powered Article Search</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. List all discounted smartphones"
          className="flex-1 border px-4 py-2 rounded shadow"
        />
        <button
          onClick={fetchAIArticles}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Ask AI
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {sql && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm font-mono">
          <strong>Generated SQL:</strong>
          <pre>{sql}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article) => (
          <div key={article.article_id} className="border p-4 rounded shadow-sm bg-white">
            {article.image_1 && (
              <img
        className="image-1"
        src={article.image_1 ? `http://localhost:5000/assets/images/${article.image_1}` : '/assets/images/placeholder.jpg'}
        alt={article.name}
        loading="lazy"  // <--- added
      />
            )}
            <h2 className="font-bold text-lg mb-2">{article.name}</h2>
            <p
              className="text-sm mb-2"
              dangerouslySetInnerHTML={{ __html: article.description }}
            />
            <p className="text-green-600 font-semibold">${article.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPromptSearch;