import React, { useState } from 'react';
import { calculatePPh4Ayat2 } from '@/modules/taxCalculator/internal/personalTax';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPh4Ayat2Calculator() {
  const [formValues, setFormValues] = useState({
    incomeType: 'land_building_sale',
    amount: ''
  });
  
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const incomeTypes = [
    { id: 'land_building_sale', name: 'Pengalihan Hak atas Tanah dan/atau Bangunan (2,5%)' },
    { id: 'land_building_rent', name: 'Persewaan Tanah dan/atau Bangunan (10%)' },
    { id: 'construction_service', name: 'Jasa Konstruksi (3%)' },
    { id: 'lottery', name: 'Hadiah Undian (25%)' },
    { id: 'bonds_interest', name: 'Bunga Obligasi (15%)' },
    { id: 'deposit_interest', name: 'Bunga Deposito dan Tabungan (20%)' },
    { id: 'shares_sale', name: 'Transaksi Penjualan Saham di Bursa Efek (0,1%)' },
    { id: 'initial_public_offering', name: 'Penjualan Saham Pendiri - IPO (0,5%)' }
  ];

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
        amount: parseFloat(formValues.amount) || 0
      };
      
      const calculationResult = calculatePPh4Ayat2(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPh Pasal 4 ayat (2):', err);
      setError('Terjadi kesalahan saat menghitung PPh. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-amber-700">
        Kalkulator PPh Final Pasal 4 ayat (2)
      </h3>
      
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
              className="select box-border"
              required
            >
              {incomeTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="amount" className="label">Jumlah Penghasilan</label>
            <CurrencyInput 
              id="amount"
              name="amount"
              value={formValues.amount}
              onChange={(value) => handleCurrencyChange('amount', value)}
              placeholder="Masukkan jumlah penghasilan"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Nilai penghasilan bruto yang akan dikenakan PPh Final Pasal 4 ayat (2)
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full cursor-pointer"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPh Final Pasal 4 ayat (2)'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="text-lg font-semibold mb-4 text-amber-800">Hasil Perhitungan PPh Final Pasal 4 ayat (2)</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-amber-100">
              <span className="text-gray-700">Jumlah Penghasilan</span>
              <span className="font-medium">{formatCurrency(result.amount)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-amber-100">
              <span className="text-gray-700">Tarif Pajak</span>
              <span className="font-medium">{result.rate}%</span>
            </div>
            
            <div className="flex justify-between pt-2">
              <span className="text-amber-900 font-semibold">PPh Final Terutang</span>
              <span className="text-amber-900 font-bold">{formatCurrency(result.tax)}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-100 rounded-md text-sm text-amber-800">
            <p>
              <strong>Catatan:</strong> PPh Final Pasal 4 ayat (2) merupakan pajak yang bersifat final, 
              artinya tidak perlu dilaporkan dalam SPT Tahunan sebagai penghasilan yang terutang pajak.
              Tarif yang dikenakan berbeda untuk setiap jenis penghasilan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PPh4Ayat2Calculator;