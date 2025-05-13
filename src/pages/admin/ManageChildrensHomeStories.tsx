import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ChildrensHomeStory {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

const ManageChildrensHomeStories = () => {
  const [stories, setStories] = useState<ChildrensHomeStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    imageFile: null as File | null
  });

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('childrens_home_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('childrens-home-stories')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('childrens-home-stories')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (!newStory.imageFile) {
        throw new Error('Please select an image');
      }

      // Upload image to storage
      const imageUrl = await uploadImage(newStory.imageFile);

      // Create story record
      const { error } = await supabase
        .from('childrens_home_stories')
        .insert([{
          title: newStory.title,
          description: newStory.description,
          image_url: imageUrl
        }]);

      if (error) throw error;

      setNewStory({
        title: '',
        description: '',
        imageFile: null
      });
      fetchStories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteStory = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      // Delete image from storage
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('childrens-home-stories')
        .remove([fileName]);

      // Delete record from database
      const { error } = await supabase
        .from('childrens_home_stories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchStories();
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
      <h2 className="text-2xl font-bold mb-6">Manage Children's Home Stories</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddStory} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Story</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newStory.title}
              onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Story Image
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
                          setNewStory({ ...newStory, imageFile: file });
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
                {newStory.imageFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newStory.imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newStory.description}
              onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={3}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} className="mr-2" />
          {uploading ? 'Uploading...' : 'Add Story'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={story.image_url}
                alt={story.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{story.title}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(story.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{story.description}</p>
              <button
                onClick={() => handleDeleteStory(story.id, story.image_url)}
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

export default ManageChildrensHomeStories;