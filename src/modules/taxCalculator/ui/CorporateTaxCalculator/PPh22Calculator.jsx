import React, { useState } from 'react';
import { calculatePPh22 } from '@/modules/taxCalculator/internal/corporateTax';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPh22Calculator() {
  const [formValues, setFormValues] = useState({
    transactionType: 'import',
    transactionValue: '',
    hasNPWP: true,
    importType: 'regular',
    apiuExists: false
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
        transactionValue: parseFloat(formValues.transactionValue) || 0
      };
      
      const calculationResult = calculatePPh22(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPh 22:', err);
      setError('Terjadi kesalahan saat menghitung PPh 22. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-green-700">Kalkulator PPh Pasal 22</h3>
      
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
              <option value="import">Impor Barang</option>
              <option value="governmentPayment">Pembayaran oleh Bendahara Pemerintah</option>
              <option value="stateOwnedCompany">Pembelian oleh BUMN/BUMD</option>
              <option value="automotive">Penjualan Kendaraan Bermotor</option>
              <option value="oil">Pembelian Bahan Bakar</option>
              <option value="luxury">Pembelian Barang Mewah</option>
            </select>
          </div>
          
          {formValues.transactionType === 'import' && (
            <div className="form-group">
              <label htmlFor="importType" className="label">Jenis Impor</label>
              <select
                id="importType"
                name="importType"
                value={formValues.importType}
                onChange={handleInputChange}
                className="select"
              >
                <option value="regular">Impor Biasa</option>
                <option value="soybeans">Kedelai, Gandum, Tepung Terigu</option>
                <option value="special">Barang dengan Ketentuan Khusus</option>
              </select>
            </div>
          )}
          
          {formValues.transactionType === 'import' && (
            <div className="form-group">
              <label htmlFor="apiuExists" className="flex items-center">
                <input
                  type="checkbox"
                  id="apiuExists"
                  name="apiuExists"
                  checked={formValues.apiuExists}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Memiliki Angka Pengenal Importir Umum (API-U)
                </span>
              </label>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="transactionValue" className="label">Nilai Transaksi</label>
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
            <label htmlFor="hasNPWP" className="flex items-center">
              <input
                type="checkbox"
                id="hasNPWP"
                name="hasNPWP"
                checked={formValues.hasNPWP}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Memiliki NPWP</span>
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full bg-green-600 hover:bg-green-700 focus:ring-green-500"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPh 22'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-lg font-semibold mb-4 text-green-800">Hasil Perhitungan PPh 22</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-green-100">
              <span className="text-gray-700">Nilai Transaksi</span>
              <span className="font-medium">{formatCurrency(result.transactionValue)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-green-100">
              <span className="text-gray-700">Tarif PPh 22</span>
              <span className="font-medium">{result.rate}%</span>
            </div>
            
            {result.additionalInfo && (
              <div className="py-2 px-3 bg-green-100 rounded text-sm text-green-800">
                <p>{result.additionalInfo}</p>
              </div>
            )}
            
            <div className="flex justify-between pt-2">
              <span className="text-green-900 font-semibold">PPh 22 Terutang</span>
              <span className="text-green-900 font-bold">{formatCurrency(result.tax)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PPh22Calculator;