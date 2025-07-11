import React from 'react';
import { Container, Button } from 'react-bootstrap';
import RotatingText from 'react-rotating-text';
import './Hero.css';
 
const Hero = ({ onSearch }) => {
  return (
    <section className="hero-section d-flex align-items-center">
      <div className="overlay"></div>
      <Container className="text-center text-white position-relative">
        <h1 className="hero-title mb-3">
          Delicious Food{' '}
          <span className="rotating-text">
            <RotatingText
              items={[
                'Delivered Fast',
                'At Your Doorstep',
                'From Top Restaurants',
              ]}
              pause={2000}
              typingInterval={100}
              deletingInterval={50}
            />
          </span>
        </h1>
 
        <Button href="#why-foodexpress" variant="outline-light" size="lg" className="mt-4">
          Explore
        </Button>
      </Container>
    </section>
  );
};
 
export default Hero;