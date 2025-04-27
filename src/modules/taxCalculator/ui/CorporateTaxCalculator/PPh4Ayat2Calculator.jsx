import React, { useState } from 'react';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPh4Ayat2Calculator() {
  const [formValues, setFormValues] = useState({
    incomeType: 'propertyRental',
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

  const calculatePPh4Ayat2 = (params) => {
    const { incomeType, incomeAmount, hasNPWP } = params;
    
    // Define rates based on income type
    let rate = 0;
    let description = '';
    
    switch (incomeType) {
      case 'propertyRental':
        rate = 10;
        description = 'Tarif untuk sewa tanah dan/atau bangunan adalah 10%';
        break;
      case 'construction':
        rate = 2;
        description = 'Tarif untuk jasa konstruksi (perencanaan) adalah 2%';
        break;
      case 'constructionExecution':
        rate = 3;
        description = 'Tarif untuk jasa konstruksi (pelaksanaan) adalah 3%';
        break;
      case 'constructionSupervision':
        rate = 4;
        description = 'Tarif untuk jasa konstruksi (pengawasan) adalah 4%';
        break;
      case 'sharesPrivate':
        rate = 0.1;
        description = 'Tarif untuk pengalihan saham perusahaan tertutup adalah 0.1%';
        break;
      case 'bondInterest':
        rate = 15;
        description = 'Tarif untuk bunga obligasi adalah 15%';
        break;
      case 'deposit':
        rate = 20;
        description = 'Tarif untuk bunga deposito adalah 20%';
        break;
      case 'lottery':
        rate = 25;
        description = 'Tarif untuk hadiah undian adalah 25%';
        break;
      default:
        rate = 10;
    }
    
    // Apply higher rate for those without NPWP (20% higher) - for certain types
    if (!hasNPWP && ['propertyRental', 'construction', 'constructionExecution', 'constructionSupervision'].includes(incomeType)) {
      rate = rate * 1.2;
      description += ' (Ditambah 20% karena tidak memiliki NPWP)';
    }
    
    // Calculate tax
    const tax = incomeAmount * (rate / 100);
    
    return { incomeAmount, rate, tax, description };
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
      
      const calculationResult = calculatePPh4Ayat2(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPh 4(2):', err);
      setError('Terjadi kesalahan saat menghitung PPh Pasal 4 Ayat (2). Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-amber-700">Kalkulator PPh Pasal 4 Ayat (2)</h3>
      
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
              <option value="propertyRental">Sewa Tanah dan/atau Bangunan</option>
              <option value="construction">Jasa Konstruksi (Perencanaan)</option>
              <option value="constructionExecution">Jasa Konstruksi (Pelaksanaan)</option>
              <option value="constructionSupervision">Jasa Konstruksi (Pengawasan)</option>
              <option value="sharesPrivate">Pengalihan Saham Perusahaan Tertutup</option>
              <option value="bondInterest">Bunga Obligasi</option>
              <option value="deposit">Bunga Deposito dan Tabungan</option>
              <option value="lottery">Hadiah Undian</option>
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
                className="h-4 w-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Memiliki NPWP</span>
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 cursor-pointer"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPh Pasal 4 (2)'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="text-lg font-semibold mb-4 text-amber-800">Hasil Perhitungan PPh Pasal 4 (2)</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-amber-100">
              <span className="text-gray-700">Jumlah Penghasilan</span>
              <span className="font-medium">{formatCurrency(result.incomeAmount)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-amber-100">
              <span className="text-gray-700">Tarif PPh Pasal 4 (2)</span>
              <span className="font-medium">{result.rate}%</span>
            </div>
            
            {result.description && (
              <div className="py-2 px-3 bg-amber-100 rounded text-sm text-amber-800">
                <p>{result.description}</p>
              </div>
            )}
            
            <div className="flex justify-between pt-2">
              <span className="text-amber-900 font-semibold">PPh Pasal 4 (2) Terutang</span>
              <span className="text-amber-900 font-bold">{formatCurrency(result.tax)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PPh4Ayat2Calculator;