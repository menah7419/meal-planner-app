import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';
import './CommunityPage.css';

const CLOUDINARY_CLOUD = 'dpqoe4jkf';
const CLOUDINARY_PRESET = 'nutriplan_uploads';

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  function getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await axios.get(`${API_BASE}/api/community/`, { headers: getHeaders() });
      setPosts(res.data);
    } catch (err) { console.error(err); }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadToCloudinary() {
    if (!image) return null;
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      formData
    );
    return res.data.secure_url;
  }

  async function sharePost(e) {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = '';
      if (image) { imageUrl = await uploadToCloudinary(); }
      await axios.post(`${API_BASE}/api/community/`, {
        title, description, image_url: imageUrl
      }, { headers: getHeaders() });
      setTitle(''); setDescription(''); setImage(null); setImagePreview('');
      fetchPosts();
    } catch (err) { console.error(err); }
    setUploading(false);
  }

  return (
    <div>
      <div className="header">
        <h1>🌿 NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div className="community-container">
        <h2 style={{ marginBottom: '8px' }}>👥 Community</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Share and discover meal plans</p>

        <form onSubmit={sharePost} className="community-form">
          <h3 style={{ marginBottom: '16px' }}>Share a Meal Plan</h3>
          <div className="community-form-field">
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="community-form-field">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              style={{ height: '80px' }} />
          </div>
          <div className="community-form-field">
            <label>Add a Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange}
              style={{ border: 'none', padding: '0', marginTop: '6px' }} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover',
                  borderRadius: '8px', marginTop: '10px' }} />
            )}
          </div>
          <button type="submit" disabled={uploading}>
            {uploading ? 'Sharing...' : 'Share'}
          </button>
        </form>

        <h3 style={{ marginBottom: '16px' }}>Community Posts</h3>
        {posts.length === 0 && <p style={{ color: '#666' }}>No posts yet — be the first to share!</p>}
        {posts.map(post => (
          <div key={post.id} className="community-post">
            <div className="community-post-title">{post.title}</div>
            {post.image_url && (
              <img src={post.image_url} alt={post.title} className="community-post-image" />
            )}
            <p className="community-post-desc">{post.description}</p>
            <small className="community-post-date">Shared on {post.created_at}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityPage;
