import React, { useState } from 'react';
import { calculateGeneralPersonalIncomeTax } from '@/modules/taxCalculator/internal/personalTax';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function GeneralPPhCalculator() {
  const [formValues, setFormValues] = useState({
    annualGrossIncome: '',
    allowableDeductions: '',
    isMarried: false,
    dependents: '0',
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
        annualGrossIncome: parseFloat(formValues.annualGrossIncome) || 0,
        allowableDeductions: parseFloat(formValues.allowableDeductions) || 0,
        dependents: parseInt(formValues.dependents, 10) || 0
      };
      
      const calculationResult = calculateGeneralPersonalIncomeTax(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating personal income tax:', err);
      setError('Terjadi kesalahan saat menghitung PPh. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-blue-700">
        Kalkulator PPh Orang Pribadi (Umum) - Pasal 17
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="annualGrossIncome" className="label">Penghasilan Bruto Setahun</label>
              <CurrencyInput 
                id="annualGrossIncome"
                name="annualGrossIncome"
                value={formValues.annualGrossIncome}
                onChange={(value) => handleCurrencyChange('annualGrossIncome', value)}
                placeholder="Masukkan jumlah penghasilan bruto"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Total penghasilan sebelum dikurangi biaya-biaya
              </p>
            </div>
            
            <div className="form-group">
              <label htmlFor="allowableDeductions" className="label">
                Biaya-biaya yang Dapat Dikurangkan
              </label>
              <CurrencyInput 
                id="allowableDeductions"
                name="allowableDeductions"
                value={formValues.allowableDeductions}
                onChange={(value) => handleCurrencyChange('allowableDeductions', value)}
                placeholder="Masukkan jumlah biaya yang dapat dikurangkan"
              />
              <p className="text-xs text-gray-500 mt-1">
                Biaya-biaya yang diperbolehkan dalam penghitungan pajak
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="isMarried" className="flex items-center">
                <input
                  type="checkbox"
                  id="isMarried"
                  name="isMarried"
                  checked={formValues.isMarried}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Status Kawin</span>
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="dependents" className="label">Jumlah Tanggungan</label>
              <select
                id="dependents"
                name="dependents"
                value={formValues.dependents}
                onChange={handleInputChange}
                className="select"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3 atau lebih</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="hasNPWP" className="flex items-center">
                <input
                  type="checkbox"
                  id="hasNPWP"
                  name="hasNPWP"
                  checked={formValues.hasNPWP}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Memiliki NPWP</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPh Orang Pribadi'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold mb-4 text-blue-800">Hasil Perhitungan PPh Orang Pribadi</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">Penghasilan Bruto</span>
              <span className="font-medium">{formatCurrency(result.grossIncome)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">Biaya yang Dapat Dikurangkan</span>
              <span className="font-medium">{formatCurrency(result.allowableDeductions)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">Penghasilan Neto</span>
              <span className="font-medium">{formatCurrency(result.netIncome)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">PTKP</span>
              <span className="font-medium">{formatCurrency(result.ptkp)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">PKP</span>
              <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
            </div>
            
            <div className="flex flex-col gap-2 py-2 px-3 bg-blue-100 rounded mb-2">
              <h5 className="text-sm font-medium text-blue-800">Perhitungan Lapisan Tarif Pajak:</h5>
              {result.taxLayers.map((layer, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{layer.description}</span>
                  <span className="font-medium">{formatCurrency(layer.tax)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-2">
              <span className="text-blue-900 font-semibold">PPh Terutang</span>
              <span className="text-blue-900 font-bold">{formatCurrency(result.totalTax)}</span>
            </div>
            
            {result.npwpPenalty > 0 && (
              <div className="flex justify-between pt-1 text-red-700">
                <span className="font-semibold">Penalti Tidak Memiliki NPWP (20%)</span>
                <span className="font-bold">{formatCurrency(result.npwpPenalty)}</span>
              </div>
            )}
            
            {result.npwpPenalty > 0 && (
              <div className="flex justify-between pt-2 text-red-800">
                <span className="font-semibold">Total PPh Terutang dengan Penalti</span>
                <span className="font-bold">{formatCurrency(result.totalTaxWithPenalty)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneralPPhCalculator;