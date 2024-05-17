import React from "react";
import {
  faArrowRotateRight,
  faDownload,
  // faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import pdf from "../../assets/pdf-placeholder.png";
import jpg from "../../assets/jpg-placeholder.png";
import ppt from "../../assets/ppt-placeholder.png";
import zip from "../../assets/zip-placeholder.png";
import txt from "../../assets/txt-placeholder.png";
import docx from "../../assets/word-placeholder.png";
import protectPdf from "../../assets/protected-pdf-placeholder.png";
import Head from "../../components/Metadata/Head";

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
    else if (extension === "txt") return txt;
    else if (extension === "zip") return zip;
    else if (extension === "docx") return docx;
  };

  const decodeUrl = decodeURIComponent(location?.state?.url);
  const filename = decodeUrl.split("/").pop().split("?")[0];

  return (
    <div className="result-page-container__wrapper">
      <Head
        title={"Result"}
        description={"Get results of your converted or modified files"}
      />
      <div className="result-page-container">
        <div className="document-container">
          <Link
            target="_blank"
            to={location?.state?.url?.replace(/"/g, "")}
            rel="noopener noreferrer"
            download
            className="link"
          >
            <img
              src={renderImg(
                filename?.substring(filename?.lastIndexOf(".") + 1)
              )}
              alt="doc-img"
            />
          </Link>
        </div>
        <div className="details-container">
          <div className="filename">
            <h3>{filename?.substring(0, filename?.lastIndexOf("."))}</h3>
            <span>{filename?.substring(filename?.lastIndexOf("."))}</span>
          </div>

          <Link
            target="_blank"
            download
            rel="noopener noreferrer"
            className="link"
            to={location?.state?.url?.replace(/"/g, "")}
          >
            <button className="download-btn">
              <FontAwesomeIcon className="icon" icon={faDownload} />
              Download
            </button>
          </Link>
          <Link className="start-over-link" to={`/${location?.state?.route}`}>
            <FontAwesomeIcon className="icon" icon={faArrowRotateRight} /> Start
            Over
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
