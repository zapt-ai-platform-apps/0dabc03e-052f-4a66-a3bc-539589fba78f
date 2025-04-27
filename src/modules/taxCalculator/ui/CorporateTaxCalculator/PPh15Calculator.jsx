import React, { useState } from 'react';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPh15Calculator() {
  const [formValues, setFormValues] = useState({
    businessType: 'shipping',
    grossIncome: '',
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

  const calculatePPh15 = (params) => {
    const { businessType, grossIncome, hasNPWP } = params;
    
    // Define rates based on business type
    let rate = 0;
    switch (businessType) {
      case 'shipping':
        rate = 2.64;
        break;
      case 'international_shipping':
        rate = 4.0;
        break;
      case 'aviation':
        rate = 1.8;
        break;
      case 'foreign_drilling':
        rate = 4.5;
        break;
      case 'foreign_construction':
        rate = 3.0;
        break;
      default:
        rate = 2.64;
    }
    
    // Apply higher rate for those without NPWP (20% higher)
    if (!hasNPWP) {
      rate = rate * 1.2;
    }
    
    // Calculate tax
    const tax = grossIncome * (rate / 100);
    
    return { grossIncome, rate, tax };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);
    
    try {
      // Parse numeric inputs
      const numericFormValues = {
        ...formValues,
        grossIncome: parseFloat(formValues.grossIncome) || 0
      };
      
      const calculationResult = calculatePPh15(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPh 15:', err);
      setError('Terjadi kesalahan saat menghitung PPh 15. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-teal-700">Kalkulator PPh Pasal 15</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="businessType" className="label">Jenis Usaha</label>
            <select
              id="businessType"
              name="businessType"
              value={formValues.businessType}
              onChange={handleInputChange}
              className="select"
            >
              <option value="shipping">Pelayaran Dalam Negeri</option>
              <option value="international_shipping">Pelayaran/Penerbangan Internasional</option>
              <option value="aviation">Penerbangan Dalam Negeri</option>
              <option value="foreign_drilling">Pengeboran Minyak Asing</option>
              <option value="foreign_construction">Konstruksi Asing</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="grossIncome" className="label">Penghasilan Bruto</label>
            <CurrencyInput 
              id="grossIncome"
              name="grossIncome"
              value={formValues.grossIncome}
              onChange={(value) => handleCurrencyChange('grossIncome', value)}
              placeholder="Masukkan penghasilan bruto"
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
                className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Memiliki NPWP</span>
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 cursor-pointer"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPh 15'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
          <h4 className="text-lg font-semibold mb-4 text-teal-800">Hasil Perhitungan PPh 15</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-teal-100">
              <span className="text-gray-700">Penghasilan Bruto</span>
              <span className="font-medium">{formatCurrency(result.grossIncome)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-teal-100">
              <span className="text-gray-700">Tarif PPh 15</span>
              <span className="font-medium">{result.rate.toFixed(2)}%</span>
            </div>
            
            <div className="flex justify-between pt-2">
              <span className="text-teal-900 font-semibold">PPh 15 Terutang</span>
              <span className="text-teal-900 font-bold">{formatCurrency(result.tax)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PPh15Calculator;