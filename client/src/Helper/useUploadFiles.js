import { useContext, useState } from "react";
import {
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../Config/firebase";
import { FileContext } from "../Helper/FileContext";
import { useNavigate } from "react-router-dom";
import useConvertFiles from "./useConvertFiles";
import useFetchFileMetadata from "./useFetchFileMetadata";

const useUploadFiles = () => {
  const { convertFiles } = useConvertFiles();
  const { fetchFilesMetadata } = useFetchFileMetadata();
  const { setMetadata, setUploadUrl, setShowInput } = useContext(FileContext);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (route, files, userId) => {
    if (!files || files.length === 0) return;

    setMetadata(null);
    setIsUploading(true);
    const uploadPromises = files.map((file) => {
      const storageRef = ref(storage, `/${userId}/upload/${file.name}`);
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
          async () => {
            fetchFilesMetadata(
              userId,
              setIsUploading,
              route === "documents" ? true : false,
              "upload"
            );
            resolve({ ref: uploadTask.snapshot.ref, storageRef });
          }
        );
      });
    });

    try {
      const uploadSnapshots = await Promise.all(uploadPromises);

      setProgress(100);

      if (route !== "documents") {
        const urls = [];
        const metadata = await getMetadata(uploadSnapshots[0].storageRef);

        for (const uploadSnapshot of uploadSnapshots) {
          const url = await getDownloadURL(uploadSnapshot.ref);
          urls.push(url);
        }

        setUploadUrl(urls);
        setMetadata(metadata);

        if (
          route === "delete-pages" ||
          route === "split-pdf" ||
          route === "extract-pdf" ||
          route === "rotate-pdf"
        ) {
          navigate(`/${route}/edit`, { state: metadata });
        } else if (route === "protect-pdf" || route === "unlock-pdf") {
          setIsUploading(false);
          setShowInput(true);
        } else {
          convertFiles(route, metadata, urls, setIsUploading);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    progress,
    uploadFiles,
    isUploading,
  };
};

export default useUploadFiles;
