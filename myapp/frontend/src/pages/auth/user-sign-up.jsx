import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Tags from "@yaireo/tagify/dist/react.tagify"; 
import "@yaireo/tagify/dist/tagify.css";

export function UserSignUp() {
  const [uname, setUname] = useState("");
  const [uemail, setUemail] = useState("");
  const [umobile, setUmobile] = useState("");
  const [upass, setUpass] = useState("");
  const [genreOptions, setGenreOptions] = useState([]);
  const [genreLike, setGenreLike] = useState([]); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch genres from books table
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get("http://localhost:3000/books");
        const uniqueGenres = [...new Set(res.data.map((b) => b.genre))];
        setGenreOptions(uniqueGenres.map((g) => ({ value: g })));
      } catch (err) {
        console.error("Error fetching genres", err);
      }
    };
    fetchGenres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uname || !uemail || !umobile || !upass) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uname,
          uemail,
          umobile,
          upass,
          genre_like: genreLike.map((g) => g.value),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/auth/user-sign-in");
        }, 1500);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">
              Sign Up
            </Typography>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal"
            >
              Create your account to get started
            </Typography>
          </div>

          <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input
              size="lg"
              placeholder="Enter Your Name"
              value={uname}
              onChange={(e) => setUname(e.target.value)}
            />

            <Input
              size="lg"
              type="email"
              placeholder="Enter Your Email"
              value={uemail}
              onChange={(e) => setUemail(e.target.value)}
            />

            <Input
              size="lg"
              placeholder="Enter Your Mobile No"
              value={umobile}
              onChange={(e) => setUmobile(e.target.value)}
            />

            <Input
              size="lg"
              type="password"
              placeholder="Enter Your Password"
              value={upass}
              onChange={(e) => setUpass(e.target.value)}
            />

            <div className="w-full">
              <Typography variant="small" color="blue-gray">
                Enter Your Favorite Genres
              </Typography>
              <Tags
                className="w-full"   
                style={{ width: "100%" }}
                settings={{
                  whitelist: genreOptions,
                  dropdown: {
                    enabled: 1,
                    maxItems: 10,
                    closeOnSelect: false,
                  },
                }}
                onChange={(e) => {
                  try {
                    const values = e.detail.value ? JSON.parse(e.detail.value) : [];
                    setGenreLike(values);
                  } catch (err) {
                    setGenreLike([]);
                  }
                }}
              />
            </div>

            <Button className="mt-6" fullWidth disabled={loading} type="submit">
              {loading ? "Registering..." : "Register Now"}
            </Button>

            <Typography
              variant="paragraph"
              className="text-center text-blue-gray-500 font-medium mt-4"
            >
              Already have an account?
              <Link to="/auth/user-sign-in" className="text-gray-900 ml-1">
                Sign in
              </Link>
            </Typography>
          </form>
        </div>
      </section>
    </>
  );
}

export default UserSignUp;
