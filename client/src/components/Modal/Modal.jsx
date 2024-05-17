import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import useFetchFileMetadata from "../../helper/useFetchFileMetadata";
import { fileContext } from "../../providers/fileContext";

const Modal = ({ user, file, setIsRenameModalOpen }) => {
  let modalRef = useRef(null);
  const [fileName, setFileName] = useState(file?.metadata?.name);
  const { fetchFilesMetadata } = useFetchFileMetadata();
  const { setIsRenaming } = useContext(fileContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsRenameModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsRenameModalOpen]);

  const handleInputChange = (e) => {
    setFileName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRenameModalOpen(false);
    setIsRenaming(true);

    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rename`, {
      method: "POST",
      body: JSON.stringify({
        urls: file?.downloadUrl,
        metadata: file?.metadata,
        user: user?.uid,
        accesToken: user?.stsTokenManager?.accessToken,
        rename_file: fileName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        fetchFilesMetadata(user?.uid, setIsRenaming, true, "upload");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="modal-container">
      <div ref={modalRef} className="modal-container__wrapper">
        <FontAwesomeIcon
          onClick={() => setIsRenameModalOpen(false)}
          className="icon"
          icon={faClose}
        />
        <div className="modal-container__input">
          <h3>Rename</h3>
          <form onSubmit={(e) => handleSubmit(e)} action="/">
            <input
              onChange={(e) => handleInputChange(e)}
              value={fileName}
              type="text"
              autoFocus
            />
          </form>
        </div>
        <div className="modal-container__button">
          <button
            onClick={() => setIsRenameModalOpen(false)}
            className="modal-btn cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={(e) => handleSubmit(e)}
            className="modal-btn submit-btn"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
