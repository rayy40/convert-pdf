import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { storage } from "../../Config/firebase";
import { ref, deleteObject } from "firebase/storage";
import useFetchFileMetadata from "../../Helper/useFetchFileMetadata";
import useConvertFiles from "../../Helper/useConvertFiles";
import { FileContext } from "../../Helper/FileContext";

const DropDownItem = ({
  to,
  icon,
  title,
  download,
  user,
  file,
  setIsRenameModalOpen,
  conversionType,
  setIsExtensiveDropDownVisible,
}) => {
  const { fetchFilesMetadata } = useFetchFileMetadata();
  const { convertFiles } = useConvertFiles();
  const { setUploadUrl, setMetadata, setShowInput } = useContext(FileContext);

  const deleteFiles = (filename) => {
    const fileRef = ref(storage, `/${user?.uid}/upload/${filename}`);
    deleteObject(fileRef)
      .then(() => {
        fetchFilesMetadata(user?.uid, undefined, true, "delete");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOperation = () => {
    setMetadata(file?.metadata);
    if (title === "Rename") {
      setIsRenameModalOpen(true);
    } else if (title === "Delete") {
      deleteFiles(file?.metadata?.name);
    } else if (to?.includes("edit")) {
      setUploadUrl(file?.downloadUrl);
    } else if (title === "Protect PDF") {
      setShowInput(true);
      setUploadUrl(file?.downloadUrl);
    } else if (!to?.includes("edit")) {
      convertFiles(
        conversionType,
        file?.metadata,
        file?.downloadUrl,
        undefined
      );
    } else {
      return null;
    }
  };

  const handleMouseOver = () => {
    if (title === "More tools") {
      setIsExtensiveDropDownVisible(true);
    }
    return undefined;
  };

  return (
    <li
      onMouseOver={handleMouseOver}
      style={{ borderTop: download ? "1px solid #e4e4e4" : "transparent" }}
      onClick={title === "More tools" ? console.log("Undone") : handleOperation}
    >
      <Link
        target={title === "Download" ? "_blank" : ""}
        rel="noopener noreferrer"
        to={to}
        className="dropdown-link"
        download={download}
      >
        {icon}
        {title}
      </Link>
    </li>
  );
};

export default DropDownItem;
