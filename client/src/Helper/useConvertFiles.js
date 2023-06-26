import { useContext } from "react";
import { FileContext } from "./FileContext";
import { useNavigate } from "react-router-dom";

const useConvertFiles = () => {
  const { setIsConverting, setIsError } = useContext(FileContext);
  const navigate = useNavigate();

  const convertFiles = async (route, meta, url, setIsUploading) => {
    setIsConverting(true);
    setIsUploading && setIsUploading(false);

    return fetch(`https://convert-pdf.onrender.com/api/${route}`, {
      method: "POST",
      body: JSON.stringify({ urls: url, metadata: meta }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.text())
      .then((data) => {
        setIsConverting(false);
        navigate("/result", { state: { url: data, route: route } });
      })
      .catch((error) => {
        setIsConverting(false);
        setIsError(true);
        console.error(error);
      });
  };

  return {
    convertFiles,
  };
};

export default useConvertFiles;
