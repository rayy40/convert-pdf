import { createContext, useState } from "react";

export const FileContext = createContext({
  uploadUrl: "",
  setUploadUrl: () => {},
  metadata: null,
  setMetadata: () => {},
  showInput: false,
  setShowInput: () => {},
  isModifying: false,
  setIsModifying: () => {},
  isCheckboxSelected: false,
  setIsCheckboxSelected: () => {},
});

export const FileProvider = (props) => {
  const [uploadUrl, setUploadUrl] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [isModifying, setIsModifying] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(null);
  return (
    <FileContext.Provider
      value={{
        uploadUrl,
        setUploadUrl,
        showInput,
        setShowInput,
        metadata,
        setMetadata,
        isModifying,
        setIsModifying,
        isCheckboxSelected,
        setIsCheckboxSelected,
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
};
