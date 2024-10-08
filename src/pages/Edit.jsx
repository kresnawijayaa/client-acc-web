import React, { useEffect, useState, useCallback  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -5.395489,
  lng: 105.2282571,
};

export default function Edit() {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    kota: "",
    kecamatan: "",
    alamat: "",
    agreement: "",
    namaCustomer: "",
    merk: "",
    type: "",
    warna: "",
    tahunMobil: "",
    tenor: "",
    handphone: "",
    namaSales: "",
    maxOvd: "",
    tanggalValid: "",
  });

  const [mapCenter, setMapCenter] = useState(center);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/customers/${id}`, {
        headers: {
          authorization: `${token}`,
        },
      });
      setCustomer(response.data);
      setMapCenter({ lat: response.data.lat, lng: response.data.lng });
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleMapClick = useCallback((event) => {
    console.log(event.latLng.lat(), event.latLng.lng(), " <<< cek lat lng")
    setCustomer({
      ...customer,
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, [customer]);

  const handleSavePinLocation = () => {
    console.log(customer, "<<< ini cust lama")
    console.log(mapCenter.lat, mapCenter.lng, "<<< ini yg di save")
    setCustomer(prevCustomer => ({
      ...prevCustomer,
      lat: mapCenter.lat,
      lng: mapCenter.lng,
    }));
  };

  useEffect(() => {
    console.log(customer, "<<< ini hasil customer baru");
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.put(`${baseURL}/api/customers/${id}`, customer, {
      headers: {
        authorization: `${token}`,
      },
    });
    navigate('/manageCustomer');
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='my-4 sm:my-8 mx-auto px-4'>
      <form onSubmit={handleSubmit}>
        <div className='space-y-12'>
          <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
            <div>
              <h1 className='text-base font-semibold leading-7 text-gray-900'>
                Edit Customer
              </h1>
              <p className='mt-1 text-sm leading-6 text-gray-600'>
                Edit data customer.
              </p>
            </div>

            <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='kota'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Kota
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='kota'
                    id='kota'
                    value={customer.kota}
                    onChange={handleChange}
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='kecamatan'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Kecamatan
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='kecamatan'
                    id='kecamatan'
                    value={customer.kecamatan}
                    onChange={handleChange}
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='col-span-full'>
                <label
                  htmlFor='alamat'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Alamat
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='alamat'
                    id='alamat'
                    value={customer.alamat}
                    onChange={handleChange}
                    autoComplete='street-address'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='agreement'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Agreement
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='agreement'
                    id='agreement'
                    value={customer.agreement}
                    onChange={handleChange}
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='namaCustomer'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Nama Customer
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='namaCustomer'
                    id='namaCustomer'
                    value={customer.namaCustomer}
                    onChange={handleChange}
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='merk'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Merk
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='merk'
                    id='merk'
                    value={customer.merk}
                    onChange={handleChange}
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='type'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Type
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='type'
                    id='type'
                    value={customer.type}
                    onChange={handleChange}
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='warna'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Warna
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='warna'
                    id='warna'
                    value={customer.warna}
                    onChange={handleChange}
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='tahunMobil'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Tahun Mobil
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='tahunMobil'
                    id='tahunMobil'
                    value={customer.tahunMobil}
                    onChange={handleChange}
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='tenor'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Tenor
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='tenor'
                    id='tenor'
                    value={customer.tenor}
                    onChange={handleChange}
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='handphone'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  No Handphone
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='handphone'
                    id='handphone'
                    value={customer.handphone}
                    onChange={handleChange}
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='namaSales'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Nama Sales
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='namaSales'
                    id='namaSales'
                    value={customer.namaSales}
                    onChange={handleChange}
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='maxOvd'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Max OVD
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='maxOvd'
                    id='maxOvd'
                    value={customer.maxOvd}
                    onChange={handleChange}
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='tanggalValid'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Tanggal Valid
                </label>
                <div className='mt-2'>
                  <input
                    type='date'
                    name='tanggalValid'
                    id='tanggalValid'
                    value={customer.tanggalValid}
                    onChange={handleChange}
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='col-span-full'>
                <label
                  htmlFor='googleMap'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Google Map
                </label>
                <div className='mt-2'>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={14}
                    onClick={handleMapClick}
                  >
                    <Marker position={{ lat: customer.lat, lng: customer.lng }} />
                  </GoogleMap>
                </div>
                <div className='mt-2'>
                  <button
                    type='button'
                    className='border rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={() => setMapCenter({ lat: customer.lat, lng: customer.lng })}
                  >
                    Change Pin Location
                  </button>
                  <button
                    type='button'
                    className='ml-4 rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={handleSavePinLocation}
                  >
                    Save Pin Location
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <button
            type='button'
            className='border rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            onClick={() => navigate('/manageCustomer')}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
