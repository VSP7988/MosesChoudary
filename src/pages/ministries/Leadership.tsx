import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
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

const Leadership = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .order('order_position', { ascending: true });

      if (data) setTeamMembers(data);
      setLoading(false);
    };

    fetchTeamMembers();
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
          <h1 className="text-5xl font-bold text-center mb-6">Our Leadership</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center">
            Meet our dedicated team of leaders who guide and inspire our ministry's mission and vision.
          </p>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-w-3 aspect-h-4 relative">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{member.designation}</p>
                <div className="flex space-x-3">
                  {member.facebook_url && (
                    <a
                      href={member.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Facebook size={18} />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a
                      href={member.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-400 transition-colors"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  {member.instagram_url && (
                    <a
                      href={member.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-600 transition-colors"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leadership;