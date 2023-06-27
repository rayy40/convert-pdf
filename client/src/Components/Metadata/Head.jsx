import React from "react";
import { Helmet } from "react-helmet";

const Head = ({ title, description }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <title>{title}</title>
    </Helmet>
  );
};

export default Head;
