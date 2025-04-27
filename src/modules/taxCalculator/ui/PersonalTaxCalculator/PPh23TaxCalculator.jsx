import React, { useState } from 'react';
import { calculatePPh23Final } from '@/modules/taxCalculator/internal/personalTax';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPh23TaxCalculator() {
  const [formValues, setFormValues] = useState({
    grossTurnover: ''
  });
  
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const handleCurrencyChange = (name, value) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);
    
    try {
      // Parse numeric inputs
      const numericFormValues = {
        ...formValues,
        grossTurnover: parseFloat(formValues.grossTurnover) || 0
      };
      
      const calculationResult = calculatePPh23Final(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPh Final PP 23/2018:', err);
      setError('Terjadi kesalahan saat menghitung PPh. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-green-700">
        Kalkulator PPh Final PP 23/2018 (0,5%)
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="grossTurnover" className="label">Peredaran Bruto (Omzet)</label>
            <CurrencyInput 
              id="grossTurnover"
              name="grossTurnover"
              value={formValues.grossTurnover}
              onChange={(value) => handleCurrencyChange('grossTurnover', value)}
              placeholder="Masukkan jumlah peredaran bruto"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Total peredaran usaha (omzet) dalam satu tahun pajak
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full cursor-pointer"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPh Final PP 23/2018'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-lg font-semibold mb-4 text-green-800">Hasil Perhitungan PPh Final PP 23/2018</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-green-100">
              <span className="text-gray-700">Peredaran Bruto (Omzet)</span>
              <span className="font-medium">{formatCurrency(result.grossTurnover)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-green-100">
              <span className="text-gray-700">Tarif Pajak</span>
              <span className="font-medium">{result.rate}%</span>
            </div>
            
            <div className="flex justify-between pt-2">
              <span className="text-green-900 font-semibold">PPh Final Terutang</span>
              <span className="text-green-900 font-bold">{formatCurrency(result.tax)}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-100 rounded-md text-sm text-green-800">
            <p>
              <strong>Catatan:</strong> PPh Final PP 23/2018 merupakan pajak yang bersifat final dengan tarif 0,5% 
              dari peredaran bruto. Berlaku untuk Wajib Pajak dengan peredaran bruto tidak melebihi 
              Rp4,8 miliar dalam satu tahun pajak.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PPh23TaxCalculator;