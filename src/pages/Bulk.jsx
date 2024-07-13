import React, { useState } from "react";
import CSVReader from "react-csv-reader";
import axios from "axios";

export default function Bulk() {
  const [data, setData] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleFileUpload = (data) => {
    const formattedData = data.slice(1).map((row) => ({
      kota: row[0],
      kecamatan: row[1],
      alamat: row[2],
      agreement: row[3],
      namaCustomer: row[4],
      merk: row[5],
      type: row[6],
      warna: row[7],
      tahunMobil: row[8],
      tenor: row[9] ? parseInt(row[9], 10) : null,
      handphone: row[10],
      namaSales: row[11],
      maxOvd: row[12],
      tanggalValid: row[13],
    })).filter(row => 
      Object.values(row).some(value => value !== undefined && value !== null && value !== "")
    ); // Filter baris kosong
  
    setData(formattedData);
    console.log(formattedData);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
  
    console.log(data, "<<<>>>")
    try {
      await axios.post(`${baseURL}/api/customers/bulk`, 
        { customers: data }, // Mengirim array data customer dalam body request
        {
          headers: {
            authorization: `${token}` // Set header Authorization dengan token
          }
        }
      );
      alert("Data berhasil disimpan!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };
  
  return (
    <div className='my-4 sm:my-8 mx-auto px-4'>
      <form>
        <div className='space-y-12'>
          <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
            <div className='col-span-1'>
              <h2 className='text-base font-semibold leading-7 text-gray-900'>
                Bulk Create Customers
              </h2>
              <p className='mt-1 text-sm leading-6 text-gray-600'>
                Upload langsung banyak data.
              </p>
            </div>
            <div className='gap-x-6 gap-y-8 col-span-2'>
              <div className='flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
                <div className='text-center'>
                  <CSVReader
                    cssClass='csv-reader-input'
                    onFileLoaded={handleFileUpload}
                    inputId='file-upload'
                    inputStyle={{color: '#6366F1'}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='h-80 w-full overflow-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  No.
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
              {data.map((row, index) => (
                <tr key={index}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {index + 1}
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

        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <button
            type='button'
            onClick={() => setData([])}
            className='border rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSave}
            className='rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
