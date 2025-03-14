import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { YoutubeVideo } from '../../types';
import YouTube from 'react-youtube';

const ManageVideos = () => {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newVideo, setNewVideo] = useState({
    video_url: ''
  });

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const extractVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      const videoId = urlObj.searchParams.get('v');
      if (!videoId) throw new Error('Invalid YouTube URL');
      return videoId;
    } catch (err) {
      throw new Error('Please enter a valid YouTube URL');
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const video_id = extractVideoId(newVideo.video_url);
      const { error } = await supabase
        .from('youtube_videos')
        .insert([{ video_id }]);

      if (error) throw error;

      setNewVideo({ video_url: '' });
      fetchVideos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchVideos();
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
      <h2 className="text-2xl font-bold mb-6">Manage Videos</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddVideo} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Video</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            YouTube Video URL
          </label>
          <input
            type="url"
            value={newVideo.video_url}
            onChange={(e) => setNewVideo({ video_url: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Supports youtube.com and youtu.be URLs
          </p>
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <Plus size={20} className="mr-2" />
          Add Video
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <YouTube
                videoId={video.video_id}
                opts={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
            <div className="p-4">
              <button
                onClick={() => handleDeleteVideo(video.id)}
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

export default ManageVideos;