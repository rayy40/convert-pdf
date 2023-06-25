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
  rotation,
  setRotation,
  operation
) => {
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
    setIsUploading(false);
    setShowInput(false);
  }
  let storedData;

  fetch(`https://convert-pdf.onrender.com/api/${route}`, {
    method: "POST",
    body: JSON.stringify({
      urls: uploadUrl,
      pages: selectedPages,
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
