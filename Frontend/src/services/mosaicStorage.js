const STORAGE_KEY = "memory-mosaic-recent";
const MAXIMUM_MOSAICS = 12;

const relationshipPriority = {
  visitor: 1,
  contributor: 2,
  creator: 3,
};

export const getSavedMosaics = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedMosaics = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    return Array.isArray(savedMosaics) ? savedMosaics : [];
  } catch {
    return [];
  }
};

export const saveMosaic = (
  mosaic,
  relationship = "visitor"
) => {
  if (!mosaic?.sharedCode) {
    return;
  }

  const savedMosaics = getSavedMosaics();

  const existingMosaic = savedMosaics.find(
    (item) => item.sharedCode === mosaic.sharedCode
  );

  const existingPriority =
    relationshipPriority[existingMosaic?.relationship] || 0;

  const newPriority =
    relationshipPriority[relationship] || 0;

  const savedRelationship =
    existingPriority > newPriority
      ? existingMosaic.relationship
      : relationship;

  const mosaicToSave = {
    sharedCode: mosaic.sharedCode,
    title:
      mosaic.title ||
      existingMosaic?.title ||
      "Untitled mosaic",
    recipientName:
      mosaic.recipientName ||
      existingMosaic?.recipientName ||
      "",
    creatorName:
      mosaic.creatorName ||
      existingMosaic?.creatorName ||
      "",
    occasion:
      mosaic.occasion ||
      existingMosaic?.occasion ||
      "",
    relationship: savedRelationship,
    lastVisitedAt: new Date().toISOString(),
  };

  const updatedMosaics = [
    mosaicToSave,
    ...savedMosaics.filter(
      (item) => item.sharedCode !== mosaic.sharedCode
    ),
  ].slice(0, MAXIMUM_MOSAICS);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedMosaics)
  );

  window.dispatchEvent(
    new Event("mosaic-storage-updated")
  );
};

export const removeSavedMosaic = (sharedCode) => {
  const updatedMosaics = getSavedMosaics().filter(
    (mosaic) => mosaic.sharedCode !== sharedCode
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedMosaics)
  );

  window.dispatchEvent(
    new Event("mosaic-storage-updated")
  );
};

export const clearSavedMosaics = () => {
  localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(
    new Event("mosaic-storage-updated")
  );
};