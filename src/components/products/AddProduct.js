import React, { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../authCtx/auth-context';
import { imagedDb } from '../Firebase/Config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import CartContext from '../store/cart-context';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const firebaseURL = 'https://shoppy-8c801-default-rtdb.firebaseio.com';
    const authCtx = useContext(AuthContext);
    const cartctx = useContext(CartContext);
    const useremail = authCtx.email;

    const handleProductImageChange = (e) => {
        const file = e.target.files[0];

        if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            setErrorMessage('Invalid image format. Please select a valid image (PNG, JPEG, JPG).');
        } else {
            setErrorMessage('');
            setProductImage(file);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!productName || !productPrice || !productImage) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        try {
            const storageRef = ref(imagedDb, `productImages/${productImage.name}`);
            await uploadBytes(storageRef, productImage);

            const imageUrl = await getDownloadURL(storageRef);

            const userData = {
                productName: productName,
                productPrice: productPrice,
                productImage: imageUrl,
            };

            const res = await axios.post(
                `${firebaseURL}/products/${useremail}.json`,
                userData
            );

            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Something went wrong');
            }

            alert('Product added successfully');

        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
        setProductName('');
        setProductPrice('');
        setProductImage('');
        setErrorMessage('');
    };


    return (
        <div className="container text-light">
            <h2 className='text-center text-dark'>Add Products</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="productName"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="productPrice" className="form-label">Product Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="productPrice"
                        placeholder="Enter product price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="productImage" className="form-label">Product Image</label>
                    <input
                        type="file"
                        className="form-control"
                        id="productImage"
                        accept=".png, .jpg, .jpeg"
                        onChange={handleProductImageChange}
                    />
                    {errorMessage && <div className="text-danger">{errorMessage}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
