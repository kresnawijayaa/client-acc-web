import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const statusOptions = [
  { id: 1, name: "All" },
  { id: 2, name: "Active" },
  { id: 3, name: "Inactive" },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${baseURL}/api/users`, {
        headers: {
          authorization: `${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${baseURL}/api/users/${id}`, {
        headers: {
          authorization: `${token}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const checkStatus = (verifiedDate) => {
    const now = new Date();
    const verified = new Date(verifiedDate._seconds * 1000);
    const differenceInDays = (now - verified) / (1000 * 60 * 60 * 24);
    return differenceInDays <= 7 ? "Active" : "Inactive";
  };

  const filteredUsers = users.filter((user) => {
    const status = checkStatus(user.verified_date);
    return (
      (selectedStatus.name === "All" || status === selectedStatus.name) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * usersPerPage;
  const indexOfFirstItem = indexOfLastItem - usersPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <div className='my-4 mx-auto px-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='w-full'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Search
            </label>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearch}
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder='Search by name or email address'
            />
          </div>
          <div className='w-full'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Status
            </label>
            <Listbox
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              {({ open }) => (
                <>
                  <div className='relative mt-2'>
                    <Listbox.Button className='relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                      <span className='block truncate'>
                        {selectedStatus.name}
                      </span>
                      <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                        <ChevronUpDownIcon
                          className='h-5 w-5 text-gray-400'
                          aria-hidden='true'
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave='transition ease-in duration-100'
                      leaveFrom='opacity-100'
                      leaveTo='opacity-0'
                    >
                      <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                        {statusOptions.map((status) => (
                          <Listbox.Option
                            key={status.id}
                            className={({ active }) =>
                              `${
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900"
                              } relative cursor-default select-none py-2 pl-3 pr-9`
                            }
                            value={status}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`${
                                    selected ? "font-semibold" : "font-normal"
                                  } block truncate`}
                                >
                                  {status.name}
                                </span>

                                {selected ? (
                                  <span
                                    // className={active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4'}
                                    className={`${
                                      active ? "text-white" : "text-indigo-600"
                                    } absolute inset-y-0 right-0 flex items-center pr-4`}
                                  >
                                    <CheckIcon
                                      className='h-5 w-5'
                                      aria-hidden='true'
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>
        </div>

        <div className='w-full overflow-x-auto mt-4'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  No.
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Nama
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  No Telp
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tanggal Register
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {currentItems.map((row, index) => (
                <tr key={index}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        checkStatus(row.verified_date) === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {checkStatus(row.verified_date)}
                    </span>
                  </td>

                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.role}
                  </td>

                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.phone}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(
                      row.createdAt._seconds * 1000
                    ).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div className='flex'>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className='py-1 px-2 rounded-md bg-red-500 hover:bg-red-600 mr-2 text-white text-xs cursor-pointer'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-between mt-4'>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50'
          >
            Previous
          </button>
          <div className='flex space-x-2'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-indigo-600"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
