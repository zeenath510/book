import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserNavbar from "@/components/UserNavbar";
import Footer from "@/components/Footer";

export function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error("Failed to load book details");
        navigate("/user/home");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  if (loading) return <p>Loading book details...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div>
      <UserNavbar />
      <main className="pt-20">
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
          <div className="w-full bg-white shadow-lg rounded-lg p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left side - Book Image */}
              <div className="col-span-12 md:col-span-6 flex items-center justify-center">
                <img
                  src={`http://localhost:3000${book.cover_image}`}
                  alt={book.title}
                  className="w-full h-auto max-h-[500px] object-cover rounded"
                />
              </div>

              {/* Right side - Book Details */}
              <div className="col-span-12 md:col-span-6">
                <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
                <p className="mb-2"><strong>Author:</strong> {book.author}</p>
                <p className="mb-2"><strong>Genre:</strong> {book.genre}</p>
                <p className="mb-2"><strong>Publisher:</strong> {book.publisher}</p>
                <p className="mb-2"><strong>Published Year:</strong> {book.published_year}</p>
                <p className="mb-2"><strong>Language:</strong> {book.language}</p>
                <p className="mb-2"><strong>ISBN:</strong> {book.isbn}</p>
                <p className="mb-2"><strong>Pages:</strong> {book.page_count}</p>
                <p className="mb-2"><strong>Tags:</strong> {book.tags}</p>
                <p className="mt-4 text-gray-700">{book.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BookDetails;
