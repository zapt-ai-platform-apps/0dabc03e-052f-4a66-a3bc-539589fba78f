import React, { useState } from 'react';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import TaxCalculatorSelector from '@/modules/taxCalculator/ui/TaxCalculatorSelector';
import CorporateTaxCalculator from '@/modules/taxCalculator/ui/CorporateTaxCalculator';
import PersonalTaxCalculator from '@/modules/taxCalculator/ui/PersonalTaxCalculator';
import ZaptBadge from '@/shared/components/ZaptBadge';

export default function App() {
  const [calculatorType, setCalculatorType] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Kalkulator Pajak Indonesia</h1>
        
        {!calculatorType ? (
          <TaxCalculatorSelector onSelect={setCalculatorType} />
        ) : calculatorType === 'corporate' ? (
          <CorporateTaxCalculator onBack={() => setCalculatorType(null)} />
        ) : (
          <PersonalTaxCalculator onBack={() => setCalculatorType(null)} />
        )}
      </main>
      
      <Footer />
      <ZaptBadge />
    </div>
  );
}