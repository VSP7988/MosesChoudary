import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopStrip from './components/TopStrip';
import Header from './components/Header';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';

// Lazy load all pages
const Home = React.lazy(() => import('./pages/Home'));
const Events = React.lazy(() => import('./pages/Events'));
const Certifications = React.lazy(() => import('./pages/about/Certifications'));
const OurFaith = React.lazy(() => import('./pages/about/OurFaith'));
const Founder = React.lazy(() => import('./pages/about/Founder'));
const ChildrensHome = React.lazy(() => import('./pages/ChildrensHome'));
const OldageHome = React.lazy(() => import('./pages/OldageHome'));
const Donate = React.lazy(() => import('./pages/Donate'));
const AdminPanel = React.lazy(() => import('./pages/admin/AdminPanel'));
const Login = React.lazy(() => import('./pages/admin/Login'));
const English = React.lazy(() => import('./pages/newsletter/English'));
const Norwegian = React.lazy(() => import('./pages/newsletter/Norwegian'));
const VedaPatasala = React.lazy(() => import('./pages/bible-schools/VedaPatasala'));
const Leadership = React.lazy(() => import('./pages/ministries/Leadership'));
const TVMinistries = React.lazy(() => import('./pages/ministries/TVMinistries'));
const Magazine = React.lazy(() => import('./pages/ministries/Magazine'));
const PastorsFellowship = React.lazy(() => import('./pages/ministries/PastorsFellowship'));

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <TopStrip />
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/about/founder" element={<Founder />} />
              <Route path="/about/certifications" element={<Certifications />} />
              <Route path="/about/our-faith" element={<OurFaith />} />
              <Route path="/childrens-home" element={<ChildrensHome />} />
              <Route path="/oldage-home" element={<OldageHome />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/newsletter/english" element={<English />} />
              <Route path="/newsletter/norwegian" element={<Norwegian />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/*" element={<AdminPanel />} />
              <Route path="/bible-schools/veda-patasala-vizag" element={<VedaPatasala />} />
              <Route path="/ministries/leadership" element={<Leadership />} />
              <Route path="/ministries/tv-ministries" element={<TVMinistries />} />
              <Route path="/ministries/magazine" element={<Magazine />} />
              <Route path="/ministries/pastors-fellowship" element={<PastorsFellowship />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;