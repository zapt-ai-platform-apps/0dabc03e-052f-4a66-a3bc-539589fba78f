import React, { useState } from 'react';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPh29Calculator() {
  const [formValues, setFormValues] = useState({
    netIncome: '',
    previousYearLoss: '',
    paidTaxes: '',
    isSME: false
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

  const calculatePPh29 = (params) => {
    const { netIncome, previousYearLoss, paidTaxes, isSME } = params;
    
    // Calculate taxable income after loss compensation
    const taxableIncome = Math.max(0, netIncome - previousYearLoss);
    
    // Calculate corporate tax based on tax rate
    let corporateTax = 0;
    
    if (isSME) {
      // For SMEs with gross revenue under 4.8B IDR, the rate is 0.5%
      // But this is applied to gross revenue, which we don't have
      // As an approximation, we'll use a 11% flat rate on net income
      corporateTax = taxableIncome * 0.11;
    } else {
      // Standard corporate tax rate is 22%
      corporateTax = taxableIncome * 0.22;
    }
    
    // Calculate remaining tax to be paid
    const remainingTax = Math.max(0, corporateTax - paidTaxes);
    
    // Check if there's an overpayment
    const overpayment = Math.max(0, paidTaxes - corporateTax);
    
    return { 
      taxableIncome, 
      corporateTax, 
      paidTaxes, 
      remainingTax, 
      overpayment,
      isOverpaid: paidTaxes > corporateTax
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);
    
    try {
      // Parse numeric inputs
      const numericFormValues = {
        ...formValues,
        netIncome: parseFloat(formValues.netIncome) || 0,
        previousYearLoss: parseFloat(formValues.previousYearLoss) || 0,
        paidTaxes: parseFloat(formValues.paidTaxes) || 0
      };
      
      const calculationResult = calculatePPh29(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPh 29:', err);
      setError('Terjadi kesalahan saat menghitung PPh 29. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-red-700">Kalkulator PPh Pasal 29</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="netIncome" className="label">Penghasilan Kena Pajak</label>
            <CurrencyInput 
              id="netIncome"
              name="netIncome"
              value={formValues.netIncome}
              onChange={(value) => handleCurrencyChange('netIncome', value)}
              placeholder="Masukkan penghasilan kena pajak"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="previousYearLoss" className="label">Kompensasi Kerugian</label>
            <CurrencyInput 
              id="previousYearLoss"
              name="previousYearLoss"
              value={formValues.previousYearLoss}
              onChange={(value) => handleCurrencyChange('previousYearLoss', value)}
              placeholder="Masukkan kompensasi kerugian"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="paidTaxes" className="label">PPh yang Sudah Dibayar</label>
            <CurrencyInput 
              id="paidTaxes"
              name="paidTaxes"
              value={formValues.paidTaxes}
              onChange={(value) => handleCurrencyChange('paidTaxes', value)}
              placeholder="Masukkan PPh yang sudah dibayar"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="isSME" className="flex items-center">
              <input
                type="checkbox"
                id="isSME"
                name="isSME"
                checked={formValues.isSME}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                UMKM dengan Omzet < 4,8 Miliar
              </span>
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full bg-red-600 hover:bg-red-700 focus:ring-red-500 cursor-pointer"
            disabled={isCalculating}
          >
            {isCalculating ? 'Menghitung...' : 'Hitung PPh 29'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="text-lg font-semibold mb-4 text-red-800">Hasil Perhitungan PPh 29</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-red-100">
              <span className="text-gray-700">Penghasilan Kena Pajak</span>
              <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-red-100">
              <span className="text-gray-700">PPh Badan</span>
              <span className="font-medium">{formatCurrency(result.corporateTax)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-red-100">
              <span className="text-gray-700">PPh yang Sudah Dibayar</span>
              <span className="font-medium">{formatCurrency(result.paidTaxes)}</span>
            </div>
            
            {result.isOverpaid ? (
              <div className="flex justify-between pt-2">
                <span className="text-green-700 font-semibold">Lebih Bayar (PPh Pasal 28A)</span>
                <span className="text-green-700 font-bold">{formatCurrency(result.overpayment)}</span>
              </div>
            ) : (
              <div className="flex justify-between pt-2">
                <span className="text-red-900 font-semibold">Kurang Bayar (PPh Pasal 29)</span>
                <span className="text-red-900 font-bold">{formatCurrency(result.remainingTax)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PPh29Calculator;