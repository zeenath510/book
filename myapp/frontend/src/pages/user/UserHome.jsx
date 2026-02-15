import Footer from "@/components/Footer";
import UserNavbar from "@/components/UserNavbar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export function UserHome() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ search state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/auth/user-sign-in");
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/books");
        const allBooks = response.data;

        setBooks(allBooks);

        // extract unique authors & genres
        setAuthors([...new Set(allBooks.map((b) => b.author))]);
        setGenres([...new Set(allBooks.map((b) => b.genre))]);
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [navigate, user]);

  // ✅ useMemo for filtering (authors, genres, search)
  const filteredBooks = useMemo(() => {
    let result = books;

    if (selectedAuthors.length > 0) {
      result = result.filter((b) => selectedAuthors.includes(b.author));
    }

    if (selectedGenres.length > 0) {
      result = result.filter((b) => selectedGenres.includes(b.genre));
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.genre.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [books, selectedAuthors, selectedGenres, searchQuery]);

  // toggle author filter
  const handleAuthorChange = (author) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  // toggle genre filter
  const handleGenreChange = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <div>
      <UserNavbar />
      <main className="pt-20">
        <div className="min-h-screen bg-gray-100 p-6">
          <ToastContainer position="top-right" autoClose={3000} />

          {loading ? (
            <p>Loading books...</p>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              {/* Sidebar: Authors, Genres, Search */}
              <aside className="col-span-12 md:col-span-3 bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Authors</h2><hr />
                <div className="mb-6 mt-4">
                  {authors.map((author) => (
                    <label key={author} className="block mb-2">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedAuthors.includes(author)}
                        onChange={() => handleAuthorChange(author)}
                      />
                      {author}
                    </label>
                  ))}
                </div>

                <h2 className="text-lg font-semibold mb-3">Genres</h2><hr />
                <div className="mt-4 mb-6">
                  {genres.map((genre) => (
                    <label key={genre} className="block mb-2">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleGenreChange(genre)}
                      />
                      {genre}
                    </label>
                  ))}
                </div>

                {/* ✅ Search Box */}
                <h2 className="text-lg font-semibold mb-3">Search</h2><hr />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-4 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                />
              </aside>

              {/* Book Cards */}
              <section className="col-span-12 md:col-span-9">
                {filteredBooks.length === 0 ? (
                  <p>No books found for selected filters/search.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredBooks.map((book) => (
                      <div
                        key={book.bid}
                        className="bg-white shadow-md rounded-lg p-4 flex flex-col"
                      >
                        <img
                          src={`http://localhost:3000${book.cover_image}`}
                          alt={book.title}
                          className="h-48 w-full object-cover rounded mb-4"
                        />
                        <h2 className="text-xl font-semibold mb-2">
                          {book.title}
                        </h2>
                        <p className="text-gray-600 mb-1">
                          <strong>Author:</strong> {book.author}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Genre:</strong> {book.genre}
                        </p>
                        <p className="text-gray-600 line-clamp-3">
                          {book.description}
                        </p>
                        <button
                          onClick={() => navigate(`/user/book/${book.bid}`)}
                          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UserHome;
