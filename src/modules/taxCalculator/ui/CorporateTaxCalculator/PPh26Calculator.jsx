import React, { useState } from 'react';
import { calculatePPh26 } from '@/modules/taxCalculator/internal/corporateTax';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPh26Calculator() {
  const [formValues, setFormValues] = useState({
    incomeType: 'dividend',
    incomeAmount: '',
    hasTaxTreaty: false,
    treatyRate: ''
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
        incomeAmount: parseFloat(formValues.incomeAmount) || 0,
        treatyRate: parseFloat(formValues.treatyRate) || 0
      };
      
      const calculationResult = calculatePPh26(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPh 26:', err);
      setError('Terjadi kesalahan saat menghitung PPh 26. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-purple-700">Kalkulator PPh Pasal 26</h3>
      
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
              <option value="dividend">Dividen</option>
              <option value="interest">Bunga</option>
              <option value="royalty">Royalti</option>
              <option value="service">Jasa</option>
              <option value="technical">Jasa Teknik</option>
              <option value="management">Jasa Manajemen</option>
              <option value="prizes">Hadiah dan Penghargaan</option>
              <option value="insurance">Premi Asuransi</option>
              <option value="branchProfit">Laba Cabang</option>
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
            <label htmlFor="hasTaxTreaty" className="flex items-center">
              <input
                type="checkbox"
                id="hasTaxTreaty"
                name="hasTaxTreaty"
                checked={formValues.hasTaxTreaty}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Terdapat P3B (Perjanjian Penghindaran Pajak Berganda)</span>
            </label>
          </div>
          
          {formValues.hasTaxTreaty && (
            <div className="form-group">
              <label htmlFor="treatyRate" className="label">Tarif P3B (%)</label>
              <input
                type="number"
                id="treatyRate"
                name="treatyRate"
                value={formValues.treatyRate}
                onChange={handleInputChange}
                className="input"
                placeholder="Masukkan tarif P3B"
                min="0"
                max="20"
                required={formValues.hasTaxTreaty}
              />
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 cursor-pointer"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPh 26'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-lg font-semibold mb-4 text-purple-800">Hasil Perhitungan PPh 26</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-purple-100">
              <span className="text-gray-700">Jumlah Penghasilan</span>
              <span className="font-medium">{formatCurrency(result.incomeAmount)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-purple-100">
              <span className="text-gray-700">Tarif Standar PPh 26</span>
              <span className="font-medium">{result.standardRate}%</span>
            </div>
            
            {result.hasTaxTreaty && (
              <div className="flex justify-between pb-2 border-b border-purple-100">
                <span className="text-gray-700">Tarif Sesuai P3B</span>
                <span className="font-medium">{result.appliedRate}%</span>
              </div>
            )}
            
            <div className="flex justify-between pt-2">
              <span className="text-purple-900 font-semibold">PPh 26 Terutang</span>
              <span className="text-purple-900 font-bold">{formatCurrency(result.tax)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PPh26Calculator;