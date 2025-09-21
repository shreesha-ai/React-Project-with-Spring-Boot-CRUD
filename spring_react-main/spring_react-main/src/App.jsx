import React, { useEffect, useState } from "react";
import axios from "axios";


const BASE_URL = "http://localhost:7583/api"; 

export default function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: 0,
    publicationYear: 2000,
  });
  const [editingId, setEditingId] = useState(null);


  const loadBooks = async () => {
    try {
      const url = `${BASE_URL}/books`;   
      const res = await axios.get(url);
      setBooks(res.data);
    } catch (e) {
      console.error("Fail...", e);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const saveBook = async (e) => {
    e.preventDefault();
    try {
      if (editingId == null) {
        const res = await axios.post(`${BASE_URL}/books`, form);   
        setBooks([res.data, ...books]);
      } else {
        const res = await axios.put(`${BASE_URL}/books/${editingId}`, form);  
        setBooks(books.map((b) => (b.id === editingId ? res.data : b)));
      }
  
      setForm({ title: "", author: "", price: 0, publicationYear: 2000 });
      setEditingId(null);
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const editBook = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      price: book.price,
      publicationYear: book.publicationYear,
    });
  };


  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await axios.delete(`${BASE_URL}/books/${id}`);  
      setBooks(books.filter((b) => b.id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Book Manager</h1>

      <form onSubmit={saveBook} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Year"
          value={form.publicationYear}
          onChange={(e) =>
            setForm({ ...form, publicationYear: Number(e.target.value) })
          }
        />
        <button type="submit">{editingId == null ? "Add" : "Update"}</button>
        {editingId != null && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                author: "",
                price: 0,
                publicationYear: 2000,
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table
        border="1"
        cellPadding="6"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books != [] && books.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.price}</td>
              <td>{b.publicationYear}</td>
              <td>
                <button onClick={() => editBook(b)}>Edit</button>
                <button onClick={() => deleteBook(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}