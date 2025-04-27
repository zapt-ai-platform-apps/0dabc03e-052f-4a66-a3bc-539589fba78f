/**
 * Calculate PPh 21 (Income Tax for Employees)
 * @param {Object} params - Parameters for calculation
 * @returns {Object} - Calculation result
 */
export function calculatePPh21(params) {
  const {
    salary,
    allowances,
    insurancePremium,
    pensionContribution,
    isMarried,
    dependents,
    hasPTKP,
    isPermanent,
    isNPWP
  } = params;

  // Monthly gross income
  const grossIncome = salary + allowances;
  
  // Position cost (5% of gross income, max 500,000 per month)
  const positionCost = Math.min(grossIncome * 0.05, 500000);
  
  // Combined deductions (position cost, insurance, pension)
  const totalDeductions = positionCost + insurancePremium + pensionContribution;
  
  // Monthly net income
  const netIncome = grossIncome - totalDeductions;
  
  // Annual net income
  const annualNetIncome = netIncome * 12;
  
  // PTKP (Tax-Free Income) calculation
  let ptkp = 0;
  if (hasPTKP) {
    // Base PTKP for single taxpayer
    ptkp = 54000000;
    
    // Additional PTKP for married
    if (isMarried) {
      ptkp += 4500000;
    }
    
    // Additional PTKP for dependents (max 3)
    const dependentsCount = Math.min(parseInt(dependents), 3);
    ptkp += dependentsCount * 4500000;
  }
  
  // Taxable income
  const taxableIncome = Math.max(0, annualNetIncome - ptkp);
  
  // Tax calculation based on progressive rates
  let annualTax = 0;
  
  if (taxableIncome > 0) {
    if (taxableIncome <= 50000000) {
      annualTax = taxableIncome * 0.05;
    } else if (taxableIncome <= 250000000) {
      annualTax = 50000000 * 0.05 + (taxableIncome - 50000000) * 0.15;
    } else if (taxableIncome <= 500000000) {
      annualTax = 50000000 * 0.05 + 200000000 * 0.15 + (taxableIncome - 250000000) * 0.25;
    } else {
      annualTax = 50000000 * 0.05 + 200000000 * 0.15 + 250000000 * 0.25 + (taxableIncome - 500000000) * 0.30;
    }
    
    // Apply penalty for those without NPWP (20% higher tax)
    if (!isNPWP) {
      annualTax = annualTax * 1.2;
    }
  }
  
  // Monthly tax
  const monthlyTax = annualTax / 12;
  
  return {
    grossIncome,
    positionCost,
    totalDeductions,
    netIncome,
    annualNetIncome,
    ptkp,
    taxableIncome,
    annualTax,
    monthlyTax
  };
}

/**
 * Calculate PPh 22 (Income Tax for Import/Purchase)
 * @param {Object} params - Parameters for calculation
 * @returns {Object} - Calculation result
 */
export function calculatePPh22(params) {
  const {
    transactionType,
    transactionValue,
    hasNPWP,
    importType,
    apiuExists
  } = params;
  
  let rate = 0;
  let tax = 0;
  let additionalInfo = null;
  
  // Apply different rates based on transaction type
  switch (transactionType) {
    case 'import':
      if (importType === 'soybeans') {
        rate = 0.5;
        additionalInfo = 'Tarif khusus untuk impor kedelai, gandum, tepung terigu adalah 0,5%';
      } else if (importType === 'special') {
        rate = 7.5;
        additionalInfo = 'Tarif khusus untuk impor dengan ketentuan khusus adalah 7,5%';
      } else {
        // Regular import
        rate = apiuExists ? 2.5 : 7.5;
        additionalInfo = apiuExists 
          ? 'Importir dengan API-U dikenakan tarif 2,5%' 
          : 'Importir tanpa API-U dikenakan tarif 7,5%';
      }
      break;
      
    case 'governmentPayment':
      rate = 1.5;
      break;
      
    case 'stateOwnedCompany':
      rate = 1.5;
      break;
      
    case 'automotive':
      rate = 0.45;
      additionalInfo = 'Tarif untuk penjualan kendaraan bermotor dalam negeri adalah 0,45%';
      break;
      
    case 'oil':
      rate = 0.3;
      additionalInfo = 'Tarif untuk pembelian bahan bakar adalah 0,3%';
      break;
      
    case 'luxury':
      rate = 5;
      additionalInfo = 'Tarif untuk pembelian barang mewah adalah 5%';
      break;
      
    default:
      rate = 1.5;
  }
  
  // Apply higher rate for those without NPWP
  if (!hasNPWP) {
    rate = rate * 1.2;
    additionalInfo = (additionalInfo || '') + ' Tambahan 20% karena tidak memiliki NPWP.';
  }
  
  // Calculate tax
  tax = transactionValue * (rate / 100);
  
  return {
    transactionValue,
    rate,
    tax,
    additionalInfo
  };
}

/**
 * Calculate PPh 23 (Income Tax for Services)
 * @param {Object} params - Parameters for calculation
 * @returns {Object} - Calculation result
 */
export function calculatePPh23(params) {
  const {
    incomeType,
    incomeAmount,
    hasNPWP
  } = params;
  
  // Default rate is 2%
  let rate = incomeType === 'rent' || incomeType === 'otherActivities' ? 2 : 15;
  
  // Apply higher rate for those without NPWP
  if (!hasNPWP) {
    rate = rate * 1.2;
  }
  
  // Calculate tax
  const tax = incomeAmount * (rate / 100);
  
  return {
    incomeAmount,
    rate,
    tax
  };
}

/**
 * Calculate PPh 26 (Income Tax for Foreign Taxpayers)
 * @param {Object} params - Parameters for calculation
 * @returns {Object} - Calculation result
 */
export function calculatePPh26(params) {
  const {
    incomeType,
    incomeAmount,
    hasTaxTreaty,
    treatyRate
  } = params;
  
  // Default rate is 20%
  let rate = 20;
  let appliedRate = rate;
  
  // If there's a tax treaty, use the treaty rate
  if (hasTaxTreaty && treatyRate) {
    appliedRate = treatyRate;
  }
  
  // Calculate tax
  const tax = incomeAmount * (appliedRate / 100);
  
  return {
    incomeAmount,
    standardRate: rate,
    appliedRate,
    tax,
    hasTaxTreaty
  };
}

/**
 * Calculate PPN (Value Added Tax)
 * @param {Object} params - Parameters for calculation
 * @returns {Object} - Calculation result
 */
export function calculatePPN(params) {
  const {
    transactionType,
    transactionValue,
    luxuryGoods
  } = params;
  
  // Standard PPN rate is 11%
  const ppnRate = 11;
  
  // Calculate PPN
  const ppn = transactionValue * (ppnRate / 100);
  
  // PPnBM rate (Luxury Goods Sales Tax)
  let ppnbmRate = 0;
  if (luxuryGoods) {
    // Apply different rates based on luxury goods category
    switch (luxuryGoods) {
      case 'category1':
        ppnbmRate = 10;
        break;
      case 'category2':
        ppnbmRate = 20;
        break;
      case 'category3':
        ppnbmRate = 30;
        break;
      case 'category4':
        ppnbmRate = 40;
        break;
      case 'category5':
        ppnbmRate = 50;
        break;
      default:
        ppnbmRate = 0;
    }
  }
  
  // Calculate PPnBM
  const ppnbm = transactionValue * (ppnbmRate / 100);
  
  // Total tax
  const totalTax = ppn + ppnbm;
  
  return {
    transactionValue,
    ppnRate,
    ppn,
    ppnbmRate,
    ppnbm,
    totalTax
  };
}