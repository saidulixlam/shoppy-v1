import React from 'react';
import { Card } from 'react-bootstrap';

const LazyLoadImage = ({ imageUrl }) => {
  return (
    <Card style={{ width: '16rem', border: 'none' }}>
      <Card.Img
        variant="top"
        src={imageUrl}
        style={{
          animation: 'enlargeAndMove 2s ease-in-out infinite alternate',
          transformOrigin: 'center',
        }}
        className="imageStyle"
      />
    </Card>
  );
};

export default LazyLoadImage;
