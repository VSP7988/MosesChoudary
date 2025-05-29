import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Award, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Certification } from '../../types';

const ManageCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newCertification, setNewCertification] = useState({
    title: '',
    imageFile: null as File | null,
    pdfFile: null as File | null
  });

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const uploadFile = async (file: File, folder: 'images' | 'pdfs') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('certifications')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('certifications')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (!newCertification.imageFile || !newCertification.pdfFile) {
        throw new Error('Please select both image and PDF files');
      }

      // Upload files to Supabase Storage
      const [imageUrl, pdfUrl] = await Promise.all([
        uploadFile(newCertification.imageFile, 'images'),
        uploadFile(newCertification.pdfFile, 'pdfs')
      ]);

      // Insert certification record
      const { error } = await supabase
        .from('certifications')
        .insert([{
          title: newCertification.title,
          image_url: imageUrl,
          pdf_url: pdfUrl
        }]);

      if (error) throw error;

      setNewCertification({ title: '', imageFile: null, pdfFile: null });
      fetchCertifications();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCertification = async (id: string, imageUrl: string, pdfUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;

    try {
      // Delete files from storage
      const imageKey = imageUrl.split('/').pop();
      const pdfKey = pdfUrl.split('/').pop();

      if (imageKey && pdfKey) {
        await Promise.all([
          supabase.storage.from('certifications').remove(['images/' + imageKey]),
          supabase.storage.from('certifications').remove(['pdfs/' + pdfKey])
        ]);
      }

      // Delete record from database
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchCertifications();
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
      <h2 className="text-2xl font-bold mb-6">Manage Certifications</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddCertification} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Certification</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newCertification.title}
              onChange={(e) => setNewCertification({ ...newCertification, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image File
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
                          setNewCertification({ ...newCertification, imageFile: file });
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
                {newCertification.imageFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newCertification.imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
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
                          setNewCertification({ ...newCertification, pdfFile: file });
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
                {newCertification.pdfFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newCertification.pdfFile.name}
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
          {uploading ? 'Uploading...' : 'Add Certification'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={cert.image_url}
                alt={cert.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{cert.title}</h3>
              <div className="flex items-center justify-between">
                <a
                  href={cert.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700"
                >
                  <Award size={18} className="mr-1" />
                  View PDF
                </a>
                <button
                  onClick={() => handleDeleteCertification(cert.id, cert.image_url, cert.pdf_url)}
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

export default ManageCertifications;