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

const useUploadFiles = () => {
  const [progress, setProgress] = useState(0);
  const { setUploadUrl, setMetadata } = useContext(FileContext);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const uploadFiles = async (route, files) => {
    if (!files || files.length === 0) return;

    setDownloadLink("");
    setMetadata(null);
    setIsUploading(true);
    const uploadPromises = files.map((file) => {
      const storageRef = ref(storage, `/files/${file.name}--${uuidv4()}`);
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
            getMetadata(storageRef).then((metadata) => {
              console.log(metadata);
              setMetadata(metadata);
            });
          }
        );
      });
    });

    Promise.all(uploadPromises).then(() => {
      setProgress(100);
    });

    if (route !== "delete-pages") {
      return Promise.all(uploadPromises)
        .then((urls) => {
          setIsUploading(false);
          // Call API endpoint with the download URLs
          return fetch(`http://localhost:5000/api/${route}`, {
            method: "POST",
            body: JSON.stringify({ urls }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        })
        .then((response) => response.blob())
        .then((blob) => setDownloadLink(blob))
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return { isUploading, progress, uploadFiles, downloadLink };
};

export default useUploadFiles;
