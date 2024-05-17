import { useContext } from "react";
import { fileContext } from "../providers/fileContext";
import { useNavigate } from "react-router-dom";

const useConvertFiles = () => {
  const { setIsConverting, setIsError } = useContext(fileContext);
  const navigate = useNavigate();

  const convertFiles = async (route, meta, url, setIsUploading, user) => {
    const userId = user?.uid;
    setIsConverting(true);
    setIsUploading && setIsUploading(false);

    return fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${route}`, {
      method: "POST",
      body: JSON.stringify({ urls: url, metadata: meta, user: userId }),
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
