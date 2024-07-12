export default function Forms() {
  return (
    <div className='my-4 sm:my-8 mx-auto px-4 sm:px-8 sm:max-w-7xl'>
      <form>
        <div className='space-y-12'>
          <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
            <div>
              <h2 className='text-base font-semibold leading-7 text-gray-900'>
                Add Customer
              </h2>
              <p className='mt-1 text-sm leading-6 text-gray-600'>
                Tambah data customer.
              </p>
              {/* <div className='mt-4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
                <div className='text-center'>
                  <div className='flex text-sm leading-6 text-gray-600'>
                    <label
                      htmlFor='file-upload'
                      className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'
                    >
                      <span>Upload a file</span>
                      <input
                        id='file-upload'
                        name='file-upload'
                        type='file'
                        className='sr-only'
                      />
                    </label>
                    <p className='pl-1'>or drag and drop</p>
                  </div>
                  <p className='text-xs leading-5 text-gray-600'>
                    XLSX or CSV up to 10MB
                  </p>
                </div>
              </div> */}
            </div>

            <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Kota
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='city'
                    id='city'
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='region'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Kecamatan
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='region'
                    id='region'
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='col-span-full'>
                <label
                  htmlFor='street-address'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Alamat
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='street-address'
                    id='street-address'
                    autoComplete='street-address'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Agreement
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='city'
                    id='city'
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='region'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Nama Customer
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='region'
                    id='region'
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Merk
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='city'
                    id='city'
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='region'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Type
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='region'
                    id='region'
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Warna
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='city'
                    id='city'
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='region'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Tahun Mobil
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='region'
                    id='region'
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Tenor
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='city'
                    id='city'
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='region'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  No Handphone
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='region'
                    id='region'
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Nama Sales
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='city'
                    id='city'
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='region'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Max OVD
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='region'
                    id='region'
                    autoComplete='address-level1'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Tanggal Valid
                </label>
                <div className='mt-2'>
                  <input
                    type='date'
                    name='city'
                    id='city'
                    autoComplete='address-level2'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <button
            type='button'
            className='border rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
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
