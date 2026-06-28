import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiCheckCircle, FiMenu, FiSearch, FiShield } from 'react-icons/fi';
import nuVisionLogo from '../assets/nu-vision-logo.jpg';
import { TopographicArt } from '../components/TopographicArt';

const highlights = [
  {
    icon: FiBookOpen,
    title: 'Student records',
    text: 'Keep admissions, classes, results, and attendance in one organized portal.',
  },
  {
    icon: FiShield,
    title: 'Trusted access',
    text: 'Secure sign in for administrators, teachers, students, and families.',
  },
  {
    icon: FiCheckCircle,
    title: 'Clear operations',
    text: 'Track fees, timetable updates, reports, and daily school activity with confidence.',
  },
];

export function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <Link className="landing-brand" to="/">
          <span className="school-logo">
            <img src={nuVisionLogo} alt="Nu Vision High School logo" />
          </span>
          <span>
            <strong>Nu Vision High School</strong>
            <small>StudentHub</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          <Link className="landing-signin" to="/login">Sign In</Link>
          <button className="landing-menu-btn" aria-label="Open menu">
            <FiMenu aria-hidden="true" />
          </button>
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-topo-wrap" aria-hidden="true">
            <TopographicArt />
          </div>

          <div className="hero-inner">
            <div className="hero-left">
              <h1 className="hero-headline">Welcome.</h1>

              <div className="hero-search">
                <input type="text" placeholder="Search school portal..." aria-label="Search" />
                <button type="button" aria-label="Submit search">
                  <FiSearch aria-hidden="true" />
                </button>
              </div>

              <div className="hero-cta-row">
                <Link className="btn-hero-primary" to="/login">
                  Free Trial
                </Link>
                <a className="btn-hero-outline" href="#about">
                  See more
                </a>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-right-icon">
                <img src={nuVisionLogo} alt="" aria-hidden="true" />
              </div>
              <h2 className="hero-right-heading">StudentHub.</h2>
              <p className="hero-right-text">
                A modern school portal for managing students, teachers, attendance, fees, results, and reports with clarity.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="landing-section">
          <div className="section-rule" />
          <p className="section-kicker">Inside StudentHub</p>
          <h2>Everything Nu Vision High School needs, arranged with clarity</h2>
          <div className="highlight-grid">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article className="highlight-card" key={item.title}>
                  <span className="highlight-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="contact" className="landing-contact">
          <div>
            <p className="section-kicker">Contact</p>
            <h2>Ready for the school day</h2>
            <p>Sign in to continue to the Nu Vision High School management dashboard.</p>
          </div>
          <Link className="btn-hero-primary" to="/login">
            Open Portal <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
    </div>
  );
}
