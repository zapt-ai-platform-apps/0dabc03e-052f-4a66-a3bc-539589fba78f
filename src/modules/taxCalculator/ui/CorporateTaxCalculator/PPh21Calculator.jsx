import React, { useState } from 'react';
import { calculatePPh21 } from '@/modules/taxCalculator/internal/corporateTax';
import CurrencyInput from '@/shared/components/CurrencyInput';
import { formatCurrency } from '@/shared/utils/formatting';

function PPh21Calculator() {
  const [formValues, setFormValues] = useState({
    salary: '',
    allowances: '',
    insurancePremium: '',
    pensionContribution: '',
    isMarried: false,
    dependents: '0',
    hasPTKP: true,
    isPermanent: true,
    isNPWP: true
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
        salary: parseFloat(formValues.salary) || 0,
        allowances: parseFloat(formValues.allowances) || 0,
        insurancePremium: parseFloat(formValues.insurancePremium) || 0,
        pensionContribution: parseFloat(formValues.pensionContribution) || 0,
        dependents: parseInt(formValues.dependents, 10) || 0
      };
      
      const calculationResult = calculatePPh21(numericFormValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Error calculating PPh 21:', err);
      setError('Terjadi kesalahan saat menghitung PPh 21. Silakan periksa input Anda.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-blue-700">Kalkulator PPh Pasal 21</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="salary" className="label">Gaji Pokok (per bulan)</label>
              <CurrencyInput 
                id="salary"
                name="salary"
                value={formValues.salary}
                onChange={(value) => handleCurrencyChange('salary', value)}
                placeholder="Masukkan jumlah gaji"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="allowances" className="label">Tunjangan (per bulan)</label>
              <CurrencyInput 
                id="allowances"
                name="allowances"
                value={formValues.allowances}
                onChange={(value) => handleCurrencyChange('allowances', value)}
                placeholder="Masukkan jumlah tunjangan"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="insurancePremium" className="label">Premi Asuransi (per bulan)</label>
              <CurrencyInput 
                id="insurancePremium"
                name="insurancePremium"
                value={formValues.insurancePremium}
                onChange={(value) => handleCurrencyChange('insurancePremium', value)}
                placeholder="Masukkan jumlah premi asuransi"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="pensionContribution" className="label">Iuran Pensiun (per bulan)</label>
              <CurrencyInput 
                id="pensionContribution"
                name="pensionContribution"
                value={formValues.pensionContribution}
                onChange={(value) => handleCurrencyChange('pensionContribution', value)}
                placeholder="Masukkan jumlah iuran pensiun"
              />
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
              <label htmlFor="isNPWP" className="flex items-center">
                <input
                  type="checkbox"
                  id="isNPWP"
                  name="isNPWP"
                  checked={formValues.isNPWP}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Memiliki NPWP</span>
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="isPermanent" className="flex items-center">
                <input
                  type="checkbox"
                  id="isPermanent"
                  name="isPermanent"
                  checked={formValues.isPermanent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Pegawai Tetap</span>
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="hasPTKP" className="flex items-center">
                <input
                  type="checkbox"
                  id="hasPTKP"
                  name="hasPTKP"
                  checked={formValues.hasPTKP}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Terapkan PTKP</span>
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
            {isCalculating ? 'Menghitung...' : 'Hitung PPh 21'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold mb-4 text-blue-800">Hasil Perhitungan PPh 21</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">Penghasilan Bruto</span>
              <span className="font-medium">{formatCurrency(result.grossIncome)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">Biaya Jabatan</span>
              <span className="font-medium">{formatCurrency(result.positionCost)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">Iuran Pensiun / JPK</span>
              <span className="font-medium">{formatCurrency(result.totalDeductions)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">Penghasilan Neto</span>
              <span className="font-medium">{formatCurrency(result.netIncome)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">Penghasilan Neto Setahun</span>
              <span className="font-medium">{formatCurrency(result.annualNetIncome)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">PTKP</span>
              <span className="font-medium">{formatCurrency(result.ptkp)}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-blue-100">
              <span className="text-gray-700">PKP</span>
              <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
            </div>
            
            <div className="flex justify-between pt-2">
              <span className="text-blue-900 font-semibold">PPh 21 Terutang (Sebulan)</span>
              <span className="text-blue-900 font-bold">{formatCurrency(result.monthlyTax)}</span>
            </div>
            
            <div className="flex justify-between pt-1">
              <span className="text-blue-900 font-semibold">PPh 21 Terutang (Setahun)</span>
              <span className="text-blue-900 font-bold">{formatCurrency(result.annualTax)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PPh21Calculator;