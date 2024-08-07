// routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../pages/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Form from '../pages/Form';
import Bulk from '../pages/Bulk';
import Manage from '../pages/Manage';
import Edit from '../pages/Edit';
import Users from '../pages/Users';
import Reset from '../pages/Reset';
import ProtectedRoute from '../middlewares/ProtectedRoute';
import PublicRoute from '../middlewares/PublicRoute';

const router = createBrowserRouter([
  {
    path: '*',
    element: <div>Page Not Found</div>,
  },
  {
    path: '/login',
    element: (
        <PublicRoute element={<Login />} />
    ),
  },
  {
    path: '/register',
    element: (
        <PublicRoute element={<Register />} />
    ),
  },
  {
    path: '/reset',
    element: (
        <PublicRoute element={<Reset />} />
    ),
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
            <ProtectedRoute element={<Home />} />
        ),
      },
      {
        path: '/manageCustomer',
        element: (
            <ProtectedRoute element={<Manage />} />
        ),
      },
      {
        path: '/addCustomer',
        element: (
            <ProtectedRoute element={<Form />} />
        ),
      },
      {
        path: '/bulkAddCustomer',
        element: (
            <ProtectedRoute element={<Bulk />} />
        ),
      },
      {
        path: '/editCustomer/:id',
        element: (
            <ProtectedRoute element={<Edit />} />
        ),
      },
      {
        path: '/users',
        element: (
            <ProtectedRoute element={<Users />} />
        ),
      },
    ],
  },
]);

export default router;
