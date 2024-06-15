import axios from "axios";
import { useEffect, useState } from "react";
import "../css/Book.css";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const loader = async () => {
  try {
    const response = await axios.get(
      `https://665eb3151e9017dc16f0f849.mockapi.io/Dashboard`
    );
    console.log({ data: response.data });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to Fetch user:`, error);
    return null;
  }
};

const BookData = () => {
  const [books, setBooks] = useState([]);
  const [showInputRow, setShowInputRow] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loader();
        if (data) {
          setBooks(data.data);
        }
      } catch (error) {
        console.error(`Failed to fetch data:`, error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      author: "",
      isbn: "",
      publication: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) {
        errors.title = "Title Required";
      }
      if (!values.author) {
        errors.author = "Author Name Required";
      }
      if (!values.isbn) {
        errors.isbn = "ISBN Required";
      }
      if (!values.publication) {
        errors.publication = "Publication Date Required";
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingBookId !== null) {
          const response = await axios.put(
            `https://665eb3151e9017dc16f0f849.mockapi.io/Dashboard/${editingBookId}`,
            values
          );
        } else {
          const response = await axios.post(
            `https://665eb3151e9017dc16f0f849.mockapi.io/Dashboard`,
            values
          );
        }

        const data = await loader();
        if (data) {
          setBooks(data.data);
        }

        resetForm();
        setShowInputRow(false);
        setEditingBookId(null);
      } catch (error) {
        console.log(`Error Found:`, error);
      }
    },
  });

  const handleAddButtonClick = () => {
    setShowInputRow(true);
    setEditingBookId(null);
    formik.resetForm(); 
  };

  const handleEditButtonClick = (bookId) => {
    setEditingBookId(bookId);
    setShowInputRow(true); 
    const bookToEdit = books.find((book) => book.id === bookId);
    if (bookToEdit) {
      formik.setValues(bookToEdit); 
    }
  };

  const handleDelete = async (bookId) => {
    try {
      const response = await axios.delete(
        `https://665eb3151e9017dc16f0f849.mockapi.io/Dashboard/${bookId}`
      );

      const data = await loader();
      if (data) {
        setBooks(data.data);
      }
    } catch (error) {
      console.log(`Error Found:`, error);
    }
  };

  const handleExitButtonClick = () => {
    formik.resetForm();
    setShowInputRow(false);
    setEditingBookId(null);
  };

  return (
    <div className="BookData">
      <div className="topButtons">
        {!showInputRow && (
          <button className="addBookButton btn" onClick={handleAddButtonClick}>
            <FontAwesomeIcon icon={faPlus} /> Add Book
          </button>
        )}
        {showInputRow && (
          <div className="inputRow">
            <input
              placeholder="Title"
              type="text"
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="error">{formik.errors.title}</div>
            ) : null}
            <input
              placeholder="Author"
              type="text"
              {...formik.getFieldProps("author")}
            />
            {formik.touched.author && formik.errors.author ? (
              <div className="error">{formik.errors.author}</div>
            ) : null}
            <input
              placeholder="ISBN No"
              type="text"
              {...formik.getFieldProps("isbn")}
            />
            {formik.touched.isbn && formik.errors.isbn ? (
              <div className="error">{formik.errors.isbn}</div>
            ) : null}
            <input
              placeholder="Published On"
              type="text"
              {...formik.getFieldProps("publication")}
            />
            {formik.touched.publication && formik.errors.publication ? (
              <div className="error">{formik.errors.publication}</div>
            ) : null}
            <button className="btn" type="button" onClick={formik.handleSubmit}>
              {editingBookId !== null ? "Update" : "Add"}
            </button>
            <button className="btn" type="button" onClick={handleExitButtonClick}>
              Exit
            </button>
          </div>
        )}
      </div>

      <table className="bookTable">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN Number</th>
            <th>Publication</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.isbn}</td>
              <td>{book.publication}</td>
              <td>
                <button onClick={() => handleEditButtonClick(book.id)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <br />
                <button onClick={() => handleDelete(book.id)}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookData;
export { loader };
