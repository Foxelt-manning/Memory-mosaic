const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export const createMosaic = async (formData) => {
  const response = await fetch(`${API_URL}/mosaics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create mosaic"
    );
  }

  return data;
};

export const getMosaic = async (sharedCode) => {
  const response = await fetch(
    `${API_URL}/mosaics/${sharedCode}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Mosaic not found");
  }

  return data;
};

export const addContribution = async (
  sharedCode,
  contributionData
) => {
  const response = await fetch(
    `${API_URL}/mosaics/${sharedCode}/contributions`,
    {
      method: "POST",
      body: contributionData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to add contribution"
    );
  }

  return data;
};