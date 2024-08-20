import React, { Fragment, useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import Loading from "../components/Loading";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [mapselectedCustomer, setMapselectedCustomer] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedCity, setSelectedCity] = useState({ id: -1, name: "All" });
  const [selectedDistrict, setSelectedDistrict] = useState({
    id: -1,
    kecamatan: "All",
  });
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAP_API;
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const defaultCenter = {
    lat: -5.395489,
    lng: 105.2282571,
  };

  const mapStyles = {
    height: "75vh",
    width: "100%",
  };

  const handleLoadMap = useCallback(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          fetchAddress(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setMapCenter(defaultCenter);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId); // Cleanup on component unmount
    } else {
      console.log("Geolocation not supported by this browser.");
      setMapCenter(defaultCenter);
    }
  }, []);

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
      );

      if (response.data.status === "OK") {
        setCurrentAddress(response.data.results[0].formatted_address);
      } else {
        setCurrentAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setCurrentAddress("Error fetching address");
    }
  };

  useEffect(() => {
    const fetchCitiesAndDistricts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`${baseURL}/api/customers`, {
          headers: { authorization: `${token}` },
        });

        const uniqueCities = [
          ...new Set(response.data.map((item) => item.kota)),
        ].map((name, id) => ({ id, name }));
        const uniqueDistricts = [
          ...new Set(
            response.data.map((item) => `${item.kota}-${item.kecamatan}`)
          ),
        ].map((item, id) => {
          const [kota, kecamatan] = item.split("-");
          return { id, kota, kecamatan };
        });

        setCities([{ id: -1, name: "All" }, ...uniqueCities]);
        setDistricts([
          { id: -1, kota: "All", kecamatan: "All" },
          ...uniqueDistricts,
        ]);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json`;

              try {
                const responselatlng = await axios.get(geocodeUrl, {
                  params: {
                    latlng: `${lat},${lng}`,
                    key: googleMapsApiKey,
                  },
                });

                if (responselatlng.data.status !== "OK") {
                  throw new Error(
                    "Failed to get geocode information from Google Maps API"
                  );
                }

                const results = responselatlng.data.results;
                let city = null;
                let district = null;

                results.forEach((result) => {
                  result.address_components.forEach((component) => {
                    if (
                      component.types.includes("administrative_area_level_2")
                    ) {
                      district = component.long_name;
                    }
                    if (
                      component.types.includes("administrative_area_level_1")
                    ) {
                      city = component.long_name;
                    }
                  });
                });

                let userCity = city || "All";
                const userDistrict = district || "All";

                if (!uniqueCities.find((c) => c.name === userCity)) {
                  userCity = "All";
                }

                setSelectedCity({ id: 0, name: userCity });
                fetchCustomers(
                  position.coords.latitude,
                  position.coords.longitude,
                  userCity,
                  userDistrict
                );
              } catch (error) {
                console.error("Error fetching geocode information:", error);
                setSelectedCity({ id: -1, name: "All" });
                setSelectedDistrict({ id: -1, kecamatan: "All" });
                fetchCustomers(
                  defaultCenter.lat,
                  defaultCenter.lng,
                  "All",
                  "All"
                );
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              setSelectedCity({ id: -1, name: "All" });
              setSelectedDistrict({ id: -1, kecamatan: "All" });
              fetchCustomers(
                defaultCenter.lat,
                defaultCenter.lng,
                "All",
                "All"
              );
            }
          );
        } else {
          setSelectedCity({ id: -1, name: "All" });
          setSelectedDistrict({ id: -1, kecamatan: "All" });
          fetchCustomers(defaultCenter.lat, defaultCenter.lng, "All", "All");
        }
      } catch (error) {
        console.error("Error fetching cities and districts:", error);
      }
    };

    fetchCitiesAndDistricts().finally(() => setLoading(false));
  }, []);

  const fetchCustomers = async (lat, lng, city, district) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const encodedDistrict = encodeURIComponent(district);
      const encodedCity = encodeURIComponent(city);
      let url = "";

      if (district !== "All" && city !== "All") {
        url = `${baseURL}/api/customers/nearby?lat=${lat}&lng=${lng}&radius=1000&kecamatan=${encodedDistrict}&kota=${encodedCity}`;
      } else {
        url = `${baseURL}/api/customers/nearby?lat=${lat}&lng=${lng}&radius=1000&kecamatan=&kota=`;
      }

      const response = await axios.get(url, {
        headers: {
          authorization: `${token}`,
        },
      });

      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${baseURL}/api/customers/${customerId}`,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );
      setSelectedCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
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

  return (
    <>
      <div className='sm:flex'>
        <div className='sm:w-2/3 flex flex-col-reverse sm:flex-col'>
          <div className='p-4 w-full gap-x-8 sm:flex'>
            <div className='w-full'>
              <Listbox
                value={selectedCity}
                onChange={(city) => {
                  setSelectedCity(city);
                  if (city.name === "All") {
                    setSelectedDistrict({ id: -1, kecamatan: "All" });
                    fetchCustomers(
                      currentLocation ? currentLocation.lat : defaultCenter.lat,
                      currentLocation ? currentLocation.lng : defaultCenter.lng,
                      "All",
                      "All"
                    );
                  } else {
                    setSelectedDistrict({ id: -1, kecamatan: "All" });
                    fetchCustomers(
                      currentLocation ? currentLocation.lat : defaultCenter.lat,
                      currentLocation ? currentLocation.lng : defaultCenter.lng,
                      city.name,
                      ""
                    );
                  }
                }}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className='block text-sm font-medium leading-6 text-gray-900'>
                      Kota
                    </Listbox.Label>
                    <div className='relative mt-2'>
                      <Listbox.Button className='relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'>
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
                          {cities.length > 0 ? (
                            cities.map((city) => (
                              <Listbox.Option
                                key={city.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "bg-indigo-600 text-white"
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
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "block truncate"
                                      )}
                                    >
                                      {city.name}
                                    </span>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-indigo-600",
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
                            ))
                          ) : (
                            <Listbox.Option
                              key={-1}
                              className='relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900'
                              value={{ id: -1, name: "Tidak Ada Pilihan" }}
                            >
                              <span className='font-normal block truncate'>
                                Tidak Ada Pilihan
                              </span>
                            </Listbox.Option>
                          )}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
            <div className='w-full mt-4 sm:mt-0'>
              <Listbox
                value={selectedDistrict}
                onChange={(district) => {
                  setSelectedDistrict(district);
                  fetchCustomers(
                    currentLocation ? currentLocation.lat : defaultCenter.lat,
                    currentLocation ? currentLocation.lng : defaultCenter.lng,
                    selectedCity.name,
                    district.kecamatan === "All" ? "" : district.kecamatan
                  );
                }}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className='block text-sm font-medium leading-6 text-gray-900'>
                      Kecamatan
                    </Listbox.Label>
                    <div className='relative mt-2'>
                      <Listbox.Button className='relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'>
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
                          {filteredDistricts.length > 0 ? (
                            filteredDistricts.map((district) => (
                              <Listbox.Option
                                key={district.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "bg-indigo-600 text-white"
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
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "block truncate"
                                      )}
                                    >
                                      {district.kecamatan}
                                    </span>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-indigo-600",
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
                            ))
                          ) : (
                            <Listbox.Option
                              key={-1}
                              className='relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900'
                              value={{ id: -1, kecamatan: "Tidak Ada Pilihan" }}
                            >
                              <span className='font-normal block truncate'>
                                Tidak Ada Pilihan
                              </span>
                            </Listbox.Option>
                          )}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
          </div>
          <div>
            <LoadScript
              googleMapsApiKey={googleMapsApiKey}
              onLoad={handleLoadMap}
            >
              <GoogleMap
                key={
                  mapCenter
                    ? `${mapCenter.lat}-${mapCenter.lng}`
                    : `${defaultCenter.lat}-${defaultCenter.lng}`
                }
                mapContainerStyle={mapStyles}
                zoom={12}
                center={mapCenter || defaultCenter}
              >
                {currentLocation && (
                  <Marker
                    position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                    label={{
                      text: "You are here",
                      fontSize: "12px",
                      color: "#C70E20",
                      fontWeight: "bold",
                    }}
                    icon={
                      window.google && {
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Use a blue-dot icon for live location
                        labelOrigin: new window.google.maps.Point(70, 20),
                        size: new window.google.maps.Size(32, 32),
                        anchor: new window.google.maps.Point(16, 32),
                      }
                    }
                  />
                )}

                {customers.map((customer) => (
                  <Marker
                    key={customer.id}
                    position={{ lat: customer.lat, lng: customer.lng }}
                    label={{
                      text: customer.namaCustomer,
                      fontSize: "12px",
                      color: "#C70E20",
                      fontWeight: "bold",
                    }}
                    icon={
                      window.google && {
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        labelOrigin: new window.google.maps.Point(70, 20),
                        size: new window.google.maps.Size(32, 32),
                        anchor: new window.google.maps.Point(16, 32),
                      }
                    }
                    onClick={() => {
                      setOpen(true); // Open customer details dialog
                      fetchCustomerDetails(customer.id); // Fetch customer details
                      setMapselectedCustomer(customer); // Set clicked customer
                    }}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
            {currentLocation && (
              <div className='px-4 pt-4'>
                <h2 className='text-lg font-bold text-gray-900'>
                  Your Current Location
                </h2>
                <div className='flex gap-4'>
                  <div className='w-full'>
                    <p className='text-sm text-gray-600 truncate'>
                      {currentAddress}
                    </p>
                    <p className='text-sm text-gray-600'>
                      Coordinates: {currentLocation.lat}, {currentLocation.lng}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='sm:w-2/5 p-4 max-h-screen'>
          {loading ? (
            <Loading />
          ) : (
            <ul
              role='list'
              className='divide-y divide-gray-100'
            >
              {customers.map((customer) => (
                <li
                  key={customer.id}
                  className='flex items-center justify-between gap-x-6 py-5'
                >
                  <div className='min-w-0'>
                    <div className='flex items-start gap-x-3'>
                      <p className='truncate text-sm font-semibold leading-6 text-gray-900'>
                        {customer.namaCustomer}
                      </p>
                    </div>
                    <div className='mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500'>
                      <p className='whitespace-nowrap truncate'>
                        {customer.alamat}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-none items-center gap-x-4'>
                    <button
                      onClick={() => {
                        setOpen(true);
                        fetchCustomerDetails(customer.id);
                      }}
                      className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    >
                      View details
                      <span className='sr-only'>, {customer.namaCustomer}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Transition.Root
        show={open}
        as={Fragment}
      >
        <Dialog
          as='div'
          className='relative z-10'
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full justify-center p-4 text-center items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                  <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
                    {selectedCustomer && (
                      <>
                        <div className='flex px-4 py-4 sm:px-6'>
                          <div className='w-full'>
                            <h3 className='text-xl font-bold leading-7 text-gray-900'>
                              {selectedCustomer.namaCustomer}
                            </h3>
                            <p className='max-w-2xl text-sm leading-6 text-gray-500'>
                              {selectedCustomer.agreement}
                            </p>
                          </div>
                          <div className='w-full flex justify-end'>
                            <a
                              type='button'
                              className='my-auto inline-flex w-auto justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto'
                              href={selectedCustomer.googleMapsLink}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Google Maps
                            </a>
                          </div>
                        </div>
                        <div className='border-t border-gray-100'>
                          <dl className='divide-y divide-gray-100'>
                            <div className='flex px-4 py-4 grid grid-cols-2 gap-4 sm:px-6'>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Kota
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.kota}
                                </dd>
                              </div>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Kecamatan
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.kecamatan}
                                </dd>
                              </div>
                            </div>

                            <div className='flex px-4 py-4 gap-4 sm:px-6'>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Alamat
                                </dt>
                                <dd className='mt-1 text-sm leading-2 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.alamat}
                                </dd>
                              </div>
                            </div>

                            <div className='flex px-4 py-4 grid grid-cols-3 gap-4 sm:px-6'>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Merk
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.merk}
                                </dd>
                              </div>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Type
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.type}
                                </dd>
                              </div>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Warna
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.warna}
                                </dd>
                              </div>
                            </div>

                            <div className='flex px-4 py-4 grid grid-cols-3 gap-4 sm:px-6'>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Tahun Mobil
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.tahunMobil}
                                </dd>
                              </div>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Tenor
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.tenor}
                                </dd>
                              </div>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Max OVD
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.maxOvd}
                                </dd>
                              </div>
                            </div>

                            <div className='flex px-4 py-4 grid grid-cols-2 gap-4 sm:px-6'>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Handphone
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.handphone}
                                </dd>
                              </div>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Tanggal Valid
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.tanggalValid}
                                </dd>
                              </div>
                            </div>

                            <div className='flex px-4 py-4 grid grid-cols-2 gap-4 sm:px-6'>
                              <div>
                                <dt className='text-sm font-medium text-gray-900'>
                                  Nama Sales
                                </dt>
                                <dd className='truncate mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                                  {selectedCustomer.namaSales}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                      </>
                    )}
                  </div>
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
