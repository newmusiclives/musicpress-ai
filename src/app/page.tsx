import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ForArtists from "@/components/ForArtists";
import ForVenues from "@/components/ForVenues";
import TrueFansSection from "@/components/TrueFansSection";
import DatabasePreview from "@/components/DatabasePreview";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <ForArtists />
      <ForVenues />
      <DatabasePreview />
      <TrueFansSection />
      <Pricing />

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
            Ready to Get Your Music{" "}
            <span className="gradient-text">in the Press?</span>
          </h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
            Join thousands of artists and venues using AI to land press
            coverage, grow their audience, and connect with fans through
            TrueFans CONNECT.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 text-lg font-bold text-white bg-gradient-to-r from-primary to-accent px-10 py-4 rounded-xl hover:opacity-90 transition-all glow-primary"
          >
            Get Started Free
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
