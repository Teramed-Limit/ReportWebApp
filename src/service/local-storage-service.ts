// Define a generic interface to make sure all stored values have a similar structure

// Define a function to write a value to local storage
function writeToLocalStorage<T>(key: string, value: T): void {
    // Create a new object to store the value and any additional metadata
    // Convert the object to a string and store it in local storage
    localStorage.setItem(key, JSON.stringify(value));
}

// Define a function to read a value from local storage
function getFromLocalStorage<T>(key: string): T | null {
    // Get the string value from local storage
    const storageValue = localStorage.getItem(key);
    // If the value is not null, parse it as a StorageValue object and return the data property
    if (storageValue !== null) {
        return JSON.parse(storageValue);
    }
    // If the value is null, return null
    return null;
}

function removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
}

const LocalStorageService = {
    getFromLocalStorage,
    writeToLocalStorage,
    removeFromLocalStorage,
};

export default LocalStorageService;
