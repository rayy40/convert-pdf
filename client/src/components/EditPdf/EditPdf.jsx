import React, { useContext, useState } from "react";
import { Document, Page } from "react-pdf";
import { fileContext } from "../../providers/fileContext";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faScissors,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../layouts/Loading";
import Converting from "../../layouts/Converting";
import { useLocation } from "react-router-dom";
import Error from "../Error/Error";
import useModifiyFiles from "../../helper/useModifyFiles";

const EditPdf = () => {
  const {
    isModifying,
    isCheckboxSelected,
    setIsCheckboxSelected,
    isError,
    metadata,
    uploadUrl,
  } = useContext(fileContext);
  const { modifyFiles } = useModifiyFiles();
  const [numPages, setNumPages] = useState(null);
  const [pageRange, setPageRange] = useState([]);
  const [isSplitting, setIsSplitting] = useState([]);
  const [rotatingAngle, setRotatingAngle] = useState({});
  const [pagesToBeSplitted, setPagesToBeSplitted] = useState([]);
  const location = useLocation();

  const generateInitialCheckboxState = (numPages) => {
    return Array.from(new Array(numPages)).reduce((acc, _, index) => {
      acc[index + 1] = false;
      return acc;
    }, {});
  };

  const generateInitialRotatingAngleState = (numPages) => {
    return Array.from(new Array(numPages)).reduce((acc, _, index) => {
      acc[index + 1] = 0;
      return acc;
    }, {});
  };

  const handleRangeSubmit = (e) => {
    e.preventDefault();
    let pages = [];
    if (pageRange.includes("-")) {
      const start = parseInt(pageRange.split("-")[0]);
      const end = parseInt(pageRange.split("-")[1]);

      if (!isNaN(start) && !isNaN(end)) {
        pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
    } else {
      if (!isNaN(parseInt(pageRange))) {
        pages = [parseInt(pageRange)];
      }
    }
    pages.map((index) =>
      setIsCheckboxSelected((prev) => ({
        ...prev,
        [index]: !prev[index],
      }))
    );
  };

  if (isModifying) {
    return (
      <div className="converting-container__wrapper">
        <Converting bgColor={"rgb(15, 192, 197)"} operation={"modified"} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="converting-container__wrapper">
        <Error route={location.pathname.split("/")[1]} />
      </div>
    );
  }

  const handleScissorButtonClick = (index, arr) => {
    setIsSplitting((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));

    let dummyArr = [];

    if (arr.every((item) => !Array.isArray(item))) {
      const first = arr.slice(0, index);
      const second = arr.slice(index, arr.length);
      dummyArr.push(first);
      dummyArr.push(second);
      setPagesToBeSplitted(dummyArr);
    } else {
      let flag = false;
      for (let ind = 0; ind < arr.length; ind++) {
        for (let y = 0; y < arr[ind].length; y++) {
          flag = true;
          if (arr[ind][y] === index) {
            if (arr[ind].length > 2) {
              const first = arr[ind].slice(0, index);
              const second = arr[ind].slice(index, arr[ind].length);
              dummyArr.push(first);
              dummyArr.push(second);
              setPagesToBeSplitted(dummyArr);
            } else {
              dummyArr.push([arr[ind][0]]);
              dummyArr.push([arr[ind][1]]);
              setPagesToBeSplitted(dummyArr);
            }

            flag = false;
            break;
          }
        }
        if (flag) dummyArr.push(arr[ind]);
      }
    }
  };

  const handleEditFiles = (
    route,
    isCheckboxSelected,
    metadata,
    operation,
    rotation,
    setRotation,
    password
  ) => {
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
    <div className="edit-pdf-container">
      <div className="edit-pdf-container__banner">
        <div className="no-of-files-selected">
          {isCheckboxSelected &&
            Object.values(isCheckboxSelected).some(
              (value) => value === true
            ) && (
              <p>
                {`${
                  Object.values(isCheckboxSelected).filter(
                    (value) => value === true
                  ).length
                } page`}
              </p>
            )}
        </div>
        {!location.pathname.includes("split-pdf") && (
          <div className="range-container">
            <form onSubmit={handleRangeSubmit} className="unmodify" action="/">
              <input
                onChange={(e) => setPageRange(e.target.value)}
                type="text"
                placeholder="Example: 1-3, 7"
                pattern="^\d+-\d+$|^\d+$"
                required
              />
              <button>Ok</button>
            </form>
          </div>
        )}
        <FontAwesomeIcon
          onClick={() =>
            handleEditFiles(
              location.pathname.split("/")[1],
              isCheckboxSelected,
              metadata
            )
          }
          className={`${
            !location.pathname.includes("delete-pages") && "icon--deactive"
          } icon ${
            isCheckboxSelected &&
            Object.values(isCheckboxSelected).some((value) => value === true) &&
            "icon--active"
          }`}
          icon={faTrashAlt}
        />
        {location.pathname.includes("rotate-pdf") && (
          <div className="rotate-icons">
            <FontAwesomeIcon
              onClick={() =>
                handleEditFiles(
                  location.pathname.split("/")[1],
                  isCheckboxSelected,
                  metadata,
                  "subtract",
                  rotatingAngle,
                  setRotatingAngle,
                  null
                )
              }
              className="rotate--icon"
              icon={faArrowRotateLeft}
            />
            <FontAwesomeIcon
              onClick={() =>
                handleEditFiles(
                  location.pathname.split("/")[1],
                  isCheckboxSelected,
                  metadata,
                  "add",
                  rotatingAngle,
                  setRotatingAngle,
                  null
                )
              }
              className="rotate--icon"
              icon={faArrowRotateRight}
            />
          </div>
        )}
        {!location.pathname.includes("/split-pdf") && (
          <div className="deselect-container">
            <label className="form-checkbox banner-checkbox" htmlFor="Deselect">
              <input
                onChange={() =>
                  setIsCheckboxSelected((prev) => {
                    const updatedState = {};
                    const anyValueSelected = Object.values(prev).some(
                      (value) => value === true
                    );

                    Object.keys(prev).forEach((key) => {
                      updatedState[key] = anyValueSelected ? false : true;
                    });
                    return updatedState;
                  })
                }
                checked={
                  isCheckboxSelected &&
                  Object.values(isCheckboxSelected).some(
                    (value) => value === true
                  )
                }
                type="checkbox"
              />
              {isCheckboxSelected &&
              Object.values(isCheckboxSelected).some((value) => value === true)
                ? "Deselect All"
                : "Select All"}
            </label>
          </div>
        )}
        {location.pathname.includes("/split-pdf") && (
          <div className="split-after-every-page-container">
            <label
              className="form-checkbox banner-checkbox"
              htmlFor="split-after-every-page"
            >
              <input
                onChange={() =>
                  setIsSplitting((prev) => {
                    const allValuesSelected = Object.values(prev).every(
                      (value) => value === true
                    );
                    const updatedState = {};

                    Object.keys(prev).forEach((key) => {
                      updatedState[key] = allValuesSelected ? false : true;
                    });
                    return updatedState;
                  })
                }
                checked={
                  isSplitting &&
                  Object.values(isSplitting)
                    .slice(0, -1)
                    .every((value) => value === true)
                }
                type="checkbox"
              />
              Split after every page
            </label>
          </div>
        )}
      </div>
      {uploadUrl?.length > 0 ? (
        <Document
          loading={<Loading />}
          file={
            Array.isArray(uploadUrl)
              ? uploadUrl?.[0]?.replace(/"/g, "")
              : uploadUrl?.replace(/"/g, "")
          }
          error={<Loading />}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setIsCheckboxSelected(generateInitialCheckboxState(numPages));
            setIsSplitting(generateInitialCheckboxState(numPages));
            setRotatingAngle(generateInitialRotatingAngleState(numPages));
            setPagesToBeSplitted(
              Array.from({ length: numPages }, (_, index) => index + 1)
            );
          }}
          onLoadError={(err) => (
            <div className="error-container">
              <p>{err}</p>
            </div>
          )}
        >
          {isCheckboxSelected &&
            Array.from(new Array(numPages)).map((_, index) => (
              <React.Fragment key={index}>
                <div className="pdf-wrapper">
                  <Page pageNumber={index + 1} />
                  <p>{index + 1}</p>
                  {!location.pathname.includes("split-pdf") && (
                    <div
                      className={`checkbox-container ${
                        numPages === 1 && "checkbox-container--deactive"
                      }`}
                    >
                      <form action="/">
                        <label className="form-checkbox">
                          <input
                            onChange={() =>
                              setIsCheckboxSelected((prev) => ({
                                ...prev,
                                [index + 1]: !prev[index + 1],
                              }))
                            }
                            checked={isCheckboxSelected[index + 1]}
                            type="checkbox"
                          />
                        </label>
                      </form>
                    </div>
                  )}
                </div>
                {location.pathname.includes("/split-pdf") && (
                  <div
                    className={`${
                      numPages === index + 1
                        ? "scissor-container--deactive"
                        : isSplitting?.[index + 1]
                        ? "scissor-container scissor-container--active"
                        : "scissor-container"
                    }`}
                  >
                    <button
                      onClick={() =>
                        handleScissorButtonClick(index + 1, pagesToBeSplitted)
                      }
                    >
                      <FontAwesomeIcon
                        className="icon"
                        icon={faScissors}
                        rotation={270}
                      />
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
        </Document>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default EditPdf;
