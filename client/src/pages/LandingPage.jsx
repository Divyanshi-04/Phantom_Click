import React, { useEffect, useRef, useState } from 'react';
import Navigation from "../components/Stage0_LandingPage/Navigation"
import HeroSection from "../components/Stage0_LandingPage/HeroSection"
import FeaturesSection from "../components/Stage0_LandingPage/FeaturesSection"
import Footer from "../components/Stage0_LandingPage/Footer"

// Main App Component
export default function PhantomClick() {
  useEffect(() => {
    // Smooth scroll for navigation links
    const handleClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', handleClick);
    });

    // Parallax effect for decorative circles
    const handleMouseMove = (e) => {
      const circles = document.querySelectorAll('.decorative-circle');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      circles.forEach((circle, index) => {
        const speed = (index + 1) * 20;
        circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener('click', handleClick);
      });
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
<div className="bg-gradient-to-b from-[#006b7d] via-[#1a8a9a] via-[#4db5c4] via-[#7dd1dd] via-[#a8e0ea] via-[#cdedf3] via-[#e8f6f9] via-[#f5fbfc] to-white text-[#0f2f35] overflow-x-hidden scale-[0.8] origin-top-left w-[125%] h-[125vh]">      <style>{`
        
        @keyframes rotate-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes pulse-circle {
          0%, 100% { opacity: 0.12; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float-phone {
          0%, 100% { transform: translateX(-50%) translateY(0px) rotateY(-5deg); }
          50% { transform: translateX(-50%) translateY(-20px) rotateY(5deg); }
        }
        
        @keyframes slideshow {
          0% { opacity: 0; transform: translateX(20px); }
          6.25% { opacity: 1; transform: translateX(0); }
          25% { opacity: 1; transform: translateX(0); }
          31.25% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 0; }
        }
        
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
      
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}