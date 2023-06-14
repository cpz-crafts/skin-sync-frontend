/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DailyLink, ShelfLink, StatisticsLink } from '../styles/StyledLinks';
import './UserPage.css';
import dailyImage from '../images/dailyImage.png';
import shelfImage from '../images/shelfImage.png';
import statisticsImage from '../images/statisticsImage.png';

const UserPage = () => {
  const [uvIndex, setUvIndex] = useState(null);

  useEffect(() => {
    const fetchUVIndex = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/userPage', {
          headers: {
            Authorization: accessToken
          }
        });
        const { uvIndex } = response.data;
        setUvIndex(uvIndex);
      } catch (error) {
        console.log('Error fetching UV index:', error);
      }
    };

    fetchUVIndex();
  }, []);

  return (
    <div className="user-page">
      <div>
        <div>
          <h1>Welcome Back!</h1>
          {uvIndex !== null && (
            <p>
              The UV index is: {uvIndex}
              <h2>Remember to wear sunscreen!</h2>
            </p>
          )}
        </div>

        <div>
          <div className="imagesandbuttons">
            <img src={dailyImage} alt="Daily Report" className="button-image1" />
            <DailyLink to="/DailyReport" className="route-button">
              Log day
            </DailyLink>
          </div>

          <div className="imagesandbuttons">
            <img src={shelfImage} alt="Product Shelf" className="button-image2" />
            <ShelfLink to="/productShelf" className="route-button">
              Product shelf
            </ShelfLink>
          </div>

          <div className="imagesandbuttons">
            <img src={statisticsImage} alt="Statistics" className="button-image3" />
            <StatisticsLink to="/statisticsPage" className="route-button">
              Statistics
            </StatisticsLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
