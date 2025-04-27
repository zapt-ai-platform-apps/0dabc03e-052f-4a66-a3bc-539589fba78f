import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} Assisten pajakku. Hak cipta dilindungi.
            </p>
          </div>
          <div className="text-sm text-gray-300">
            <p>Informasi pajak sesuai dengan peraturan perpajakan yang berlaku di Indonesia.</p>
            <p className="mt-1">Aplikasi ini hanya sebagai alat bantu, untuk keputusan perpajakan final silakan konsultasi dengan konsultan pajak.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;