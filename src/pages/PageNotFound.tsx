import React from "react";
import { Link } from "react-router-dom";

const PageNotFound: React.FC = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>sorry! your page is not Found😒</h2>
      <Link to="/dashboard">Go to Home</Link>
    </div>
  );
};

export default PageNotFound;
