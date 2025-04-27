import React from 'react';

function TaxTypeSelector({ onSelect }) {
  const taxTypes = [
    {
      id: 'general',
      name: 'PPh OP Umum',
      description: 'Pajak penghasilan berdasarkan tarif Pasal 17 UU PPh bagi WP OP yang melakukan pembukuan',
      color: 'blue'
    },
    {
      id: 'pph23',
      name: 'PPh Final PP 23/2018',
      description: 'Tarif 0,5% dari omzet bruto bagi WP OP dengan peredaran bruto tidak lebih dari Rp4,8 miliar',
      color: 'green'
    },
    {
      id: 'nppn',
      name: 'PPh OP secara NPPN',
      description: 'Menggunakan tarif Pasal 17 UU PPh dengan penghasilan neto berdasarkan norma',
      color: 'indigo'
    },
    {
      id: 'pph4ayat2',
      name: 'PPh Final Pasal 4 ayat (2)',
      description: 'Pajak final atas jenis-jenis penghasilan tertentu',
      color: 'amber'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6 text-center">Pilih Jenis Pajak Penghasilan Orang Pribadi</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {taxTypes.map((tax) => (
          <button
            key={tax.id}
            onClick={() => onSelect(tax.id)}
            className={`card border border-${tax.color}-200 bg-${tax.color}-50 hover:bg-${tax.color}-100 transition-all cursor-pointer text-left`}
          >
            <h4 className={`text-lg font-semibold text-${tax.color}-700 mb-2`}>{tax.name}</h4>
            <p className="text-gray-600 text-sm">{tax.description}</p>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold mb-2">Ketentuan Jenis Pajak Penghasilan Orang Pribadi</h4>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Wajib Pajak Orang Pribadi dengan omzet < Rp4,8 miliar dapat memilih metode perhitungan yang menguntungkan</li>
          <li>PP 23/2018 bersifat final dengan tarif 0,5% dari omzet bruto</li>
          <li>Metode NPPN menggunakan norma penghitungan yang berbeda untuk setiap jenis usaha</li>
          <li>Untuk penghasilan yang dikenai pajak bersifat final, gunakan PPh Final Pasal 4 ayat (2)</li>
        </ul>
      </div>
    </div>
  );
}

export default TaxTypeSelector;