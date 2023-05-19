export const handleApiCall = (
  isCheckboxSelected,
  uploadUrl,
  setIsModifying,
  setUploadUrl,
  route
) => {
  const selectedPages = Object.entries(isCheckboxSelected)
    .filter(([key, value]) => value === true)
    .map(([key]) => Number(key));

  setIsModifying(true);

  fetch(`http://localhost:5000/api/${route}`, {
    method: "POST",
    body: JSON.stringify({ urls: uploadUrl, pages: selectedPages }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text()) // Assuming the response is JSON
    .then((data) => {
      setUploadUrl(data);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setIsModifying(false);
    });
};
