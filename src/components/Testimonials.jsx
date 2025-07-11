import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
 
const testimonials = [
  {
    id: 1,
    name: 'Ananya R.',
    feedback: 'Fast delivery and delicious food! Highly recommend FoodExpress.',
avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 2,
    name: 'Rahul K.',
    feedback: 'The restaurant choices are amazing, and the app is super easy to use.',
avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 3,
    name: 'Meera S.',
    feedback: 'Great customer support and smooth payment experience.',
avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
];
 
const Testimonials = () => {
  return (
    <Container id="testimonials" className="my-5">
      <h2 className="text-center mb-4" data-aos="fade-up">What Our Customers Say</h2>
      <Row className="g-4">
        {testimonials.map(({ id, name, feedback, avatar }) => (
          <Col md={4} key={id} data-aos="fade-up">
            <Card className="h-100 shadow">
              <Card.Body className="text-center">
                <img
                  src={avatar}
                  alt={name}
                  className="rounded-circle mb-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <Card.Text>"{feedback}"</Card.Text>
                <Card.Subtitle className="mt-3 text-muted">{name}</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
 
export default Testimonials;