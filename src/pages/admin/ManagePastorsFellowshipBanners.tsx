import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PastorsFellowshipBanner {
  id: string;
  image_url: string;
  created_at: string;
}

const ManagePastorsFellowshipBanners = () => {
  const [banners, setBanners] = useState<PastorsFellowshipBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('pastors_fellowship_banners')
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
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pastors-fellowship-banners')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('pastors-fellowship-banners')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddBanners = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (imageFiles.length === 0) {
        throw new Error('Please select at least one image');
      }

      // Upload all images and get their URLs
      const uploadPromises = imageFiles.map(file => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      // Create banner records for each image
      const bannerRecords = imageUrls.map(imageUrl => ({
        image_url: imageUrl
      }));

      const { error } = await supabase
        .from('pastors_fellowship_banners')
        .insert(bannerRecords);

      if (error) throw error;

      setImageFiles([]);
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
        .from('pastors-fellowship-banners')
        .remove([fileName]);

      // Delete record from database
      const { error } = await supabase
        .from('pastors_fellowship_banners')
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
      <h2 className="text-2xl font-bold mb-6">Manage Pastors Fellowship Banners</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddBanners} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Banners</h3>
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
                    setImageFiles(files);
                  }}
                  required
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB each
            </p>
            {imageFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-green-600">
                  Selected {imageFiles.length} images:
                </p>
                <ul className="text-sm text-gray-500 mt-2">
                  {imageFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} className="mr-2" />
          {uploading ? 'Uploading...' : 'Add Banners'}
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

export default ManagePastorsFellowshipBanners;