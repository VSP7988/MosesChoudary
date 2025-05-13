import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Logo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase
        .from('logo')
        .select('image_url')
        .single();

      if (data) {
        setLogoUrl(data.image_url);
      }
    };

    fetchLogo();
  }, []);

  return logoUrl ? (
    <img src={logoUrl} alt="Logo" className="h-12 sm:h-14 md:h-16 w-auto" />
  ) : (
    <span className="text-lg sm:text-xl md:text-2xl font-bold">MOSES CHOUDARY</span>
  );
};

export default Logo;