import { createContext, useState } from "react";

export const FileContext = createContext({
  user: null,
  setUser: () => {},
  hasAccount: false,
  setHasAccount: () => {},
  metadata: null,
  setMetadata: () => {},
  showInput: false,
  setShowInput: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  isConverting: false,
  setIsConverting: () => {},
  isModifying: false,
  uploadUrl: "",
  setUploadUrl: () => {},
  fileDetails: [],
  setFileDetails: () => {},
  isRenaming: false,
  setIsRenaming: () => {},
  isError: false,
  setIsError: () => {},
  isCheckboxSelected: false,
  setIsCheckboxSelected: () => {},
});

export const FileProvider = (props) => {
  const [user, setUser] = useState(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [fileDetails, setFileDetails] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [uploadUrl, setUploadUrl] = useState("");
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(null);
  return (
    <FileContext.Provider
      value={{
        user,
        setUser,
        hasAccount,
        setHasAccount,
        metadata,
        setMetadata,
        fileDetails,
        setFileDetails,
        showInput,
        setShowInput,
        uploadUrl,
        setUploadUrl,
        isError,
        setIsError,
        isModalOpen,
        setIsModalOpen,
        isConverting,
        setIsConverting,
        isModifying,
        setIsModifying,
        isRenaming,
        setIsRenaming,
        isCheckboxSelected,
        setIsCheckboxSelected,
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
};
