import React, { useState, useEffect, useRef } from 'react';
import { Zap, ShieldCheck, Car, LayoutDashboard, ChevronRight, Check, ArrowRight, Star, Instagram, Facebook } from 'lucide-react';
import axios from 'axios';
import './App.css';

const FORMULAS = [
  { name: "Express", price: "25€", features: ["EXTÉRIEUR", "JANTES"], icon: <Zap size={40} /> },
  { name: "Premium", price: "50€", features: ["INTÉRIEUR", "VITRES"], icon: <ShieldCheck size={40} /> },
  { name: "Infinity Luxe", price: "90€", features: ["DETAILING", "CIRE"], icon: <Car size={40} /> }
];

function App() {
  const [view, setView] = useState<'client' | 'admin'>('client');
  const [formData, setFormData] = useState({ name: '', phone: '', formula: 'Express', date: '', time: '' });
  const [reservations, setReservations] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const cardsRef = useRef([]);

  // Effet de suivi de souris pour les cartes (Spotlight effect)
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    }
  };

  useEffect(() => {
    if (view === 'admin') {
      axios.get('http://localhost:5001/api/reservations').then(res => setReservations(res.data));
    }
  }, [view]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/reservations', formData);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (err) { alert("Erreur serveur."); }
  };

  return (
    <div className="App">
      <nav>
        <div className="logo" onClick={() => setView('client')}>
          <img src="/assets/logo.jpg" alt="Logo" style={{height: '35px', borderRadius: '50%'}} />
          <span style={{fontFamily: 'Bebas Neue', fontSize: '1.2rem', marginLeft: '10px', color: '#fff'}}>INFINITY</span>
        </div>
        <div className="nav-links">
          {view === 'client' ? (
            <>
              <a href="#services">Services</a>
              <a href="#booking">Réserver</a>
              <button onClick={() => setView('admin')} style={{background: 'none', border: '1px solid #333', color: '#fff', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.6rem'}}>ADMIN</button>
            </>
          ) : (
            <a onClick={() => setView('client')} style={{cursor: 'pointer'}}>RETOUR</a>
          )}
        </div>
      </nav>

      {view === 'client' ? (
        <main>
          {/* SECTION HERO KINETIC */}
          <section className="hero container">
            <h1 className="hero-text">
              PRECISION<br />
              <span style={{color: 'var(--yellow)'}}>DETAILING</span><br />
              SYSTEM.
            </h1>
            <div className="hero-img-box">
              <img src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80" alt="Car" />
            </div>
            <div style={{position: 'absolute', bottom: '50px', left: '40px', display: 'flex', gap: '40px', alignItems: 'center'}}>
              <div style={{fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px'}}>01 / EST. 2026</div>
              <div style={{width: '100px', height: '1px', background: '#333'}}></div>
              <a href="#booking" className="magnetic-btn">RÉSERVER <ArrowRight size={18} /></a>
            </div>
          </section>

          {/* SECTION SERVICES INTERACTIVE */}
          <section id="services" style={{padding: '150px 0'}}>
            <div className="container">
              <div style={{marginBottom: '100px'}}>
                <span style={{color: 'var(--yellow)', fontWeight: '800', letterSpacing: '4px'}}>EXCELLENCE</span>
                <h2 style={{fontFamily: 'Bebas Neue', fontSize: '6rem', lineHeight: 1}}>NOS FORMULES</h2>
              </div>

              <div className="services-grid">
                {FORMULAS.map((f, i) => (
                  <div 
                    key={i} 
                    className="card" 
                    ref={el => cardsRef.current[i] = el}
                    onMouseMove={(e) => handleMouseMove(e, i)}
                  >
                    <div style={{color: 'var(--yellow)', marginBottom: '30px'}}>{f.icon}</div>
                    <h3>{f.name}</h3>
                    <div className="price">{f.price}</div>
                    <ul style={{listStyle: 'none', marginBottom: '40px', color: '#666'}}>
                      {f.features.map((feat, j) => (
                        <li key={j} style={{marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px'}}><Check size={14} color="var(--yellow)" /> {feat}</li>
                      ))}
                    </ul>
                    <button className="magnetic-btn" style={{width: '100%', justifyContent: 'center'}} onClick={() => {
                      setFormData({...formData, formula: f.name});
                      window.location.href = '#booking';
                    }}>CHOISIR</button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION BOOKING PREMIUM */}
          <section id="booking" className="container">
            <div className="booking-container">
              <div>
                <h2 style={{fontFamily: 'Bebas Neue', fontSize: '5rem', marginBottom: '30px'}}>PRÊT POUR LE<br /><span style={{color: 'var(--yellow)'}}>SHOWROOM ?</span></h2>
                <p style={{color: '#666', maxWidth: '400px', marginBottom: '40px'}}>Votre véhicule mérite le meilleur traitement. Remplissez les détails et nous nous occupons du reste.</p>
                <div style={{display: 'flex', gap: '20px'}}>
                  <Instagram size={20} color="#333" />
                  <Facebook size={20} color="#333" />
                </div>
              </div>

              <div>
                {bookingSuccess ? (
                  <div style={{background: 'var(--yellow)', color: '#000', padding: '60px', borderRadius: '30px', textAlign: 'center'}}>
                    <Star size={60} fill="#000" style={{marginBottom: '20px'}} />
                    <h3 style={{fontFamily: 'Bebas Neue', fontSize: '3rem'}}>CONFIRMÉ !</h3>
                    <p>On se voit bientôt.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking}>
                    <div className="input-group">
                      <label>CLIENT</label>
                      <input type="text" placeholder="NOM COMPLET" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>CONTACT</label>
                      <input type="tel" placeholder="TÉLÉPHONE" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>SERVICE</label>
                      <select value={formData.formula} onChange={e => setFormData({...formData, formula: e.target.value})}>
                        {FORMULAS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                      </select>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
                      <div className="input-group">
                        <label>DATE</label>
                        <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                      </div>
                      <div className="input-group">
                        <label>HEURE</label>
                        <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                      </div>
                    </div>
                    <button type="submit" className="magnetic-btn" style={{width: '100%', justifyContent: 'center', height: '80px', fontSize: '1.2rem'}}>CONFIRMER LA SESSION</button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* ADMIN VIEW KINETIC */
        <div className="container" style={{paddingTop: '150px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px'}}>
            <h2 style={{fontFamily: 'Bebas Neue', fontSize: '5rem'}}>PLANNING</h2>
            <div style={{textAlign: 'right'}}>
              <span style={{fontSize: '3rem', fontWeight: '900'}}>{reservations.length}</span><br />
              <span style={{fontSize: '0.7rem', color: 'var(--yellow)', letterSpacing: '2px'}}>RESERVATIONS TOTALES</span>
            </div>
          </div>

          <div style={{background: 'var(--card-bg)', borderRadius: '30px', border: '1px solid var(--border)', overflow: 'hidden'}}>
            {reservations.map((res, i) => (
              <div key={i} style={{padding: '30px 40px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center', transition: '0.3s'}} onMouseEnter={(e) => e.currentTarget.style.background = '#111'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <div>
                  <div style={{fontWeight: '800', fontSize: '1.1rem'}}>{res.name}</div>
                  <div style={{color: '#555', fontSize: '0.8rem'}}>{res.phone}</div>
                </div>
                <div style={{color: 'var(--yellow)', fontWeight: '900'}}>{res.formula.toUpperCase()}</div>
                <div>{res.date}</div>
                <div style={{textAlign: 'right'}}>{res.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer style={{padding: '100px 0', borderTop: '1px solid var(--border)', marginTop: '150px', textAlign: 'center'}}>
        <div style={{fontFamily: 'Bebas Neue', fontSize: '4rem', opacity: 0.05}}>INFINITY CAR WASH</div>
        <p style={{fontSize: '0.6rem', letterSpacing: '5px', color: '#333'}}>HIGH END DETAILING / TOKYO / PARIS / LONDON</p>
      </footer>
    </div>
  );
}

export default App;
