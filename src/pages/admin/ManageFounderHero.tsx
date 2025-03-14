import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FounderHeroVideo {
  id: string;
  video_id: string;
}

const ManageFounderHero = () => {
  const [video, setVideo] = useState<FounderHeroVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  const fetchVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('founder_hero_video')
        .select('*')
        .single();

      if (error) throw error;
      setVideo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
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

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const video_id = extractVideoId(videoUrl);

      const { error } = await supabase
        .from('founder_hero_video')
        .upsert([{
          id: 'default',
          video_id
        }]);

      if (error) throw error;

      setVideoUrl('');
      fetchVideo();
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
      <h2 className="text-2xl font-bold mb-6">Manage Founder Hero Video</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleUpdateVideo} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Update Hero Video</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Supports youtube.com and youtu.be URLs
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Update Video
        </button>
      </form>

      {video && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current Hero Video</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.video_id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFounderHero;