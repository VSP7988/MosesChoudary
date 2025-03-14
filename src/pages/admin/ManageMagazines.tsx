import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Upload, Book } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Magazine {
  id: string;
  year: number;
  month: number;
  image_url: string;
  pdf_url: string;
  created_at: string;
}

const ManageMagazines = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newMagazine, setNewMagazine] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    imageFile: null as File | null,
    pdfFile: null as File | null
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchMagazines = async () => {
    try {
      const { data, error } = await supabase
        .from('magazines')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      setMagazines(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  const uploadFile = async (file: File, folder: 'covers' | 'pdfs') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('magazines')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('magazines')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddMagazine = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (!newMagazine.imageFile || !newMagazine.pdfFile) {
        throw new Error('Please select both cover image and PDF files');
      }

      // Upload files to Supabase Storage
      const [imageUrl, pdfUrl] = await Promise.all([
        uploadFile(newMagazine.imageFile, 'covers'),
        uploadFile(newMagazine.pdfFile, 'pdfs')
      ]);

      // Create magazine record
      const { error } = await supabase
        .from('magazines')
        .insert([{
          year: newMagazine.year,
          month: newMagazine.month,
          image_url: imageUrl,
          pdf_url: pdfUrl
        }]);

      if (error) throw error;

      setNewMagazine({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        imageFile: null,
        pdfFile: null
      });
      fetchMagazines();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMagazine = async (id: string, imageUrl: string, pdfUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this magazine?')) return;

    try {
      // Delete files from storage
      const imageKey = imageUrl.split('/').pop();
      const pdfKey = pdfUrl.split('/').pop();
      
      if (imageKey && pdfKey) {
        await Promise.all([
          supabase.storage.from('magazines').remove(['covers/' + imageKey]),
          supabase.storage.from('magazines').remove(['pdfs/' + pdfKey])
        ]);
      }

      // Delete record from database
      const { error } = await supabase
        .from('magazines')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchMagazines();
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
      <h2 className="text-2xl font-bold mb-6">Manage Magazines</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddMagazine} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Magazine</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              min="1982"
              max={new Date().getFullYear()}
              value={newMagazine.year}
              onChange={(e) => setNewMagazine({ ...newMagazine, year: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={newMagazine.month}
              onChange={(e) => setNewMagazine({ ...newMagazine, month: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
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
                          setNewMagazine({ ...newMagazine, imageFile: file });
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
                {newMagazine.imageFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newMagazine.imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF File
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
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewMagazine({ ...newMagazine, pdfFile: file });
                        }
                      }}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF up to 10MB
                </p>
                {newMagazine.pdfFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newMagazine.pdfFile.name}
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
          <Plus size={20} className="mr-2" />
          {uploading ? 'Uploading...' : 'Add Magazine'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magazines.map((magazine) => (
          <div
            key={magazine.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="aspect-w-3 aspect-h-4 relative">
              <img
                src={magazine.image_url}
                alt={`Magazine ${monthNames[magazine.month - 1]} ${magazine.year}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
                  {monthNames[magazine.month - 1]} {magazine.year}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <a
                  href={magazine.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700"
                >
                  <Book size={18} className="mr-1" />
                  View PDF
                </a>
                <button
                  onClick={() => handleDeleteMagazine(magazine.id, magazine.image_url, magazine.pdf_url)}
                  className="inline-flex items-center px-3 py-1 text-red-600 hover:text-red-800 focus:outline-none"
                >
                  <Trash2 size={18} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMagazines;