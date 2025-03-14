import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Calendar as CalendarIcon, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Event } from '../../types';

const ManageEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    imageFile: null as File | null
  });

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `events/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('events')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('events')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (!newEvent.imageFile) {
        throw new Error('Please select an image');
      }

      // Upload image to storage
      const imageUrl = await uploadImage(newEvent.imageFile);

      // Create event record
      const { error } = await supabase
        .from('events')
        .insert([{
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          image_url: imageUrl
        }]);

      if (error) throw error;

      setNewEvent({
        title: '',
        description: '',
        date: '',
        imageFile: null
      });
      fetchEvents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEvent = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      // Delete image from storage
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('events')
        .remove([`events/${fileName}`]);

      // Delete record from database
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchEvents();
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
      <h2 className="text-2xl font-bold mb-6">Manage Events</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddEvent} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Image
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
                          setNewEvent({ ...newEvent, imageFile: file });
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
                {newEvent.imageFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newEvent.imageFile.name}
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
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
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
          {uploading ? 'Uploading...' : 'Add Event'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={event.image_url}
                alt={event.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-orange-600">
                  <CalendarIcon size={18} className="mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleDeleteEvent(event.id, event.image_url)}
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

export default ManageEvents;