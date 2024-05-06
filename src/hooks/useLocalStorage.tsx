type usestore = {
  name: string;
  obj?: any;
};

export const getLocalStoreData = ({ name }: usestore) => {
  const storedData = localStorage.getItem(name);
  return storedData ? JSON.parse(storedData) : [];
};

export const setLocalStoreData = ({ name, obj }: usestore) => {
  // Get existing data
  const existingData = getLocalStoreData({ name });

  if (existingData.length > 0) {
    const updatedData = [...existingData, obj];
    localStorage.setItem(name, JSON.stringify(updatedData));
  } else {
    localStorage.setItem(name, JSON.stringify([obj]));
  }
};
