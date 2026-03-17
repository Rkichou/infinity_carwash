import React, { useState, useEffect } from 'react';
import { Car, Check, ArrowRight, Star, Instagram, Facebook, Bike } from 'lucide-react';
import axios from 'axios';
import './App.css';

const CARS_FORMULAS = {
  bronze: {
    name: "BRONZE",
    color: "#CD7F32",
    options: [
      {
        vehicle: "Citadine",
        price: "49€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (EN SURFACE)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES", "DÉPOUSSIÉRAge COMPLET HABITACLE", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES"]
      },
      {
        vehicle: "Compact",
        price: "59€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (EN SURFACE)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES", "DÉPOUSSIÉRAGE COMPLET HABITACLE", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES"]
      },
      {
        vehicle: "Berlin/SUV",
        price: "69€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (EN SURFACE)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES", "DÉPOUSSIÉRAGE COMPLET HABITACLE", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES"]
      },
      {
        vehicle: "4x4 / Monospace",
        price: "79€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (EN SURFACE)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES", "DÉPOUSSIÉRAGE COMPLET HABITACLE", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES"]
      }
    ]
  },
  gold: {
    name: "GOLD",
    color: "#FFD700",
    options: [
      {
        vehicle: "Citadine",
        price: "89€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (INTERIEUR ET EXTERIEUR)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "LAVAGE DES PASSAGES DE ROUES", "CIRE DE FINITION", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES/COFFRE", "DÉPOUSSIÉRAGE COMPLET HABITACLE & AÉRATION", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES", "SHAMPOUINAGE SIEGES ET TAPIS OU ENTRETIEN CUIR"]
      },
      {
        vehicle: "Compact",
        price: "99€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (INTERIEUR ET EXTERIEUR)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "LAVAGE DES PASSAGES DE ROUES", "CIRE DE FINITION", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES/COFFRE", "DÉPOUSSIÉRAGE COMPLET HABITACLE & AÉRATION", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES", "SHAMPOUINAGE SIEGES ET TAPIS OU ENTRETIEN CUIR"]
      },
      {
        vehicle: "Berlin/SUV",
        price: "109€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (INTERIEUR ET EXTERIEUR)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "LAVAGE DES PASSAGES DE ROUES", "CIRE DE FINITION", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES/COFFRE", "DÉPOUSSIÉRAGE COMPLET HABITACLE & AÉRATION", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES", "SHAMPOUINAGE SIEGES ET TAPIS OU ENTRETIEN CUIR"]
      },
      {
        vehicle: "4x4 / Monospace",
        price: "119€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (INTERIEUR ET EXTERIEUR)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "LAVAGE DES PASSAGES DE ROUES", "CIRE DE FINITION", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES/COFFRE", "DÉPOUSSIÉRAGE COMPLET HABITACLE & AÉRATION", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES", "SHAMPOUINAGE SIEGES ET TAPIS OU ENTRETIEN CUIR"]
      }
    ]
  },
  platinum: {
    name: "PLATINUM",
    color: "#E5E4E2",
    options: [
      {
        vehicle: "Citadine",
        price: "129€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (INTERIEUR ET EXTERIEUR)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "NETTOYAGE BAIE DE PARE BRISE", "LAVAGE DES PASSAGES DE ROUES", "LAVAGE TRAPPE A CARBURANT,CONTOUR DE COFFRE ET PORTES", "CIRE DE FINITION PREMIUM", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES/COFFRE", "DÉPOUSSIÉRAGE COMPLET HABITACLE & AÉRATION", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES", "SHAMPOUINAGE SIEGES ET TAPIS / MOQUETTES OU NETTOYAGE ENTRETIEN CUIR"]
      },
      {
        vehicle: "Compact",
        price: "139€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (INTERIEUR ET EXTERIEUR)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "NETTOYAGE BAIE DE PARE BRISE", "LAVAGE DES PASSAGES DE ROUES", "LAVAGE TRAPPE A CARBURANT,CONTOUR DE COFFRE ET PORTES", "CIRE DE FINITION PREMIUM", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES/COFFRE", "DÉPOUSSIÉRAGE COMPLET HABITACLE & AÉRATION", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES", "SHAMPOUINAGE SIEGES ET TAPIS / MOQUETTES OU NETTOYAGE ENTRETIEN CUIR"]
      },
      {
        vehicle: "Berlin/SUV",
        price: "149€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (INTERIEUR ET EXTERIEUR)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "NETTOYAGE BAIE DE PARE BRISE", "LAVAGE DES PASSAGES DE ROUES", "LAVAGE TRAPPE A CARBURANT,CONTOUR DE COFFRE ET PORTES", "CIRE DE FINITION PREMIUM", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES/COFFRE", "DÉPOUSSIÉRAGE COMPLET HABITACLE & AÉRATION", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES", "SHAMPOUINAGE SIEGES ET TAPIS / MOQUETTES OU NETTOYAGE ENTRETIEN CUIR"]
      },
      {
        vehicle: "4x4 / Monospace",
        price: "159€",
        exterior: ["PRELAVAGE MOUSSE ACTIVE", "LAVAGE MANUEL & HAUTE PRESSION", "NETTOYAGE DES JANTES (INTERIEUR ET EXTERIEUR)", "NETTOYAGE ET DEGRAISSAGE DES PNEUMATIQUES", "NETTOYAGE BAIE DE PARE BRISE", "LAVAGE DES PASSAGES DE ROUES", "LAVAGE TRAPPE A CARBURANT,CONTOUR DE COFFRE ET PORTES", "CIRE DE FINITION PREMIUM", "SÉCHAGE"],
        interior: ["ASPIRATION SIEGES /TAPIS / MOQUETTES/COFFRE", "DÉPOUSSIÉRAGE COMPLET HABITACLE & AÉRATION", "NETTOYAGE PLASTIQUES & VINYLES", "NETTOYAGE DES SURFACES VITREES", "SHAMPOUINAGE SIEGES ET TAPIS / MOQUETTES OU NETTOYAGE ENTRETIEN CUIR"]
      }
    ]
  }
};

const BIKES_FORMULAS = {
  scooter: {
    name: "SCOOTER",
    price: "35€",
    services: ["PRELAVAGE MOUSSE ACTIVE", "NETTOYAGE AU PINCEAU DES PLAQUITES,GRILLES,EMBLEMES...", "LAVAGE MANUEL AVEC UN SHAMPOING SPECIFIQUE", "NETTOYAGE DES JANTES", "SÉCHAGE MANUEL ET SOUFFLAGE AIR CHAUD PULSE", "NETTOYAGE DE LA BULLE"]
  },
  moto1: {
    name: "MOTO 1",
    price: "45€",
    services: ["PRELAVAGE MOUSSE ACTIVE", "NETTOYAGE AU PINCEAU DES PLAQUITES GRILLES,EMBLEMES...", "LAVAGE MANUEL AVEC UN SHAMPOING SPECIFIQUE", "NETTOYAGE DES JANTES", "SÉCHAGE MANUEL ET SOUFFLAGE AIR CHAUD PULSE", "NETTOYAGE DE LA BULLE"]
  },
  moto2: {
    name: "MOTO 2",
    price: "75€",
    services: ["PRELAVAGE MOUSSE ACTIVE", "NETTOYAGE AU PINCEAU DES PLAQUITES,GRILLES,EMBLEMES...", "LAVAGE MANUEL AVEC UN SHAMPOING SPECIFIQUE", "NETTOYAGE DES JANTES", "DÉCONTAMINATION DES JANTES", "DEGODRONNAGE", "DÉGRAISSAGE COMPLET DES PLASTIQUES", "SÉCHAGE MANUEL ET SOUFFLAGE AIR CHAUD PULSE", "NETTOYAGE DE LA BULLE"]
  }
};

function App() {
  const [view, setView] = useState<'client' | 'admin'>('client');
  const [vehicleType, setVehicleType] = useState<'cars' | 'bikes'>('cars');
  const [selectedFormula, setSelectedFormula] = useState<'bronze' | 'gold' | 'platinum'>('bronze');
  const [selectedBikeType, setSelectedBikeType] = useState<'scooter' | 'moto1' | 'moto2'>('scooter');
  const [currentOption, setCurrentOption] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', formula: 'Bronze Citadine', date: '', time: '' });
  const [reservations, setReservations] = useState<Array<{name: string; phone: string; formula: string; date: string; time: string}>>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (view === 'admin') {
      axios.get('http://localhost:5001/api/reservations').then(res => setReservations(res.data));
    }
  }, [view]);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/reservations', formData);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (err) { alert("Erreur serveur."); }
  };

  const currentFormula = vehicleType === 'cars' ? CARS_FORMULAS[selectedFormula] : null;

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
          {/* HERO SECTION */}
          <section className="hero container">
            <h1 className="hero-text">
              PRECISION<br />
              <span style={{color: 'var(--yellow)'}}>DETAILING</span><br />
              SYSTEM.
            </h1>
            <div className="hero-img-box">
              <img src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80" alt="Gallery" />
            </div>
            <div style={{position: 'absolute', bottom: '50px', left: '40px', display: 'flex', gap: '40px', alignItems: 'center'}}>
              <div style={{fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px'}}>01 / EST. 2026</div>
              <div style={{width: '100px', height: '1px', background: '#333'}}></div>
              <a href="#services" className="magnetic-btn">RÉSERVER <ArrowRight size={18} /></a>
            </div>
          </section>

          {/* GALLERY SECTION */}
          <section style={{padding: '150px 0', position: 'relative'}}>
            <div className="container">
              <div style={{marginBottom: '100px'}}>
                <span style={{color: 'var(--yellow)', fontWeight: '800', letterSpacing: '4px'}}>PORTFOLIO</span>
                <h2 style={{fontFamily: 'Bebas Neue', fontSize: '6rem', lineHeight: 1, marginBottom: '20px'}}>NOS RÉALISATIONS</h2>
                <p style={{color: '#666', fontSize: '1.1rem', maxWidth: '600px'}}>Découvrez nos derniers projets et la qualité de notre travail</p>
              </div>

              <div className="gallery-grid">
                {[
                  { src: '/gallery/403924050_3587710754833150_5900264034059047470_n.jpg', title: 'Detailing Premium' },
                  { src: '/gallery/403973534_1055402805789110_7233715674512643210_n.jpg', title: 'Finition Brillante' },
                  { src: '/gallery/403974184_862673138686066_3025127976942975769_n.jpg', title: 'Nettoyage Intérieur' },
                  { src: '/gallery/403974408_370509418872760_6173925844015582472_n.jpg', title: 'Cire Protection' },
                  { src: '/gallery/404009282_294461203563925_6457900525238846879_n.jpg', title: 'Jantes Brillantes' },
                  { src: '/gallery/404312393_1084507149246173_7625125058440905692_n.jpg', title: 'Résultat Final' },
                  { src: '/gallery/407462813_1181528016139196_3562692919351622280_n.jpg', title: 'Avant/Après' },
                  { src: '/gallery/625263281_1522449202190828_99402922404437828_n.jpg', title: 'Détail Professionnel' },
                  { src: '/gallery/394246266_4391153877776812_4198801479392743647_n.jpg', title: 'Soin Complet' },
                  { src: '/gallery/394534742_262979086237373_7662017294127398248_n.jpg', title: 'Excellence' },
                ].map((image, idx) => (
                  <div key={idx} className="gallery-item">
                    <img src={image.src} alt={image.title} />
                    <div className="gallery-overlay">
                      <span className="gallery-title">{image.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SERVICES SECTION */}
          <section id="services" style={{padding: '150px 0'}}>
            <div className="container">
              <div style={{marginBottom: '100px'}}>
                <span style={{color: 'var(--yellow)', fontWeight: '800', letterSpacing: '4px'}}>EXCELLENCE</span>
                <h2 style={{fontFamily: 'Bebas Neue', fontSize: '6rem', lineHeight: 1}}>NOS FORMULES</h2>
              </div>

              {/* CATEGORY TABS */}
              <div className="category-tabs">
                <button 
                  className={`tab ${vehicleType === 'cars' ? 'active' : ''}`}
                  onClick={() => {
                    setVehicleType('cars');
                    setSelectedFormula('bronze');
                    setCurrentOption(0);
                  }}
                >
                  <Car size={20} /> VOITURES
                </button>
                <button 
                  className={`tab ${vehicleType === 'bikes' ? 'active' : ''}`}
                  onClick={() => {
                    setVehicleType('bikes');
                    setSelectedBikeType('scooter');
                    setCurrentOption(0);
                  }}
                >
                  <Bike size={20} /> 2 ROUES
                </button>
              </div>

              {vehicleType === 'cars' ? (
                /* CARS SECTION - MODERN DESIGN */
                currentFormula ? (
                <>
                  {/* PREMIUM FORMULA TABS */}
                  <div className="premium-formula-tabs">
                    {(['bronze', 'gold', 'platinum'] as const).map((level) => (
                      <button
                        key={level}
                        className={`premium-tab ${selectedFormula === level ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedFormula(level);
                          setCurrentOption(0);
                        }}
                      >
                        <div className="tab-content">
                          <span className="tab-label">{CARS_FORMULAS[level].name}</span>
                          <div className="tab-indicator" style={{background: CARS_FORMULAS[level].color}}></div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* VEHICLE CARDS GRID */}
                  <div className="vehicles-grid-modern">
                    {currentFormula.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`vehicle-card ${currentOption === idx ? 'active' : ''}`}
                        onClick={() => setCurrentOption(idx)}
                      >
                        <div className="card-header">
                          <div className="vehicle-name">{option.vehicle}</div>
                          <div className="vehicle-badge">{idx + 1}</div>
                        </div>
                        
                        <div className="price-section">
                          <span className="price-label">À partir de</span>
                          <div className="price-display" style={{color: CARS_FORMULAS[selectedFormula].color}}>
                            {option.price}
                          </div>
                        </div>

                        <div className="quick-services">
                          <span className="services-count">
                            {option.exterior.length + option.interior.length} services
                          </span>
                        </div>

                        <button className="card-select-btn">
                          SÉLECTIONNER
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* SERVICES SHOWCASE */}
                  <div className="services-showcase">
                    <div className="showcase-header">
                      <h3 style={{fontFamily: 'Bebas Neue', fontSize: '3rem', marginBottom: '10px'}}>
                        {currentFormula.options[currentOption].vehicle}
                      </h3>
                      <div className="formula-badge" style={{background: CARS_FORMULAS[selectedFormula].color}}>
                        {currentFormula.name}
                      </div>
                    </div>

                    <div className="services-two-column">
                      {/* EXTERIOR */}
                      <div className="service-panel">
                        <div className="panel-header" style={{background: CARS_FORMULAS[selectedFormula].color}}>
                          <span className="panel-title">EXTÉRIEUR</span>
                        </div>
                        <ul className="service-list">
                          {currentFormula.options[currentOption].exterior.map((service, idx) => (
                            <li key={idx} className="service-item">
                              <Check size={16} style={{flexShrink: 0, color: CARS_FORMULAS[selectedFormula].color}} />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* INTERIOR */}
                      <div className="service-panel">
                        <div className="panel-header" style={{background: CARS_FORMULAS[selectedFormula].color}}>
                          <span className="panel-title">INTÉRIEUR</span>
                        </div>
                        <ul className="service-list">
                          {currentFormula.options[currentOption].interior.map((service, idx) => (
                            <li key={idx} className="service-item">
                              <Check size={16} style={{flexShrink: 0, color: CARS_FORMULAS[selectedFormula].color}} />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button 
                      className="cta-reserve-btn"
                      style={{background: CARS_FORMULAS[selectedFormula].color}}
                      onClick={() => {
                        setFormData({...formData, formula: `${currentFormula.name} ${currentFormula.options[currentOption].vehicle}`});
                        window.location.href = '#booking';
                      }}
                    >
                      RÉSERVER MAINTENANT - {currentFormula.options[currentOption].price}
                    </button>
                  </div>
                </>
                ) : null
              ) : (
                /* BIKES SECTION */
                <>
                  <div className="bikes-grid">
                    {(['scooter', 'moto1', 'moto2'] as const).map((bikeType) => {
                      const bike = BIKES_FORMULAS[bikeType];
                      const isActive = selectedBikeType === bikeType;
                      return (
                        <div
                          key={bikeType}
                          className={`bike-card ${isActive ? 'active' : ''}`}
                          onClick={() => setSelectedBikeType(bikeType)}
                          style={{
                            borderColor: isActive ? 'var(--yellow)' : 'rgba(255,255,255,0.1)',
                            boxShadow: isActive ? '0 0 40px rgba(255,222,0,0.3)' : 'none'
                          }}
                        >
                          <div style={{fontSize: '0.7rem', color: '#666', marginBottom: '15px', letterSpacing: '2px'}}>FORMULE</div>
                          <h3 style={{fontFamily: 'Bebas Neue', fontSize: '2.2rem', marginBottom: '20px'}}>{bike.name}</h3>
                          <div style={{fontSize: '3rem', fontWeight: '900', color: 'var(--yellow)', marginBottom: '40px'}}>
                            {bike.price}
                          </div>
                          <ul style={{listStyle: 'none', marginBottom: '40px'}}>
                            {bike.services.map((service, idx) => (
                              <li key={idx} style={{
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                fontSize: '0.85rem',
                                color: '#888',
                                lineHeight: 1.3
                              }}>
                                <Check size={16} color="var(--yellow)" style={{flexShrink: 0, marginTop: '2px'}} />
                                {service}
                              </li>
                            ))}
                          </ul>
                          <button 
                            className="magnetic-btn"
                            style={{width: '100%', justifyContent: 'center'}}
                            onClick={() => {
                              setFormData({...formData, formula: bike.name});
                              window.location.href = '#booking';
                            }}
                          >
                            RÉSERVER
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* BOOKING SECTION */}
          {/* BOOKING SECTION */}
          <section id="booking" className="container" style={{paddingBottom: '150px'}}>
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
                      <input type="text" value={formData.formula} readOnly style={{background: '#111', cursor: 'not-allowed'}} />
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
        /* ADMIN VIEW */
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
