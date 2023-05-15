import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../Config/firebase";
import { v4 as uuidv4 } from "uuid";

const useUploadFiles = () => {
  const [progress, setProgress] = useState(0);
  const [downloadedUrls, setDownloadedUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const uploadFiles = async (route, files) => {
    if (!files || files.length === 0) return;

    console.log(files);

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
              })
              .catch(reject);
          }
        );
      });
    });

    return Promise.all(uploadPromises)
      .then((urls) => {
        setIsUploading(false);
        setDownloadedUrls(urls);
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
  };

  return { isUploading, progress, downloadedUrls, uploadFiles, downloadLink };
};

export default useUploadFiles;
