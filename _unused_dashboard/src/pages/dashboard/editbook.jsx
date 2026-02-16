import { Input, Button, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function EditBook() {
  const { id } = useParams(); // get the book ID from URL
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    publisher: "",
    published_year: "",
    language: "",
    isbn: "",
    page_count: "",
    cover_image: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:3000/books/${id}`);
        if (!res.ok) throw new Error("Failed to fetch book");
        const data = await res.json();

        setForm({
          title: data.title || "",
          author: data.author || "",
          genre: data.genre || "",
          description: data.description || "",
          publisher: data.publisher || "",
          published_year: data.published_year || "",
          language: data.language || "",
          isbn: data.isbn || "",
          page_count: data.page_count || "",
          cover_image: data.cover_image || "",
          tags: data.tags || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Book updated successfully!");
      } else {
        toast.error(data.error || "Failed to update book");
      }
    } catch {
      toast.error("Network error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mt-12 mx-auto max-w-4xl">
        {/* Card container for the whole form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <Link
            to="/dashboard/viewbook"
            className="px-4 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 hover:shadow-lg transition duration-300 ease-in-out"
          >
            Back
          </Link>
          <Typography variant="h5" className="font-bold mb-6 text-gray-800 mt-5">
            Edit Book
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Row 1: Title and Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Title" name="title" value={form.title} onChange={handleChange} />
              <Input label="Author" name="author" value={form.author} onChange={handleChange} />
            </div>

            {/* Row 2: Genre and Publisher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Genre" name="genre" value={form.genre} onChange={handleChange} />
              <Input label="Publisher" name="publisher" value={form.publisher} onChange={handleChange} />
            </div>

            {/* Row 3: Published Year and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Published Year" name="published_year" value={form.published_year} onChange={handleChange} />
              <Input label="Language" name="language" value={form.language} onChange={handleChange} />
            </div>

            {/* Row 4: ISBN and Page Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="ISBN" name="isbn" value={form.isbn} onChange={handleChange} />
              <Input label="Page Count" name="page_count" value={form.page_count} onChange={handleChange} />
            </div>

            {/* Row 5: Tags and Cover Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Tags" name="tags" value={form.tags} onChange={handleChange} />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cover_image"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg border border-blue-gray-200 hover:bg-gray-200 transition"
                >
                  Choose File
                </label>
                <input
                  id="cover_image"
                  type="file"
                  accept="image/*"
                  name="cover_image"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setForm({ ...form, cover_image: file });
                  }}
                />
                {form.cover_image && (
                  <img
                    src={
                      form.cover_image instanceof File
                        ? URL.createObjectURL(form.cover_image) // new file selected
                        : `http://localhost:3000${form.cover_image}` // existing image from DB
                    }
                    alt="Cover Preview"
                    className="mt-2 h-48 w-auto object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>

            {/* Row 6: Description */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter Description"
              rows={4}
              className="w-full rounded-lg border border-blue-gray-200 bg-transparent px-3 py-2 text-base text-gray-900 outline-none focus:border-gray-900 focus:ring-0"
            ></textarea>

            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Adding..." : "Update Book"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditBook;
