import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../Config/firebase";
import { v4 as uuidv4 } from "uuid";

const useUploadFiles = () => {
  const [progress, setProgress] = useState(0);
  const [downloadedUrl, setDownloadedUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const uploadFiles = async (route, file) => {
    if (!file) return;

    setIsUploading(true);
    const storageRef = ref(storage, `/files/${file.name}--${uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshop) => {
          const prog =
            Math.round(snapshop.bytesTransferred / snapshop.totalBytes) * 100;
          setProgress(prog);
        },
        (err) => {
          console.log(err);
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              setIsUploading(false);
              setDownloadedUrl(url);
              resolve(url);
              // Call API endpoint with the download URL
              fetch(`http://localhost:5000/api/${route}`, {
                method: "POST",
                body: JSON.stringify({ url }),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(blob);
                  setDownloadLink(url);
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch(reject);
        }
      );
    });
  };
  return { isUploading, progress, downloadedUrl, uploadFiles, downloadLink };
};

export default useUploadFiles;
