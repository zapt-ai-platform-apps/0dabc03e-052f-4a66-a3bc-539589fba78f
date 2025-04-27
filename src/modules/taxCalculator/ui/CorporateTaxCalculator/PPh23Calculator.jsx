import React, { useState } from 'react';
import { calculatePPh23 } from '@/modules/taxCalculator/internal/corporateTax';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPh23Calculator() {
  const [formValues, setFormValues] = useState({
    incomeType: 'rent',
    incomeAmount: '',
    hasNPWP: true
  });
  
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
  };

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
        incomeAmount: parseFloat(formValues.incomeAmount) || 0
      };
      
      const calculationResult = calculatePPh23(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPh 23:', err);
      setError('Terjadi kesalahan saat menghitung PPh 23. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-indigo-700">Kalkulator PPh Pasal 23</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="incomeType" className="label">Jenis Penghasilan</label>
            <select
              id="incomeType"
              name="incomeType"
              value={formValues.incomeType}
              onChange={handleInputChange}
              className="select"
            >
              <option value="rent">Sewa dan Penghasilan lain sehubungan dengan penggunaan harta</option>
              <option value="technicalService">Jasa teknik</option>
              <option value="managementService">Jasa manajemen</option>
              <option value="consultantService">Jasa konsultan</option>
              <option value="otherActivities">Aktivitas lain yang dikenakan PPh 23</option>
              <option value="dividend">Dividen</option>
              <option value="interest">Bunga</option>
              <option value="royalty">Royalti</option>
              <option value="prize">Hadiah dan penghargaan</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="incomeAmount" className="label">Jumlah Penghasilan</label>
            <CurrencyInput 
              id="incomeAmount"
              name="incomeAmount"
              value={formValues.incomeAmount}
              onChange={(value) => handleCurrencyChange('incomeAmount', value)}
              placeholder="Masukkan jumlah penghasilan"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hasNPWP" className="flex items-center">
              <input
                type="checkbox"
                id="hasNPWP"
                name="hasNPWP"
                checked={formValues.hasNPWP}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Memiliki NPWP</span>
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 cursor-pointer"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPh 23'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="text-lg font-semibold mb-4 text-indigo-800">Hasil Perhitungan PPh 23</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-indigo-100">
              <span className="text-gray-700">Jumlah Penghasilan</span>
              <span className="font-medium">{formatCurrency(result.incomeAmount)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-indigo-100">
              <span className="text-gray-700">Tarif PPh 23</span>
              <span className="font-medium">{result.rate}%</span>
            </div>
            
            <div className="flex justify-between pt-2">
              <span className="text-indigo-900 font-semibold">PPh 23 Terutang</span>
              <span className="text-indigo-900 font-bold">{formatCurrency(result.tax)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PPh23Calculator;