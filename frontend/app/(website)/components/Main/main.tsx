"use client"
import Faqs from "./faqs-section";
import Features from "./features-section";
import HeroSection from "./hero-section";
import Requirements from "./requirements-section";

function Main() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Features />
      <Faqs />
      <Requirements />
    </main>
  );
}

export default Main;
