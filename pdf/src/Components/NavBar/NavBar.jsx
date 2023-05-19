import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FileContext } from "../../Helper/FileContext";
import { useLocation, Link } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const { metadata, uploadUrl } = useContext(FileContext);

  const convertSize = (size) => {
    if (size >= 1000000) {
      // Convert to megabytes
      return `${(size / 1000000).toFixed(2)} mB`;
    } else {
      // Convert to kilobytes
      return `${Math.round(size / 1000)} kB`;
    }
  };

  return (
    <div className="navbar-container__wrapper">
      <div className="navbar-container">
        <Link className="link" to={"/"}>
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
              <polygon
                fill="#FF46FB"
                points="19.922 19.922 29.883 19.922 29.883 29.883 19.922 29.883"
              ></polygon>
              <polygon
                fill="#CA41FC"
                points="9.961 19.922 19.922 19.922 19.922 29.883 9.961 29.883"
              ></polygon>
              <polygon
                fill="#8B48FE"
                points="0 19.922 9.961 19.922 9.961 29.883 0 29.883"
              ></polygon>
              <polygon
                fill="#81E650"
                points="19.922 9.961 29.883 9.961 29.883 19.922 19.922 19.922"
              ></polygon>
              <polygon
                fill="#00D267"
                points="9.961 9.961 19.922 9.961 19.922 19.922 9.961 19.922"
              ></polygon>
              <polygon
                fill="#00C0FF"
                points="0 9.961 9.961 9.961 9.961 19.922 0 19.922"
              ></polygon>
              <polygon
                fill="#FFD200"
                points="19.922 0 29.883 0 29.883 9.961 19.922 9.961"
              ></polygon>
              <polygon
                fill="#FF8E00"
                points="9.961 0 19.922 0 19.922 9.961 9.961 9.961"
              ></polygon>
              <polygon
                fill="#FF5400"
                points="0 0 9.961 0 9.961 9.961 0 9.961"
              ></polygon>
            </svg>
          </div>
        </Link>
        <div className="navbar-container__middle">
          {location.pathname === "/delete-pages/edit" && (
            <>
              <p>{metadata?.name.split("--")[0]}</p>
              <span>{convertSize(metadata?.size)}</span>
            </>
          )}
        </div>
        <div className="navbar-container__right">
          {location.pathname === "/delete-pages/edit" && (
            <a
              className="link"
              target="_blank"
              rel="noreferrer"
              href={uploadUrl}
              download
            >
              <button className="convert-btn">
                Download
                <FontAwesomeIcon className="icon" icon={faDownload} />
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
