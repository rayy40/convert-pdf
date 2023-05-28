import React from "react";
import { Link } from "react-router-dom";

const Error = ({ route }) => {
  return (
    <div className="error-container">
      <div className="error-container--detail">
        <h3>Oops, something went wrong :(</h3>
        <Link reloadDocument to={`/${route}`} className="link">
          Try again...
        </Link>
      </div>
    </div>
  );
};

export default Error;
