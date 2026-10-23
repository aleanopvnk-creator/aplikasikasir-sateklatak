/**
 * Database Menu Sate Klatak Mbak Lala
 * Berdasarkan daftar menu asli
 * Catatan: Gambar menu sengaja dikosongkan (null) sesuai permintaan user
 */

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: 'utensils' },
  { id: 'sate', name: 'Sate', icon: 'flame' },
  { id: 'daging', name: 'Daging', icon: 'drumstick' },
  { id: 'tulang', name: 'Tulang', icon: 'bone' },
  { id: 'jeroan', name: 'Jeroan', icon: 'sparkles' },
  { id: 'goreng', name: 'Goreng', icon: 'cooking-pot' },
  { id: 'nasi', name: 'Nasi', icon: 'wheat' },
  { id: 'ayam_bebek', name: 'Ayam & Bebek', icon: 'egg' },
  { id: 'minum', name: 'Minuman', icon: 'cup-soda' }
];

const INITIAL_MENU_ITEMS = [
  // --- SATE ---
  {
    id: 'sate-1',
    name: 'Sate Klatak',
    category: 'sate',
    price: 35000,
    description: 'Sate kambing muda bakar jeruji besi bumbu garam gurih, disajikan dengan kuah gule khas',
    image: null,
    stock: 50,
    available: true
  },
  {
    id: 'sate-2',
    name: 'Sate Kecap',
    category: 'sate',
    price: 35000,
    description: 'Sate kambing bakar bumbu kecap manis legit istimewa, irisan bawang merah, cabai & tomat segar',
    image: null,
    stock: 45,
    available: true
  },
  {
    id: 'sate-3',
    name: 'Sate Goreng Manis',
    category: 'sate',
    price: 35000,
    description: 'Daging kambing empuk ditumis bumbu kecap manis gurih tanpa tusuk',
    image: null,
    stock: 40,
    available: true
  },

  // --- DAGING ---
  {
    id: 'daging-1',
    name: 'Tongseng Daging',
    category: 'daging',
    price: 35000,
    description: 'Daging kambing muda dengan kuah santan tongseng gurih, kol renyah & tomat',
    image: null,
    stock: 35,
    available: true
  },
  {
    id: 'daging-2',
    name: 'Gule Daging',
    category: 'daging',
    price: 35000,
    description: 'Daging kambing empuk berkuah gule santan kental rempah kaya rasa',
    image: null,
    stock: 35,
    available: true
  },
  {
    id: 'daging-3',
    name: 'Kicik Daging',
    category: 'daging',
    price: 35000,
    description: 'Olahan daging kambing bumbu kicik manis gurih kental khas Yogyakarta',
    image: null,
    stock: 30,
    available: true
  },

  // --- TULANG ---
  {
    id: 'tulang-1',
    name: 'Tengkleng',
    category: 'tulang',
    price: 35000,
    description: 'Tulang kambing berdaging dengan kuah gurih segar rempah nusantara',
    image: null,
    stock: 30,
    available: true
  },
  {
    id: 'tulang-2',
    name: 'Rica Tengkleng',
    category: 'tulang',
    price: 35000,
    description: 'Tulang kambing dimasak bumbu rica pedas mantap menggugah selera',
    image: null,
    stock: 30,
    available: true
  },
  {
    id: 'tulang-3',
    name: 'Gule Tulang',
    category: 'tulang',
    price: 35000,
    description: 'Tulang kambing empuk disiram kuah gule santan gurih sedap',
    image: null,
    stock: 25,
    available: true
  },

  // --- JEROAN ---
  {
    id: 'jeroan-1',
    name: 'Tongseng Jeroan',
    category: 'jeroan',
    price: 10000,
    description: 'Jeroan kambing gurih pilihan dimasak kuah tongseng bumbu rempah',
    image: null,
    stock: 30,
    available: true
  },
  {
    id: 'jeroan-2',
    name: 'Kicik Jeroan',
    category: 'jeroan',
    price: 10000,
    description: 'Jeroan kambing dimasak kicik manis gurih bumbu rempah meresap',
    image: null,
    stock: 25,
    available: true
  },
  {
    id: 'jeroan-3',
    name: 'Gule Jeroan',
    category: 'jeroan',
    price: 10000,
    description: 'Jeroan kambing empuk berkuah gule santan rempah hangat gurih',
    image: null,
    stock: 30,
    available: true
  },

  // --- GORENG ---
  {
    id: 'goreng-1',
    name: 'Kronyos',
    category: 'goreng',
    price: 30000,
    description: 'Lemak gajih kambing goreng kering renyah gurih favorit penikmat sate',
    image: null,
    stock: 25,
    available: true
  },
  {
    id: 'goreng-2',
    name: 'Gule Goreng',
    category: 'goreng',
    price: 10000,
    description: 'Olahan tetelan & kuah gule digoreng garing wangi rempah',
    image: null,
    stock: 20,
    available: true
  },
  {
    id: 'goreng-3',
    name: 'Klatak Goreng',
    category: 'goreng',
    price: 35000,
    description: 'Daging kambing klatak digoreng gurih dengan aroma khas',
    image: null,
    stock: 30,
    available: true
  },
  {
    id: 'goreng-4',
    name: 'Klatak Bawang',
    category: 'goreng',
    price: 35000,
    description: 'Daging klatak dengan taburan bawang merah & tumisan bawang gurih wangi',
    image: null,
    stock: 30,
    available: true
  },

  // --- NASI ---
  {
    id: 'nasi-1',
    name: 'Nasi Putih',
    category: 'nasi',
    price: 5000,
    description: 'Nasi putih pulen hangat disajikan dalam porsi pas',
    image: null,
    stock: 100,
    available: true
  },
  {
    id: 'nasi-2',
    name: 'Nasi Goreng Kambing',
    category: 'nasi',
    price: 30000,
    description: 'Nasi goreng harum rempah istimewa dengan potongan daging kambing gurih',
    image: null,
    stock: 35,
    available: true
  },

  // --- AYAM KAMPUNG & TELUR BEBEK ---
  {
    id: 'ayam-1',
    name: 'Bakmi Goreng',
    category: 'ayam_bebek',
    price: 25000,
    description: 'Bakmi goreng Jawa gurih dengan suwiran ayam kampung & telur bebek',
    image: null,
    stock: 30,
    available: true
  },
  {
    id: 'ayam-2',
    name: 'Bakmi Godog',
    category: 'ayam_bebek',
    price: 25000,
    description: 'Bakmi godog khas Jawa berkuah kaldu ayam kampung kental gurih & telur bebek',
    image: null,
    stock: 30,
    available: true
  },
  {
    id: 'ayam-3',
    name: 'Nasi Goreng',
    category: 'ayam_bebek',
    price: 25000,
    description: 'Nasi goreng kampung bumbu tradisional dengan telur bebek & ayam suwir',
    image: null,
    stock: 30,
    available: true
  },
  {
    id: 'ayam-4',
    name: 'Magelangan',
    category: 'ayam_bebek',
    price: 25000,
    description: 'Perpaduan nasi dan mie goreng Jawa khas dimasak dengan telur bebek',
    image: null,
    stock: 25,
    available: true
  },
  {
    id: 'ayam-5',
    name: 'Rica Rica Mentok',
    category: 'ayam_bebek',
    price: 25000,
    description: 'Daging mentok/entok empuk dimasak bumbu rica pedas gurih medhok',
    image: null,
    stock: 25,
    available: true
  },

  // --- MINUM ---
  {
    id: 'minum-1',
    name: 'Teh Tawar Panas',
    category: 'minum',
    price: 3000,
    description: 'Teh seduh panas aroma melati tanpa gula',
    image: null,
    stock: 100,
    available: true
  },
  {
    id: 'minum-2',
    name: 'Teh Panas Manis',
    category: 'minum',
    price: 5000,
    description: 'Teh seduh panas wangi dengan gula pasir asli',
    image: null,
    stock: 100,
    available: true
  },
  {
    id: 'minum-3',
    name: 'Es Teh Manis',
    category: 'minum',
    price: 5000,
    description: 'Es teh melati manis dingin menyegarkan',
    image: null,
    stock: 100,
    available: true
  },
  {
    id: 'minum-4',
    name: 'Es Teh Tawar',
    category: 'minum',
    price: 3000,
    description: 'Es teh seduh dingin tanpa gula',
    image: null,
    stock: 100,
    available: true
  },
  {
    id: 'minum-5',
    name: 'Es Teh Krampul',
    category: 'minum',
    price: 5000,
    description: 'Es teh manis khas Jogja/Solo dengan irisan jeruk nipis/lemon segar krampul',
    image: null,
    stock: 80,
    available: true
  },
  {
    id: 'minum-6',
    name: 'Jeruk Tawar Panas',
    category: 'minum',
    price: 3000,
    description: 'Air perasan jeruk asli hangat tanpa gula',
    image: null,
    stock: 80,
    available: true
  },
  {
    id: 'minum-7',
    name: 'Jeruk Panas Manis',
    category: 'minum',
    price: 5000,
    description: 'Jeruk peras asli hangat dengan gula manis pas',
    image: null,
    stock: 80,
    available: true
  },
  {
    id: 'minum-8',
    name: 'Es Jeruk Manis',
    category: 'minum',
    price: 5000,
    description: 'Es jeruk peras asli segar dingin manis nikmat',
    image: null,
    stock: 80,
    available: true
  },
  {
    id: 'minum-9',
    name: 'Es Jeruk Tawar',
    category: 'minum',
    price: 3000,
    description: 'Es perasan jeruk murni dingin tanpa gula',
    image: null,
    stock: 80,
    available: true
  },
  {
    id: 'minum-10',
    name: 'Air Es',
    category: 'minum',
    price: 2000,
    description: 'Air mineral segar dengan es batu dingin',
    image: null,
    stock: 150,
    available: true
  }
];

// Quick notes presets for food customization
const QUICK_NOTES = [
  'Tidak Pedas',
  'Pedas Sedang',
  'Pedas Banget 🔥',
  'Kuah Dipisah',
  'Tanpa Bawang Goreng',
  'Bawang Banyak',
  'Tanpa Kecap',
  'Tanpa Gajih/Lemak',
  'Daging Matang Banget',
  'Es Sedikit',
  'Kurang Manis',
  'Bungkus Pisah'
];

// Table numbers and areas list
const TABLES = [
  'Meja 01', 'Meja 02', 'Meja 03', 'Meja 04',
  'Meja 05', 'Meja 06', 'Meja 07', 'Meja 08',
  'Meja 09', 'Meja 10', 'Meja 11', 'Meja 12',
  'Lesehan 01', 'Lesehan 02', 'Lesehan 03', 'Lesehan 04',
  'Lesehan 05', 'Lesehan 06', 'Lesehan 07', 'Lesehan 08',
  'Bungkus'
];

