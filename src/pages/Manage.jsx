import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import loadingIcon from "../assets/loading-icon.svg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Manage() {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState({ id: -1, name: "All" });
  const [selectedDistrict, setSelectedDistrict] = useState({
    id: -1,
    kecamatan: "All",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseURL}/api/customers`, {
      headers: {
        authorization: `${token}`,
      },
    });
    const result = response.data;
    setData(result);
    setFilteredData(result);

    const uniqueCities = [...new Set(result.map((item) => item.kota))].map(
      (name, id) => ({ id, name })
    );
    const uniqueDistricts = [
      ...new Set(result.map((item) => `${item.kota}-${item.kecamatan}`)),
    ].map((item, id) => {
      const [kota, kecamatan] = item.split("-");
      return { id, kota, kecamatan };
    });

    setCities([{ id: -1, name: "All" }, ...uniqueCities]);
    setDistricts([
      { id: -1, kota: "All", kecamatan: "All" },
      ...uniqueDistricts,
    ]);
  };

  const fetchCustomers = async (city, district) => {
    const token = localStorage.getItem("token");

    let url = `${baseURL}/api/customers`;
    if (city !== "All" && district !== "All") {
      url += `?kota=${city}&kecamatan=${district}`;
    } else if (city !== "All") {
      url += `?kota=${city}`;
    }

    const response = await axios.get(url, {
      headers: {
        authorization: `${token}`,
      },
    });
    setData(response.data);
    setFilteredData(response.data);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = data.filter(
      (item) =>
        item.namaCustomer.toLowerCase().includes(value) ||
        item.kota.toLowerCase().includes(value) ||
        item.kecamatan.toLowerCase().includes(value) ||
        item.alamat.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleEdit = (id) => {
    navigate(`/editCustomer/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${baseURL}/api/customers/${id}`, {
      headers: {
        authorization: `${token}`,
      },
    });
    setData(data.filter((item) => item.id !== id));
    setFilteredData(filteredData.filter((item) => item.id !== id));
  };

  const handleDeleteAllConfirmation = () => {
    // Display confirmation dialog (not shown here)
    if (
      window.confirm(
        "Are you sure you want to delete all customers? This action cannot be undone."
      )
    ) {
      handleDeleteAll();
    }
  };

  const handleDeleteAll = async (id) => {
    const token = localStorage.getItem("token");

    try {
      setLoadingStatus(true);
      await axios.delete(`${baseURL}/api/customers`, {
        headers: {
          authorization: `${token}`,
        },
      });
      setData(data.filter((item) => item.id !== id));
      setFilteredData(filteredData.filter((item) => item.id !== id));
      alert("All customers deleted successfully");
      setLoadingStatus(false);
      fetchData();
    } catch (error) {
      alert("Error deleting all customers:", error);
    }
  };

  const filteredDistricts =
    selectedCity.name === "All"
      ? [{ id: -1, kota: "All", kecamatan: "All" }]
      : [
          {
            id: -1,
            kota: selectedCity ? selectedCity.name : "",
            kecamatan: "All",
          },
          ...districts.filter(
            (district) =>
              district.kota === (selectedCity ? selectedCity.name : "All")
          ),
        ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const visiblePages = (currentPage, totalPages) => {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = currentPage - halfVisiblePages;
    let endPage = currentPage + halfVisiblePages;

    // Adjust start and end pages to ensure they stay within bounds
    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(maxVisiblePages, totalPages);
    }
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

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
              className='block mt-2 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
              placeholder='Search by name, city, district, or address'
            />
          </div>
          <div className='w-full'>
            <Listbox
              value={selectedCity}
              onChange={(city) => {
                setSelectedCity(city);
                setSelectedDistrict({ id: -1, kecamatan: "All" });
                fetchCustomers(city.name, "All");
              }}
            >
              {({ open }) => (
                <>
                  <Listbox.Label className='block text-sm font-medium leading-6 text-gray-900'>
                    Kota
                  </Listbox.Label>
                  <div className='relative mt-2'>
                    <Listbox.Button className='relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6'>
                      <span className='block truncate'>
                        {selectedCity.name}
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
                        {cities.map((city) => (
                          <Listbox.Option
                            key={city.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={city}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {city.name}
                                </span>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-blue-600",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
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
          <div className='w-full'>
            <Listbox
              value={selectedDistrict}
              onChange={(district) => {
                setSelectedDistrict(district);
                fetchCustomers(selectedCity.name, district.kecamatan);
              }}
            >
              {({ open }) => (
                <>
                  <Listbox.Label className='block text-sm font-medium leading-6 text-gray-900'>
                    Kecamatan
                  </Listbox.Label>
                  <div className='relative mt-2'>
                    <Listbox.Button className='relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6'>
                      <span className='block truncate'>
                        {selectedDistrict.kecamatan}
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
                        {filteredDistricts.map((district) => (
                          <Listbox.Option
                            key={district.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={district}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {district.kecamatan}
                                </span>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-blue-600",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
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
          <div className='w-full mt-auto flex gap-2'>
            <div className='relative flex gap-2'>
              <button
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'
              >
                <NavLink to='/addCustomer'>
                Add Customer
                </NavLink>
              </button>
            </div>
            <div className='relative flex gap-2'>
              <button
                onClick={() => handleDeleteAllConfirmation()}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50'
              >
                Delete All
              </button>
              <div className='my-auto'>
                {loadingStatus && (
                  <img
                    className='h-8 w-auto'
                    src={loadingIcon}
                    alt='Your Company'
                  />
                )}
              </div>
            </div>
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
                  Action
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Kota
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Kecamatan
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Alamat
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Agreement
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Nama Customer
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Merk
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Warna
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tahun Mobil
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tenor
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Handphone
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Nama Sales
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Max OVD
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tanggal Valid
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
                    <div className='flex'>
                      <button
                        onClick={() => handleEdit(row.id)}
                        className='py-1 px-2 rounded-md bg-blue-500 hover:bg-blue-600 mr-2 text-white text-xs cursor-pointer'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className='py-1 px-2 rounded-md bg-red-500 hover:bg-red-600 mr-2 text-white text-xs cursor-pointer'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.kota}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.kecamatan}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.alamat}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.agreement}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.namaCustomer}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.merk}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.type}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.warna}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.tahunMobil}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.tenor}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.handphone}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.namaSales}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.maxOvd}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {row.tanggalValid}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-between mt-4'>
          <button
            onClick={() => paginate(1)}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'
          >
            First Page
          </button>
          <div className='flex gap-4'>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'
            >
              <svg
                class='w-6 h-6 text-gray-800 dark:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='m15 19-7-7 7-7'
                />
              </svg>
            </button>
            <div className='flex space-x-2'>
              {visiblePages(currentPage, totalPages).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'
            >
              <svg
                class='w-6 h-6 text-gray-800 dark:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='m9 5 7 7-7 7'
                />
              </svg>
            </button>
          </div>
          <button
            onClick={() => paginate(totalPages)}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'
          >
            Last Page
          </button>
        </div>
      </div>
    </>
  );
}
