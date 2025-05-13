import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  order_position: number;
  created_at: string;
}

const ManageOldageHomeTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({
    quote: '',
    author: '',
    role: ''
  });

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('oldage_home_testimonials')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Get the highest order number and add 1
      const maxOrder = testimonials.reduce((max, t) => Math.max(max, t.order_position), 0);
      const newOrder = maxOrder + 1;

      const { error } = await supabase
        .from('oldage_home_testimonials')
        .insert([{
          quote: newTestimonial.quote,
          author: newTestimonial.author,
          role: newTestimonial.role,
          order_position: newOrder
        }]);

      if (error) throw error;

      setNewTestimonial({
        quote: '',
        author: '',
        role: ''
      });
      fetchTestimonials();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('oldage_home_testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchTestimonials();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMoveTestimonial = async (id: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = testimonials.findIndex(t => t.id === id);
      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= testimonials.length) return;

      const currentTestimonial = testimonials[currentIndex];
      const swapTestimonial = testimonials[newIndex];

      const { error } = await supabase
        .from('oldage_home_testimonials')
        .upsert([
          { ...currentTestimonial, order_position: swapTestimonial.order_position },
          { ...swapTestimonial, order_position: currentTestimonial.order_position }
        ]);

      if (error) throw error;

      fetchTestimonials();
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
      <h2 className="text-2xl font-bold mb-6">Manage Oldage Home Testimonials</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddTestimonial} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Testimonial</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quote
            </label>
            <textarea
              value={newTestimonial.quote}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author Name
            </label>
            <input
              type="text"
              value={newTestimonial.author}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={newTestimonial.role}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <Plus size={20} className="mr-2" />
          Add Testimonial
        </button>
      </form>

      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{testimonial.author}</h3>
                <p className="text-gray-600">{testimonial.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleMoveTestimonial(testimonial.id, 'up')}
                  disabled={index === 0}
                  className="p-2 text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp size={20} />
                </button>
                <button
                  onClick={() => handleMoveTestimonial(testimonial.id, 'down')}
                  disabled={index === testimonials.length - 1}
                  className="p-2 text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown size={20} />
                </button>
                <button
                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <p className="text-gray-700">{testimonial.quote}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOldageHomeTestimonials;