/**
 * Calculate General Personal Income Tax (PPh OP Umum - Pasal 17)
 * @param {Object} params - Parameters for calculation
 * @returns {Object} - Calculation result
 */
export function calculateGeneralPersonalIncomeTax(params) {
  const {
    annualGrossIncome,
    allowableDeductions,
    isMarried,
    dependents,
    hasNPWP
  } = params;

  // Calculate net income
  const netIncome = annualGrossIncome - allowableDeductions;
  
  // PTKP (Tax-Free Income) calculation
  // Base PTKP for single taxpayer is 54,000,000
  let ptkp = 54000000;
  
  // Additional PTKP for married
  if (isMarried) {
    ptkp += 4500000;
  }
  
  // Additional PTKP for dependents (max 3)
  const dependentsCount = Math.min(parseInt(dependents), 3);
  ptkp += dependentsCount * 4500000;
  
  // Taxable income
  const taxableIncome = Math.max(0, netIncome - ptkp);
  
  // Tax calculation based on progressive rates
  let totalTax = 0;
  const taxLayers = [];
  
  if (taxableIncome > 0) {
    // First layer: 0 - 50,000,000 (5%)
    const layer1Amount = Math.min(taxableIncome, 50000000);
    const layer1Tax = layer1Amount * 0.05;
    totalTax += layer1Tax;
    
    if (layer1Amount > 0) {
      taxLayers.push({
        description: '5% × ' + formatLayerAmount(layer1Amount),
        tax: layer1Tax
      });
    }
    
    // Second layer: 50,000,000 - 250,000,000 (15%)
    const layer2Amount = Math.min(Math.max(0, taxableIncome - 50000000), 200000000);
    const layer2Tax = layer2Amount * 0.15;
    totalTax += layer2Tax;
    
    if (layer2Amount > 0) {
      taxLayers.push({
        description: '15% × ' + formatLayerAmount(layer2Amount),
        tax: layer2Tax
      });
    }
    
    // Third layer: 250,000,000 - 500,000,000 (25%)
    const layer3Amount = Math.min(Math.max(0, taxableIncome - 250000000), 250000000);
    const layer3Tax = layer3Amount * 0.25;
    totalTax += layer3Tax;
    
    if (layer3Amount > 0) {
      taxLayers.push({
        description: '25% × ' + formatLayerAmount(layer3Amount),
        tax: layer3Tax
      });
    }
    
    // Fourth layer: > 500,000,000 (30%)
    const layer4Amount = Math.max(0, taxableIncome - 500000000);
    const layer4Tax = layer4Amount * 0.30;
    totalTax += layer4Tax;
    
    if (layer4Amount > 0) {
      taxLayers.push({
        description: '30% × ' + formatLayerAmount(layer4Amount),
        tax: layer4Tax
      });
    }
  }
  
  // Calculate penalty for not having NPWP (20% higher tax)
  const npwpPenalty = !hasNPWP ? totalTax * 0.2 : 0;
  const totalTaxWithPenalty = totalTax + npwpPenalty;
  
  return {
    grossIncome: annualGrossIncome,
    allowableDeductions,
    netIncome,
    ptkp,
    taxableIncome,
    taxLayers,
    totalTax,
    npwpPenalty,
    totalTaxWithPenalty
  };
}

/**
 * Calculate PPh Final PP 23/2018 (0.5% from gross turnover)
 * @param {Object} params - Parameters for calculation
 * @returns {Object} - Calculation result
 */
export function calculatePPh23Final(params) {
  const { grossTurnover } = params;
  
  // Rate for PP 23/2018 is 0.5%
  const rate = 0.5;
  
  // Calculate tax
  const tax = grossTurnover * (rate / 100);
  
  return {
    grossTurnover,
    rate,
    tax
  };
}

/**
 * Calculate PPh with NPPN (Norma Penghitungan Penghasilan Neto)
 * @param {Object} params - Parameters for calculation
 * @returns {Object} - Calculation result
 */
export function calculateNPPN(params) {
  const {
    businessType,
    grossTurnover,
    isMarried,
    dependents,
    hasNPWP
  } = params;
  
  // Get NPPN rate based on business type
  const npnnRate = getNPPNRate(businessType, grossTurnover);
  
  // Calculate net income using NPPN
  const netIncome = grossTurnover * (npnnRate / 100);
  
  // PTKP (Tax-Free Income) calculation
  let ptkp = 54000000; // Base PTKP for single taxpayer
  
  // Additional PTKP for married
  if (isMarried) {
    ptkp += 4500000;
  }
  
  // Additional PTKP for dependents (max 3)
  const dependentsCount = Math.min(parseInt(dependents), 3);
  ptkp += dependentsCount * 4500000;
  
  // Taxable income
  const taxableIncome = Math.max(0, netIncome - ptkp);
  
  // Tax calculation based on progressive rates (same as general PPh OP)
  let totalTax = 0;
  const taxLayers = [];
  
  if (taxableIncome > 0) {
    // First layer: 0 - 50,000,000 (5%)
    const layer1Amount = Math.min(taxableIncome, 50000000);
    const layer1Tax = layer1Amount * 0.05;
    totalTax += layer1Tax;
    
    if (layer1Amount > 0) {
      taxLayers.push({
        description: '5% × ' + formatLayerAmount(layer1Amount),
        tax: layer1Tax
      });
    }
    
    // Second layer: 50,000,000 - 250,000,000 (15%)
    const layer2Amount = Math.min(Math.max(0, taxableIncome - 50000000), 200000000);
    const layer2Tax = layer2Amount * 0.15;
    totalTax += layer2Tax;
    
    if (layer2Amount > 0) {
      taxLayers.push({
        description: '15% × ' + formatLayerAmount(layer2Amount),
        tax: layer2Tax
      });
    }
    
    // Third layer: 250,000,000 - 500,000,000 (25%)
    const layer3Amount = Math.min(Math.max(0, taxableIncome - 250000000), 250000000);
    const layer3Tax = layer3Amount * 0.25;
    totalTax += layer3Tax;
    
    if (layer3Amount > 0) {
      taxLayers.push({
        description: '25% × ' + formatLayerAmount(layer3Amount),
        tax: layer3Tax
      });
    }
    
    // Fourth layer: > 500,000,000 (30%)
    const layer4Amount = Math.max(0, taxableIncome - 500000000);
    const layer4Tax = layer4Amount * 0.30;
    totalTax += layer4Tax;
    
    if (layer4Amount > 0) {
      taxLayers.push({
        description: '30% × ' + formatLayerAmount(layer4Amount),
        tax: layer4Tax
      });
    }
  }
  
  // Calculate penalty for not having NPWP (20% higher tax)
  const npwpPenalty = !hasNPWP ? totalTax * 0.2 : 0;
  const totalTaxWithPenalty = totalTax + npwpPenalty;
  
  return {
    grossTurnover,
    npnnRate,
    netIncome,
    ptkp,
    taxableIncome,
    taxLayers,
    totalTax,
    npwpPenalty,
    totalTaxWithPenalty
  };
}

/**
 * Calculate PPh Final Pasal 4 ayat (2)
 * @param {Object} params - Parameters for calculation
 * @returns {Object} - Calculation result
 */
export function calculatePPh4Ayat2(params) {
  const { incomeType, amount } = params;
  
  // Get rate based on income type
  const rate = getPPh4Ayat2Rate(incomeType);
  
  // Calculate tax
  const tax = amount * (rate / 100);
  
  return {
    amount,
    rate,
    tax
  };
}

// Helper function to get NPPN rate based on business type
function getNPPNRate(businessType, grossTurnover) {
  // Simplified NPPN rates
  const npnnRates = {
    'agriculture': 14.5,
    'trade': 10,
    'industry': 12.5,
    'services': 17.5,
    'freelance': 30,
    'construction': 15,
    'other': 12.5
  };
  
  return npnnRates[businessType] || 12.5;
}

// Helper function to get PPh 4 ayat 2 rate based on income type
function getPPh4Ayat2Rate(incomeType) {
  const rates = {
    'land_building_sale': 2.5,
    'land_building_rent': 10,
    'construction_service': 3,
    'lottery': 25,
    'bonds_interest': 15,
    'deposit_interest': 20,
    'shares_sale': 0.1,
    'initial_public_offering': 0.5
  };
  
  return rates[incomeType] || 10;
}

// Helper function to format layer amount
function formatLayerAmount(amount) {
  return new Intl.NumberFormat('id-ID').format(amount);
}