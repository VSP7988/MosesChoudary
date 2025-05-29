import React from 'react';
import { Book, Cross, Heart, HelpingHand as PrayingHands, Church, Heater as Water, Siren as Fire, ChevronFirst as FirstAid, ArrowUp, Scale } from 'lucide-react';

const OurFaith = () => {
  const beliefs = [
    {
      icon: <Book className="w-8 h-8 text-orange-600" />,
      title: "The Bible",
      description: "In the verbal inspiration of the Bible which is the infallible and authoritative word of God."
    },
    {
      icon: <Cross className="w-8 h-8 text-orange-600" />,
      title: "The Trinity",
      description: "In one God eternally existing in three persons namely the Father, Son, and Holy Spirit."
    },
    {
      icon: <Heart className="w-8 h-8 text-orange-600" />,
      title: "Jesus Christ",
      description: "In the deity of Jesus. Christ his conception of the Holy Spirit, virgin birth, holy life, and that he died upon the Cross as the substitutionary sacrifice for the sins of the world and arose from the dead and ascended into heaven from where he will return with power and glory."
    },
    {
      icon: <PrayingHands className="w-8 h-8 text-orange-600" />,
      title: "Salvation",
      description: "That all are sinners and that the forgiveness of sins and justification are wrought by repentance of sins and faith in. Jesus Christ."
    },
    {
      icon: <Water className="w-8 h-8 text-orange-600" />,
      title: "Water Baptism",
      description: "In water Baptism' by immersion."
    },
    {
      icon: <Scale className="w-8 h-8 text-orange-600" />,
      title: "Holy Living",
      description: "In the holiness to be God's standard of living for his people, and that true devotion (piety) which God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress and to keep oneself from being polluted by the world."
    },
    {
      icon: <Fire className="w-8 h-8 text-orange-600" />,
      title: "Holy Spirit Baptism",
      description: "In the baptism of the Holy Spirit with noticeable signs."
    },
    {
      icon: <FirstAid className="w-8 h-8 text-orange-600" />,
      title: "Divine Healing",
      description: "In miraculous divine healing and the Lord's communion meal."
    },
    {
      icon: <ArrowUp className="w-8 h-8 text-orange-600" />,
      title: "Second Coming",
      description: "In the second coming of Jesus Christ, first, to resurrect the Righteous dead and catch away the living saints to Him in the air. Second, to reign with saints in the earth for a thousand years."
    },
    {
      icon: <Church className="w-8 h-8 text-orange-600" />,
      title: "Resurrection",
      description: "In the bodily resurrection, eternal life for the righteous, and eternal damnation for the unrighteous."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">Statement of Faith</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center">
            Our foundational beliefs and doctrinal commitments that guide our ministry and service.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 bg-clip-text text-transparent">
            We Believe
          </h2>
         
        </div>

        {/* Core Beliefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beliefs.map((belief, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4 mx-auto">
                {belief.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
                {belief.title}
              </h3>
              <p className="text-gray-600 text-center">
                {belief.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurFaith;