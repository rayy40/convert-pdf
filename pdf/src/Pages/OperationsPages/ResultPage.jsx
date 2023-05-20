import {
  faArrowRotateRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileContext } from "../../Helper/FileContext";
import pdf from "../../Assets/pdf-placeholder.png";
import jpg from "../../Assets/jpg-placeholder.png";
import ppt from "../../Assets/ppt-placeholder.png";

const ResultPage = () => {
  const location = useLocation();
  const { metadata } = useContext(FileContext);

  console.log(location);
  console.log(metadata);

  const renderImg = (extension) => {
    if (extension === "pdf") return pdf;
    else if (extension === "pptx" || extension === "ppt") return ppt;
    else if (extension === "jpg") return jpg;
  };

  return (
    <div className="result-page-container__wrapper">
      <div className="result-page-container">
        <div className="document-container">
          <Link className="link" to={location?.state}>
            <img
              src={renderImg(
                metadata?.name
                  ?.split("--")[0]
                  .substr(metadata?.name?.split("--")[0].lastIndexOf(".") + 1)
              )}
              alt="doc-img"
            />
          </Link>
        </div>
        <div className="details-container">
          <h3>
            {metadata?.name
              ?.split("--")[0]
              .substr(0, metadata?.name?.split("--")[0].lastIndexOf("."))}
            <span>
              {metadata?.name
                ?.split("--")[0]
                .substr(metadata?.name?.split("--")[0].lastIndexOf("."))}
            </span>
          </h3>
          <Link className="link" to={location?.state}>
            <button className="download-btn">
              <FontAwesomeIcon className="icon" icon={faDownload} />
              Download
            </button>
          </Link>
          <Link className="start-over-link" to={"/"}>
            <FontAwesomeIcon className="icon" icon={faArrowRotateRight} /> Start
            Over
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;