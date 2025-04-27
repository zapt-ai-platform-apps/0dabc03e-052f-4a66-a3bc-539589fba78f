import React from 'react';

function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=48&height=48" 
            alt="Assisten pajakku logo" 
            className="h-10 w-10 mr-3"
          />
          <h1 className="text-xl font-bold text-white">Assisten pajakku</h1>
        </div>
        <div>
          <p className="text-sm text-white/80">Kalkulator Pajak Indonesia</p>
        </div>
      </div>
    </header>
  );
}

export default Header;