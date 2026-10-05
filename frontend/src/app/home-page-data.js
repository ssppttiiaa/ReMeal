export const homePage = {
  name: 'ReMeal public landing page',
  route: '/',
  language: 'id',
  purpose: 'Memperkenalkan penyelamatan makanan surplus dari bisnis lokal dan mengarahkan pengunjung untuk menjelajah atau mendaftar.',
  navigation: [
    { label: 'Tentang Kami', href: '#tentang', section: 'tentang' },
    { label: 'Cara Kerja', href: '#cara-kerja', section: 'cara-kerja' },
    { label: 'Dampak', href: '#dampak', section: 'dampak' },
    { label: 'Kenapa ReMeal', href: '#kenapa-remeal', section: 'kenapa-remeal' },
    { label: 'Masuk', href: '/login' },
    { label: 'Daftar', href: '/register' },
  ],
  sections: [
    {
      id: 'hero',
      title: 'Makan enak. Selamatkan makanan.',
      description: 'Makanan berlebih tidak harus berakhir menjadi sampah. Temukan santapan lezat dari UMKM sekitar dengan harga lebih hemat dan ramah kantong.',
      actions: [
        { label: 'Temukan makanan', href: '/consumer/products', behavior: 'Jika belum login, arahkan ke login dengan tujuan kembali ke katalog.' },
        { label: 'Pelajari ReMeal', href: '#tentang' },
      ],
      visual: 'Ilustrasi makanan surplus lokal dengan roti, salad, pizza, dan label ketersediaan.',
    },
    {
      id: 'dampak-ringkas',
      title: 'Dampak ReMeal',
      description: 'Metrik dampak ditampilkan sebagai tanda belum tersedia sampai data aktual dapat dihubungkan.',
      metrics: [
        { label: 'Makanan terselamatkan', value: null },
        { label: 'Pengguna bergabung', value: null },
        { label: 'Mitra UMKM aktif', value: null },
        { label: 'Food waste terhindarkan', value: null },
      ],
    },
    {
      id: 'tentang',
      title: 'Makanan baik tidak seharusnya terbuang.',
      description: 'ReMeal menghubungkan surplus makanan yang masih layak dari bisnis lokal dengan orang-orang yang ingin menikmatinya.',
      benefits: [
        { title: 'Harga lebih hemat', description: 'Nikmati makanan berkualitas dengan harga yang lebih bersahabat.' },
        { title: 'Kurangi food waste', description: 'Setiap makanan yang terselamatkan adalah langkah kecil untuk bumi.' },
        { title: 'Dukung bisnis lokal', description: 'Bantu UMKM sekitar menjangkau pelanggan dan menjual surplusnya.' },
      ],
    },
    {
      id: 'cara-kerja',
      title: 'Cara kerja ReMeal',
      steps: [
        { number: '01', title: 'Cari makanan', description: 'Temukan makanan surplus dari toko lokal di sekitarmu sebelum jam operasional berakhir.' },
        { number: '02', title: 'Pesan & bayar', description: 'Pilih makanan yang kamu suka, lakukan pemesanan, dan simpan kode pesananmu.' },
        { number: '03', title: 'Ambil di toko', description: 'Datang sesuai waktu pickup, tunjukkan kode pesanan, lalu nikmati makananmu.' },
      ],
    },
    {
      id: 'dampak',
      title: 'Satu pilihan kecil, dampak besar.',
      description: 'Setiap makanan yang terselamatkan adalah langkah nyata menuju konsumsi yang lebih bertanggung jawab.',
      outcomes: [
        { title: 'Lebih sedikit terbuang', description: 'Bantu makanan layak konsumsi menemukan penikmatnya.' },
        { title: 'Komunitas lebih peduli', description: 'Ajak lebih banyak orang memilih konsumsi yang bijak.' },
        { title: 'Bisnis lokal bertumbuh', description: 'Dukung UMKM sekitar dengan setiap pesanan.' },
      ],
    },
    {
      id: 'kenapa-remeal',
      title: 'Kenapa pilih ReMeal?',
      description: 'Solusi menang-menang untuk perut kenyang, dompet tenang, dan bumi senang.',
      benefits: [
        { title: 'Lebih hemat', description: 'Temukan makanan pilihan dari bisnis sekitar dengan harga surplus.' },
        { title: 'Kurangi food waste', description: 'Selamatkan makanan yang masih layak dinikmati sebelum terbuang.' },
        { title: 'Dukung UMKM', description: 'Bantu bisnis lokal memperluas jangkauan dan mengelola surplus.' },
      ],
    },
    {
      id: 'cta',
      title: 'Siap menyelamatkan makanan hari ini?',
      description: 'Jelajahi surplus lezat di sekitarmu dan jadilah bagian dari perubahan kecil yang berdampak.',
      actions: [
        { label: 'Mulai sekarang', href: '/register' },
        { label: 'Jelajahi makanan', href: '/consumer/products' },
      ],
    },
  ],
  footer: {
    brand: 'ReMeal',
    tagline: 'Makan enak, selamatkan makanan. Platform digital penyelamatan surplus kuliner lokal.',
    copyright: '© 2026 ReMeal. All rights reserved.',
    groups: [
      {
        title: 'Jelajahi',
        links: [
          { label: 'Tentang Kami', href: '#tentang' },
          { label: 'Cara Kerja', href: '#cara-kerja' },
          { label: 'Dampak', href: '#dampak' },
          { label: 'Kenapa ReMeal', href: '#kenapa-remeal' },
        ],
      },
      {
        title: 'Akun',
        links: [
          { label: 'Masuk', href: '/login' },
          { label: 'Daftar pembeli', href: '/register' },
          { label: 'Cari makanan', href: '/consumer/products' },
        ],
      },
    ],
    seller: {
      title: 'Punya usaha kuliner?',
      description: 'Jual makanan surplus sebelum terbuang dan jangkau pelanggan baru di sekitarmu.',
      action: { label: 'Daftar jadi mitra', href: '/register/seller' },
    },
  },
};

export const homeDesign = {
  palette: {
    ink: '#211f1c',
    paper: '#fff9ef',
    panel: '#fffdf8',
    yellow: '#ffc72c',
    softYellow: '#ffe4a9',
    green: '#dcebd3',
    peach: '#f7d4c9',
    muted: '#716e68',
  },
  style: ['retro', 'friendly', 'food-oriented', 'sustainable', 'bold dark outlines', 'warm paper background'],
  layout: {
    desktop: 'Horizontal navbar, two-column hero, four impact cards, three-column content cards.',
    tablet: 'Navigation stays available, impact cards use two columns, hero maintains two columns where space permits.',
    mobile: 'Hamburger navigation, one-column hero and steps, compact two-column impact metrics, no horizontal overflow.',
  },
};

export function getHomeSection(sectionId) {
  return homePage.sections.find(section => section.id === sectionId) ?? null;
}
