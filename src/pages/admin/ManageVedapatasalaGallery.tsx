import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface VedapatasalaGalleryImage {
  id: string;
  image_url: string;
  created_at: string;
}

const ManageVedapatasalaGallery = () => {
  const [images, setImages] = useState<VedapatasalaGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('vedapatasala_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `vedapatasala-gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('vedapatasala-gallery')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('vedapatasala-gallery')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddImages = async (e: React.FormEvent) => {
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

      // Create gallery records for each image
      const galleryRecords = imageUrls.map(imageUrl => ({
        image_url: imageUrl
      }));

      const { error } = await supabase
        .from('vedapatasala_gallery')
        .insert(galleryRecords);

      if (error) throw error;

      setImageFiles([]);
      fetchImages();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      // Delete image from storage
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('vedapatasala-gallery')
        .remove([`vedapatasala-gallery/${fileName}`]);

      // Delete record from database
      const { error } = await supabase
        .from('vedapatasala_gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchImages();
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
      <h2 className="text-2xl font-bold mb-6">Manage Vedapatasala Gallery</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddImages} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Images</h3>
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
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {imageFiles.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
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
          {uploading ? 'Uploading...' : 'Add Images'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.image_url}
              alt="Gallery"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteImage(image.id, image.image_url)}
                  className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageVedapatasalaGallery