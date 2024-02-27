import { Row, Container } from "react-bootstrap";
import ProductDisplay from "./ProductDisplay";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../authCtx/auth-context";
import CartContext from "../store/cart-context";

const PeoductList = () => {
    const [products, setProducts] = useState([]);

    const authCtx = useContext(AuthContext);
    const ctx=useContext(CartContext);
    const useremail = authCtx.email;
    const firebaseURL = 'https://shoppy-8c801-default-rtdb.firebaseio.com/';
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${firebaseURL}/products/${useremail}.json`);
                if (res.status === 200) {
                    const data = await res.data;

                    // Map each product along with its key
                    const productsArray = Object.entries(data).map(([key, product]) => ({
                        key: key,
                        ...product
                    }));

                    setProducts((prevProducts) => [...prevProducts, ...productsArray]);
                    ctx.addProduct(products);
                    
                } else {
                    console.error('Error fetching data:', res.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);


    const product = products.map((item) => item)
    

    return (

        <Container >
            <h1 className="text-center my-4">Music</h1>
            {products.length === 0 && <h2 className="text-dark text-center">Nothing here ...?    Add some products......</h2>}
            <Row className="d-flex justify-content-space-evenly align-items-center gy-5 ">
                {product.map((item, index) => (

                    <ProductDisplay
                        id={item.key}
                        key={index}
                        title={item.productName}
                        imageUrl={item.productImage}
                        price={item.productPrice}
                    />

                ))}
            </Row>
        </Container>

    );
}

export default PeoductList;