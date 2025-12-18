import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SavedNews() {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  const fetchSavedArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://newsflow-backend-jlfd.onrender.com/api/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedArticles(response.data);
    } catch (err) {
      console.error('Error fetching saved articles:', err);
    }
    setLoading(false);
  };

  const deleteArticle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://newsflow-backend-jlfd.onrender.com/api/saved/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedArticles(savedArticles.filter(article => article._id !== id));
      alert('Article removed!');
    } catch (err) {
      alert('Error deleting article');
    }
  };

  const logout = () => {
  localStorage.clear(); // or remove specific keys
  navigate('/login', { replace: true });
};

  if (loading) return <p>Loading saved articles...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Your Saved Articles</h2>
        <div>
          <button onClick={() => navigate('/preferences')} style={{ padding: '10px 15px', marginRight: '10px', cursor: 'pointer' }}>
            Back to Feed
          </button>
          <button onClick={logout} style={{ padding: '10px 15px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {savedArticles.length === 0 ? (
        <p>No saved articles yet. Start saving articles from your feed!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {savedArticles.map((article) => (
            <div key={article._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              )}
              <div style={{ padding: '15px' }}>
                <h4 style={{ marginTop: '0' }}>{article.title}</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>{article.description}</p>
                <p style={{ fontSize: '12px', color: '#999' }}>Saved on: {new Date(article.savedAt).toLocaleDateString()}</p>
                <div style={{ marginTop: '10px' }}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>
                    Read More
                  </a>
                  <button onClick={() => deleteArticle(article._id)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none' }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedNews;
