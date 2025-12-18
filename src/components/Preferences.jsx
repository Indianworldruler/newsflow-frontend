import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Preferences({ onLogout }) {
  const [preferences, setPreferences] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const topics = [
    'technology',
    'sports',
    'startup',
    'india',
    'crypto',
    'business',
    'entertainment',
    'health',
    'science'
  ];

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://newsflow-backend-jlfd.onrender.com/api/user/preferences',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPreferences(response.data.preferences);

      if (response.data.preferences.length > 0) {
        fetchPersonalizedNews();
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    }
  };

  const togglePreference = (topic) => {
    setPreferences((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const savePreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'https://newsflow-backend-jlfd.onrender.com/api/user/preferences',
        { preferences },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Preferences saved!');
      fetchPersonalizedNews();
    } catch (err) {
      alert('Error saving preferences');
    }
  };

  const fetchPersonalizedNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://newsflow-backend-jlfd.onrender.com/api/news/personalized',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNews(response.data);
    } catch (err) {
      console.error('Error fetching news:', err);
    }
    setLoading(false);
  };

  const saveArticle = async (article) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://newsflow-backend-jlfd.onrender.com/api/saved/save',
        {
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source?.name
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Article saved!');
    } catch (err) {
      alert('Error saving article');
    }
  };

  const logout = () => {
    onLogout(); // ✅ UPDATE APP AUTH STATE
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>NewsFlow - Your Personalized Feed</h2>
        <div>
          <button
            onClick={() => navigate('/saved')}
            style={{ padding: '10px 15px', marginRight: '10px', cursor: 'pointer' }}
          >
            Saved Articles
          </button>
          <button
            onClick={logout}
            style={{ padding: '10px 15px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <h3>Select Your Interests:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => togglePreference(topic)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor: preferences.includes(topic) ? '#4CAF50' : '#f0f0f0',
                color: preferences.includes(topic) ? 'white' : 'black',
                border: 'none',
                borderRadius: '20px'
              }}
            >
              {topic}
            </button>
          ))}
        </div>

        <button
          onClick={savePreferences}
          style={{ marginTop: '15px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Save Preferences
        </button>
      </div>

      {loading && <p>Loading news...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {news.map((article, index) => (
          <div key={index} style={{ border: '1px solid #ddd' }}>
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            )}
            <div style={{ padding: '15px' }}>
  <h4 style={{ marginTop: 0 }}>{article.title}</h4>
  <p style={{ fontSize: '14px', color: '#666' }}>
    {article.description}
  </p>
  <div style={{ marginTop: '10px' }}>
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ marginRight: '10px' }}
    >
      Read More
    </a>
    <button
      onClick={() => saveArticle(article)}
      style={{ padding: '5px 10px', cursor: 'pointer' }}
    >
      Save
    </button>
  </div>
</div>


          </div>
        ))}
      </div>
    </div>
  );
}

export default Preferences;
