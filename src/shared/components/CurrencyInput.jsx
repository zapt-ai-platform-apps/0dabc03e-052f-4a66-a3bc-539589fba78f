import React from 'react';

function CurrencyInput({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  className = ''
}) {
  const handleChange = (e) => {
    // Remove non-digit characters
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(rawValue);
  };

  // Format number with thousand separators
  const formatValue = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500">Rp</span>
      </div>
      <input
        type="text"
        id={id}
        name={name}
        value={formatValue(value)}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input pl-10 ${className}`}
      />
    </div>
  );
}

export default CurrencyInput;