import { Card, Col, Button } from "react-bootstrap";
import './ProductDipaly.css'
import React, { lazy, Suspense } from 'react';
import { useContext } from "react";
import CartContext from "../store/cart-context";
import { Link } from "react-router-dom";

const LazyLoadedImage = lazy(() => import('./LazyLoadImage'));

const ProductDisplay = (props) => {
    const ctx = useContext(CartContext);

    const item = {
        id: props.id,
        title: props.title,
        imageUrl: props.imageUrl,
        price: props.price,
        quantity: Number(1)
    }

    function addToCartHandler(e) {
        e.preventDefault();
        ctx.addItem(item);
    }

    return (
        <Col style={{ display: 'flex', justifyContent: 'space-evenly' }} sm={6} md={6} lg={6} xl={6}>
            <Card style={{ width: '16rem', border: 'none' }}>
                <h3 className="text-center my-4">{props.title}</h3>
                <Link to={`/product/${props.title}`}>
                    <Suspense fallback={<div className="text-dark text-center">Loading...</div>}>
                        <LazyLoadedImage imageUrl={props.imageUrl} />
                    </Suspense>
                </Link>

                <Card.Body className="d-flex flex-column justify-content-center">
                    <Card.Text className="d-flex justify-content-between">
                        <span>${props.price}</span>
                        <Button variant="primary" onClick={addToCartHandler}>Add to cart</Button>

                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default ProductDisplay;
