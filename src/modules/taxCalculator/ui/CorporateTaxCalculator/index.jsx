import React, { useState } from 'react';
import TaxTypeSelector from './TaxTypeSelector';
import PPh21Calculator from './PPh21Calculator';
import PPh22Calculator from './PPh22Calculator';
import PPh23Calculator from './PPh23Calculator';
import PPh26Calculator from './PPh26Calculator';
import PPh29Calculator from './PPh29Calculator';
import PPh15Calculator from './PPh15Calculator';
import PPh4Ayat2Calculator from './PPh4Ayat2Calculator';
import PPNCalculator from './PPNCalculator';

function CorporateTaxCalculator({ onBack }) {
  const [selectedTaxType, setSelectedTaxType] = useState(null);
  
  const renderCalculator = () => {
    switch (selectedTaxType) {
      case 'pph21':
        return <PPh21Calculator />;
      case 'pph22':
        return <PPh22Calculator />;
      case 'pph23':
        return <PPh23Calculator />;
      case 'pph26':
        return <PPh26Calculator />;
      case 'pph29':
        return <PPh29Calculator />;
      case 'pph15':
        return <PPh15Calculator />;
      case 'pph4ayat2':
        return <PPh4Ayat2Calculator />;
      case 'ppn':
        return <PPNCalculator />;
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
        <h2 className="text-2xl font-bold ml-4">Kalkulator Pajak Badan</h2>
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

export default CorporateTaxCalculator;