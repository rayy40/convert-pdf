import React, { useContext, useState } from "react";
import { Document, Page } from "react-pdf";
import { FileContext } from "../../Helper/FileContext";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../Layouts/Loading";
import Converting from "../../Layouts/Converting";

const EditPdf = () => {
  const { uploadUrl, setUploadUrl, isCheckboxSelected, setIsCheckboxSelected } =
    useContext(FileContext);
  const [numPages, setNumPages] = useState(null);
  const [isModifying, setIsModifying] = useState(false);

  const generateInitialCheckboxState = (numPages) => {
    return Array.from(new Array(numPages)).reduce((acc, _, index) => {
      acc[index + 1] = false;
      return acc;
    }, {});
  };

  const handleApiCall = () => {
    const selectedPages = Object.entries(isCheckboxSelected)
      .filter(([key, value]) => value === true)
      .map(([key]) => Number(key));

    setIsModifying(true);

    fetch(`http://localhost:5000/api/delete-pages`, {
      method: "POST",
      body: JSON.stringify({ urls: uploadUrl, pages: selectedPages }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.text()) // Assuming the response is JSON
      .then((data) => {
        setUploadUrl(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsModifying(false);
      });
  };

  if (isModifying) {
    return (
      <div className="converting-container__wrapper">
        <Converting bgColor={"rgb(15, 192, 197)"} />
      </div>
    );
  }

  console.log(numPages);
  return (
    <div className="edit-pdf-container">
      <div className="edit-pdf-container__banner">
        <FontAwesomeIcon
          onClick={handleApiCall}
          className={`icon ${
            isCheckboxSelected &&
            Object.values(isCheckboxSelected).some((value) => value === true) &&
            "icon--active"
          }`}
          icon={faTrashAlt}
        />
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
          {Array.from(new Array(numPages)).map((_, index) => (
            <div key={index} className="pdf-wrapper">
              <Page pageNumber={index + 1} />
              <div className="icons-container">
                <button className="magnify">
                  <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
                </button>
              </div>
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
                      type="checkbox"
                      name="checkbox"
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
