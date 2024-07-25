import { useNavigate } from "react-router-dom"; 
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const navigate = useNavigate(); 

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [openx, setOpenx] = useState(false);
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [otpResendCount, setOtpResendCount] = useState(0);
  const [verificationMethod, setVerificationMethod] = useState(""); // State for verification method

  const cancelButtonRef = useRef(null);
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setIsLoading(true); // Set loading state to true
    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data)
        const verifiedDate = new Date(data.user.verified_date._seconds * 1000); 
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - verifiedDate); 
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const verified_date_valid = diffDays < 7;

        if (data.user.is_verified && verified_date_valid) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/"); 
        } else {
          setContact(data.user.email); 
          setOpenx(true); 
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed"); 
      }
    } catch (error) {
      setError("Something went wrong. Please try again later."); 
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const sendOtp = async (method) => {
    try {
      const contactDetail = method === "email" ? contact : user.user.phone;
      method === "email" ? setContact(contact) : setContact(user.user.phone);

      await fetch(`${baseURL}/api/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact: contactDetail }),
      });
      setOpenx(false); 
      setOpen(true); 
      setOtpCountdown(60); 
      setVerificationMethod(method);
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  useEffect(() => {
    let timer;
    if (open && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0 && otpResendCount >= 3) {
      setError("Maximum OTP resend attempts reached. Redirecting to login page.");
      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 3000);
    }

    return () => clearInterval(timer);
  }, [open, otpCountdown, otpResendCount, navigate]);

  const handleOtpChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
      if (!value && index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(`${baseURL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact, otp: otp.join("") }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/"); 
      } else {
        setError("Invalid OTP. Please try again.");
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
            className='sm:h-screen w-full object-cover'
            src='https://netimg.acc.co.id/redberries/data_content/company_value/company_value_1.webp'
            alt=''
          />
        </div>
        <div className='mt-6 sm:mt-0 flex flex-1 flex-col justify-center px-4 py-auto sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
          <div className='mx-auto w-full max-w-sm lg:w-96'>
            <div>
              <h2 className='mt-2 text-2xl font-bold leading-9 tracking-tight text-neutral-800'>
                Log in to your account
              </h2>
            </div>

            <div className='mt-6'>
              <div>
                <form className='space-y-6' onSubmit={handleLogin}>
                  <div>
                    <label htmlFor='emailOrPhone' className='block text-sm font-medium leading-6 text-gray-900'>
                      Email / phone number
                    </label>
                    <div className='mt-2'>
                      <input
                        id='emailOrPhone'
                        name='emailOrPhone'
                        type='text'
                        required
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
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

                  {error && error !== "Invalid OTP. Please try again." && (
                    <div className='mb-4 text-sm text-red-600'>{error}</div>
                  )}

                  <div>
                    <button
                      type='submit'
                      className='flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      disabled={isLoading} 
                    >
                      {isLoading ? 'Logging in...' : 'Log in'}
                    </button>
                    <p className='mt-4 text-sm leading-6 text-gray-500'>
                      Don't have account?{" "}
                      <button
                        onClick={() => {
                          navigate("/register");
                        }}
                        className='font-semibold text-blue-600 hover:text-blue-500'
                      >
                        Register
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition.Root show={openx} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setOpenx}>
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
                  <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                    <button
                      type='button'
                      className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      onClick={() => setOpenx(false)}
                    >
                      <span className='sr-only'>Close</span>
                      <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                    </button>
                  </div>

                  <div>
                    <div className='flex flex-col items-center justify-center text-center space-y-2'>
                      <h2 className='mt-2 text-2xl font-semibold leading-9 tracking-tight text-neutral-800'>
                        Choose verification method
                      </h2>
                      <div className='flex flex-row text-sm text-gray-400'>
                        <p>
                          For security reasons, you must verify your account
                          periodically (7 days)
                        </p>
                      </div>
                    </div>

                    <div className='my-8'>
                      <div className='flex flex-col space-y-8'>
                        <div className='flex flex-col space-y-5'>
                          <div className='w-full flex justify-center items-center gap-8'>
                            <button
                              type='button'
                              className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                              onClick={() => sendOtp("email")}
                            >
                              Via Email
                            </button>
                            <button
                              type='button'
                              className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                              onClick={() => sendOtp("whatsapp")}
                            >
                              Via WhatsApp/SMS
                            </button>
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

      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setOpen}>
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
                  <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                    <button
                      type='button'
                      className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      onClick={() => setOpen(false)}
                    >
                      <span className='sr-only'>Close</span>
                      <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                    </button>
                  </div>
                  <div>
                    <div className='flex flex-col items-center justify-center text-center space-y-2'>
                      <h2 className='mt-2 text-2xl font-semibold leading-9 tracking-tight text-neutral-800'>
                        Verify your account
                      </h2>
                      <div className='flex flex-row text-sm text-gray-400'>
                        <p>
                          We have sent a code to your{" "}
                          {verificationMethod === "email" ? "email" : "phone"} {verificationMethod === "email" ? contact : user?.user?.phone}
                        </p>
                      </div>
                    </div>

                    <div className='mt-8'>
                      <form action='' method='post'>
                        <div className='flex flex-col space-y-8'>
                          <div className='flex gap-2 sm:gap-4 flex-row items-center justify-between mx-auto w-full max-w-md'>
                            {otp.map((value, index) => (
                              <div className='w-16 sm:h-16' key={index}>
                                <input
                                  id={`otp-${index}`}
                                  className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full sm:h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700'
                                  type='number'
                                  value={value}
                                  onChange={(e) => handleOtpChange(index, e.target.value)}
                                  maxLength={1}
                                />
                              </div>
                            ))}
                          </div>

                          <div className='flex flex-col space-y-5'>
                            {error && (
                              <div className='mx-auto text-sm text-red-600'>
                                {error}
                              </div>
                            )}

                            <div className='w-full flex justify-center items-center'>
                              <button
                                type='button'
                                className='text-lg inline-flex w-full justify-center rounded-md bg-blue-600 px-8 py-2 text-sm text-white shadow-sm hover:bg-blue-500 sm:w-auto'
                                onClick={handleVerifyOtp}
                              >
                                Verify Account
                              </button>
                            </div>

                            <div className='flex flex-row items-center justify-center text-center text-sm space-x-1 text-gray-500'>
                              <p>Didn't receive code?</p>
                              {otpCountdown > 0 ? (
                                <span>{otpCountdown} seconds</span>
                              ) : otpResendCount < 3 ? (
                                <button
                                  className='flex flex-row items-center font-semibold text-blue-600'
                                  onClick={() => {
                                    sendOtp(verificationMethod);
                                    setOtpResendCount((prev) => prev + 1);
                                    setOtpCountdown(60);
                                  }}
                                >
                                  Resend
                                </button>
                              ) : (
                                <span className='text-red-600'>
                                  Maximum resend attempts reached
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </form>
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
};

export default Login;
