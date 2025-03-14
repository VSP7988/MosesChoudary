import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DonationQR {
  id: string;
  name: string;
  qr_image_url: string;
  payment_link: string;
}

const Donate = () => {
  const [qrCodes, setQRCodes] = useState<DonationQR[]>([]);

  useEffect(() => {
    const fetchQRCodes = async () => {
      const { data } = await supabase
        .from('donation_qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setQRCodes(data);
    };

    fetchQRCodes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Giving is Divine</h1>
            <p className="text-xl text-white/90 mb-8">
              Thank you for your interest in donating to us, and we are grateful for your contribution. Please use a QR code for quick access to donate, or mail your cheques to Maranatha Faith Ministries, Inc., P.O.Box 2414 Brunswick, GA 31521-2414, USA (Tax Exempt).
            </p>
          </div>
        </div>
      </div>

      {/* QR Codes Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold mb-4">Scan to Donate</h3>
                <p className="text-gray-600">
                  Maranatha Faith Ministries, Inc. is a registered not-for-profit 501(c)(3) corporation. All donations are tax-deductible.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {qrCodes.map((qr) => (
                  <div key={qr.id} className="text-center">
                    <div className="bg-gray-100 p-8 rounded-xl mb-4">
                      <img 
                        src={qr.qr_image_url}
                        alt={`${qr.name} QR Code`}
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <h4 className="font-semibold mb-2">{qr.name}</h4>
                    {qr.payment_link && (
                      <a
                        href={qr.payment_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Donate Now
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;