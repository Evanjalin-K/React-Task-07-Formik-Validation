import React from 'react';
import { RouterProvider, createBrowserRouter, Link } from 'react-router-dom';
import BookData from './components/BookData';
import { loader as BooksLoader } from './components/BookData';
import Dashboard from './components/Dashboard';
import "./App.css";
import AuthorsData from './components/AuthorsData';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: [
      {
        path: '/',
        element: (
          <div className='cards container'>
              <Link to="/bookdata" className='link'>
                <div className="card1 card">
                  <img src="https://www.wallpapermania.eu/images/lthumbs/2015-01/7381_Magic-stories-and-beautiful-books-HD-wallpaper.jpg" alt="" />
                  <h2 className='book text-center fw-bold'>BOOKS</h2>
                </div>
                </Link>
                 <Link to="/authorsdata" className='link'>
                <div className="card2 card">
                  <img src="https://www.discoverwalks.com/blog/wp-content/uploads/2019/01/optimized-writing-hand-pen-black-paper-ink-35194-pxhere.com-1.jpg" alt="" />
                  <h2 className='author text-center fw-bold'>AUTHORS</h2>

                </div>
              </Link>
            </div>
        ),
      },
      {
        path: "/bookdata",
        element: <BookData />,
        loader: BooksLoader
      },
      {
        path: "/authorsdata",
        element: <AuthorsData />,
        loader: BooksLoader
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
