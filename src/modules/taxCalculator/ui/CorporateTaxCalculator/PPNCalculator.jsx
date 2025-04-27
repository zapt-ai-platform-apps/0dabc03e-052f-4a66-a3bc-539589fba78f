import React, { useState } from 'react';
import { calculatePPN } from '@/modules/taxCalculator/internal/corporateTax';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPNCalculator() {
  const [formValues, setFormValues] = useState({
    transactionType: 'sale',
    transactionValue: '',
    luxuryGoods: ''
  });
  
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
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
        transactionValue: parseFloat(formValues.transactionValue) || 0
      };
      
      const calculationResult = calculatePPN(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPN:', err);
      setError('Terjadi kesalahan saat menghitung PPN. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-orange-700">Kalkulator PPN</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="transactionType" className="label">Jenis Transaksi</label>
            <select
              id="transactionType"
              name="transactionType"
              value={formValues.transactionType}
              onChange={handleInputChange}
              className="select"
            >
              <option value="sale">Penjualan Barang/Jasa</option>
              <option value="import">Impor Barang</option>
              <option value="export">Ekspor Barang</option>
              <option value="selfUsage">Pemanfaatan Sendiri</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="transactionValue" className="label">Nilai Transaksi (DPP)</label>
            <CurrencyInput 
              id="transactionValue"
              name="transactionValue"
              value={formValues.transactionValue}
              onChange={(value) => handleCurrencyChange('transactionValue', value)}
              placeholder="Masukkan nilai transaksi"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="luxuryGoods" className="label">Barang Mewah (PPnBM)</label>
            <select
              id="luxuryGoods"
              name="luxuryGoods"
              value={formValues.luxuryGoods}
              onChange={handleInputChange}
              className="select"
            >
              <option value="">Bukan Barang Mewah</option>
              <option value="category1">Kategori 10%</option>
              <option value="category2">Kategori 20%</option>
              <option value="category3">Kategori 30%</option>
              <option value="category4">Kategori 40%</option>
              <option value="category5">Kategori 50%</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 cursor-pointer"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPN'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="text-lg font-semibold mb-4 text-orange-800">Hasil Perhitungan PPN</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-orange-100">
              <span className="text-gray-700">Nilai Transaksi (DPP)</span>
              <span className="font-medium">{formatCurrency(result.transactionValue)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-orange-100">
              <span className="text-gray-700">Tarif PPN</span>
              <span className="font-medium">{result.ppnRate}%</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-orange-100">
              <span className="text-gray-700">PPN</span>
              <span className="font-medium">{formatCurrency(result.ppn)}</span>
            </div>
            
            {result.ppnbmRate > 0 && (
              <>
                <div className="flex justify-between pb-2 border-b border-orange-100">
                  <span className="text-gray-700">Tarif PPnBM</span>
                  <span className="font-medium">{result.ppnbmRate}%</span>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-orange-100">
                  <span className="text-gray-700">PPnBM</span>
                  <span className="font-medium">{formatCurrency(result.ppnbm)}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between pt-2">
              <span className="text-orange-900 font-semibold">Total PPN + PPnBM</span>
              <span className="text-orange-900 font-bold">{formatCurrency(result.totalTax)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PPNCalculator;