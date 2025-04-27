import React, { useState } from 'react';
import TaxTypeSelector from './TaxTypeSelector';
import GeneralPPhCalculator from './GeneralPPhCalculator';
import PPh23TaxCalculator from './PPh23TaxCalculator';
import NPPNCalculator from './NPPNCalculator';
import PPh4Ayat2Calculator from './PPh4Ayat2Calculator';

function PersonalTaxCalculator({ onBack }) {
  const [selectedTaxType, setSelectedTaxType] = useState(null);
  
  const renderCalculator = () => {
    switch (selectedTaxType) {
      case 'general':
        return <GeneralPPhCalculator />;
      case 'pph23':
        return <PPh23TaxCalculator />;
      case 'nppn':
        return <NPPNCalculator />;
      case 'pph4ayat2':
        return <PPh4Ayat2Calculator />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="btn btn-secondary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>
        <h2 className="text-2xl font-bold ml-4">Kalkulator Pajak Orang Pribadi</h2>
      </div>

      {!selectedTaxType ? (
        <TaxTypeSelector onSelect={setSelectedTaxType} />
      ) : (
        <div>
          <div className="mb-6">
            <button 
              onClick={() => setSelectedTaxType(null)}
              className="btn btn-secondary text-sm"
            >
              ← Pilih jenis pajak lain
            </button>
          </div>
          {renderCalculator()}
        </div>
      )}
    </div>
  );
}

export default PersonalTaxCalculator;