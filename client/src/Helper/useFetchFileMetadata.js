import { useContext, useState } from "react";
import { FileContext } from "./FileContext";
import { ref, listAll, getMetadata, getDownloadURL } from "firebase/storage";
import { storage } from "../Config/firebase";

const useFetchFileMetadata = () => {
  const { setFileDetails } = useContext(FileContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFilesMetadata = async (
    userId,
    setIsUploading,
    isRouteDocument,
    operation
  ) => {
    try {
      setIsDeleting(true);
      const userRef = ref(storage, `${userId}/upload/`);
      const filesList = await listAll(userRef);

      const metadataWithDownloadUrls = await Promise.all(
        filesList.items.map(async (fileRef) => {
          try {
            if (isRouteDocument && operation !== "delete") {
              setIsUploading(false);
            }

            setIsDeleting(false);
            const [metadata, downloadUrl] = await Promise.all([
              getMetadata(fileRef),
              getDownloadURL(fileRef),
            ]);

            return { metadata, downloadUrl };
          } catch (err) {
            console.log(err.message);
            return null;
          }
        })
      );

      const uniqueMetadata = metadataWithDownloadUrls
        .filter((file, index, arr) => {
          return (
            arr.findIndex((f) => f.metadata.name === file.metadata.name) ===
            index
          );
        })
        .map((file) => ({ ...file, isChecked: false }));

      setFileDetails(uniqueMetadata);
      localStorage.setItem("userFiles", JSON.stringify(uniqueMetadata));
    } catch (err) {
      console.log(err);
    }
  };

  return { fetchFilesMetadata, isDeleting };
};

export default useFetchFileMetadata;
