import React, { useContext, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronUp,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import useUploadFiles from "../../Helper/useUploadFiles";
import Converting from "../../Layouts/Converting";
import { FileContext } from "../../Helper/FileContext";
import Error from "../Error/Error";
import useModifiyFiles from "../../Helper/useModifyFiles";

const FileUploadBox = ({ route, image, bgColor, file }) => {
  let fileInputRef = useRef(null);
  const { user, metadata, showInput, isError, isConverting, setIsModalOpen } =
    useContext(FileContext);
  const { modifyFiles } = useModifiyFiles();
  const { progress, uploadFiles, isUploading } = useUploadFiles();
  const [password, setPassword] = useState("");
  const [confirmPassword, setComfirmPassword] = useState("");

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!user) return setIsModalOpen((v) => !v);
    const files = fileInputRef.current.files;
    if (files.length === 0) return;
    uploadFiles(route, Array.from(files), user?.uid);
  };

  const handleEditFiles = (
    e,
    route,
    isCheckboxSelected,
    metadata,
    operation,
    rotation,
    setRotation,
    password
  ) => {
    e.preventDefault();
    modifyFiles(
      route,
      isCheckboxSelected,
      metadata,
      operation,
      rotation,
      setRotation,
      password
    );
  };

  return (
    <div
      style={{ height: showInput && window.innerWidth < 767 && "400px" }}
      className="fileUpload-container"
    >
      {!isError && !showInput && !(isUploading || isConverting) && (
        <div
          style={{
            display: isUploading ? "none" : "block",
            backgroundColor: bgColor,
          }}
          className="fileUpload-container--wrapper"
        >
          <form
            onSubmit={handleFileUpload}
            action="/"
            method="POST"
            encType="multipart/form-data"
          >
            <div className="fileUpload-container__content">
              <div className="fileUpload-container__content__img">{image}</div>
              <div className="fileUpload-container__content__row">
                <div className="fileUpload-container__content__input">
                  <label className="file-input">
                    <input
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      className="picker-input"
                      type="file"
                      accept={
                        route === "jpg-to-pdf"
                          ? "image/png, image/gif, image/bmp, image/tiff, image/jpg"
                          : route === "word-to-pdf"
                          ? ".doc,.docx"
                          : "application/pdf"
                      }
                    />
                    <FontAwesomeIcon className="icon" icon={faFilePdf} />
                    <span>Choose Files</span>
                  </label>
                </div>
                <div className="fileUpload-container__content__btn">
                  <button type="submit">
                    <FontAwesomeIcon className="icon" icon={faChevronUp} />
                  </button>
                </div>
              </div>
              <p>or drop {file} here</p>
            </div>
          </form>
        </div>
      )}
      {!isError && !showInput && isUploading && !isConverting && (
        <div className="fileUpload-container__progress">
          <div
            style={{ width: `${progress}%`, background: bgColor }}
            className="progress-bar"
          ></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
            fill={bgColor}
          >
            <path d="M7,51 L7,58 C7,58.5522847 7.44771525,59 8,59 L52,59 C52.5522847,59 53,58.5522847 53,58 L53,13 L41,13 L41,12 L41,1 L8,1 C7.44771525,1 7,1.44771525 7,2 L7,35 L33,35 C34.1045695,35 35,35.8954305 35,37 L35,49 C35,50.1045695 34.1045695,51 33,51 L7,51 Z M6,51 L4,51 C2.8954305,51 2,50.1045695 2,49 L2,37 C2,35.8954305 2.8954305,35 4,35 L6,35 L6,2 C6,0.8954305 6.8954305,2.02906125e-16 8,0 L42,0 L54,12 L54,58 C54,59.1045695 53.1045695,60 52,60 L8,60 C6.8954305,60 6,59.1045695 6,58 L6,51 Z M52.5857864,12 L42,1.41421356 L42,12 L52.5857864,12 Z M17,24 L43,24 L43,25 L17,25 L17,24 Z M17,30 L43,30 L43,31 L17,31 L17,30 Z M37,36 L43,36 L43,37 L37,37 L37,36 Z M13.3818681,41.119015 C13.3818681,40.0838982 13.0901586,39.3052922 12.5067308,38.7831737 C11.9233029,38.2610553 11.0713426,38 9.95082418,38 L7,38 L7,48 L8.95879121,48 L8.95879121,44.4432285 L9.79917582,44.4432285 C10.9449691,44.4432285 11.8285225,44.1582336 12.4498626,43.5882353 C13.0712027,43.018237 13.3818681,42.1951718 13.3818681,41.119015 Z M8.95879121,42.7058824 L8.95879121,39.7373461 L9.84972527,39.7373461 C10.3847096,39.7373461 10.7775171,39.855904 11.0281593,40.0930233 C11.2788016,40.3301425 11.4041209,40.6972159 11.4041209,41.1942544 C11.4041209,41.686733 11.2545803,42.0617862 10.9554945,42.3194254 C10.6564088,42.5770647 10.2056807,42.7058824 9.6032967,42.7058824 L8.95879121,42.7058824 Z M22.7903846,42.9042408 C22.7903846,41.3584054 22.3733558,40.1545871 21.5392857,39.2927497 C20.7052156,38.4309122 19.534165,38 18.0260989,38 L15.1258242,38 L15.1258242,48 L17.7417582,48 C19.3761986,48 20.6262319,47.5622479 21.4918956,46.6867305 C22.3575593,45.8112131 22.7903846,44.5503958 22.7903846,42.9042408 Z M20.7557692,42.9589603 C20.7557692,45.1523137 19.8121889,46.248974 17.925,46.248974 L17.0846154,46.248974 L17.0846154,39.7373461 L18.1271978,39.7373461 C19.8795875,39.7373461 20.7557692,40.8112068 20.7557692,42.9589603 Z M26.6321429,48 L26.6321429,44.0465116 L29.7662088,44.0465116 L29.7662088,42.3160055 L26.6321429,42.3160055 L26.6321429,39.7373461 L30,39.7373461 L30,38 L24.7049451,38 L24.7049451,48 L26.6321429,48 Z M37,42 L43,42 L43,43 L37,43 L37,42 Z M37,48 L43,48 L43,49 L37,49 L37,48 Z"></path>
          </svg>
          <p>Uploading...</p>
        </div>
      )}
      {!isError &&
        showInput &&
        (route === "protect-pdf" || route === "unlock-pdf") && (
          <div className="fileUpload-container__progress">
            <div className="protect-panel__wrapper">
              <div className="protect-panel--detail">
                {password.length > 0 ? (
                  <svg viewBox="0 0 50 72" xmlns="http://www.w3.org/2000/svg">
                    <g id="Page-1" fill="none" fillRule="evenodd">
                      <g id="password-weak" stroke="#000" strokeWidth="2">
                        <g
                          id="strokes"
                          transform="translate(1.000000, 1.000000)"
                        >
                          <rect
                            id="lock"
                            fill="#FFF"
                            y="27"
                            width="48"
                            height="43"
                            rx="6"
                          ></rect>
                          <path
                            d="M37.998 27V13.999C37.998 6.268 31.73 0 23.998 0 16.269 0 10 6.268 10 13.999V27"
                            id="outer"
                          ></path>
                          <path
                            d="M31.046 27.197V14.339a7.047 7.047 0 1 0-14.094 0v12.62"
                            id="inner"
                          ></path>
                          <path
                            d="M34 51c.552 0 1-.895 1-2l-1.594-1.317C33.16 47.917 33 48.34 33 49c0 1.105.448 2 1 2z"
                            id="right-eye"
                          ></path>
                          <path
                            d="M23.667 51l1 2L23 55.667l1.667 2.666L23 61l1.667 2.667L23 66.333 24.667 69l-1 1.333"
                            id="mouth"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            transform="translate(23.833333, 60.666667) rotate(-270.000000) translate(-23.833333, -60.666667)"
                          ></path>
                          <path
                            d="M14 51c.552 0 1-.895 1-2l-1.594-1.317C13.15 47.89 13 48.34 13 49c0 1.105.448 2 1 2z"
                            id="left-eye"
                            transform="translate(14.000000, 49.341475) scale(-1, 1) translate(-14.000000, -49.341475)"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                ) : (
                  <svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg">
                    <g id="Page-1" fill="none" fillRule="evenodd">
                      <g id="password-open">
                        <g
                          id="strokes"
                          transform="translate(1.000000, 1.000000)"
                          stroke="#000"
                          strokeWidth="2"
                        >
                          <rect
                            id="lock"
                            fill="#FFF"
                            y="35"
                            width="48"
                            height="43"
                            rx="6"
                          ></rect>
                          <path
                            d="M37.998 35V13.999C37.998 6.268 31.73 0 23.998 0 16.269 0 10 6.268 10 13.999V21h7"
                            id="top-2"
                          ></path>
                          <path
                            d="M31.046 34.197V14.339a7.047 7.047 0 1 0-14.094 0V22"
                            id="top-1"
                          ></path>
                          <ellipse
                            id="left-eye"
                            cx="14"
                            cy="57"
                            rx="1"
                            ry="2"
                          ></ellipse>
                          <ellipse
                            id="right-eye"
                            cx="34"
                            cy="57"
                            rx="1"
                            ry="2"
                          ></ellipse>
                        </g>
                        <ellipse
                          id="fills"
                          fill="#000"
                          cx="25"
                          cy="68"
                          rx="4"
                          ry="4"
                        ></ellipse>
                      </g>
                    </g>
                  </svg>
                )}
                <p>{metadata?.name?.split("--")[0]}</p>
              </div>
              <div
                className={`protect-panel--input ${
                  route === "unlock-pdf" ? "modify-input--panel" : ""
                }`}
              >
                <p>
                  {route === "protect-pdf"
                    ? "We protect your file with strong 128-bit AES encyrption. This will make it impossible to open or remove the protection without the correct password."
                    : "If you have the password, it will only take seconds to decrypt your password protected pdf."}
                </p>
                <form action="/">
                  <label htmlFor="password">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      placeholder={
                        route === "protect-pdf"
                          ? "Choose your password"
                          : "Password"
                      }
                      type="password"
                    />
                  </label>
                  {route === "protect-pdf" && (
                    <label htmlFor="password">
                      <input
                        onChange={(e) => setComfirmPassword(e.target.value)}
                        value={confirmPassword}
                        placeholder="Repeat your password"
                        type="password"
                      />
                    </label>
                  )}
                  <button
                    onClick={(e) =>
                      handleEditFiles(
                        e,
                        route,
                        undefined,
                        metadata,
                        "subtract",
                        undefined,
                        undefined,
                        password
                      )
                    }
                    className={
                      route !== "protect-pdf"
                        ? password.length > 0
                          ? "btn--active"
                          : ""
                        : password.length > 0 && password === confirmPassword
                        ? "btn--active"
                        : ""
                    }
                    type="submit"
                  >
                    {route === "protect-pdf" ? "ENCRYPT" : "DECRYPT"} PDF
                    <FontAwesomeIcon className="icon" icon={faArrowRight} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      {!isError && !showInput && !isUploading && isConverting && (
        <div className="fileUpload-container__progress modifying--progress">
          <Converting toggle={true} bgColor={bgColor} operation={"converted"} />
        </div>
      )}
      {isError && (
        <div className="fileUpload-container__progress">
          <Error route={route} />
        </div>
      )}
    </div>
  );
};

export default FileUploadBox;
