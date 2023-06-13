/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import confetti from 'canvas-confetti';
import { AddProductButton, DeleteProductButton } from '../styles/StyledButtons';
import { UsageLink } from '../styles/StyledLinks';
import cleanserImage from '../images/cleanser.png';
import moisturizerImage from '../images/moisturizer.png';
import serumImage from '../images/serum.png';
import sunscreenImage from '../images/sunscreen.png';
import otherImage from '../images/other.png';
import defaultImage from '../images/default.png';

const SingleProductWrapper = styled.div`
  display: flex;
  border: 1px solid black;
  `

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  cursor: pointer;
  `;

const handleConfetti = () => {
  confetti({
    particleCount: 180,
    spread: 90,
    startVelocity: 30,
    gravity: 0.4,
    scalar: 0.7,
    origin: { y: 0.5 },
    resize: true,
    ticks: 260,
    disableForReducedMotion: true // For users with motion sensitivity
  });
};

const MorningShelf = () => {
  const [morningName, setMorningName] = useState('');
  const [morningBrand, setMorningBrand] = useState('');
  const [morningProducts, setMorningProducts] = useState([]);
  const [morningEditing, setMorningEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [morningCategory, setMorningCategory] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const buttonRef = useRef(null);

  // Gets the categories for the dropdown menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8080/categories', {
          headers: {
            Authorization: accessToken
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCategories(data.categories);
        console.log(categories);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchCategories();
  }, []);

  // Extra safety for delete button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setClickCount(0);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [buttonRef]);

  const getMorningProducts = () => {
    const accessToken = localStorage.getItem('accessToken');
    fetch('http://localhost:8080/productShelf/morning', {
      headers: {
        Authorization: accessToken
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMorningProducts(data.response);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  useEffect(() => {
    getMorningProducts();
  }, []);

  // MORNING

  const handleSubmitMorningRoutine = (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    // eslint-disable-next-line no-unused-vars
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      },
      body: JSON.stringify({
        name: morningName,
        brand: morningBrand,
        category: morningCategory,
        routine: 'morning'
      })
    };

    let requestUrl = 'http://localhost:8080/productShelf';
    let requestMethod = 'POST';

    if (editingProductId) {
      requestUrl += `/${editingProductId}`;
      requestMethod = 'PUT';
    }

    fetch(requestUrl, { ...options, method: requestMethod })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Product submitted successfully');
          setMorningName('');
          setMorningBrand('');
          setMorningCategory('');
          // Reset the editing state
          setEditingProductId(null);
          setMorningEditing(false);
          getMorningProducts();
        } else {
          console.error('Failed to submit Skincare Product');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  // DELETE
  const handleDeleteProduct = (productId) => {
    if (clickCount === 0) {
      setClickCount(1);
    } else {
      const accessToken = localStorage.getItem('accessToken');
      fetch(`http://localhost:8080/productShelf/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: accessToken
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log('Product deleted successfully');
            getMorningProducts();
          } else {
            console.error('Failed to delete product');
          }
          setMorningName('');
          setMorningBrand('');
          setMorningCategory('');
          setClickCount(0);
          setMorningEditing(false);
        });
    }
  };

  // EDIT
  const handleMorningEdit = (productId) => {
    setMorningName('');
    setMorningBrand('');
    setMorningCategory('');

    if (editingProductId === productId) {
      setEditingProductId(null); // Hide the form if the same product image is clicked again
      setMorningEditing(false);
    } else {
      const product = morningProducts.find((prod) => prod._id === productId);
      if (product) {
        setMorningName(product.name);
        setMorningBrand(product.brand);
        setMorningCategory(product.category);
        setEditingProductId(productId);
        setMorningEditing(true); // Set morningEditing to true
      }
    }
  };

  // Uses the chosen category to display the correct image
  const getImagePath = (category) => {
    switch (category) {
      case 'cleanser':
        return cleanserImage;
      case 'moisturizer':
        return moisturizerImage;
      case 'serum':
        return serumImage;
      case 'sunscreen':
        return sunscreenImage;
      case 'other':
        return otherImage;
      default:
        return defaultImage;
    }
  };

  return (
    <div>
      <h1>Product Shelves</h1>
      <UsageLink to="/productShelf/logUsage">Log my products usage</UsageLink>
      <h2>Morning Shelf</h2>
      <SingleProductWrapper>
        {morningProducts.map((product) => (
          <div key={product._id}>
            <ProductImage
              src={getImagePath(product.category)}
              alt={product.category}
              onClick={() => handleMorningEdit(product._id)} />

            <h5> {product.name} </h5>
            <h6> {product.brand} </h6>

          </div>
        ))}
      </SingleProductWrapper>
      <form onSubmit={handleSubmitMorningRoutine}>
        <fieldset><legend>{morningEditing ? 'Edit' : 'Add to '} Morning shelf</legend>
          <div>
            <label htmlFor="morningName">Name:</label>
            <input
              type="text"
              placeholder="product name"
              id="morningName"
              value={morningName}
              onChange={(e) => setMorningName(e.target.value)}
              required />
          </div>
          <div>
            <label htmlFor="morningBrand">Brand:</label>
            <input
              type="text"
              placeholder="brand name"
              id="morningBrand"
              value={morningBrand}
              onChange={(e) => setMorningBrand(e.target.value)} />
          </div>
          <div>
            <label htmlFor="morningCategory">Category:</label>
            <select
              id="morningCategory"
              value={morningCategory}
              onChange={(e) => setMorningCategory(e.target.value)}
              required>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <AddProductButton
            type="submit"
            onClick={(event) => {
              if (morningName && morningCategory) {
                handleConfetti();
                handleSubmitMorningRoutine(event);
              }
            }}>
            {morningEditing ? 'Save change' : 'Put on shelf'}
          </AddProductButton>
          <DeleteProductButton
            type="button"
            onClick={() => handleDeleteProduct(editingProductId)}
            clicked={clickCount > 0}
            ref={buttonRef}
            isVisible={morningEditing}>
            {clickCount === 0 ? 'Delete' : 'Delete product?'}
          </DeleteProductButton>
        </fieldset>
      </form>
    </div>
  );
};

export default MorningShelf;