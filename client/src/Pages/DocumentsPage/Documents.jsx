import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  faArrowUp,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileContext } from "../../Helper/FileContext";
import useUploadFiles from "../../Helper/useUploadFiles";
import File from "../../Components/File/File";
import useFetchFileMetadata from "../../Helper/useFetchFileMetadata";
import Converting from "../../Layouts/Converting";
import { Link } from "react-router-dom";
import { storage } from "../../Config/firebase";
import { deleteObject, ref } from "firebase/storage";
import useConvertFiles from "../../Helper/useConvertFiles";
import Head from "../../Components/Metadata/Head";

const Documents = () => {
  let fileInputRef = useRef(null);
  let dropdownRef = useRef(null);
  const { convertFiles } = useConvertFiles();
  const { fetchFilesMetadata, isDeleting } = useFetchFileMetadata();
  const { user, fileDetails, isRenaming, setIsModalOpen, setHasAccount } =
    useContext(FileContext);
  const { uploadFiles, isUploading } = useUploadFiles();
  const [fileList, setFileList] = useState([]);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const getFileList = localStorage.getItem("userFiles");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useMemo(() => {
    const files =
      fileDetails?.length > 0
        ? fileDetails
        : getFileList
        ? JSON.parse(getFileList)
        : [];

    setFileList(files);
  }, [fileDetails, getFileList]);

  const handleUploadFiles = (e) => {
    e.preventDefault();
    const files = fileInputRef.current.files;
    if (files.length === 0) return;
    uploadFiles("documents", Array.from(files), user?.uid ?? user?.user?.uid);
  };

  const handleDownload = () => {
    const selectedFiles = fileList.filter((file) => file.isChecked);
    selectedFiles.forEach((file) => {
      const link = document.createElement("a");
      link.href = file?.downloadUrl;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.click();
    });
  };

  const deleteFiles = () => {
    const selectedFiles = fileList.filter((file) => file.isChecked);

    const deletePromises = selectedFiles.map((file) => {
      const fileRef = ref(
        storage,
        `/${user?.uid}/upload/${file?.metadata?.name}`
      );
      return deleteObject(fileRef);
    });

    Promise.all(deletePromises)
      .then(() => {
        fetchFilesMetadata(user?.uid, undefined, true, "delete");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMerge = () => {
    const urls = [];
    const files = fileList.filter((item) => item.isChecked === true);

    for (const file of files) {
      urls.push(file?.downloadUrl);
    }

    convertFiles("merge-pdf", files[0]?.metadata, urls, undefined);
  };

  if (isRenaming) {
    return (
      <div className="modifying-container__wrapper">
        <Converting bgColor={"rgb(15, 192, 197)"} operation={"renamed"} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-prompt-container">
        <h3>
          <span
            onClick={() => {
              setIsModalOpen((v) => !v);
              setHasAccount(true);
            }}
          >
            Sign Up
          </span>{" "}
          for a new account to experience the various operations,
          <br />
          Or you can{" "}
          <span
            onClick={() => {
              setIsModalOpen((v) => !v);
              setHasAccount(false);
            }}
          >
            Login
          </span>{" "}
          if you already have an account.
        </h3>
      </div>
    );
  }

  return (
    <div className="documents-page-container">
      <Head title={"Documents"} description={"All your uploaded documents"} />
      <div className="documents-page-container__header">
        <h3>My Documents</h3>
        {fileList.find((item) => item.isChecked === true) && (
          <button
            onClick={() => setIsDropDownVisible((v) => !v)}
            className="actions"
          >
            <FontAwesomeIcon className="icon" icon={faEllipsisVertical} />
            {isDropDownVisible && (
              <div ref={dropdownRef} className="dropdown-container">
                <ul>
                  <li>
                    <Link
                      to="#"
                      onClick={handleDownload}
                      className="dropdown-link"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                      >
                        <path d="M18 20H5V15H6V19H17V15H18V20ZM12 4V15.19L14.3 13L15 13.6667L11.5 17L8 13.6667L8.7 13L11 15.19V4H12Z"></path>
                      </svg>
                      Download
                    </Link>
                  </li>
                  <li onClick={deleteFiles}>
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="M16 4V6.999L20 7V8L17.934 7.999L17.1429 20H6.85714L6.066 7.999L4 8V7L8 6.999V4H16ZM17 8H7L7.73708 19H16.2629L17 8ZM12.5 9V18H11.5V9H12.5ZM10 9V18H9V9H10ZM15 9V18H14V9H15ZM15 5H9V7H15V5Z"></path>
                    </svg>
                    Delete
                  </li>
                  {fileList.filter((item) => item.isChecked === true).length >
                    1 && (
                    <li
                      onClick={handleMerge}
                      style={{ borderTop: "1px solid #e4e4e4" }}
                    >
                      <svg
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                          fill="#7961F2"
                        ></path>
                        <path d="M13 21H8V7H19V11" stroke="white"></path>
                        <rect
                          x="13.5"
                          y="11.5"
                          width="11"
                          height="13"
                          stroke="white"
                        ></rect>
                        <path d="M19 15V21" stroke="white"></path>
                        <path d="M16 18H22" stroke="white"></path>
                      </svg>
                      Merge Pdf
                    </li>
                  )}
                </ul>
              </div>
            )}
          </button>
        )}
        <form onSubmit={(e) => e.preventDefault()} action="/">
          <div className="documents-page-container__header__input">
            <label htmlFor="uploadFile">
              <input
                ref={fileInputRef}
                onChange={handleUploadFiles}
                multiple
                accept=".doc, .docx, .ppt,.pptx,.jpg,.jpeg,.png,appplication/pdf"
                id="file-selecter"
                type="file"
              />
            </label>
            <button
              onClick={() => document.getElementById("file-selecter").click()}
              className="upload-btn"
            >
              <FontAwesomeIcon className="icon" icon={faArrowUp} /> Upload
            </button>
          </div>
        </form>
      </div>
      {isUploading || isDeleting ? (
        <div className="loading-container">
          <div className="lds-ring">
            <div
              style={{
                borderColor: "#A9A9A9 transparent transparent transparent",
              }}
            ></div>
            <div
              style={{
                borderColor: "#A9A9A9 transparent transparent transparent",
              }}
            ></div>
            <div
              style={{
                borderColor: "#A9A9A9 transparent transparent transparent",
              }}
            ></div>
            <div
              style={{
                borderColor: "#A9A9A9 transparent transparent transparent",
              }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="documents-page-container__files">
          <div className="file-list__header">
            <div className="file-list--checkbox">
              <input style={{ visibility: "hidden" }} type="checkbox" />
            </div>
            <div className="file-list__header--items">
              <div className="file-name">
                <button>Name </button>
              </div>
              <div className="file-size">
                <button>Size</button>
              </div>
              <div className="file-time">
                <button>Date</button>
              </div>
              <div className="actions">
                <button>Actions</button>
              </div>
            </div>
          </div>
          <div className="file-list__content">
            <ul>
              {fileList?.map((file, index) => (
                <File
                  key={index}
                  index={index}
                  user={user}
                  file={file}
                  setFileList={setFileList}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
