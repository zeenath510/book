const API_URL = import.meta.env.VITE_API_URL;

export const fetchBooks = async () => { const res = await fetch(`${API_URL}/books`); return res.json(); };

export const loginUser = async (data) => { const res = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); return res.json(); };
