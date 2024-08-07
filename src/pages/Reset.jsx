import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PasswordResetPage = () => {
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSendOTP = async () => {
    try {
      await axios.post(`${baseURL}/api/auth/send-password-reset`, { contact });
      setStep(2);
    } catch (error) {
      console.error("Error sending OTP:", error.response.data.message);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post(`${baseURL}/api/auth/reset-password`, {
        contact,
        otp,
        newPassword,
      });
      alert(
        "Password reset successfully. You can now log in with your new password."
      );
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error.response.data.message);
      alert("Failed to reset password. Please check your OTP and try again.");
    }
  };

  return (
    <>
      <div className='password-reset-page sm:flex min-h-screen sm:flex-1'>
        <div className='mb-8 sm:mb-0'>
          <img
            className='sm:h-screen w-full object-cover'
            src='https://netimg.acc.co.id/redberries/data_content/company_value/company_value_1.webp'
            alt=''
          />
        </div>
        {step === 1 && (
          <div className='mt-6 sm:mt-0 flex flex-1 flex-col justify-center px-4 py-auto sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='mx-auto w-full max-w-sm lg:w-96'>
              <div>
                <h2 className='mt-2 text-2xl font-bold leading-9 tracking-tight text-neutral-800'>
                  Reset Password
                </h2>
              </div>

              <div className='mt-6'>
                <div>
                  <div>
                    <label
                      htmlFor='emailOrPhone'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Enter your email or phone number
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        placeholder='Enter your email or phone number'
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  {/* <div>
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
                    <button
                      onClick={() => {
                        navigate("/reset");
                      }}
                      className='mt-2 text-sm font-semibold text-blue-600 hover:text-blue-500'
                    >
                      Forgot password?
                    </button>
                  </div> */}

                  <div>
                    <button
                      onClick={handleSendOTP}
                      className='flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className='mt-6 sm:mt-0 flex flex-1 flex-col justify-center px-4 py-auto sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='mx-auto w-full max-w-sm lg:w-96'>
              <div>
                <h2 className='mt-2 text-2xl font-bold leading-9 tracking-tight text-neutral-800'>
                  Enter OTP and New Password
                </h2>
              </div>

              <div className='mt-6'>
                <div>
                  <div>
                    <label
                      htmlFor='emailOrPhone'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Enter OTP
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        placeholder='Enter OTP'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='password'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Enter New Password
                    </label>
                    <div className='mt-2 relative'>
                      <input
                        placeholder='Enter new password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        id='password'
                        name='password'
                        type={showPassword ? "text" : "password"}
                        required
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
                    <button
                      onClick={handleResetPassword}
                      className='flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <div className='password-reset-page'>
        {step === 1 && (
          <div className='send-otp'>
            <h2>Reset Password</h2>
            <input
              type='text'
              placeholder='Enter your email or phone number'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <button onClick={handleSendOTP}>Send OTP</button>
          </div>
        )}
        {step === 2 && (
          <div className='reset-password'>
            <h2>Enter OTP and New Password</h2>
            <input
              type='text'
              placeholder='Enter OTP'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type='password'
              placeholder='Enter new password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Reset Password</button>
          </div>
        )}
      </div> */}
    </>
  );
};

export default PasswordResetPage;
