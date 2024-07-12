//routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../pages/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Form from '../pages/Form';
import Bulk from '../pages/Bulk';

const router = createBrowserRouter([
  {
    path: '*',
    element: <div>Page Not Found</div>,
  },
  {
    path: '/login',
    element: (
        <Login />
    ),
  },
  {
    path: '/register',
    element: (
        <Register />
    ),
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
            <Home />
        ),
      },
      {
        path: '/addCustomer',
        element: (
            <Form />
        ),
      },
      {
        path: '/bulkAddCustomer',
        element: (
            <Bulk />
        ),
      },
    ],
  },
]);

export default router;
