import { Button } from "react-bootstrap";
import React, { useContext } from "react";
import { Container, Table } from "react-bootstrap";
import CartContext from "../store/cart-context";
import { useHistory } from "react-router-dom";

const Cart = () => {
    const history=useHistory();
    const ctx=useContext(CartContext);
    const cartItems = ctx.items;

    let totAmount = 0;
    if(cartItems){
        cartItems.forEach((item) => {
            totAmount += item.quantity*item.price;
        })
    }
    function purchaseHandler() {
        ctx.removeAll();
        alert("Your order is placed!!! Your total is: $" + totAmount);
        history.push('./home');
        
    }

    return (
        <Container>
            <div className="d-flex justify-content-between">
                <Table hover>
                    <thead>
                        <tr>
                            <th>ITEM</th>
                            <th>PRICE</th>
                            <th>QUANTITY</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(cartItems) && cartItems.map((item,index) => (
                            <tr key={index}>
                                <td className="d-flex">
                                    <img src={item.imageUrl} alt="Albums" width="50" height="50" />
                                    {item.title}
                                </td>
                                <td>${item.price}</td>
                                <td>{item.quantity}</td> 
                                <td><button className="btn btn-danger" onClick={() => ctx.removeItem(item._id)}>REMOVE</button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </div>
            <div className="d-flex justify-content-between">
                <div>
                    <h3><strong>Total</strong></h3>
                </div>
                <div>
                    <h4><strong>${totAmount}</strong></h4>
                </div>
            </div>

            {/* Purchase Button */}
            <div className="text-center">
                <Button onClick={purchaseHandler} variant="primary">PURCHASE</Button>
            </div>
        </Container>
    );
};

export default Cart;
