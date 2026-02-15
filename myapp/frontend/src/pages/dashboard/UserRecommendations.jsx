import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserRecommendations() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [books, setBooks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetch("http://localhost:3000/users"); // API to get all users
        const data = await res.json();
        setUsers(data);
        if (data.length > 0) setSelectedUser(data[0].uid); // default first user
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch books for selected user
  useEffect(() => {
    if (!selectedUser) return;

    const fetchBooks = async () => {
      setLoadingBooks(true);
      try {
        const res = await fetch(
          `http://localhost:3000/users/${selectedUser}/recommendations`
        );
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch books for selected user");
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, [selectedUser]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6 min-h-screen bg-gray-100">
        {/* User Selection */}
        <Card className="mb-6 p-4">
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Select User
          </Typography>
          {loadingUsers ? (
            <Typography>Loading users...</Typography>
          ) : (
            <select
              className="p-2 border rounded w-full md:w-1/3"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.uname}
                </option>
              ))}
            </select>
          )}
        </Card>

        {/* Recommendations Table */}
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6 mt-4">
            <Typography variant="h6" color="white">
              Recommended Books
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {loadingBooks ? (
              <Typography className="p-4">Loading books...</Typography>
            ) : books.length === 0 ? (
              <Typography className="p-4">No recommended books for this user.</Typography>
            ) : (
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Cover", "Title", "Author", "Genre", "Year"].map((el) => (
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
                      key === books.length - 1 ? "" : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={book.bid}>
                        <td className={className}>
                          <Avatar
                            src={`http://localhost:3000${book.cover_image}`}
                            alt={book.title || book.book_title}
                            size="sm"
                            variant="rounded"
                          />
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {book.book_title || book.title}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {book.author}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs text-blue-gray-500">
                            {book.genre}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {book.published_year}
                          </Typography>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
