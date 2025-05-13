import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Event } from '../types';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(10);

      if (data) setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join us in our upcoming events and be part of our growing community. Experience spiritual growth, fellowship, and community service.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
                  <div className="text-center">
                    <span className="block text-orange-600 font-bold">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="block text-3xl font-bold text-gray-800">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">
                  {event.title}
                </h3>
                
                <div className="mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;