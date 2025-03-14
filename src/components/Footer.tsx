import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number>(100982);

  useEffect(() => {
    // Check if this is a new visit
    const lastVisitTime = localStorage.getItem('lastVisitTime');
    const currentTime = new Date().getTime();
    
    // Consider it a new visit if there's no last visit time or it was more than 30 minutes ago
    if (!lastVisitTime || currentTime - parseInt(lastVisitTime) > 30 * 60 * 1000) {
      setVisitorCount(prev => prev + 1);
      localStorage.setItem('lastVisitTime', currentTime.toString());
    }

    // Simulate occasional new visitors
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + 1);
    }, 60000); // Add a new visitor every minute

    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    { 
      icon: <Facebook size={20} />, 
      url: 'https://www.facebook.com/moseschoudary.gullapalli', 
      label: 'Facebook' 
    },
    { 
      icon: <Youtube size={20} />, 
      url: 'https://www.youtube.com/channel/UCl_anQ9uGIHI9Dh061NbM3w', 
      label: 'YouTube' 
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* First Row - Indian Offices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Vijayawada Office */}
          <div className="space-y-4">
            <h5 className="text-base sm:text-lg font-semibold flex items-center">
              <MapPin className="mr-2 text-orange-500" size={20} />
              Vijayawada Office
            </h5>
            <div className="text-sm sm:text-base text-gray-400 space-y-2">
              <p className="font-medium text-white">Maranatha Visvasa Samajam</p>
              <p>D.No.59-8-2/1, Gayatri Nagar, Vijayawada-520008, Andhra Pradhesh, India</p>
              <div className="flex items-center">
                <Phone className="mr-2 text-orange-500" size={16} />
                <a href="tel:+919394247333" className="hover:text-orange-500 transition-colors">
                  +91 93942-47333
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 text-orange-500" size={16} />
                <a href="mailto:mvs828@gmail.com" className="hover:text-orange-500 transition-colors">
                  mvs828@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Visakhapatnam Office */}
          <div className="space-y-4">
            <h5 className="text-base sm:text-lg font-semibold flex items-center">
              <MapPin className="mr-2 text-orange-500" size={20} />
              Visakhapatnam Office
            </h5>
            <div className="text-sm sm:text-base text-gray-400 space-y-2">
              <p className="font-medium text-white">Maranatha Visvasa Samajam</p>
              <p>50-43-9, P&T Colony, Road No.3, MRO Office Back Road, Seethammadhara, Visakhapatnam-530013</p>
              <div className="flex items-center">
                <Phone className="mr-2 text-orange-500" size={16} />
                <a href="tel:+919949590555" className="hover:text-orange-500 transition-colors">
                  +91 9949590555
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 text-orange-500" size={16} />
                <a href="mailto:mvsamajamvisakha@gmail.com" className="hover:text-orange-500 transition-colors">
                  mvsamajamvisakha@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Hyderabad Office */}
          <div className="space-y-4">
            <h5 className="text-base sm:text-lg font-semibold flex items-center">
              <MapPin className="mr-2 text-orange-500" size={20} />
              Hyderabad Office
            </h5>
            <div className="text-sm sm:text-base text-gray-400 space-y-2">
              <p className="font-medium text-white">Maranatha Visvasa Samajam</p>
              <p>Raghavendra Nagar, Kukatpally, Hyderabad-500072</p>
              <div className="flex items-center">
                <Phone className="mr-2 text-orange-500" size={16} />
                <a href="tel:+919849746464" className="hover:text-orange-500 transition-colors">
                  +91 9849746464
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 text-orange-500" size={16} />
                <a href="mailto:knireekshan@gmail.com" className="hover:text-orange-500 transition-colors">
                  knireekshan@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - International Offices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* USA Office */}
          <div className="space-y-4">
            <h5 className="text-base sm:text-lg font-semibold flex items-center">
              <MapPin className="mr-2 text-orange-500" size={20} />
              USA Office
            </h5>
            <div className="text-sm sm:text-base text-gray-400 space-y-2">
              <p className="font-medium text-white">Maranatha Faith Ministries, Inc.</p>
              <p>P.O.Box 2414 Brunswick, GA 31521-2414 (Tax Exempt)</p>
              <div className="flex items-center">
                <Mail className="mr-2 text-orange-500" size={16} />
                <a href="mailto:pastorchoudary@yahoo.com" className="hover:text-orange-500 transition-colors">
                  pastorchoudary@yahoo.com
                </a>
              </div>
            </div>
          </div>

          {/* Norway Office */}
          <div className="space-y-4">
            <h5 className="text-base sm:text-lg font-semibold flex items-center">
              <MapPin className="mr-2 text-orange-500" size={20} />
              Norway Office
            </h5>
            <div className="text-sm sm:text-base text-gray-400 space-y-2">
              <p className="font-medium text-white">Karismakirken</p>
              <p>52 Adjunkt Haugland Street, Stavanger 4022, Norway</p>
              <p className="text-sm">Bank Account: 2801.38.71576 (Please mark as "India")</p>
            </div>
          </div>

          {/* Empty Third Column */}
          <div></div>
        </div>

        {/* Copyright and Social Links */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm sm:text-base text-gray-400">
              © {new Date().getFullYear()} Dream Studios. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-500 transition-colors p-2 bg-gray-800 rounded-full"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>

              {/* Visitor Count */}
              <div className="flex items-center space-x-2 text-gray-400">
                <Globe size={16} />
                <span className="font-mono bg-gray-800 px-2 py-1 rounded text-sm">
                  {visitorCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;