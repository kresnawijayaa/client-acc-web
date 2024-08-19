import { Fragment, useState, useEffect, useRef } from "react";
import { Disclosure, Menu, Transition, Dialog } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import { XMarkIcon } from '@heroicons/react/20/solid'
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/CekSekitarMu.png";

const userNavigation = [
  // { name: "Home", href: "/" },
  // { name: "Bulk Add Customer", href: "/bulkAddCustomer" },
];

const adminNavigation = [
  { name: "Dashboard", href: "/" },
  { name: "Manage User", href: "/users" },
  { name: "Manage Customer", href: "/manageCustomer" },
  { name: "Add Customer", href: "/addCustomer" },
  { name: "Bulk Add Customer", href: "/bulkAddCustomer" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState(userNavigation);

  const [openx, setOpenx] = useState(false);
  const cancelButtonRef = useRef(null);
  const [session, setSession] = useState(Date.now());
  const [username, setUsername] = useState("Kamu");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.name);
    }

    if (user && user.role === "admin") {
      setNavigation(adminNavigation);
    }

    const handleSessionTimeout = () => {
      const timeSinceSessionStart = Date.now() - session;
      if (timeSinceSessionStart > 24 * 60 * 60 * 1000) {
        setOpenx(true);
      }
    };

    handleSessionTimeout();

    const intervalId = setInterval(handleSessionTimeout, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [session]);

  const handleSignOut = () => {
    localStorage.clear(); // Clear all local storage
    window.location.reload();
    // navigate("/login"); // Navigate to login page
  };

  return (
    <>
      <header className='flex h-16 border-b border-gray-900/10'>
        <div className='mx-auto flex w-full items-center justify-between px-4'>
          <div className='flex flex-1 items-center gap-x-6'>
            <button
              type='button'
              className='-m-3 p-3 md:hidden'
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className='sr-only'>Open main menu</span>
              <Bars3Icon
                className='h-5 w-5 text-gray-900'
                aria-hidden='true'
              />
            </button>
            <NavLink to='/'>
              {/* <img
                className='h-8 w-auto'
                src={logo}
                alt='Your Company'
              /> */}
              <div className='my-auto'>
                <h1 className='text-xl'>
                  Cek<span className='font-bold'>SekitarMu</span>
                </h1>
              </div>
            </NavLink>
          </div>
          {/* <nav className='hidden md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-700'>
            {navigation.map((item, itemIdx) => (
              <NavLink
                key={itemIdx}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    isActive ? "text-indigo-600" : "",
                    "hover:text-gray-900"
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav> */}
          <div className='flex flex-1 items-center justify-end gap-x-8'>
            <Menu
              as='div'
              className='relative ml-3'
            >
              <div className='flex gap-4'>
                <div className='my-auto hidden sm:block'>
                  <h1 className='font-medium'>Hello, {username}!</h1>
                </div>
                <Menu.Button className='flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                  <span className='sr-only'>Open user menu</span>
                  <img
                    className='h-8 w-8 rounded-full border'
                    src='https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833572.jpg?t=st=1720783897~exp=1720787497~hmac=be7d4f5cb595b4c7923ea72dcbb3c86daef163d595b4c365edd608da3fedaac8&w=740'
                    alt=''
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  {/* <Menu.Item>
                    {({ active }) => (
                      <a
                        href='#'
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Your Profile
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href='#'
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Settings
                      </a>
                    )}
                  </Menu.Item> */}
                  {navigation.map((item, itemIdx) => (
                    <Menu.Item className='hidden sm:block'>
                      {({ active }) => (
                        <NavLink
                          key={itemIdx}
                          to={item.href}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block w-full text-left px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          {item.name}
                        </NavLink>
                      )}
                    </Menu.Item>
                  ))}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block w-full text-left px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <Dialog
          as='div'
          className='lg:hidden'
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className='fixed inset-0 z-50' />
          <Dialog.Panel className='fixed inset-y-0 left-0 z-50 w-2/3 shadow overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10'>
            <div className='-ml-0.5 flex h-16 items-center gap-x-6'>
              <button
                type='button'
                className='-m-2.5 p-2.5 text-gray-700'
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className='sr-only'>Close menu</span>
                <XMarkIcon
                  className='h-6 w-6'
                  aria-hidden='true'
                />
              </button>
              <div className='-ml-0.5'>
                <a
                  href='#'
                  className='-m-1.5 block p-1.5'
                >
                  <span className='sr-only'>Your Company</span>
                  {/* <img
                    className='h-8 w-auto'
                    src={logo}
                    alt=''
                  /> */}
                  <div className='my-auto'>
                    <h1 className='text-xl'>
                      Cek<span className='font-bold'>SekitarMu</span>
                    </h1>
                  </div>
                </a>
              </div>
            </div>
            <div className='mt-2 space-y-2'>
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      isActive ? "bg-gray-100" : "",
                      "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      <div className='flex items-center gap-x-6 bg-gray-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1'>
        <p className='text-sm leading-6 text-white'>
          <a href='#'>
            <strong className='font-semibold'>This website is under maintenance</strong>
            <svg
              viewBox='0 0 2 2'
              className='mx-2 inline h-0.5 w-0.5 fill-current'
              aria-hidden='true'
            >
              <circle
                cx={1}
                cy={1}
                r={1}
              />
            </svg>
            Some functions may not be available&nbsp;
            {/* <span aria-hidden='true'>&rarr;</span> */}
          </a>
        </p>
        <div className='flex flex-1 justify-end'>
          <button
            type='button'
            className='-m-3 p-3 focus-visible:outline-offset-[-4px]'
          >
            <span className='sr-only'>Dismiss</span>
            <XMarkIcon
              className='h-5 w-5 text-white'
              aria-hidden='true'
            />
          </button>
        </div>
      </div>
      <Transition.Root
        show={openx}
        as={Fragment}
      >
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setOpenx}
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
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
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
                  <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                    <button
                      type='button'
                      className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      onClick={() => setOpenx(false)}
                    >
                      <span className='sr-only'>Close</span>
                      <XMarkIcon
                        className='h-6 w-6'
                        aria-hidden='true'
                      />
                    </button>
                  </div>

                  <div>
                    <div className='flex flex-col items-center justify-center text-center space-y-2'>
                      <h2 className='mt-2 text-2xl font-semibold leading-9 tracking-tight text-neutral-800'>
                        Your session timed out
                      </h2>
                    </div>

                    <div className='my-8'>
                      <div className='flex flex-col space-y-8'>
                        <div className='flex flex-col space-y-5'>
                          <div className='w-full flex justify-center items-center gap-8'>
                            <a
                              type='button'
                              // onClick={() => {navigate("/login")}}
                              href='/login'
                              className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                            >
                              Relogin
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
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
