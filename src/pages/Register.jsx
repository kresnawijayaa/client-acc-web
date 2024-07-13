import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const viteAdminCode = import.meta.env.VITE_ADMIN_CODE

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let apiUrl = `${baseURL}/api/auth/register`;
      const body = { name, email, password, phone };

      if (isAdmin) {
        if (adminCode !== viteAdminCode) {
          setError("Invalid admin code");
          return;
        }
        apiUrl = `${baseURL}/api/auth/register/admin`;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setOpen(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <div className='sm:flex min-h-screen sm:flex-1'>
        <div className='mb-8 sm:mb-0'>
          <img
            className='sm:h-full w-full object-cover'
            src='https://netimg.acc.co.id/redberries/data_content/company_value/company_value_1.webp'
            alt=''
          />
        </div>
        <div className='mt-6 sm:mt-0 flex flex-1 flex-col justify-center px-4 py-auto sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
          <div className='mx-auto w-full max-w-sm lg:w-96'>
            <div>
              <h2 className='mt-2 text-2xl font-bold leading-9 tracking-tight text-neutral-800'>
                Create your account
              </h2>
            </div>

            <div className='mt-6'>
              <div>
                <form
                  className='space-y-6'
                  onSubmit={handleRegister}
                >
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Name
                    </label>
                    <div className='mt-2'>
                      <input
                        id='name'
                        name='name'
                        type='text'
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Email
                    </label>
                    <div className='mt-2'>
                      <input
                        id='email'
                        name='email'
                        type='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='password'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Password
                    </label>
                    <div className='mt-2 relative'>
                      <input
                        id='password'
                        name='password'
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute inset-y-0 right-0 flex items-center px-2 text-sm text-gray-600'
                      >
                        {showPassword ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Phone Number
                    </label>
                    <div className='mt-2'>
                      <input
                        id='phone'
                        name='phone'
                        type='text'
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div className='flex items-center'>
                    <input
                      id='isAdmin'
                      name='isAdmin'
                      type='checkbox'
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                    />
                    <label
                      htmlFor='isAdmin'
                      className='ml-2 block text-sm text-gray-900'
                    >
                      Register sebagai admin
                    </label>
                  </div>

                  {isAdmin && (
                    <div>
                      <label
                        htmlFor='adminCode'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Admin Code
                      </label>
                      <div className='mt-2'>
                        <input
                          id='adminCode'
                          name='adminCode'
                          type='text'
                          required
                          value={adminCode}
                          onChange={(e) => setAdminCode(e.target.value)}
                          className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className='mb-4 text-sm text-red-600'>{error}</div>
                  )}

                  <div>
                    <button
                      type='submit'
                      className='flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    >
                      Register
                    </button>
                    <p className='mt-4 text-sm leading-6 text-gray-500'>
                      Have an account?{" "}
                      <button
                        className='font-semibold text-blue-600 hover:text-blue-500'
                        onClick={() => navigate("/login")}
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                  <div>
                    <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                      <CheckIcon
                        className='h-6 w-6 text-green-600'
                        aria-hidden='true'
                      />
                    </div>
                    <div className='mt-3 text-center sm:mt-5'>
                      <Dialog.Title
                        as='h3'
                        className='text-base font-semibold leading-6 text-gray-900'
                      >
                        Registration successful
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-500'>
                          Your account has been created successfully.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-6'>
                    <button
                      type='button'
                      className='inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      onClick={() => navigate("/login")}
                    >
                      Go to login
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
};

export default Register;
