import { useContext, useState } from "react";
import {
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../Config/firebase";
import { FileContext } from "../Helper/FileContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const useUploadFiles = () => {
  const [progress, setProgress] = useState(0);
  const {
    setUploadUrl,
    setMetadata,
    setShowInput,
    setIsConverting,
    setIsUploading,
  } = useContext(FileContext);
  const [downloadLink, setDownloadLink] = useState("");
  const navigate = useNavigate();

  const uploadFiles = async (route, files) => {
    if (!files || files.length === 0) return;

    setDownloadLink("");
    setMetadata(null);
    setIsUploading(true);
    const uploadPromises = files.map((file) => {
      const storageRef = ref(
        storage,
        `/${route}/upload/${file.name}--${uuidv4()}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog =
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(prog);
          },
          (err) => {
            console.log(err);
            reject(err);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((url) => {
                resolve(url);
                setUploadUrl(url);
              })
              .catch(reject);
            // Retrieve and log the metadata
            getMetadata(storageRef).then((meta) => {
              setMetadata(meta);

              if (meta) {
                if (
                  route === "delete-pages" ||
                  route === "split-pdf" ||
                  route === "extract-pdf" ||
                  route === "rotate-pdf"
                ) {
                  navigate(`/${route}/edit`, { state: meta });
                } else if (route !== "protect-pdf" && route !== "unlock-pdf") {
                  return Promise.all(uploadPromises)
                    .then((urls) => {
                      setIsConverting(true);
                      setIsUploading(false);
                      // Call API endpoint with the download URLs
                      return fetch(
                        `https://convert-pdf.onrender.com/api/${route}`,
                        {
                          method: "POST",
                          body: JSON.stringify({ urls: urls, metadata: meta }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );
                    })
                    .then((response) => response.text())
                    .then((data) => {
                      setIsConverting(false);
                      setDownloadLink(data);
                      navigate("/result", { state: data });
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                } else {
                  setShowInput(true);
                }
              }
            });
          }
        );
      });
    });

    Promise.all(uploadPromises).then(() => {
      setProgress(100);
    });
  };

  return {
    progress,
    uploadFiles,
    downloadLink,
  };
};

export default useUploadFiles;
