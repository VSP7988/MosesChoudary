import React, { useState, useEffect } from 'react';
import { Newspaper, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Newsletter } from '../../types';

const Norwegian = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  useEffect(() => {
    const fetchNewsletters = async () => {
      const { data } = await supabase
        .from('newsletters')
        .select('*')
        .eq('language', 'norwegian')
        .order('year', { ascending: false })
        .order('month', { ascending: true });

      if (data) {
        setNewsletters(data);
        const uniqueYears = [...new Set(data.map(newsletter => newsletter.year))];
        setYears(uniqueYears.sort((a, b) => b - a));
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]);
        }
      }
      setLoading(false);
    };

    fetchNewsletters();
  }, []);

  const filteredNewsletters = newsletters.filter(newsletter => newsletter.year === selectedYear);

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
          <div className="flex items-center justify-center mb-6">
            <Newspaper className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold text-center mb-6">Nyhetsbrev på Norsk</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center">
            Hold deg oppdatert med våre siste nyheter, arrangementer og åndelige innsikter gjennom vårt månedlige nyhetsbrev.
          </p>
        </div>
      </div>

      {/* Year Selection */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <span className="text-xl font-semibold">
                {selectedYear ? `Nyhetsbrev fra ${selectedYear}` : 'Velg år'}
              </span>
              <ChevronDown className={`w-6 h-6 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showYearDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setShowYearDropdown(false);
                    }}
                    className={`w-full px-6 py-3 text-left hover:bg-orange-50 transition-colors ${
                      selectedYear === year ? 'bg-orange-100 text-orange-600 font-semibold' : ''
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Newsletters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNewsletters.map((newsletter) => (
            <div
              key={newsletter.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={newsletter.image_url}
                  alt="Newsletter Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <a
                  href={newsletter.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Newspaper className="w-5 h-5 mr-2" />
                  Les nyhetsbrev
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredNewsletters.length === 0 && selectedYear && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">Ingen nyhetsbrev tilgjengelig for {selectedYear}</h3>
            <p className="text-gray-500">Vennligst velg et annet år eller sjekk tilbake senere.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Norwegian;