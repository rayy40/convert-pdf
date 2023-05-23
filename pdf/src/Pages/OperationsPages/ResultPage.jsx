import {
  faArrowRotateRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import pdf from "../../Assets/pdf-placeholder.png";
import jpg from "../../Assets/jpg-placeholder.png";
import ppt from "../../Assets/ppt-placeholder.png";
import protectPdf from "../../Assets/protected-pdf-placeholder.png";

const ResultPage = () => {
  const location = useLocation();

  const renderImg = (extension) => {
    if (extension === "pdf") {
      if (decodeUrl.split("/")[7] === "protect-pdf") {
        return protectPdf;
      }
      return pdf;
    } else if (extension === "pptx" || extension === "ppt") return ppt;
    else if (extension === "jpg") return jpg;
  };

  const decodeUrl = decodeURIComponent(location.state);
  const filename = decodeUrl.split("/").pop().split("?")[0];

  return (
    <div className="result-page-container__wrapper">
      <div className="result-page-container">
        <div className="document-container">
          <Link to={location?.state} target="_blank" download className="link">
            <img
              src={renderImg(
                filename?.substring(filename.lastIndexOf(".") + 1)
              )}
              alt="doc-img"
            />
          </Link>
        </div>
        <div className="details-container">
          <div className="filename">
            <h3>{filename?.substring(0, filename.lastIndexOf("."))}</h3>
            <span>{filename?.substring(filename.lastIndexOf("."))}</span>
          </div>

          <Link download target="_blank" className="link" to={location?.state}>
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
