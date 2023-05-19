import React, { useContext, useState } from "react";
import { Document, Page } from "react-pdf";
import { FileContext } from "../../Helper/FileContext";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../Layouts/Loading";
import Converting from "../../Layouts/Converting";
import { useLocation } from "react-router-dom";
import { handleApiCall } from "../../Helper/ReusableFunctions";

const EditPdf = () => {
  const {
    uploadUrl,
    setUploadUrl,
    isCheckboxSelected,
    setIsCheckboxSelected,
    isModifying,
    setIsModifying,
  } = useContext(FileContext);
  const [numPages, setNumPages] = useState(null);
  const location = useLocation();

  const generateInitialCheckboxState = (numPages) => {
    return Array.from(new Array(numPages)).reduce((acc, _, index) => {
      acc[index + 1] = false;
      return acc;
    }, {});
  };

  if (isModifying) {
    return (
      <div className="converting-container__wrapper">
        <Converting bgColor={"rgb(15, 192, 197)"} />
      </div>
    );
  }

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
        <FontAwesomeIcon
          onClick={() =>
            handleApiCall(
              isCheckboxSelected,
              uploadUrl,
              setIsModifying,
              setUploadUrl,
              location.pathname.split("/")[1]
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
      </div>
      {uploadUrl.length > 0 ? (
        <Document
          loading={<Loading />}
          file={uploadUrl}
          error={<Loading />}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setIsCheckboxSelected(generateInitialCheckboxState(numPages));
          }}
          onLoadError={(err) => (
            <div className="error-container">
              <p>{err}</p>
            </div>
          )}
        >
          {isCheckboxSelected &&
            Array.from(new Array(numPages)).map((_, index) => (
              <div key={index} className="pdf-wrapper">
                <Page pageNumber={index + 1} />
                <p>{index + 1}</p>
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
              </div>
            ))}
        </Document>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default EditPdf;
