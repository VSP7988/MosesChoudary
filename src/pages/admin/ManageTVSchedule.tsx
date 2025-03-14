import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TVSchedule {
  id: string;
  time: string;
  channel: string;
  program: string;
  hosts: string;
  created_at: string;
}

const ManageTVSchedule = () => {
  const [schedules, setSchedules] = useState<TVSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSchedule, setNewSchedule] = useState({
    time: '',
    channel: '',
    program: '',
    hosts: ''
  });

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('tv_schedule')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase
        .from('tv_schedule')
        .insert([newSchedule]);

      if (error) throw error;

      setNewSchedule({
        time: '',
        channel: '',
        program: '',
        hosts: ''
      });
      fetchSchedules();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const { error } = await supabase
        .from('tv_schedule')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchSchedules();
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
      <h2 className="text-2xl font-bold mb-6">Manage TV Schedule</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddSchedule} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="text"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., 9:00 - 9:30 PM"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel
            </label>
            <input
              type="text"
              value={newSchedule.channel}
              onChange={(e) => setNewSchedule({ ...newSchedule, channel: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., Nireekshana TV Channel"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program
            </label>
            <input
              type="text"
              value={newSchedule.program}
              onChange={(e) => setNewSchedule({ ...newSchedule, program: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., Gospel Program"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hosts
            </label>
            <input
              type="text"
              value={newSchedule.hosts}
              onChange={(e) => setNewSchedule({ ...newSchedule, hosts: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., G. Moses Choudary"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <Plus size={20} className="mr-2" />
          Add Schedule
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{schedule.time}</h3>
                    <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      {schedule.channel}
                    </span>
                  </div>
                  <p className="text-gray-600">{schedule.program}</p>
                  <p className="text-sm text-gray-500 mt-1">Hosted by: {schedule.hosts}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteSchedule(schedule.id)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTVSchedule;