import { useState, useContext} from "react";
import CartContext from "./cart-context";
import AuthContext from "../../authCtx/auth-context";
import axios from "axios";

const CartProvider = (props) => {
    const [items, updatedItems] = useState([]);
    const authCtx = useContext(AuthContext);
    const useremail = authCtx.email;
    
    const getItems = async ()=> {
        try {
            const removeAtSymbol = (email) => {
                return email.replace(/[@.]/g, ''); // Replace "@" with an empty string
            };
            // Process the email ID
            const processedEmail = removeAtSymbol(useremail);
    
            const response = await axios.get(`https://crudcrud.com/api/0c4f5d0eab7c47adaf3627c12ef80cfc/${processedEmail}`);
            // Handle success (e.g., update the cart state on the frontend)
            updatedItems(response.data);
            console.log(items);
        } catch (error) {
            // Handle errors
            console.error('Error retrieving cart items:', error);
        }
    }
    
    const addItemHandler = (item) => {
        const updatedItemsArray = [...items];
        // Check if an item with the same ID already exists
        const existingItemIndex = updatedItemsArray.findIndex((existingItem) => existingItem.id === item.id);

        if (existingItemIndex !== -1) {
            // If the item with the same ID exists, update its quantity
            updatedItemsArray[existingItemIndex].quantity += Number(item.quantity);
        } else {
            // If the item with the same ID doesn't exist, add it to the array
            updatedItemsArray.push(item);
        }
        // Update the state with the new items array
        updatedItems(updatedItemsArray);
        getItems();
    }

    const removeItemHandler = async (id) => {
        console.log(id);
        try {
            const removeAtSymbol = (email) => {
                return email.replace(/[@.]/g, ''); // Replace "@" with an empty string
            }

            const processedEmail = removeAtSymbol(useremail);

            await axios.delete(`https://crudcrud.com/api/0c4f5d0eab7c47adaf3627c12ef80cfc/${processedEmail}/${id}`);

            // Update the state by filtering out the deleted item
            const updatedItemsArray = items.filter((item) => item._id !== id);
            updatedItems(updatedItemsArray);
        } catch (error) {
            // Handle errors
            console.error("Error deleting cart item:", error);
        }
    };

    const cartContext = {
        items: items,
        addItem: addItemHandler,
        removeItem: removeItemHandler
    }
    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    );
}

export default CartProvider;