const symptoms = [
  { code: "G01", name: "Seberapa sering terjadi keterlambatan produksi?" },
  { code: "G02", name: "Seberapa sering kualitas produk rendah?" },
  { code: "G03", name: "Seberapa sering kapasitas produksi tidak mencukupi?" },
  { code: "G04", name: "Seberapa sering bahan baku tidak sesuai?" },
  { code: "G05", name: "Seberapa sering data barang tidak konsisten?" },
  { code: "G06", name: "Seberapa sering barang di gudang rusak?" },
  { code: "G07", name: "Seberapa sering stok berlebih?" },
  { code: "G08", name: "Seberapa sering kehilangan barang di gudang?" },
  { code: "G09", name: "Seberapa sering barang yang diterima tidak sesuai?" },
  { code: "G10", name: "Seberapa sering barang di gudang kurang?" },
  { code: "G11", name: "Seberapa sering terjadi keterlambatan pengiriman?" },
  { code: "G12", name: "Seberapa sering barang rusak saat pengiriman?" },
  { code: "G13", name: "Seberapa sering kehilangan barang pada pengiriman?" },
  {
    code: "G14",
    name: "Seberapa sering terjadi keterlambatan penerimaan barang?",
  },
  { code: "G15", name: "Seberapa sering terjadi pengembalian barang?" },
];
  

const causes = [
  { code: "A", name: "Keterlambatan Pengiriman Bahan Baku" },
  { code: "B", name: "Pemrosesan yang Tidak Sesuai Standar" },
  { code: "C", name: "Gangguan pada Transportasi dan Bencana alam" },
  { code: "D", name: "Perubahan Permintaan yang Tidak Terduga" },
  { code: "E", name: "Kondisi Transportasi yang Buruk" },
  { code: "F", name: "Kesalahan Pengiriman" },
  { code: "G", name: "Miskomunikasi" },
  { code: "H", name: "Kesalahan pekerja atau petugas" },
  { code: "I", name: "Kesalahan sistem Produksi" },
  { code: "J", name: "Kesalahan Sistem IT" },
];

export { symptoms, causes };
