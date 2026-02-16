import { Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AddBook() {
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
    tags: "",
    cover_image: null,
    book_file: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) formData.append(key, form[key]);
    });

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/books", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Book added successfully!");
        setForm({
          title: "",
          author: "",
          genre: "",
          description: "",
          publisher: "",
          published_year: "",
          language: "",
          isbn: "",
          page_count: "",
          tags: "",
          cover_image: null,
          book_file: null,
        });
      } else {
        toast.error(data.error || "Failed to add book.");
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
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <Typography variant="h5" className="font-bold mb-6 text-gray-800">
            Add Book
          </Typography>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title and Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Title" name="title" value={form.title} onChange={handleChange} />
              <Input label="Author" name="author" value={form.author} onChange={handleChange} />
            </div>

            {/* Genre and Publisher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Genre" name="genre" value={form.genre} onChange={handleChange} />
              <Input label="Publisher" name="publisher" value={form.publisher} onChange={handleChange} />
            </div>

            {/* Published Year and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Published Year" name="published_year" value={form.published_year} onChange={handleChange} />
              <Input label="Language" name="language" value={form.language} onChange={handleChange} />
            </div>

            {/* ISBN and Page Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="ISBN" name="isbn" value={form.isbn} onChange={handleChange} />
              <Input label="Page Count" name="page_count" value={form.page_count} onChange={handleChange} />
            </div>

            {/* Tags, Cover Image, Book PDF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Tags" name="tags" value={form.tags} onChange={handleChange} />

              <div className="flex flex-col gap-2">
                {/* Cover Image */}
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg border border-blue-gray-200 hover:bg-gray-200 transition">
                  Choose Cover Image
                  <input
                    type="file"
                    name="cover_image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {form.cover_image && (
                  <img
                    src={URL.createObjectURL(form.cover_image)}
                    alt="Cover Preview"
                    className="mt-2 h-32 w-auto object-cover rounded-lg border"
                  />
                )}

                {/* Book PDF */}
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg border border-blue-gray-200 hover:bg-gray-200 transition mt-2">
                  Choose PDF
                  <input
                    type="file"
                    name="book_file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {form.book_file && <p className="mt-1 text-sm text-gray-600">{form.book_file.name}</p>}
              </div>
            </div>

            {/* Description */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter Description"
              rows={4}
              className="w-full rounded-lg border border-blue-gray-200 bg-transparent px-3 py-2 text-base text-gray-900 outline-none focus:border-gray-900 focus:ring-0"
            ></textarea>

            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Adding..." : "Add Book"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddBook;
