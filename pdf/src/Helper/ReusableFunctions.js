export const handleApiCall = (
  metadata,
  isCheckboxSelected,
  uploadUrl,
  setIsModifying,
  setUploadUrl,
  route,
  navigateToPage,
  password,
  setShowInput,
  setIsConverting,
  setIsUploading,
  rotation
) => {
  let selectedPages;
  if (!(route === "protect-pdf" || route === "unlock-pdf")) {
    selectedPages = Object.entries(isCheckboxSelected)
      .filter(([key, value]) => value === true)
      .map(([key]) => Number(key));

    setIsModifying(true);
  }

  console.log(rotation);

  if (route === "protect-pdf" || route === "unlock-pdf") {
    setIsConverting(true);
    setIsUploading(false);
    setShowInput(false);
  }
  let storedData;

  fetch(`http://localhost:5000/api/${route}`, {
    method: "POST",
    body: JSON.stringify({
      urls: uploadUrl,
      pages: selectedPages,
      metadata: metadata,
      password: password || "",
      rotation: rotation || 0,
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
        navigateToPage(storedData);
      }
    });
};
