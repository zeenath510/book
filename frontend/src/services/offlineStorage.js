import { openDB } from "idb";

const DB_NAME = "book-reader-db";
const STORE_NAME = "books";

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
};

export const saveBookOffline = async (bookId, blob) => {
    const db = await initDB();
    await db.put(STORE_NAME, blob, bookId);
};

export const getOfflineBook = async (bookId) => {
    const db = await initDB();
    return db.get(STORE_NAME, bookId);
};

export const isBookOffline = async (bookId) => {
    const db = await initDB();
    const book = await db.get(STORE_NAME, bookId);
    return !!book;
};

export const removeOfflineBook = async (bookId) => {
    const db = await initDB();
    await db.delete(STORE_NAME, bookId);
};
