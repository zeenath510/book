// Native fetch is available in Node.js 18+

const API_URL = "https://book-62p9.onrender.com/api/books"; // Hardcoded to your specific backend

const books = [
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        genre: "Technology",
        publisher: "Prentice Hall",
        publishYear: 2008,
        language: "English",
        pageCount: 464,
        isbn: "978-0132350884",
        tags: ["programming", "coding", "best practices"],
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/41jEbK-jG+L._SX258_BO1,204,203,200_.jpg",
        description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way."
    },
    {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        genre: "Technology",
        publisher: "Addison-Wesley",
        publishYear: 1999,
        language: "English",
        pageCount: 352,
        isbn: "978-0201616224",
        tags: ["programming", "career"],
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX258_BO1,204,203,200_.jpg",
        description: "The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users."
    },
    {
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        genre: "Technology",
        publisher: "MIT Press",
        publishYear: 2009,
        language: "English",
        pageCount: 1312,
        isbn: "978-0262033848",
        tags: ["algorithms", "computer science"],
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/41SNoh5ZhOL._SX258_BO1,204,203,200_.jpg",
        description: "This title covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers."
    }
];

const seedBooks = async () => {
    console.log(`Seeding books to ${API_URL}...`);
    for (const book of books) {
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(book)
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`[SUCCESS] Added: ${book.title}`);
            } else {
                console.error(`[FAILED] ${book.title}:`, data.error || res.statusText);
            }
        } catch (error) {
            console.error(`[ERROR] Connection failed for ${book.title}:`, error.message);
        }
    }
    console.log("Seeding complete!");
};

seedBooks();
