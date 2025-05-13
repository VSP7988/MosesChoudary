import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Certification } from '../../types';

const Certifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      const { data } = await supabase
        .from('certifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setCertifications(data);
      setLoading(false);
    };

    fetchCertifications();
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
      <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 text-white py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold text-center mb-6">Our Certifications</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center">
            Recognized qualifications and accreditations that demonstrate our commitment to excellence in ministry and theological education.
          </p>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <a
                href={cert.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                      {cert.title}
                    </h3>
                  </div>
                </div>
              </a>
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                <p className="text-gray-600 mb-4">
                  Click to view the full certification document
                </p>
                <a
                  href={cert.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold transition-colors group/link"
                >
                  <Award className="w-5 h-5 mr-2" />
                  <span>View Certificate</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certifications;