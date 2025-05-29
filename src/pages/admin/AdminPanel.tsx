import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Image, Calendar, Youtube, Phone as Photo, Award, Newspaper, LogInIcon as LogoIcon, Video, Images, FileText, Presentation, Heart, BookOpen, Camera, MessageSquare, Users, Tv, Gift, Book, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ManageBanners from './ManageBanners';
import ManageEvents from './ManageEvents';
import ManageVideos from './ManageVideos';
import ManageGallery from './ManageGallery';
import ManageCertifications from './ManageCertifications';
import ManageNewsletters from './ManageNewsletters';
import ManageLogo from './ManageLogo';
import ManageFounderHero from './ManageFounderHero';
import ManageFounderGallery from './ManageFounderGallery';
import ManageFounderContent from './ManageFounderContent';
import ManageVedapatasalaBanners from './ManageVedapatasalaBanners';
import ManageVedapatasalaContent from './ManageVedapatasalaContent';
import ManageVedapatasalaGallery from './ManageVedapatasalaGallery';
import ManageChildrensHomeBanners from './ManageChildrensHomeBanners';
import ManageChildrensHomeStories from './ManageChildrensHomeStories';
import ManageChildrensHomeGallery from './ManageChildrensHomeGallery';
import ManageChildrensHomeTestimonials from './ManageChildrensHomeTestimonials';
import ManageOldageHomeBanners from './ManageOldageHomeBanners';
import ManageOldageHomeContent from './ManageOldageHomeContent';
import ManageOldageHomeGallery from './ManageOldageHomeGallery';
import ManageTeamMembers from './ManageTeamMembers';
import ManageTVSchedule from './ManageTVSchedule';
import ManageDonations from './ManageDonations';
import ManageMagazines from './ManageMagazines';
import ManagePastorsFellowship from './ManagePastorsFellowship';
import ManagePastorsFellowshipBanners from './ManagePastorsFellowshipBanners';
import PageLoader from '../../components/PageLoader';

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          navigate('/admin/login');
          return;
        }

        if (!session) {
          navigate('/admin/login');
          return;
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!session) {
            navigate('/admin/login');
          }
        });

        setLoading(false);

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Auth check error:', err);
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/admin/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-800"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/logo"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/logo' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <LogoIcon className="w-12 h-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Logo</h2>
          </Link>

          <Link
            to="/admin/founder-hero"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/founder-hero' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Video className="w-12 h-12 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Founder Hero</h2>
          </Link>

          <Link
            to="/admin/founder-content"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/founder-content' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <FileText className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Founder Content</h2>
          </Link>

          <Link
            to="/admin/founder-gallery"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/founder-gallery' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Images className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Founder Gallery</h2>
          </Link>

          <Link
            to="/admin/banners"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/banners' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Image className="w-12 h-12 text-orange-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Banners</h2>
          </Link>

          <Link
            to="/admin/events"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/events' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Calendar className="w-12 h-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Events</h2>
          </Link>

          <Link
            to="/admin/videos"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/videos' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Youtube className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Videos</h2>
          </Link>

          <Link
            to="/admin/gallery"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/gallery' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Photo className="w-12 h-12 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Gallery</h2>
          </Link>

          <Link
            to="/admin/certifications"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/certifications' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Award className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Certifications</h2>
          </Link>

          <Link
            to="/admin/newsletters"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/newsletters' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Newspaper className="w-12 h-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Newsletters</h2>
          </Link>

          <Link
            to="/admin/magazines"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/magazines' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Book className="w-12 h-12 text-yellow-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Magazines</h2>
          </Link>

          <Link
            to="/admin/pastors-fellowship"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/pastors-fellowship' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <UserPlus className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Pastors Fellowship</h2>
          </Link>

          <Link
            to="/admin/pastors-fellowship-banners"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/pastors-fellowship-banners' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Image className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Pastors Fellowship Banners</h2>
          </Link>

          <Link
            to="/admin/team-members"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/team-members' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Team Members</h2>
          </Link>

          <Link
            to="/admin/tv-schedule"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/tv-schedule' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Tv className="w-12 h-12 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage TV Schedule</h2>
          </Link>

          <Link
            to="/admin/donations"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/donations' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Gift className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Donations</h2>
          </Link>

          <Link
            to="/admin/vedapatasala-banners"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/vedapatasala-banners' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Presentation className="w-12 h-12 text-teal-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Vedapatasala Banners</h2>
          </Link>

          <Link
            to="/admin/vedapatasala-content"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/vedapatasala-content' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <FileText className="w-12 h-12 text-teal-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Vedapatasala Content</h2>
          </Link>

          <Link
            to="/admin/vedapatasala-gallery"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/vedapatasala-gallery' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Images className="w-12 h-12 text-teal-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Vedapatasala Gallery</h2>
          </Link>

          <Link
            to="/admin/childrens-home-banners"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/childrens-home-banners' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Heart className="w-12 h-12 text-pink-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Children's Home Banners</h2>
          </Link>

          <Link
            to="/admin/childrens-home-stories"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/childrens-home-stories' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <BookOpen className="w-12 h-12 text-pink-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Children's Home Stories</h2>
          </Link>

          <Link
            to="/admin/childrens-home-gallery"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/childrens-home-gallery' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Camera className="w-12 h-12 text-pink-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Children's Home Gallery</h2>
          </Link>

          <Link
            to="/admin/childrens-home-testimonials"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/childrens-home-testimonials' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <MessageSquare className="w-12 h-12 text-pink-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Children's Home Testimonials</h2>
          </Link>

          <Link
            to="/admin/oldage-home-banners"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/oldage-home-banners' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Heart className="w-12 h-12 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Oldage Home Banners</h2>
          </Link>

          <Link
            to="/admin/oldage-home-content"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/oldage-home-content' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <FileText className="w-12 h-12 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Oldage Home Content</h2>
          </Link>

          <Link
            to="/admin/oldage-home-gallery"
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              location.pathname === '/admin/oldage-home-gallery' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <Camera className="w-12 h-12 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold">Manage Oldage Home Gallery</h2>
          </Link>
        </div>

        <Routes>
          <Route path="/logo" element={<ManageLogo />} />
          <Route path="/founder-hero" element={<ManageFounderHero />} />
          <Route path="/founder-content" element={<ManageFounderContent />} />
          <Route path="/founder-gallery" element={<ManageFounderGallery />} />
          <Route path="/banners" element={<ManageBanners />} />
          <Route path="/events" element={<ManageEvents />} />
          <Route path="/videos" element={<ManageVideos />} />
          <Route path="/gallery" element={<ManageGallery />} />
          <Route path="/certifications" element={<ManageCertifications />} />
          <Route path="/newsletters" element={<ManageNewsletters />} />
          <Route path="/magazines" element={<ManageMagazines />} />
          <Route path="/pastors-fellowship" element={<ManagePastorsFellowship />} />
          <Route path="/pastors-fellowship-banners" element={<ManagePastorsFellowshipBanners />} />
          <Route path="/team-members" element={<ManageTeamMembers />} />
          <Route path="/tv-schedule" element={<ManageTVSchedule />} />
          <Route path="/donations" element={<ManageDonations />} />
          <Route path="/vedapatasala-banners" element={<ManageVedapatasalaBanners />} />
          <Route path="/vedapatasala-content" element={<ManageVedapatasalaContent />} />
          <Route path="/vedapatasala-gallery" element={<ManageVedapatasalaGallery />} />
          <Route path="/childrens-home-banners" element={<ManageChildrensHomeBanners />} />
          <Route path="/childrens-home-stories" element={<ManageChildrensHomeStories />} />
          <Route path="/childrens-home-gallery" element={<ManageChildrensHomeGallery />} />
          <Route path="/childrens-home-testimonials" element={<ManageChildrensHomeTestimonials />} />
          <Route path="/oldage-home-banners" element={<ManageOldageHomeBanners />} />
          <Route path="/oldage-home-content" element={<ManageOldageHomeContent />} />
          <Route path="/oldage-home-gallery" element={<ManageOldageHomeGallery />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;