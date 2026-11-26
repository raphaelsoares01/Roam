"use client";

import { useEffect, useState } from "react";
import "./Hero.css";

const destinations = [
  {
    name: "Egypt",
    country: "Egypt",
    image: "/images/carousel-background-images/egypt-background.png",
    imageFit: "fit-height",
    showOverlayCopy: true,
    description: "Where ancient wonders meet endless horizons.",
    label: "The land of timeless wonders",
  },
  {
    name: "Chichén Itzá",
    country: "Mexico",
    image: "/images/carousel-background-images/chichen-itza-background.png",
    showOverlayCopy: false,
    description: "Step into the heart of the ancient Maya world.",
    label: "Discover the Mayan world",
  },
];

type HeroProps = {
  onExplore: () => void;
};

export default function Hero({ onExplore }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDestination = destinations[activeIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % destinations.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, []);

  const showDestination = (index: number) => {
    setActiveIndex((index + destinations.length) % destinations.length);
  };

  return (
    <main className="hero">
      {destinations.map((destination, index) => (
        <div
          key={destination.name}
          className={`background ${index === activeIndex ? "background-active" : ""}`}
          aria-hidden="true"
        >
          {destination.imageFit === "fit-height" && (
            <div
              className="background-fill"
              style={{ backgroundImage: `url("${destination.image}")` }}
            />
          )}
          <div
            className={`background-image ${
              destination.imageFit === "fit-height" ? "background-image-fit-height" : ""
            }`}
            style={{ backgroundImage: `url("${destination.image}")` }}
          />
        </div>
      ))}
      <div className="shade" aria-hidden="true" />

      <header className="hero-header">
        <a className="hero-logo" href="#" aria-label="Roam home">
          <span className="hero-logo-mark" aria-hidden="true">✦</span>
          roam
        </a>

        <nav className="hero-navigation" aria-label="Main navigation">
          <button type="button">Stays</button>
          <button type="button">Experiences</button>
          <button type="button">Blog</button>
          <button type="button">About</button>
          <button type="button">Become a host</button>
        </nav>

        <div className="hero-account-actions">
          <button className="hero-login-button" type="button">Log in</button>
          <button className="hero-signup-button" type="button">Sign up</button>
        </div>
      </header>

      <section className="hero-content" aria-live="polite">
        <h1 className="visually-hidden">{activeDestination.country}</h1>
        {activeDestination.showOverlayCopy && (
          <>
            <p className="hero-eyebrow">{activeDestination.label}</p>
            <p className="hero-description">{activeDestination.description}</p>
          </>
        )}
      </section>

      <footer className="hero-footer">
        <div className="hero-stats" aria-label="Roam community">
          <div className="hero-stat">
            <strong>20K+</strong>
            <span>Happy travelers</span>
          </div>
          <div className="hero-stat">
            <strong>2K+</strong>
            <span>Curated stays</span>
          </div>
          <div className="hero-stat">
            <strong>5K+</strong>
            <span>Unforgettable stays</span>
          </div>
        </div>

        <div className="hero-explore">
          <button className="hero-explore-button" type="button" onClick={onExplore}>
            Explore now <span aria-hidden="true">↗</span>
          </button>
          <p>Find your next story, one journey at a time.</p>
        </div>

        <div className="hero-carousel">
          <div
            className="hero-destination-card"
            style={{ backgroundImage: `url("${activeDestination.image}")` }}
          >
            <span>{activeDestination.name}</span>
            <span>{String(activeIndex + 1).padStart(2, "0")} / {String(destinations.length).padStart(2, "0")}</span>
          </div>
          <div className="hero-carousel-controls" aria-label="Choose a destination">
            {destinations.map((destination, index) => (
              <button
                key={destination.name}
                className={`hero-carousel-dot ${
                  index === activeIndex ? "hero-carousel-dot-active" : ""
                }`}
                type="button"
                aria-label={`Show ${destination.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => showDestination(index)}
              />
            ))}
            <button
              className="hero-arrow-button"
              type="button"
              aria-label="Next destination"
              onClick={() => showDestination(activeIndex + 1)}
            >
              →
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
