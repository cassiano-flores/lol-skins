import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [allImages, setAllImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const allImagesFromStorage = localStorage.getItem("allImages");
    const selectedImagesFromStorage = localStorage.getItem("selectedImages");

    if (allImagesFromStorage) {
      setAllImages(JSON.parse(allImagesFromStorage));
    }

    if (selectedImagesFromStorage) {
      setSelectedImages(JSON.parse(selectedImagesFromStorage));
    }

    async function fetchData() {
      const response = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json"
      );
      const data = await response.json();
      if (!allImagesFromStorage) {
        setAllImages(
          Object.values(data.data)
            .map((champion) => {
              return {
                id: champion.id,
                name: champion.name,
                image: `https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${champion.id}.png`,
              };
            })
            .sort((a, b) => (a.name > b.name ? 1 : -1))
        );
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("allImages", JSON.stringify(allImages));
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
  }, [allImages, selectedImages]);

  const handleClick = (image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((i) => i !== image));
      setAllImages(
        [...allImages, image].sort((a, b) => (a.name > b.name ? 1 : -1))
      );
    } else {
      setSelectedImages(
        [...selectedImages, image].sort((a, b) => (a.name > b.name ? 1 : -1))
      );
      setAllImages(
        allImages
          .filter((i) => i !== image)
          .sort((a, b) => (a.name > b.name ? 1 : -1))
      );
    }
  };

  return (
    <div className="App">
      <h1 className="upper-images">Champions sem Skin</h1>
      <div className="images">
        {allImages.map((image) => (
          <div key={image.id} onClick={() => handleClick(image)}>
            <img className="image" src={image.image} alt={image.name} />
            {/* <div className="image-text">{image.name}</div> */}
          </div>
        ))}
      </div>
      <h1 className="lower-images">Champions com Skin</h1>
      <div className="images">
        {selectedImages.map((image) => (
          <div key={image.id} onClick={() => handleClick(image)}>
            <img className="image" src={image.image} alt={image.name} />
            {/* <div className="image-text">{image.name}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;