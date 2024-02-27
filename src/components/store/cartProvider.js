import { useState, useEffect, useContext } from "react";
import CartContext from "./cart-context";
import AuthContext from "../../authCtx/auth-context";
import axios from "axios";

const CartProvider = (props) => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const authCtx = useContext(AuthContext);
  const useremail = authCtx.email;
  const isLoggedIn = authCtx.isLoggedIn;
  const firebaseURL = 'https://shoppy-8c801-default-rtdb.firebaseio.com/';

  const addProduct = () => {
    fetchProducts();
  };
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${firebaseURL}/products/${useremail}.json`);
      if (res.status === 200) {
        const data = await res.data;

        const productsArray = Object.entries(data).map(([key, product]) => ({
          key: key,
          ...product
        }));

        setProducts((prevProducts) => [...prevProducts, ...productsArray]);


      } else {
        console.error('Error fetching data:', res.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };


  const getItems = async () => {
    try {
      const response = await axios.get(
        `https://shoppy-8c801-default-rtdb.firebaseio.com/cart/${useremail}.json`
      );


      const itemsArray = Object.entries(response.data || {}).map(([key, value]) => {
        return { _id: key, ...value };
      });

      setItems(itemsArray);
    } catch (error) {
      console.error("Error retrieving cart items:", error);
    }
  };


  useEffect(() => {
    if (isLoggedIn) {
      getItems();

    } else {
      setItems([]);
    }
  }, []);

  const addItemHandler = async (item) => {

    const updatedItemsArray = [...items];

    const url = `https://shoppy-8c801-default-rtdb.firebaseio.com/cart/${useremail}.json`;

    const existingItemIndex = updatedItemsArray.findIndex(
      (existingItem) => existingItem.title === item.title
    );

    if (existingItemIndex !== -1) {
      updatedItemsArray[existingItemIndex].quantity += parseInt(item.quantity, 10);

      try {
        const itemIdToUpdate = updatedItemsArray[existingItemIndex]._id;
        const updatedItem = {
          title: item.title,
          imageUrl: item.imageUrl,
          price: item.price,
          quantity: updatedItemsArray[existingItemIndex].quantity,
        };

        await axios.put(`https://shoppy-8c801-default-rtdb.firebaseio.com/cart/${useremail}/${itemIdToUpdate}.json`, updatedItem);
        getItems();
      } catch (error) {
        console.error("Error updating item:", error);
      }
    } else {
      try {
        const res = await axios.post(url, item);
        getItems();
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
    setItems(updatedItemsArray);
  };

  const removeItemHandler = async (id) => {
    try {
      await axios.delete(
        `https://shoppy-8c801-default-rtdb.firebaseio.com/cart/${useremail}/${id}.json`
      );

      const updatedItems = Object.values(items);
      const updatedItemsArray = updatedItems.filter((item) => item._id !== id);
      setItems(updatedItemsArray);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const removeAll = async () => {
    try {
      await axios.delete(`https://shoppy-8c801-default-rtdb.firebaseio.com/cart/${useremail}.json`);
      setItems([]);
    } catch (error) {

      console.error("Error deleting all cart items:", error);
    }
  };

  const cartContext = {
    products: products,
    items: items,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    addProduct: addProduct,
    removeAll: removeAll
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
