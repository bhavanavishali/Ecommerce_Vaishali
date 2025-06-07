import React, { useState, useEffect } from 'react';
import api from '../../api'
const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await api.get('offer/banners/');
      setBanners(response.data);
    } catch (err) {
      setError('Failed to fetch banners');
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('description', description);
    if (image) formData.append('banner_image', image);

    try {
      let response;
      if (editId) {
        // Update existing banner
        response = await api.patch(`offer/banners/${editId}/`, formData);
        setSuccess('Banner updated successfully!');
        setEditId(null);
      } else {
        // Create new banner
        response = await axios.post('offer/banners/', formData);
        setSuccess('Banner uploaded successfully!');
      }
      setBanners(
        editId
          ? banners.map(banner => (banner.id === editId ? response.data : banner))
          : [...banners, response.data]
      );
      setDescription('');
      setImage(null);
    } catch (err) {
      setError(editId ? 'Failed to update banner' : 'Failed to upload banner');
    }
  };

  // Handle edit button click
  const handleEdit = (banner) => {
    setEditId(banner.id);
    setDescription(banner.description);
    setImage(null); // Image is optional for updates
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`offer/banners/${id}/`);
      setBanners(banners.filter(banner => banner.id !== id));
      setSuccess('Banner deleted successfully!');
    } catch (err) {
      setError('Failed to delete banner');
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Reset form
  const resetForm = () => {
    setEditId(null);
    setDescription('');
    setImage(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-900">Banner Management</h1>

      {/* Upload/Update Form */}
      <div className="mb-8 p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">{editId ? 'Update Banner' : 'Upload New Banner'}</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              rows="4"
              placeholder="Enter banner description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-gray-700"
            />
            {editId && <p className="text-sm text-gray-500 mt-1">Leave empty to keep existing image</p>}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-red-900"
              disabled={editId ? false : !image}
            >
              {editId ? 'Update Banner' : 'Upload Banner'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Banner List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Banners</h2>
        {banners.length === 0 && <p className="text-gray-500">No banners available.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map(banner => (
            <div key={banner.id} className="border rounded-lg p-4 shadow-md bg-white">
              <img
                src={banner.image_url}
                alt={banner.description}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <p className="text-gray-700">{banner.description || 'No description'}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(banner.created_at).toLocaleString()}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;