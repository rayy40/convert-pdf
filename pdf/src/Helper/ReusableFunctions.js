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
  setIsConverting
) => {
  let selectedPages;
  if (!(route === "protect-pdf" || route === "unlock-pdf")) {
    selectedPages = Object.entries(isCheckboxSelected)
      .filter(([key, value]) => value === true)
      .map(([key]) => Number(key));
  }

  setIsModifying(true);
  if (route === "protect-pdf") {
    setIsConverting(true);
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
      setIsModifying(false);
      setIsConverting(false);
      if (route !== "delete-pages") {
        navigateToPage(storedData);
      }
    });
};
