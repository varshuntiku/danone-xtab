import React, { useEffect } from 'react';
import './App.css';

function App() {

  // Function to open the comments drawer manually
  const openCommentsDrawer = () => {
    if (window.renderCommentsDrawer) {
      window.renderCommentsDrawer();
    } else {
      console.error("window.renderCommentsDrawer is not defined");
    }
  };

  // Function to get query parameters from the URL
  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('filters'); // returns the value of 'filters' query parameter, if any
  };

  useEffect(() => {
    const filterId = getQueryParams();

    if (filterId && window?.renderCommentsDrawer) {
      console.log("rendering from app", filterId)
      window.renderCommentsDrawer({ filter_id: filterId });
    }
    else{
      console.error("error loading script")
    }
  }, []);

  return (
    <div>
      <h3>Comments Decoupling</h3>
      {/* Button to manually open the comments drawer */}
      <button onClick={openCommentsDrawer}>
        Comments
      </button>
    </div>
  );
}

export default App;