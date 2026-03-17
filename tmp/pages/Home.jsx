import React, { useState, useEffect } from "react";
import "../App.css";
import hero from "../assets/hero.png";
import deliveryImage from "../assets/delivery.png";
import tshirtExample from "../assets/example.png";
import { Link } from "react-router-dom";



export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [name, setName] = useState("");
    const [socials, setSocials] = useState("");
    const [contact, setContact] = useState("");
    const [submitStatus, setSubmitStatus] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [heroMessageIndex, setHeroMessageIndex] = useState(0);
    const [soldCount, setSoldCount] = useState(300);

    const heroMessages = [
        "Create T-shirt prints with AI.",
        "Share your link with followers.",
        "Earn money for every sale.",
    ];

    const renderOdometer = (value, prefix = "") => {
        const chars = value.toLocaleString("en-US").split("");

        return (
            <span className="odometer" aria-label={`${prefix}${value.toLocaleString("en-US")}`}>
                {prefix && <span className="odometer-prefix">{prefix}</span>}
                {chars.map((char, index) => {
                    if (char === ",") {
                        return (
                            <span key={`sep-${index}`} className="odometer-separator" aria-hidden="true">
                                ,
                            </span>
                        );
                    }

                    const digit = Number(char);
                    return (
                        <span
                            key={`digit-${index}-${digit}`}
                            className="odometer-digit"
                            style={{ "--digit": digit }}
                            aria-hidden="true"
                        >
                            <span className="odometer-strip">
                                {Array.from({ length: 10 }, (_, num) => (
                                    <span key={`num-${index}-${num}`}>{num}</span>
                                ))}
                            </span>
                        </span>
                    );
                })}
            </span>
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitStatus("");
        setSubmitSuccess(false);
        setIsSubmitting(true);

        try {
            const response = await fetch("https://api.kurage.dev/ai/partner/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    partner_name: name,
                    partner_info: socials,
                    partner_contact: contact,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(
                    `Server responded with ${response.status}${text ? `: ${text}` : ""}`
                );
            }

            setSubmitStatus("Nice! Your application is in — we’ll reach out soon.");
            setSubmitSuccess(true);
            setName("");
            setSocials("");
            setContact("");
        } catch (err) {
            setSubmitStatus(`Submission failed: ${err.message}`);
            setSubmitSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const featureCards = [
        {
            id: "feature-step-1",
            step: "Step 1",
            title: "Create your T-shirt design",
            description: "Use AI to make a print in minutes.",
        },
        {
            id: "feature-step-2",
            step: "Step 2",
            title: "Share your store link",
            description: "Post your link to followers on social media.",
        },
        {
            id: "feature-step-3",
            step: "Step 3",
            title: "Get paid every sale",
            description: "We print and ship. You earn money on each order.",
        },
    ];

    const showcaseItems = [
        {
            id: "showcase-1",
            title: "Neon Streetwear",
            description: "Bold neon prints that pop in any feed.",
            image: tshirtExample,
        },
        {
            id: "showcase-2",
            title: "Minimalist Classics",
            description: "Clean, modern designs that feel premium.",
            image: tshirtExample,
        },
        {
            id: "showcase-3",
            title: "Retro Vibes",
            description: "Throwback style with a modern twist.",
            image: tshirtExample,
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                root: null, // viewport
                rootMargin: "0px",
                threshold: 0.2, // Trigger when 20% of the element is visible
            }
        );

        const fadeElements = document.querySelectorAll(".fade-in");
        fadeElements.forEach((el) => observer.observe(el));

        return () => {
            fadeElements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setHeroMessageIndex((prev) => (prev + 1) % heroMessages.length);
        }, 2400);

        return () => clearInterval(messageInterval);
    }, [heroMessages.length]);

    useEffect(() => {
        let progress = 0;
        const targetGrowthPerSecond = 60 / 300;

        const soldInterval = setInterval(() => {
            const randomJitter = (Math.random() - 0.5) * 0.08;
            progress += Math.max(0.04, targetGrowthPerSecond + randomJitter);

            if (progress >= 1) {
                const increment = Math.floor(progress);
                progress -= increment;
                setSoldCount((prev) => prev + increment);
            }
        }, 1000);

        return () => clearInterval(soldInterval);
    }, []);

    const handleScroll = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setIsMenuOpen(false);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="app">
            <header className="header">
                <div className="header-inner">
                    <div className="logo" onClick={() => handleScroll("hero")}>
                        kurage<span className="logo-print">print</span>
                    </div>

                    <nav className="nav desktop-nav">
                        <button className="nav-link" onClick={() => handleScroll("features")}>Features</button>
                        <button className="nav-link" onClick={() => handleScroll("how")}>How it works</button>
                        <button className="nav-link" onClick={() => handleScroll("steps")}>Get started</button>
                        <Link className="nav-link" to="/partner-images">
                            My portal
                        </Link>
                    </nav>

                    <button
                        className="menu-toggle"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>

                    {isMenuOpen && (
                        <nav className="nav mobile-nav">
                            <button className="nav-link-mobile" onClick={() => handleScroll("features")}>
                                Features
                            </button>
                            <button className="nav-link-mobile" onClick={() => handleScroll("how") }>
                                How it works
                            </button>
                            <button className="nav-link-mobile" onClick={() => handleScroll("steps")}>
                                Get started
                            </button>

                            <Link
                                className="nav-link-mobile"
                                to="/partner-images"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                My portal
                            </Link>
                        </nav>
                    )}
                </div>
            </header>

            <main>
                <section id="hero" className="hero">
                    <div className="hero-inner">
                                <div className="text-side">
                            <h1>
                                Launch your custom T-shirt shop —
                                <span className="highlight"> start selling in minutes.</span>
                            </h1>

                            <p className="subtitle">
                                Use AI to build your print collection, share one easy link, and keep the profit while we handle printing, fulfillment, and payouts.
                            </p>

                            <div className="hero-rotating-wrap" aria-live="polite">
                                <span key={heroMessageIndex} className="hero-rotating-line">
                                    {heroMessages[heroMessageIndex]}
                                </span>
                            </div>

                            <div className="hero-stats" aria-live="polite">
                                <div className="hero-stat-card">
                                    <span className="hero-stat-label">T-shirts sold</span>
                                    <strong className="hero-stat-value">{renderOdometer(soldCount)}</strong>
                                </div>
                                <div className="hero-stat-card">
                                    <span className="hero-stat-label">Creator earnings</span>
                                    <strong className="hero-stat-value">{renderOdometer(soldCount * 2, "EUR ")}</strong>
                                </div>
                            </div>

                            <div className="hero-cta">
                                <button
                                    className="primary-btn"
                                    onClick={() => handleScroll("steps")}
                                >
                                    Start free
                                </button>

                                <Link className="secondary-btn" to="/partner-images">
                                    Go to dashboard
                                </Link>
                            </div>
                        </div>

                        <div className="hero-image-container">
                            <div className="hero-image-card" role="presentation">
                                <img
                                    src={hero}
                                    alt="Hero"
                                    className="hero-image hero-image--zoom"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="hero-badges">
                        <span className="badge">No setup fees</span>
                        <span className="badge">Real-time analytics</span>
                        <span className="badge">Worldwide fulfillment</span>
                    </div>

                </section>

                <div className="section-bg-wrapper">
                    <section id="features" className="section fade-in">
                        <h2 className="section-title">
                            Start in 3 simple steps
                        </h2>
                        <div className="feature-grid">
                            {featureCards.map((card) => (
                                <div key={card.id} className="feature-card shadow-3d-medium">
                                    <div>
                                        <span className="feature-step-label">{card.step}</span>
                                        <h3 className="feature-title">{card.title}</h3>
                                        <p className="feature-desc">{card.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="section-bg-wrapper">
                    <section id="showcase" className="section fade-in">
                        <h2 className="section-title">T-shirt examples</h2>
                        <p className="subtitle" style={{ marginBottom: "2rem" }}>
                            Inspiration from collections you can build with the dashboard.
                        </p>

                        <div className="showcase-grid">
                            {showcaseItems.map((item) => (
                                <div key={item.id} className="showcase-card shadow-3d-subtle">
                                    <div className="showcase-image">
                                        <img src={item.image} alt={item.title} />
                                    </div>
                                    <div className="showcase-body">
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                        <span className="tag">Designed for creators</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="section-bg-wrapper">
                    <section id="how" className="section fade-in">
                        <div className="how-wrapper">
                            <h2 className="section-title">
                                <span className="emphasis">How</span> it works
                            </h2>

                            <div className="how-steps-list">
                                <div className="how-step">
                                    <span className="step-number">1</span>
                                    <div className="step-content">
                                        <h3 className="step-header">Create your design</h3>
                                        <p className="how-text">
                                            Use AI or our editor to generate a print, pick colors, and build a collection in minutes.
                                        </p>
                                    </div>
                                </div>

                                <div className="how-step">
                                    <span className="step-number">2</span>
                                    <div className="step-content">
                                        <h3 className="step-header">Publish your store link</h3>
                                        <p className="how-text">
                                            One click publishes your shop. Share the link with followers on social media, email, or anywhere.
                                        </p>
                                    </div>
                                </div>

                                <div className="how-step last-step">
                                    <span className="step-number">3</span>
                                    <div className="step-content">
                                        <h3 className="step-header">
                                            We print, pack & ship worldwide
                                        </h3>
                                        <p className="how-text">
                                            Orders are fulfilled globally — we handle printing, shipping, and payouts so you earn every sale.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="delivery-banner shadow-3d-subtle">
                                <div className="delivery-banner-text">
                                    <span className="delivery-pill">Express Delivery</span>
                                    <h3 className="delivery-title">Fast shipping to every country</h3>
                                    <p className="delivery-copy">
                                        Your customers get worldwide express delivery with live tracking from checkout to doorstep.
                                    </p>
                                </div>
                                <div className="delivery-banner-image">
                                    <img src={deliveryImage} alt="Express delivery worldwide" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>


                <div className="section-bg-wrapper">
                    <section id="steps" className="section fade-in">
                        <div className="next-steps-inner">
                            <h2 className="section-title next-title">Get started in seconds</h2>

                            <p className="next-sub">
                                Tell us a little about yourself and we’ll create your dashboard.
                                Once you're approved, you can publish designs and start earning.
                            </p>

                            <form className="next-form" onSubmit={handleSubmit}>
                                <label htmlFor="name">
                                    Name
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </label>

                                <label htmlFor="socials">
                                    My Social Network Accounts
                                    <textarea
                                        id="socials"
                                        placeholder="Instagram, TikTok, YouTube links..."
                                        rows="3"
                                        value={socials}
                                        onChange={(e) => setSocials(e.target.value)}
                                        required
                                    />
                                </label>

                                <label htmlFor="contact">
                                    Contact Data
                                    <input
                                        id="contact"
                                        type="text"
                                        placeholder="email, WhatsApp..."
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        required
                                    />
                                </label>

                                <div
                                    className="next-form-actions"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.75rem",
                                        alignItems: "center",
                                    }}
                                >
                                    <button
                                        className="primary-btn next-btn shadow-3d"
                                        type="submit"
                                        disabled={
                                            isSubmitting ||
                                            !name.trim() ||
                                            !socials.trim() ||
                                            !contact.trim()
                                        }
                                    >
                                        {isSubmitting ? "Submitting…" : "Submit Your Application"}
                                    </button>

                                    <Link className="secondary-btn" to="/partner-images">
                                        I already have an account
                                    </Link>
                                </div>

                                {submitStatus && (
                                    <div
                                        className={`submit-status ${
                                            submitSuccess ? "submit-status--success" : "submit-status--error"
                                        }`}
                                        role="status"
                                        aria-live="polite"
                                    >
                                        <span className="submit-status__icon" aria-hidden="true">
                                            {submitSuccess ? "✓" : "⚠"}
                                        </span>
                                        <span className="submit-status__message">{submitStatus}</span>
                                    </div>
                                )}
                            </form>

                            <div className="next-extra">
                                <p>
                                    Alternatively: <a href="#sample">Create a sample T-shirt</a>{" "}
                                    or <a href="#test">See a test collection</a>.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="footer">
                <span>
                    © {new Date().getFullYear()} kurage print. All rights reserved.
                </span>
                <span>Earn with your creativity.</span>
            </footer>
        </div>
    );
}