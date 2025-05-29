import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Newspaper, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Newsletter } from '../../types';

const ManageNewsletters = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
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
        .order('year', { ascending: false })
        .order('month', { ascending: true });

      if (error) throw error;
      if (data) {
        setNewsletters(data);
        const uniqueYears = [...new Set(data.map(newsletter => newsletter.year))];
        setYears(uniqueYears.sort((a, b) => b - a));
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]);
        }
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
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

      // Get month from published date
      const publishedDate = new Date(newNewsletter.published_date);
      const month = publishedDate.getMonth() + 1;

      // Create newsletter record
      const { error } = await supabase
        .from('newsletters')
        .insert([{
          year: newNewsletter.year,
          month,
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

  const filteredNewsletters = newsletters.filter(newsletter => newsletter.year === selectedYear);

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
              Published Date
            </label>
            <input
              type="date"
              value={newNewsletter.published_date}
              onChange={(e) => setNewNewsletter({ ...newNewsletter, published_date: e.target.value })}
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

      {/* Year Selection */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <span className="text-xl font-semibold">
              {selectedYear ? `Newsletters from ${selectedYear}` : 'Select Year'}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showYearDropdown && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setShowYearDropdown(false);
                  }}
                  className={`w-full px-6 py-3 text-left hover:bg-orange-50 transition-colors ${
                    selectedYear === year ? 'bg-orange-100 text-orange-600 font-semibold' : ''
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNewsletters.map((newsletter) => (
          <div
            key={newsletter.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-w-3 aspect-h-4 relative">
              <img
                src={newsletter.image_url}
                alt={newsletter.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-orange-600 rounded-full text-sm font-semibold shadow-lg">
                  {new Date(newsletter.published_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{newsletter.title}</h3>
              <div className="flex flex-wrap gap-2">
                <a
                  href={newsletter.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Newspaper className="w-5 h-5 mr-2" />
                  Read Newsletter
                </a>
                <button
                  onClick={() => handleDeleteNewsletter(newsletter.id, newsletter.image_url, newsletter.pdf_url)}
                  className="inline-flex items-center px-3 py-2 text-red-600 hover:text-red-800 focus:outline-none"
                >
                  <Trash2 size={18} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNewsletters.length === 0 && selectedYear && (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No newsletters available for {selectedYear}</h3>
          <p className="text-gray-500">Add a new newsletter or select a different year.</p>
        </div>
      )}
    </div>
  );
};

export default ManageNewsletters;