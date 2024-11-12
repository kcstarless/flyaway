
export function setLocalstorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
}

export function getLocalstorageItem(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error(`Error fetching from localStorage: ${error}`);
        return null;
    }
};

export function setSessionstorageItem(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) { 
    console.error(`Error saving to sessionStorage: ${error}`);
  }
}

export function getSessionstorageItem(key) {
    try {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error(`Error fetching from sessionStorage: ${error}`);
        return null;
    }
}; 

export function clearSessionstorage() {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error(`Error clearing sessionStorage: ${error}`);
  }
}

export function clearLocalstorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
  }
}