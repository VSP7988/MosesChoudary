import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Logo {
  id: string;
  image_url: string;
  created_at: string;
}

const ManageLogo = () => {
  const [logo, setLogo] = useState<Logo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('logo')
        .select('*')
        .single();

      if (error) throw error;
      setLogo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('logo')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('logo')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleUpdateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (!imageFile) {
        throw new Error('Please select an image');
      }

      // Upload image to storage
      const imageUrl = await uploadImage(imageFile);

      // Update or insert logo record
      const { error } = await supabase
        .from('logo')
        .upsert([{
          id: logo?.id || 'default',
          image_url: imageUrl
        }]);

      if (error) throw error;

      setImageFile(null);
      fetchLogo();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!logo || !window.confirm('Are you sure you want to delete the logo?')) return;

    try {
      // Delete image from storage
      const urlParts = logo.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('logo')
        .remove([fileName]);

      // Delete record from database
      const { error } = await supabase
        .from('logo')
        .delete()
        .eq('id', logo.id);

      if (error) throw error;

      setLogo(null);
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
      <h2 className="text-2xl font-bold mb-6">Manage Logo</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleUpdateLogo} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Update Logo</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                        }
                      }}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                {imageFile && (
                  <p className="text-sm text-green-600">
                    Selected: {imageFile.name}
                  </p>
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
          <Upload size={20} className="mr-2" />
          {uploading ? 'Uploading...' : 'Update Logo'}
        </button>
      </form>

      {logo && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current Logo</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={logo.image_url}
                alt="Current Logo"
                className="object-contain w-full h-full"
              />
            </div>
            <button
              onClick={handleDeleteLogo}
              className="mt-4 inline-flex items-center px-3 py-2 text-red-600 hover:text-red-800 focus:outline-none"
            >
              <Trash2 size={18} className="mr-1" />
              Delete Logo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLogo;