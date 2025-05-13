import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DonationQR {
  id: string;
  name: string;
  qr_image_url: string;
  payment_link?: string;
  created_at: string;
}

const ManageDonations = () => {
  const [qrCodes, setQRCodes] = useState<DonationQR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newQR, setNewQR] = useState({
    name: '',
    imageFile: null as File | null,
    payment_link: ''
  });

  const fetchQRCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('donation_qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQRCodes(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('donation-qr-codes')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('donation-qr-codes')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      if (!newQR.imageFile) {
        throw new Error('Please select a QR code image');
      }

      // Upload image to storage
      const imageUrl = await uploadImage(newQR.imageFile);

      // Create QR code record
      const { error } = await supabase
        .from('donation_qr_codes')
        .insert([{
          name: newQR.name,
          qr_image_url: imageUrl,
          payment_link: newQR.payment_link || null
        }]);

      if (error) throw error;

      setNewQR({
        name: '',
        imageFile: null,
        payment_link: ''
      });
      fetchQRCodes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteQR = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;

    try {
      // Delete image from storage
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('donation-qr-codes')
        .remove([fileName]);

      // Delete record from database
      const { error } = await supabase
        .from('donation_qr_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchQRCodes();
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
      <h2 className="text-2xl font-bold mb-6">Manage Donations</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleAddQR} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New QR Code</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newQR.name}
              onChange={(e) => setNewQR({ ...newQR, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., Indian UPI, International PayPal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Link (Optional)
            </label>
            <input
              type="text"
              value={newQR.payment_link}
              onChange={(e) => setNewQR({ ...newQR, payment_link: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., upi://pay?pa=example@upi or https://paypal.me/example"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              QR Code Image
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
                          setNewQR({ ...newQR, imageFile: file });
                        }
                      }}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
                {newQR.imageFile && (
                  <p className="text-sm text-green-600">
                    Selected: {newQR.imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="mt-6 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} className="mr-2" />
          {uploading ? 'Uploading...' : 'Add QR Code'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qr) => (
          <div key={qr.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-1 aspect-h-1 relative">
              <img
                src={qr.qr_image_url}
                alt={qr.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{qr.name}</h3>
              {qr.payment_link && (
                <p className="text-sm text-gray-500 mb-4 truncate">{qr.payment_link}</p>
              )}
              <button
                onClick={() => handleDeleteQR(qr.id, qr.qr_image_url)}
                className="inline-flex items-center px-3 py-1 text-red-600 hover:text-red-800 focus:outline-none"
              >
                <Trash2 size={18} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDonations;