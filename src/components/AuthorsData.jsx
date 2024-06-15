import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import "../css/Author.css"
import axios from 'axios';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export const loader = async () => {
  try {
    const response = await axios.get(
      `https://665eb3151e9017dc16f0f849.mockapi.io/Author`
    );
    console.log({ data: response.data });
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to Fetch user:`, error);
    return null;
  }
};

const AuthorsData = () => {
  const { data: authorList } = useLoaderData();
  const [authors, setAuthors] = useState([]);
  const [showInputRow, setShowInputRow] = useState(false);
  const [editingAuthorId, setEditingAuthorId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Adata = await loader();

        if (Adata) {
          setAuthors(Adata.data); 
        }
      } catch (error) {
        console.error(`Failed to fetch data:`, error);
      }
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      dob: '',
      biography: ''
    },
    validate: (values) => {
      const errors = {};

      if (!values.name) {
        errors.name = 'Author Name Required';
      }
      if (!values.dob) {
        errors.dob = 'Dob is Required';
      }
      if (!values.biography) {
        errors.biography = 'Biography Required';
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingAuthorId !== null) {
          await axios.put(`https://665eb3151e9017dc16f0f849.mockapi.io/Author/${editingAuthorId}`, values);
        } else {
          await axios.post(`https://665eb3151e9017dc16f0f849.mockapi.io/Author`, values);
        }
        
        const data = await loader();
        if (data) {
          setAuthors(data.data);
        }
        resetForm();
        setShowInputRow(false);
        setEditingAuthorId(null);
      } catch (error) {
        console.log(`Error Found:`, error)
      }
    },
  });

  const handleAddButtonAuthor = () => {
    setShowInputRow(true);
    setEditingAuthorId(null);
  };

  const handleExitButtonClick = () => {
    setShowInputRow(false);
    formik.resetForm();
    setEditingAuthorId(null);
  };

  const handleEditButton = (authorId) => {
    setEditingAuthorId(authorId);

    const authorToEdit = authors.find((author) => author.id === authorId);

    if (authorToEdit) {
      formik.setValues(authorToEdit);
      setShowInputRow(true);
    }
  };

  const handleDelAuthor = async (authorId) => {
    try {
      await axios.delete(`https://665eb3151e9017dc16f0f849.mockapi.io/Author/${authorId}`);
      const data = await loader();
      if (data) {
        setAuthors(data.data);
      }
    } catch (error) {
      console.log(`Error Found:`, error);
    }
  };

  return (
    <div>
      <button className='addAuthor btn' type='button' onClick={handleAddButtonAuthor}><FontAwesomeIcon icon={faPlus} color="black" /> Add Author</button>
      
      {showInputRow && (
        <div className="inputRow">
          <input
            type="text" placeholder='Author'{...formik.getFieldProps('name')}/>
          {formik.touched.name && formik.errors.name && (
            <div className='error'>{formik.errors.name}</div>
          )}
          
          <input type="text"placeholder='Author DOB'{...formik.getFieldProps('dob')}/>
          {formik.touched.dob && formik.errors.dob && (
            <div className='error'>{formik.errors.dob}</div>
          )}
          
          <input type="text" placeholder='Biography' {...formik.getFieldProps('biography')}/>
          {formik.touched.biography && formik.errors.biography && (
            <div className='error'>{formik.errors.biography}</div>
          )}
          
          <button className='addInput btn' type='button' onClick={formik.handleSubmit}>
            {editingAuthorId !== null ? 'Update' : 'Add'}
          </button>
          <button className='exitInput btn' type='button' onClick={handleExitButtonClick}>
            Exit
          </button>
        </div>
      )}
      
      <table className='tableA'>
        <thead>
          <tr>
            <th>Author</th>
            <th>DOB</th>
            <th>Biography</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map(author => (
            <tr key={author.id}>
              <td>
                {author.name}
              </td>
              <td>
                {author.dob}
              </td>
              <td>
                {author.biography}
              </td>
              <td>
                <button onClick={() => handleEditButton(author.id)}><FontAwesomeIcon icon={faEdit} color="black" className='edit' /> Edit</button>
                <br />
                <button onClick={() => handleDelAuthor(author.id)}><FontAwesomeIcon icon={faTrash} color="black" className='del' /> Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorsData;
