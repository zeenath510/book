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

export function ViewUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("User deleted successfully!");
        setUsers((prev) => prev.filter((u) => u.uid !== userId));
      } else {
        toast.error(data.error || "Failed to delete user");
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
                View Users
            </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
                <thead>
                <tr>
                    {["Name", "Email", "Comtact", "action"].map((el) => (
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
                    {users.map((user, key) => {
                    const className = `py-3 px-5 ${
                      key === users.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={user.uid}>
                        {/* Title */}
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {user.uname}
                          </Typography>
                        </td>

                        {/* Author */}
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user.uemail}
                          </Typography>
                        </td>

                        {/* Genre */}
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {user.umobile}
                          </Typography>
                        </td>

                        {/* Action */}
                        <td className={className}>
                            <div className="flex space-x-3">
                                
                                {/* Delete link */}
                                <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteUser(user.uid, user.uname);
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

export default ViewUsers;
