const symptoms = [
  { code: "G01", name: "Keterlambatan Produksi" },
  { code: "G02", name: "Kualitas Produk yang rendah" },
  { code: "G03", name: "Kapasitas produksi yang tidak mencukupi" },
  { code: "G04", name: "Bahan baku tidak sesuai" },
  { code: "G05", name: "Data barang tidak konsisten" },
  { code: "G06", name: "Barang di gudang rusak" },
  { code: "G07", name: "Stock Berlebih" },
  { code: "G08", name: "Kehilangan barang di gudang" },
  { code: "G09", name: "Barang yang diterima tidak sesuai" },
  { code: "G10", name: "Barang di gudang kurang" },
  { code: "G11", name: "Keterlambatan pengiriman" },
  { code: "G12", name: "Barang Rusak saat pengiriman" },
  { code: "G13", name: "Kehilangan Barang Pada pengiriman" },
  { code: "G14", name: "Keterlambatan penerimaan Barang" },
  { code: "G15", name: "Terjadi Pengembalian barang" },
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
