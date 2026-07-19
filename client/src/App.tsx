import React, { useState, useEffect } from 'react';
import { CalendarDays, Car, Check, ArrowRight, Star, Instagram, Facebook, Bike, Clock } from 'lucide-react';
import { createReservation, getReservations, getReservationsByDate, type Reservation, type ReservationFormData } from './services/reservations';
import './App.css';

const OPENING_SLOTS = Array.from({ length: 9 }, (_, index) => `${String(index + 10).padStart(2, '0')}:00`);
const CALENDAR_DAYS_TO_SHOW = 14;

function getDateValue(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDate(dateValue: string, options: Intl.DateTimeFormatOptions) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString('fr-FR', options);
}

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
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    email: '',
    phone: '',
    formula: 'Bronze Citadine',
    vehicle: 'Citadine',
    price: '49€',
    date: '',
    time: '',
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Erreur inconnue.';
  };

  useEffect(() => {
    if (view === 'admin') {
      getReservations()
        .then(setReservations)
        .catch((error) => {
          console.error('Erreur lecture Firebase:', error);
          alert(`Impossible de charger les réservations Firebase: ${getErrorMessage(error)}`);
        });
    }
  }, [view]);

  useEffect(() => {
    if (!formData.date) {
      setBookedTimes([]);
      setFormData((currentFormData) => ({ ...currentFormData, time: '' }));
      return;
    }

    setIsLoadingSlots(true);
    getReservationsByDate(formData.date)
      .then((dateReservations) => {
        const reservedTimes = dateReservations.map((reservation) => reservation.time);
        setBookedTimes(reservedTimes);

        setFormData((currentFormData) => (
          reservedTimes.includes(currentFormData.time)
            ? { ...currentFormData, time: '' }
            : currentFormData
        ));
      })
      .catch((error) => {
        console.error('Erreur chargement créneaux Firebase:', error);
        alert(`Impossible de charger les créneaux: ${getErrorMessage(error)}`);
      })
      .finally(() => setIsLoadingSlots(false));
  }, [formData.date]);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      alert('Choisis une date et un créneau disponible.');
      return;
    }

    try {
      await createReservation(formData);
      setBookingSuccess(true);
      setBookedTimes((currentBookedTimes) => [...currentBookedTimes, formData.time]);
      setFormData({
        name: '',
        email: '',
        phone: '',
        formula: formData.formula,
        vehicle: formData.vehicle,
        price: formData.price,
        date: '',
        time: '',
      });
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (err) {
      console.error('Erreur création réservation Firebase:', err);
      alert(`Erreur Firebase: ${getErrorMessage(err)}`);
    }
  };

  const currentFormula = vehicleType === 'cars' ? CARS_FORMULAS[selectedFormula] : null;
  const availableSlots = OPENING_SLOTS.filter((slot) => !bookedTimes.includes(slot));
  const calendarDays = Array.from({ length: CALENDAR_DAYS_TO_SHOW }, (_, index) => {
    const dateValue = getDateValue(index);

    return {
      dateValue,
      dayName: formatDate(dateValue, { weekday: 'short' }),
      dayNumber: formatDate(dateValue, { day: '2-digit' }),
      monthName: formatDate(dateValue, { month: 'short' }),
    };
  });
  const selectedDateLabel = formData.date
    ? formatDate(formData.date, { weekday: 'long', day: '2-digit', month: 'long' })
    : '';

  return (
    <div className="App">
      <nav>
        <div className="logo" onClick={() => setView('client')}>
          <img src="/assets/logo.jpg" alt="Logo" style={{height: '35px', borderRadius: '50%'}} />
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
              <img src="/assets/icw.png" alt="Gallery" />
            </div>
            <div style={{position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '28px', alignItems: 'center'}}>
              <div style={{fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px'}}>Depuis 2023</div>
              <div style={{width: '100px', height: '1px', background: '#333'}}></div>
              <a href="#services" className="magnetic-btn">RÉSERVER <ArrowRight size={18} /></a>
            </div>
          </section>

          {/* GALLERY SECTION */}
          <section style={{padding: '150px 0', position: 'relative'}}>
            <div className="container">
              <div style={{marginBottom: '100px'}}>
                <span style={{color: 'var(--yellow)', fontWeight: '800', letterSpacing: '4px'}}>PORTFOLIO</span>
                <h2 className='titre'>NOS RÉALISATIONS</h2>
                <p style={{color: '#666', fontSize: '1.1rem', maxWidth: '600px'}}>Découvrez nos derniers projets et la qualité de notre travail</p>
              </div>

              <div className="gallery-grid">
                {[
                  { src: '/gallery/625263281_1522449202190828_99402922404437828_n.jpg', title: 'Cire Protection' },
                  { src: '/gallery/moto.png', title: 'lavage 2 roues' },
                  { src: '/gallery/finition.png', title: 'Resultat final' },
                  { src: '/gallery/jante.png', title: 'Jantes Brillantes' },
                  { src: '/gallery/407462813_1181528016139196_3562692919351622280_n.jpg', title: 'Finition Brillante' },
                  { src: '/gallery/403924050_3587710754833150_5900264034059047470_n.jpg', title: 'Resultat final' },
                  { src: '/gallery/siege.png', title: 'Détail Professionnel' },
                  { src: '/gallery/interieur.png', title: 'lavage interieur' },

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
                <h2 className='titre'>NOS FORMULES</h2>
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
                        const option = currentFormula.options[currentOption];
                        setFormData({
                          ...formData,
                          formula: `${currentFormula.name} ${option.vehicle}`,
                          vehicle: option.vehicle,
                          price: option.price,
                        });
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
                              setFormData({
                                ...formData,
                                formula: bike.name,
                                vehicle: bike.name,
                                price: bike.price,
                              });
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
              <div className="booking-copy">
                <h2>PRÊT POUR LE<br /><span>SHOWROOM ?</span></h2>
                <p>Votre véhicule mérite le meilleur traitement. Remplissez les détails et nous nous occupons du reste.</p>
                <div className="booking-socials">
                  <Instagram size={20} color="#333" />
                  <Facebook size={20} color="#333" />
                </div>
              </div>

              <div>
                {bookingSuccess ? (
                  <div className="booking-success">
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
                      <label>EMAIL</label>
                      <input type="email" placeholder="EMAIL" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>CONTACT</label>
                      <input type="tel" placeholder="TÉLÉPHONE" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>SERVICE</label>
                      <input type="text" value={formData.formula} readOnly style={{background: '#111', cursor: 'not-allowed'}} />
                    </div>
                    <div className="booking-calendar">
                      <div className="booking-calendar-header">
                        <div>
                          <span className="booking-kicker">Disponibilites</span>
                          <h3>Choisir un creneau</h3>
                        </div>
                        <div className="opening-hours">
                          <Clock size={16} />
                          10h - 19h
                        </div>
                      </div>

                      <div className="date-strip" aria-label="Choisir une date">
                        {calendarDays.map((day, index) => (
                          <button
                            key={day.dateValue}
                            type="button"
                            className={`date-card ${formData.date === day.dateValue ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, date: day.dateValue, time: ''})}
                          >
                            <span>{index === 0 ? "Aujourd'hui" : day.dayName}</span>
                            <strong>{day.dayNumber}</strong>
                            <small>{day.monthName}</small>
                          </button>
                        ))}
                      </div>

                      <div className="slots-panel">
                        <div className="slots-panel-title">
                          <CalendarDays size={18} />
                          <span>{selectedDateLabel || 'Selectionnez une date'}</span>
                        </div>

                        {isLoadingSlots ? (
                          <div className="slots-empty">Chargement des creneaux...</div>
                        ) : formData.date && availableSlots.length > 0 ? (
                          <div className="slot-grid">
                            {availableSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                className={`slot-card ${formData.time === slot ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, time: slot})}
                              >
                                <span>{slot}</span>
                                <small>{formatDate(formData.date, { day: '2-digit', month: 'short' })}</small>
                              </button>
                            ))}
                          </div>
                        ) : formData.date ? (
                          <div className="slots-empty">Cette date est complete.</div>
                        ) : (
                          <div className="slots-empty">Choisissez une date pour voir les creneaux libres.</div>
                        )}

                        {formData.date && formData.time ? (
                          <div className="selected-slot-summary">
                            <span>Votre rendez-vous</span>
                            <strong>{selectedDateLabel} a {formData.time}</strong>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <button type="submit" className="magnetic-btn booking-submit">CONFIRMER LA SESSION</button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* ADMIN VIEW */
        <div className="container admin-page">
          <div className="admin-header">
            <h2>PLANNING</h2>
            <div className="admin-count">
              <span>{reservations.length}</span><br />
              <small>RESERVATIONS TOTALES</small>
            </div>
          </div>

          <div className="admin-list">
            {reservations.map((res, i) => (
              <button key={res.id || i} type="button" className="admin-row" onClick={() => setSelectedReservation(res)}>
                <div className="admin-client">
                  <div>{res.name}</div>
                  <span>{res.date}</span>
                </div>
                <div className="admin-service">{res.formula.toUpperCase()}</div>
                <div className="admin-date">{res.phone}</div>
                <div className="admin-time">{res.time}</div>
              </button>
            ))}
          </div>

          {selectedReservation ? (
            <div className="reservation-modal-backdrop" onClick={() => setSelectedReservation(null)}>
              <div className="reservation-modal" role="dialog" aria-modal="true" aria-label="Details reservation" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="modal-close" onClick={() => setSelectedReservation(null)}>×</button>
                <span className="booking-kicker">Reservation</span>
                <h3>{selectedReservation.name}</h3>

                <div className="modal-detail-grid">
                  <div>
                    <span>Telephone</span>
                    <strong>{selectedReservation.phone}</strong>
                  </div>
                  <div>
                    <span>Email</span>
                    <strong>{selectedReservation.email}</strong>
                  </div>
                  <div>
                    <span>Service</span>
                    <strong>{selectedReservation.formula}</strong>
                  </div>
                  {selectedReservation.vehicle ? (
                    <div>
                      <span>Vehicule</span>
                      <strong>{selectedReservation.vehicle}</strong>
                    </div>
                  ) : null}
                  {selectedReservation.price ? (
                    <div>
                      <span>Prix</span>
                      <strong>{selectedReservation.price}</strong>
                    </div>
                  ) : null}
                  <div>
                    <span>Date</span>
                    <strong>{formatDate(selectedReservation.date, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</strong>
                  </div>
                  <div>
                    <span>Heure</span>
                    <strong>{selectedReservation.time}</strong>
                  </div>
                  <div>
                    <span>Statut</span>
                    <strong>{selectedReservation.status}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
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
