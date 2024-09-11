
// src/components/ImageGrid.js
import {React, useState, useEffect} from 'react';
import './styles/NewspaperGrid.css';

const ImageGrid = () => {
    const [images, setImages] = useState([]);


    useEffect(() => {
        // Fetch image list from your backend (this should return a list of image filenames)
        fetch('/api/images')
          .then(response => response.json())
          .then(data => setImages(data))
          .catch(error => console.error('Error fetching images:', error));
      }, []);

  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-item">
          <img src={`http://localhost:5000/images/${image}`} alt={`Image ${index}`} />
          </div>
      ))}
    </div>
  );
};

export default ImageGrid;
