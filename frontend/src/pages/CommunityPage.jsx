import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';

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
    } catch (err) {
      console.error(err);
    }
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
      if (image) {
        imageUrl = await uploadToCloudinary();
      }
      await axios.post(`${API_BASE}/api/community/`, {
        title,
        description,
        image_url: imageUrl
      }, { headers: getHeaders() });
      setTitle('');
      setDescription('');
      setImage(null);
      setImagePreview('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>
      <h2>👥 Community</h2>

      <form onSubmit={sharePost} style={{ background: '#F1F8E9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Share a Meal Plan</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>Title</label><br/>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description</label><br/>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            style={{ height: '80px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Add a Photo (optional)</label><br/>
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

      <h3>Community Posts</h3>
      {posts.length === 0 && <p>No posts yet — be the first to share!</p>}
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #C8E6C9', borderRadius: '8px',
          padding: '16px', marginBottom: '12px', backgroundColor: 'white' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>{post.title}</h4>
          {post.image_url && (
            <img src={post.image_url} alt={post.title}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover',
                borderRadius: '8px', marginBottom: '10px' }} />
          )}
          <p style={{ color: '#666', margin: '0 0 8px 0' }}>{post.description}</p>
          <small style={{ color: '#999' }}>Shared on {post.created_at}</small>
        </div>
      ))}
    </div>
  );
}

export default CommunityPage;
