import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setError("");
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8001/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="app" style={{ backgroundImage: "url('/image.jpg')" }}>
      <div className="container">
        {!selectedImage && !result ? (
          <div className="upload-area">
            <label className="upload-label">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <div>Drag and drop an image of a skin lesion to process</div>
              <div className="upload-icon">⬆</div>
            </label>
          </div>
        ) : null}

        {selectedImage && result && (
          <div className="result">
            <img src={selectedImage} alt="Selected" className="preview" />
            <div className="prediction">
              <h3>Label: {result.class}</h3>
              <h4>Confidence: {(result.confidence * 100).toFixed(2)}%</h4>
            </div>
            <button className="clear-button" onClick={clearSelection}>
              × CLEAR
            </button>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default App;
