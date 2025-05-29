import React from 'react';

const TopStrip = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="animate-fadeInLeft text-center sm:text-left">
            <span className="text-[1.75rem] font-medium">Maranatha Visvasa Samajam</span>
          </div>
          <div className="animate-fadeInRight text-center sm:text-right">
            <span className="text-[1.75rem] font-medium">Maranatha Faith Ministries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopStrip;