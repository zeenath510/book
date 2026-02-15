import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authorsTableData, projectsTableData } from "@/data";
import { Link } from "react-router-dom";

export function ViewBook() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:3000/books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        toast.error("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Delete book
  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Book deleted successfully!");
        setBooks((prev) => prev.filter((b) => b.bid !== bookId));
      } else {
        toast.error(data.error || "Failed to delete book");
      }
    } catch (err) {
      toast.error("Network error. Try again later.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
                View Books
            </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
                <thead>
                <tr>
                    {["cover image", "title", "author", "language", "published year", "action"].map((el) => (
                    <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                        <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                        {el}
                        </Typography>
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    {books.map((book, key) => {
                    const className = `py-3 px-5 ${
                      key === books.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={book.id}>
                        {/* Cover image */}
                        <td className={className}>
                          <Avatar
                            src={`http://localhost:3000${book.cover_image}`}
                            alt={book.title}
                            size="sm"
                            variant="rounded"
                          />
                        </td>

                        {/* Title */}
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {book.title}
                          </Typography>
                        </td>

                        {/* Author */}
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {book.author}
                          </Typography>
                        </td>

                        {/* Genre */}
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {book.language}
                          </Typography>
                        </td>

                        {/* Year */}
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {book.published_year}
                          </Typography>
                        </td>

                        {/* Action */}
                        <td className={className}>
                            <div className="flex space-x-3">
                                {/* Edit link */}
                                <Link
                                to={`/editbook/${book.bid}`}
                                className="text-blue-500 hover:text-blue-700"
                                >
                                <PencilSquareIcon className="h-5 w-5" />
                                </Link>

                                {/* Delete link */}
                                <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteBook(book.bid, book.title);
                                }}
                                className="text-red-500 hover:text-red-700"
                                >
                                <TrashIcon className="h-5 w-5" />
                                </a>
                            </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
            </table>
            </CardBody>
        </Card>
      </div>
    </>
  );
}

export default ViewBook;
