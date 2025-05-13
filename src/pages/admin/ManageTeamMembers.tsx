import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  image_url: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  order_position: number;
}

const ManageTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    designation: '',
    imageFile: null as File | null,
    facebook_url: '',
    twitter_url: '',
    instagram_url: ''
  });

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('team-members')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('team-members')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (!newMember.imageFile) {
        throw new Error('Please select an image');
      }

      // Get the highest order number and add 1
      const maxOrder = members.reduce((max, m) => Math.max(max, m.order_position), 0);
      const newOrder = maxOrder + 1;

      // Upload image to storage
      const imageUrl = await uploadImage(newMember.imageFile);

      // Create member record
      const { error } = await supabase
        .from('team_members')
        .insert([{
          name: newMember.name,
          designation: newMember.designation,
          image_url: imageUrl,
          facebook_url: newMember.facebook_url || null,
          twitter_url: newMember.twitter_url || null,
          instagram_url: newMember.instagram_url || null,
          order_position: newOrder
        }]);

      if (error) throw error;

      setNewMember({
        name: '',
        designation: '',
        imageFile: null,
        facebook_url: '',
        twitter_url: '',
        instagram_url: ''
      });
      fetchMembers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMember = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      // Delete image from storage
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('team-members')
        .remove([fileName]);

      // Delete record from database
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchMembers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMoveMember = async (id: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = members.findIndex(m => m.id === id);
      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= members.length) return;

      const currentMember = members[currentIndex];
      const swapMember = members[newIndex];

      const { error } = await supabase
        .from('team_members')
        .upsert([
          { ...currentMember, order_position: swapMember.order_position },
          { ...swapMember, order_position: currentMember.order_position }
        ]);

      if (error) throw error;

      fetchMembers();
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
      <h2 className="text-2xl font-bold mb-6">Manage Team Members</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddMember} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Team Member</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="text"
              value={newMember.designation}
              onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
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
                          setNewMember({ ...newMember, imageFile: file });
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
                {newMember.imageFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newMember.imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={newMember.facebook_url}
              onChange={(e) => setNewMember({ ...newMember, facebook_url: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="https://facebook.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter URL
            </label>
            <input
              type="url"
              value={newMember.twitter_url}
              onChange={(e) => setNewMember({ ...newMember, twitter_url: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={newMember.instagram_url}
              onChange={(e) => setNewMember({ ...newMember, instagram_url: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="https://instagram.com/username"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} className="mr-2" />
          {uploading ? 'Uploading...' : 'Add Team Member'}
        </button>
      </form>

      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={member.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start gap-6">
              <img
                src={member.image_url}
                alt={member.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-gray-600">{member.designation}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMoveMember(member.id, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowUp size={20} />
                    </button>
                    <button
                      onClick={() => handleMoveMember(member.id, 'down')}
                      disabled={index === members.length - 1}
                      className="p-2 text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDown size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id, member.image_url)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {member.facebook_url && (
                    <p className="text-sm text-gray-600">Facebook: {member.facebook_url}</p>
                  )}
                  {member.twitter_url && (
                    <p className="text-sm text-gray-600">Twitter: {member.twitter_url}</p>
                  )}
                  {member.instagram_url && (
                    <p className="text-sm text-gray-600">Instagram: {member.instagram_url}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTeamMembers;