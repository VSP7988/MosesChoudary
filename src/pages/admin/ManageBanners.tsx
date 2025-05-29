import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Banner } from '../../types';

const ManageBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newBanner, setNewBanner] = useState({
    subtitle: '',
    imageFiles: [] as File[]
  });

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('banners')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (newBanner.imageFiles.length === 0) {
        throw new Error('Please select at least one image');
      }

      // Upload all images and get their URLs
      const uploadPromises = newBanner.imageFiles.map(file => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      // Create banner records for each image
      const bannerRecords = imageUrls.map(imageUrl => ({
        subtitle: newBanner.subtitle,
        image_url: imageUrl
      }));

      const { error } = await supabase
        .from('banners')
        .insert(bannerRecords);

      if (error) throw error;

      setNewBanner({ subtitle: '', imageFiles: [] });
      fetchBanners();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBanner = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      // Delete image from storage
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('banners')
        .remove([`banners/${fileName}`]);

      // Delete record from database
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchBanners();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Banners</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddBanner} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Banner</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={newBanner.subtitle}
              onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setNewBanner({ ...newBanner, imageFiles: files });
                      }}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
                {newBanner.imageFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-green-600">
                      Selected {newBanner.imageFiles.length} images:
                    </p>
                    <ul className="text-sm text-gray-500 mt-2">
                      {newBanner.imageFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} className="mr-2" />
          {uploading ? 'Uploading...' : 'Add Banner'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={banner.image_url}
                alt="Banner"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">{banner.subtitle}</p>
              <button
                onClick={() => handleDeleteBanner(banner.id, banner.image_url)}
                className="inline-flex items-center px-3 py-1 text-red-600 hover:text-red-800 focus:outline-none"
              >
                <Trash2 size={18} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBanners;