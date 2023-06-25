import { createContext, useState } from "react";

export const FileContext = createContext({
  uploadUrl: "",
  setUploadUrl: () => {},
  metadata: null,
  setMetadata: () => {},
  showInput: false,
  setShowInput: () => {},
  isUploading: false,
  setIsUploading: () => {},
  isConverting: false,
  setIsConverting: () => {},
  isModifying: false,
  setIsModifying: () => {},
  isCheckboxSelected: false,
  setIsCheckboxSelected: () => {},
});

export const FileProvider = (props) => {
  const [uploadUrl, setUploadUrl] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
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
        isUploading,
        setIsUploading,
        isConverting,
        setIsConverting,
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
