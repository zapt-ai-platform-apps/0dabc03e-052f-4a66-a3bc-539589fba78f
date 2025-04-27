import React from 'react';

function TaxCalculatorSelector({ onSelect }) {
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full mb-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-center">Pilih Jenis Wajib Pajak</h2>
          <p className="text-gray-600 mb-6 text-center">
            Assisten Pajakku akan membantu Anda menghitung berbagai jenis pajak yang perlu dibayar 
            sesuai dengan ketentuan perpajakan yang berlaku di Indonesia.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <button 
              onClick={() => onSelect('corporate')}
              className="card hover:shadow-lg cursor-pointer flex flex-col items-center p-8 border border-gray-200 transition-all hover:border-blue-300"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Wajib Pajak Badan</h3>
              <p className="text-gray-600 text-center">
                Untuk perusahaan, badan usaha, dan organisasi yang memiliki kewajiban perpajakan badan
              </p>
            </button>
            
            <button 
              onClick={() => onSelect('personal')}
              className="card hover:shadow-lg cursor-pointer flex flex-col items-center p-8 border border-gray-200 transition-all hover:border-green-300"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Wajib Pajak Orang Pribadi</h3>
              <p className="text-gray-600 text-center">
                Untuk individu dengan penghasilan dari pekerjaan, usaha, investasi, dan sumber penghasilan lainnya
              </p>
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <div className="card bg-blue-50 border border-blue-100">
          <h3 className="text-lg font-semibold mb-2">Tentang Aplikasi Ini</h3>
          <p className="text-gray-700 mb-3">
            Assisten pajakku membantu Anda menghitung berbagai jenis pajak, termasuk:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <ul className="list-disc list-inside text-gray-700">
              <li>PPh Pasal 21, 22, 23, 26, 29</li>
              <li>PPh Pasal 15 & Pasal 4 Ayat (2)</li>
              <li>Pajak Pertambahan Nilai (PPN)</li>
            </ul>
            <ul className="list-disc list-inside text-gray-700">
              <li>PPh Orang Pribadi (Umum)</li>
              <li>PPh Final PP 23/2018</li>
              <li>PPh dengan NPPN</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaxCalculatorSelector;