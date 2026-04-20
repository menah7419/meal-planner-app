import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await axios.get(`${API_BASE}/api/community/`, { headers });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function sharePost(e) {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/community/`, {
        title,
        description
      }, { headers });
      setTitle('');
      setDescription('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>← Dashboard</button>
      </div>
      <h2>👥 Community</h2>

      <form onSubmit={sharePost} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Share a Meal Plan</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>Title</label><br/>
          <input value={title} onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px' }} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description</label><br/>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', height: '80px' }} />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Share</button>
      </form>

      <h3>Community Posts</h3>
      {posts.length === 0 && <p>No posts yet — be the first to share!</p>}
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ddd', borderRadius: '8px',
          padding: '16px', marginBottom: '12px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>{post.title}</h4>
          <p style={{ color: '#666', margin: '0 0 8px 0' }}>{post.description}</p>
          <small style={{ color: '#999' }}>Shared on {post.created_at}</small>
        </div>
      ))}
    </div>
  );
}

export default CommunityPage;
