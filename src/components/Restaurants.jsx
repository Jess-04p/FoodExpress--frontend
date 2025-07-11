import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const restaurantData = [
  {
    id: 1,
    name: 'Spicy Biryani House',
    image: 'https://images.unsplash.com/photo-1605477332045-d31cb1632747?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Indian, Biryani',
  },
  {
    id: 2,
    name: 'Pizza Paradise',
    image: 'https://images.unsplash.com/photo-1601924928587-4a3e7e3e6c1f?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Italian, Pizza',
  },
  {
    id: 3,
    name: 'Sushi World',
    image: 'https://images.unsplash.com/photo-1585238342028-3d1f9a5dcf39?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Japanese, Sushi',
  },
];

const Restaurants = () => {
  const navigate = useNavigate();

  return (
    <Container id="restaurants" className="my-5">
      <h2 className="text-center mb-4" data-aos="fade-up">Popular Restaurants</h2>
      <Row className="g-4">
        {restaurantData.map(restaurant => (
          <Col key={restaurant.id} md={4} data-aos="fade-up">
            <Card className="h-100 shadow">
              <Card.Img
                variant="top"
                src={restaurant.image}
                height="200px"
                style={{ objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{restaurant.name}</Card.Title>
                <Card.Text>{restaurant.cuisine}</Card.Text>
                <Button variant="primary" onClick={() => navigate(`/menu/${restaurant.id}`)}>
                  View Menu
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Restaurants;
