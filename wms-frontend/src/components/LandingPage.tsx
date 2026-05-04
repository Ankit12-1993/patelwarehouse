import React from 'react';
import LeadForm from './LeadForm';

export default function LandingPage() {
  return (
    <div>
      {/* 1. Hero Section */}
      <section className="section" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '100px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h1 style={{ color: 'white', fontSize: '48px', marginBottom: '24px' }}>Flexible Warehouse Space for E-commerce Sellers</h1>
            <p style={{ fontSize: '20px', color: '#cbd5e1', marginBottom: '32px', lineHeight: '1.6' }}>
              Scale your business with secure, accessible, and on-demand storage solutions. Request a quote today and move your inventory in tomorrow.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-primary" onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Request Space
              </button>
              <button className="btn btn-secondary" style={{ backgroundColor: 'transparent', color: 'white', borderColor: '#475569' }}>
                Contact Us
              </button>
            </div>
          </div>
          
          <div style={{ flex: '1 1 400px' }} id="lead-form">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* 2. Trust Signals */}
      <section className="section section-bg" style={{ padding: '40px 0' }}>
        <div className="container text-center">
          <p className="text-muted mb-4" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>Trusted by Fast-Growing Brands</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.6 }}>
            {/* Placeholders for logos */}
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Company A</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Brand B</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Logistics Co</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>E-Comm Plus</div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-8">
            <h2>Storage Solutions Built for You</h2>
            <p className="text-muted">Choose exactly what you need. No hidden fees.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <ServiceCard 
              icon="📦" 
              title="Pallet & Sq Ft Storage" 
              desc="Pay only for the space you use. We offer flexible pallet storage or dedicated square footage." 
            />
            <ServiceCard 
              icon="⏱️" 
              title="Flexible Durations" 
              desc="Need space for a month? A year? We support both short-term bursts and long-term commitments." 
            />
            <ServiceCard 
              icon="🚚" 
              title="Loading & Unloading" 
              desc="On-site forklifts and loading docks available to handle your incoming and outgoing shipments." 
            />
          </div>
        </div>
      </section>

      {/* 4. Warehouse Details */}
      <section className="section section-bg">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2>Premium Facility Location</h2>
              <p className="text-muted mb-4">Our primary facility is strategically located to optimize your supply chain routing.</p>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FeatureItem title="📍 Prime Location" desc="Minutes away from major highways and transit hubs." />
                <FeatureItem title="🔒 24/7 Security" desc="CCTV monitoring, restricted access, and on-site guards." />
                <FeatureItem title="🏢 50,000+ Sq Ft" desc="Massive capacity to accommodate growth spurts." />
                <FeatureItem title="🚛 Easy Accessibility" desc="Multiple loading docks designed for heavy 18-wheelers." />
              </ul>
            </div>
            <div style={{ flex: '1 1 400px', height: '350px', backgroundColor: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow)' }}>
              {/* Placeholder for real warehouse map/image */}
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '48px' }}>🗺️</span>
                <p style={{ marginTop: '16px', fontWeight: 500 }}>Interactive Map / Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="section">
        <div className="container text-center">
          <h2 className="mb-8">What Our Partners Say</h2>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <TestimonialCard 
              quote="The flexibility they offer saved us during the Q4 holiday rush. We scaled our space up and down seamlessly."
              name="Sarah Jenkins"
              role="Operations Manager, TechStore"
            />
            <TestimonialCard 
              quote="Clean, secure, and incredibly professional. Their loading docks make our weekly shipments a breeze."
              name="David Chen"
              role="Founder, Apparel Brand X"
            />
          </div>
        </div>
      </section>

    </div>
  );
}

// Subcomponents for cleaner code
function ServiceCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div style={{ flex: '1 1 300px', padding: '32px', backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', textAlign: 'left' }}>
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>{icon}</div>
      <h3 className="mb-2" style={{ fontSize: '20px' }}>{title}</h3>
      <p className="text-muted">{desc}</p>
    </div>
  );
}

function FeatureItem({ title, desc }: { title: string, desc: string }) {
  return (
    <li style={{ display: 'flex', flexDirection: 'column' }}>
      <strong style={{ color: 'var(--primary)', fontSize: '18px' }}>{title}</strong>
      <span className="text-muted">{desc}</span>
    </li>
  );
}

function TestimonialCard({ quote, name, role }: { quote: string, name: string, role: string }) {
  return (
    <div style={{ flex: '1 1 400px', padding: '32px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'left' }}>
      <div style={{ color: '#fbbf24', fontSize: '20px', marginBottom: '16px' }}>★★★★★</div>
      <p style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '24px', color: 'var(--primary)' }}>"{quote}"</p>
      <div>
        <strong>{name}</strong>
        <div className="text-muted" style={{ fontSize: '14px' }}>{role}</div>
      </div>
    </div>
  );
}
