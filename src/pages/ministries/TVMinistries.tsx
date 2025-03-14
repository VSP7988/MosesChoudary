import React, { useState, useEffect } from 'react';
import { Tv, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TVSchedule {
  id: string;
  time: string;
  channel: string;
  program: string;
  hosts: string;
}

const TVMinistries = () => {
  const [schedules, setSchedules] = useState<TVSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      const { data } = await supabase
        .from('tv_schedule')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setSchedules(data);
      setLoading(false);
    };

    fetchSchedules();
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
        <div className="relative container mx-auto px-4">
          <div className="flex justify-center mb-6">
            <Tv className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold text-center mb-6">TV Ministries</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center">
            Spreading the Gospel through television programs across multiple channels
          </p>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedules.map((program) => (
            <div 
              key={program.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{program.time}</h3>
                    <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      {program.channel}
                    </span>
                  </div>
                  <p className="text-gray-600">{program.program}</p>
                  <p className="text-sm text-gray-500 mt-1">Hosted by: {program.hosts}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVMinistries;