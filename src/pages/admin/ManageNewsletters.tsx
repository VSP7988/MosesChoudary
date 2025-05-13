import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Newspaper, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Newsletter } from '../../types';

const ManageNewsletters = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'english' | 'norwegian'>('all');
  const [newNewsletter, setNewNewsletter] = useState({
    year: new Date().getFullYear(),
    title: '',
    language: 'english' as 'english' | 'norwegian',
    imageFile: null as File | null,
    pdfFile: null as File | null,
    published_date: new Date().toISOString().split('T')[0]
  });

  const fetchNewsletters = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);

      // Set initial selected year to the most recent year
      if (data && data.length > 0) {
        const years = [...new Set(data.map(n => n.year))];
        setSelectedYear(Math.max(...years));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const uploadFile = async (file: File, folder: 'images' | 'pdfs') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('newsletters')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('newsletters')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (!newNewsletter.imageFile || !newNewsletter.pdfFile) {
        throw new Error('Please select both image and PDF files');
      }

      // Upload files to Supabase Storage
      const [imageUrl, pdfUrl] = await Promise.all([
        uploadFile(newNewsletter.imageFile, 'images'),
        uploadFile(newNewsletter.pdfFile, 'pdfs')
      ]);

      // Insert newsletter record
      const { error } = await supabase
        .from('newsletters')
        .insert([{
          year: newNewsletter.year,
          title: newNewsletter.title,
          language: newNewsletter.language,
          image_url: imageUrl,
          pdf_url: pdfUrl,
          published_date: newNewsletter.published_date
        }]);

      if (error) throw error;

      setNewNewsletter({
        year: new Date().getFullYear(),
        title: '',
        language: 'english',
        imageFile: null,
        pdfFile: null,
        published_date: new Date().toISOString().split('T')[0]
      });
      fetchNewsletters();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteNewsletter = async (id: string, imageUrl: string, pdfUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      // Delete files from storage
      const imageKey = imageUrl.split('/').pop();
      const pdfKey = pdfUrl.split('/').pop();

      if (imageKey && pdfKey) {
        await Promise.all([
          supabase.storage.from('newsletters').remove(['images/' + imageKey]),
          supabase.storage.from('newsletters').remove(['pdfs/' + pdfKey])
        ]);
      }

      // Delete record from database
      const { error } = await supabase
        .from('newsletters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchNewsletters();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Get unique years from newsletters
  const years = [...new Set(newsletters.map(n => n.year))].sort((a, b) => b - a);

  // Filter newsletters based on selected year and language
  const filteredNewsletters = newsletters.filter(newsletter => {
    const yearMatch = selectedYear ? newsletter.year === selectedYear : true;
    const languageMatch = selectedLanguage === 'all' ? true : newsletter.language === selectedLanguage;
    return yearMatch && languageMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Newsletters</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddNewsletter} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Newsletter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              value={newNewsletter.year}
              onChange={(e) => setNewNewsletter({ ...newNewsletter, year: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              min={2000}
              max={2100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={newNewsletter.language}
              onChange={(e) => setNewNewsletter({ ...newNewsletter, language: e.target.value as 'english' | 'norwegian' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="english">English</option>
              <option value="norwegian">Norwegian</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newNewsletter.title}
              onChange={(e) => setNewNewsletter({ ...newNewsletter, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
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
                          setNewNewsletter({ ...newNewsletter, imageFile: file });
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
                {newNewsletter.imageFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newNewsletter.imageFile.name}
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
                          setNewNewsletter({ ...newNewsletter, pdfFile: file });
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
                {newNewsletter.pdfFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newNewsletter.pdfFile.name}
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
          {uploading ? 'Uploading...' : 'Add Newsletter'}
        </button>
      </form>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Year
            </label>
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as 'all' | 'english' | 'norwegian')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Languages</option>
              <option value="english">English</option>
              <option value="norwegian">Norwegian</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNewsletters.map((newsletter) => (
          <div key={newsletter.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={newsletter.image_url}
                alt={newsletter.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {newsletter.language.charAt(0).toUpperCase() + newsletter.language.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  {newsletter.year}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4">{newsletter.title}</h3>
              <div className="flex items-center justify-between">
                <a
                  href={newsletter.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700"
                >
                  <Newspaper size={18} className="mr-1" />
                  View PDF
                </a>
                <button
                  onClick={() => handleDeleteNewsletter(newsletter.id, newsletter.image_url, newsletter.pdf_url)}
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

      {filteredNewsletters.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No newsletters found</h3>
          <p className="text-gray-500">Try adjusting your filters or add a new newsletter.</p>
        </div>
      )}
    </div>
  );
};

export default ManageNewsletters;