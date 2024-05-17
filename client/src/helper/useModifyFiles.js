import { useContext } from "react";
import { fileContext } from "../providers/fileContext";
import { useNavigate } from "react-router-dom";

const useModifiyFiles = () => {
  const {
    setIsModifying,
    setIsError,
    setIsConverting,
    setUploadUrl,
    setShowInput,
    uploadUrl,
  } = useContext(fileContext);
  const navigate = useNavigate();

  const modifyFiles = async (
    route,
    user,
    isCheckboxSelected,
    metadata,
    operation,
    rotation,
    setRotation,
    password
  ) => {
    const userId = user?.uid;
    let selectedPages, rotatingAngle;
    if (!(route === "protect-pdf" || route === "unlock-pdf")) {
      selectedPages = Object.entries(isCheckboxSelected)
        .filter(([key, value]) => value === true)
        .map(([key]) => Number(key));

      setIsModifying(true);
    }

    if (route === "rotate-pdf") {
      rotatingAngle = Object.fromEntries(
        Object.entries(rotation).map(([key, value]) => {
          if (selectedPages.includes(Number(key))) {
            if (operation === "subtract") {
              return [key, (value - 90 + 360) % 360];
            } else if (operation === "add") {
              return [key, (value + 90) % 360];
            }
          }
          return [key, value];
        })
      );

      setRotation(rotatingAngle);
    }

    if (route === "protect-pdf" || route === "unlock-pdf") {
      setIsConverting(true);
      setShowInput(false);
    }
    let storedData;

    return fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${route}`, {
      method: "POST",
      body: JSON.stringify({
        urls: uploadUrl,
        pages: selectedPages,
        user: userId,
        metadata: metadata,
        password: password || "",
        rotation: rotatingAngle || rotation,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.text()) // Assuming the response is JSON
      .then((data) => {
        setUploadUrl(data);
        storedData = data;
      })
      .catch((error) => {
        setIsError(true);
        console.error(error);
      })
      .finally(() => {
        if (!(route === "protect-pdf" || route === "unlock-pdf")) {
          setIsModifying(false);
        }
        if (route === "protect-pdf" || route === "unlock-pdf") {
          setIsConverting(false);
        }
        if (route !== "delete-pages" && route !== "rotate-pdf") {
          navigate("/result", { state: { url: storedData, route: route } });
        }
      });
  };

  return {
    modifyFiles,
  };
};

export default useModifiyFiles;
