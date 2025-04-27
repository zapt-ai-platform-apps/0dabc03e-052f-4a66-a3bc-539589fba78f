import React from 'react';

function TaxTypeSelector({ onSelect }) {
  const taxTypes = [
    {
      id: 'pph21',
      name: 'PPh Pasal 21',
      description: 'Pajak atas penghasilan karyawan',
      color: 'blue'
    },
    {
      id: 'pph22',
      name: 'PPh Pasal 22',
      description: 'Pajak atas perdagangan/kegiatan ekspor-impor',
      color: 'green'
    },
    {
      id: 'pph23',
      name: 'PPh Pasal 23',
      description: 'Pajak atas royalti, dividen, hadiah, bonus, dan jasa tertentu',
      color: 'indigo'
    },
    {
      id: 'pph26',
      name: 'PPh Pasal 26',
      description: 'Pajak atas transaksi dengan wajib pajak luar negeri',
      color: 'purple'
    },
    {
      id: 'pph29',
      name: 'PPh Pasal 29',
      description: 'Perhitungan potensi kurang bayar PPh Tahunan Badan',
      color: 'red'
    },
    {
      id: 'ppn',
      name: 'PPN',
      description: 'Pajak atas penjualan barang/jasa kena pajak',
      color: 'orange'
    },
    {
      id: 'pph15',
      name: 'PPh Pasal 15',
      description: 'Pajak atas penghasilan wajib pajak tertentu seperti asuransi LN, penerbangan',
      color: 'teal'
    },
    {
      id: 'pph4ayat2',
      name: 'PPh Pasal 4 Ayat (2)',
      description: 'Pajak final atas penghasilan tertentu',
      color: 'amber'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6 text-center">Pilih Jenis Pajak</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}

export default TaxTypeSelector;