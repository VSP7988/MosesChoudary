import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Home, Book, Church, Users, Heart, Newspaper, Gift } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const menuItems = [
    { 
      title: 'Home', 
      path: '/', 
      icon: <Home size={20} /> 
    },
    {
      title: 'About Us',
      path: '/about',
      icon: <Users size={20} />,
      dropdown: [
        { title: 'Founder', path: '/about/founder' },
        { title: 'Certifications', path: '/about/certifications' },
        { title: 'Our Faith', path: '/about/our-faith' }
      ]
    },
    {
      title: 'Ministries',
      path: '/ministries',
      icon: <Church size={20} />,
      dropdown: [
        { title: 'Leadership', path: '/ministries/leadership' },
        { title: 'TV Ministries', path: '/ministries/tv-ministries' },
        { title: 'Magazine', path: '/ministries/magazine' },
        { title: 'Pastors Fellowship', path: '/ministries/pastors-fellowship' }
      ]
    },
    {
      title: 'Bible Schools',
      path: '/bible-schools',
      icon: <Book size={20} />,
      dropdown: [
        { 
          title: 'Biblical Seminary - Vijayawada', 
          path: 'https://www.biblicalseminary.in/',
          external: true 
        },
        { 
          title: 'Theological Seminary - Hyderabad', 
          path: 'https://mvsamajam.org/',
          external: true 
        },
        { title: 'Veda Patasala - Vizag', path: '/bible-schools/veda-patasala-vizag' }
      ]
    },
    { 
      title: "Children's Home", 
      path: '/childrens-home',
      icon: <Heart size={20} />
    },
    { 
      title: 'Oldage Home', 
      path: '/oldage-home',
      icon: <Users size={20} />
    },
    { 
      title: 'Newsletter', 
      path: '/newsletter',
      icon: <Newspaper size={20} />,
      dropdown: [
        { title: 'English', path: '/newsletter/english' },
        { title: 'Norwegian', path: '/newsletter/norwegian' }
      ]
    },
    { 
      title: 'Donate', 
      path: '/donate',
      icon: <Gift size={20} />,
      highlight: true
    }
  ];

  return (
    <header className="bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 text-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          <div className="hidden lg:flex space-x-1">
            {menuItems.map((item) => (
              <div key={item.title} className="relative group">
                {item.dropdown ? (
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors ${
                      location.pathname.startsWith(item.path) ? 'bg-white/20' : ''
                    }`}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span className="text-sm">{item.title}</span>
                    <ChevronDown
                      size={16}
                      className={`ml-1 transform transition-transform duration-200 ${
                        activeDropdown === item.title ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      item.highlight
                        ? 'bg-white text-orange-600 hover:bg-orange-50'
                        : 'hover:bg-white/10'
                    } ${location.pathname === item.path ? 'bg-white/20' : ''}`}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span className="text-sm">{item.title}</span>
                  </Link>
                )}

                {item.dropdown && activeDropdown === item.title && (
                  <div className="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 transform opacity-100 scale-100 transition-all duration-200 origin-top-left">
                    <div className="absolute top-0 left-6 -mt-2 w-4 h-4 bg-white transform rotate-45" />
                    {item.dropdown.map((subItem) => (
                      subItem.external ? (
                        <a
                          key={subItem.title}
                          href={subItem.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors relative z-10"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.title}
                        </a>
                      ) : (
                        <Link
                          key={subItem.title}
                          to={subItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors relative z-10"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.title}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 bg-white/10 rounded-lg backdrop-blur-sm">
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className={`w-full text-left py-3 px-4 flex justify-between items-center hover:bg-white/10 transition-colors ${
                        location.pathname.startsWith(item.path) ? 'bg-white/20' : ''
                      }`}
                    >
                      <span className="flex items-center">
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        <span className="text-sm">{item.title}</span>
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-200 ${
                          activeDropdown === item.title ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeDropdown === item.title && (
                      <div className="bg-white/5 py-2">
                        {item.dropdown.map((subItem) => (
                          subItem.external ? (
                            <a
                              key={subItem.title}
                              href={subItem.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block py-2 px-8 text-sm hover:bg-white/10 transition-colors"
                              onClick={() => {
                                setIsOpen(false);
                                setActiveDropdown(null);
                              }}
                            >
                              {subItem.title}
                            </a>
                          ) : (
                            <Link
                              key={subItem.title}
                              to={subItem.path}
                              className="block py-2 px-8 text-sm hover:bg-white/10 transition-colors"
                              onClick={() => {
                                setIsOpen(false);
                                setActiveDropdown(null);
                              }}
                            >
                              {subItem.title}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`block py-3 px-4 text-sm hover:bg-white/10 transition-colors ${
                      item.highlight ? 'bg-white text-orange-600' : ''
                    } ${location.pathname === item.path ? 'bg-white/20' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.title}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;