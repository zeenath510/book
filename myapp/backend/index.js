const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//const BOOKS_DIR = path.join(__dirname, "uploads");

require('dotenv').config();

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_book_recommendation",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
});

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });


// Admin Login
app.post("/login", (req, res) => {
  const { aname, apass } = req.body;

  if (!aname || !apass) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  const query = "SELECT * FROM tbl_admin WHERE aname = ? AND apass = ? LIMIT 1";

  db.query(query, [aname, apass], (err, results) => {
    if (err) {
      console.error("DB query error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ message: "Login successful", user: aname });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  });
});

// Accept multiple fields: cover_image (image), book_file (PDF)
app.post(
  "/books",
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "book_file", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      title,
      author,
      genre,
      description,
      publisher,
      published_year,
      language,
      isbn,
      page_count,
      tags,
    } = req.body;

    const coverImagePath = req.files["cover_image"]
      ? `/uploads/${req.files["cover_image"][0].filename}`
      : null;

    const bookFilePath = req.files["book_file"]
      ? `/uploads/${req.files["book_file"][0].filename}`
      : null;

    const query = `
      INSERT INTO tbl_books 
      (title, author, genre, description, publisher, published_year, language, isbn, page_count, cover_image, book_file, tags) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        title,
        author,
        genre,
        description,
        publisher,
        published_year,
        language,
        isbn,
        page_count,
        coverImagePath,
        bookFilePath,
        tags,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Book added", bookId: result.insertId });
      }
    );
  }
);

// Read - Get all books
app.get("/books", (req, res) => {
  db.query("SELECT * FROM tbl_books", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Read - Get book by ID
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM tbl_books WHERE bid = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(results[0]);
  });
});

// Update - Update book by ID
app.put("/books/:id", upload.single("cover_image"), (req, res) => {
  const { id } = req.params;
  const {
    title,
    author,
    genre,
    description,
    publisher,
    published_year,
    language,
    isbn,
    page_count,
    tags,
  } = req.body;

  let values = [
    title,
    author,
    genre,
    description,
    publisher,
    published_year,
    language,
    isbn,
    page_count,
    tags,
  ];
  let query = `
    UPDATE tbl_books
    SET title = ?,
        author = ?,
        genre = ?,
        description = ?,
        publisher = ?,
        published_year = ?,
        language = ?,
        isbn = ?,
        page_count = ?,
        tags = ?
  `;

  if (req.file) {
    query += `, cover_image = ?`;
    values.push(`/uploads/${req.file.filename}`);
  }

  query += ` WHERE bid = ?`;
  values.push(id);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book updated" });
  });
});

// Delete - Delete book by ID
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tbl_books WHERE bid = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  });
});

// User Login
app.post("/users/login", (req, res) => {
  const { uname, upass } = req.body;

  if (!uname || !upass) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  const sql = "SELECT * FROM tbl_users WHERE uname = ? AND upass = ? LIMIT 1";
  db.query(sql, [uname, upass], (err, results) => {
    if (err) {
      console.error("DB query error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(200).json({
        message: "Login successful",
        user: {
          uid: results[0].uid,
          uname: results[0].uname,
          uemail: results[0].uemail,
          umobile: results[0].umobile,
        },
      });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  });
});

// CREATE a new user
app.post("/users", (req, res) => {
  const { uname, uemail, umobile, upass, genre_like } = req.body;

  const sql =
    "INSERT INTO tbl_users (uname, uemail, umobile, upass, genre_like) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [uname, uemail, umobile, upass, JSON.stringify(genre_like)],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res
        .status(201)
        .json({ message: "User created", userId: result.insertId });
    }
  );
});

// READ all users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM tbl_users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// READ single user by id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM tbl_users WHERE uid = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(result[0]);
  });
});

// UPDATE user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { uname, uemail, umobile, upass } = req.body;
  const sql =
    "UPDATE tbl_users SET uname=?, uemail=?, umobile=?, upass=? WHERE uid=?";
  db.query(sql, [uname, uemail, umobile, upass, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated" });
  });
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tbl_users WHERE uid = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  });
});

//Reports & Analytics
app.get("/reports/most-recommended", (req, res) => {
  const sql = `
    SELECT b.bid, b.title, b.author, b.genre, COUNT(r.bid) AS recommend_count
    FROM tbl_recommendations r
    JOIN tbl_books b ON r.bid = b.bid
    GROUP BY r.bid
    ORDER BY recommend_count DESC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.get("/reports/popular-genres", (req, res) => {
  const sql = `
    SELECT b.genre, COUNT(a.bid) AS activity_count
    FROM tbl_user_activity a
    JOIN tbl_books b ON a.bid = b.bid
    GROUP BY b.genre
    ORDER BY activity_count DESC
    LIMIT 5
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Get book recommendations for a user with optional search
app.get("/users/:uid/recommendations", (req, res) => {
  const { uid } = req.params;
  const { search } = req.query;

  const userSql = "SELECT genre_like FROM tbl_users WHERE uid = ?";
  db.query(userSql, [uid], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ error: "User not found" });

    let genreLikes = [];
    try {
      genreLikes = JSON.parse(results[0].genre_like || "[]");
    } catch {
      genreLikes = [];
    }

    // Base query
    let sql = "SELECT * FROM tbl_books WHERE 1=1";
    const params = [];

    if (search && search.trim() !== "") {
      sql +=
        " AND (title LIKE ? OR author LIKE ? OR description LIKE ? OR genre LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like, like);
    } else if (genreLikes.length > 0) {
      sql += " AND genre IN (?)";
      params.push(genreLikes);
    }

    db.query(sql, params, (err2, books) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json(books);
    });
  });
});

app.get("/stats", (req, res) => {
  // Query both counts
  const sqlUsers = "SELECT COUNT(*) AS total_users FROM tbl_users";
  const sqlBooks = "SELECT COUNT(*) AS total_books FROM tbl_books";

  db.query(sqlUsers, (err, usersResult) => {
    if (err) return res.status(500).json({ error: err });

    db.query(sqlBooks, (err, booksResult) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        total_users: usersResult[0].total_users,
        total_books: booksResult[0].total_books,
      });
    });
  });
});

// ----------------- Recommendation Routes -------------------------------//
// GET all recommendations
app.get("/", (req, res) => {
  const sql = `
      SELECT r.rid, r.uid, r.bid, r.created_at,
             u.first_name, u.last_name, b.title AS book_title
      FROM tbl_recommendations r
      JOIN tbl_users u ON r.uid = u.user_id
      JOIN tbl_books b ON r.bid = b.book_id
      ORDER BY r.created_at DESC
    `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET recommendations by user
app.get("/user/:uid", (req, res) => {
  const { uid } = req.params;
  const sql = `
      SELECT r.rid, r.uid, r.bid, r.created_at,
             b.title AS book_title
      FROM tbl_recommendations r
      JOIN tbl_books b ON r.bid = b.book_id
      WHERE r.uid = ?
      ORDER BY r.created_at DESC
    `;
  db.query(sql, [uid], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET recommendations by book
app.get("/book/:bid", (req, res) => {
  const { bid } = req.params;
  const sql = `
      SELECT r.rid, r.uid, r.bid, r.created_at,
             u.first_name, u.last_name
      FROM tbl_recommendations r
      JOIN tbl_users u ON r.uid = u.user_id
      WHERE r.bid = ?
      ORDER BY r.created_at DESC
    `;
  db.query(sql, [bid], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST: Add a new recommendation
app.post("/", (req, res) => {
  const { uid, bid } = req.body;

  if (!uid || !bid) {
    return res
      .status(400)
      .json({ message: "User ID (uid) and Book ID (bid) are required" });
  }

  const sql = `
      INSERT INTO tbl_recommendations (uid, bid, created_at)
      VALUES (?, ?, NOW())
    `;

  db.query(sql, [uid, bid], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({
      message: "Recommendation added successfully",
      recommendation_id: result.insertId,
      uid,
      bid,
    });
  });
});

app.get("/books/download/:bid", (req, res) => {
  const { bid } = req.params;

  const sql = "SELECT book_file, title FROM tbl_books WHERE bid = ?";
  db.query(sql, [bid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Book not found" });

    const { book_file, title } = results[0];
    if (!book_file) return res.status(404).json({ error: "No file associated with this book" });

    const filePath = path.join(__dirname, book_file);

    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });

    res.download(filePath, `${title}.pdf`, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        return res.status(500).json({ error: "Failed to download file" });
      }
    });
  });
});

// POST /books/download/:bid/:uid
app.post("/books/download/:bid/:uid", (req, res) => {
  const { bid, uid } = req.params;

  // Check if a record already exists
  const checkSql = "SELECT * FROM tbl_downloads WHERE uid = ? AND bid = ?";
  db.query(checkSql, [uid, bid], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      // Record exists, increment times
      const updateSql = "UPDATE tbl_downloads SET times = times + 1 WHERE uid = ? AND bid = ?";
      db.query(updateSql, [uid, bid], (err2) => {
        if (err2) return res.status(500).json({ error: "Failed to update download count" });
        return res.json({ message: "Download recorded" });
      });
    } else {
      // Create new record
      const insertSql = "INSERT INTO tbl_downloads (uid, bid, times) VALUES (?, ?, 1)";
      db.query(insertSql, [uid, bid], (err3) => {
        if (err3) return res.status(500).json({ error: "Failed to record download" });
        return res.json({ message: "Download recorded" });
      });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
