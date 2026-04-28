export type CurrencyCode = string;

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // Exchange rate relative to USD
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.79 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 151.2 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.53 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.36 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', rate: 0.9 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 7.23 },
};

export const ALL_AVAILABLE_CURRENCIES: Currency[] = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', rate: 3.67 },
  { code: 'AFN', name: 'Afghan Afghani', symbol: 'AFN', flag: '🇦🇫', rate: 1 },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'ALL', flag: '🇦🇱', rate: 1 },
  { code: 'AMD', name: 'Armenian Dram', symbol: 'AMD', flag: '🇦🇲', rate: 1 },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ANG', flag: '🇨🇼', rate: 1 },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'AOA', flag: '🇦🇴', rate: 1 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'ARS', flag: '🇦🇷', rate: 1 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.53 },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'AWG', flag: '🇦🇼', rate: 1 },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: 'AZN', flag: '🇦🇿', rate: 1 },
  { code: 'BAM', name: 'Bosnia and Herzegovina Convertible Mark', symbol: 'BAM', flag: '🇧🇦', rate: 1 },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'BBD', flag: '🇧🇧', rate: 1 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: 'BDT', flag: '🇧🇩', rate: 1 },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'BGN', flag: '🇧🇬', rate: 1 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BHD', flag: '🇧🇭', rate: 1 },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'BIF', flag: '🇧🇮', rate: 1 },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'BND', flag: '🇧🇳', rate: 1 },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'BOB', flag: '🇧🇴', rate: 1 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', rate: 5.06 },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'BWP', flag: '🇧🇼', rate: 1 },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'BYN', flag: '🇧🇾', rate: 1 },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZD', flag: '🇧🇿', rate: 1 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.36 },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'CDF', flag: '🇨🇩', rate: 1 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', rate: 0.9 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP', flag: '🇨🇱', rate: 1 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 7.23 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COP', flag: '🇨🇴', rate: 1 },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: 'CRC', flag: '🇨🇷', rate: 1 },
  { code: 'CUP', name: 'Cuban Peso', symbol: 'CUP', flag: '🇨🇺', rate: 1 },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: 'CVE', flag: '🇨🇻', rate: 1 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'CZK', flag: '🇨🇿', rate: 1 },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'DJF', flag: '🇩🇯', rate: 1 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'DKK', flag: '🇩🇰', rate: 1 },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'DOP', flag: '🇩🇴', rate: 1 },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'DZD', flag: '🇩🇿', rate: 1 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'EGP', flag: '🇪🇬', rate: 1 },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'ERN', flag: '🇪🇷', rate: 1 },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'ETB', flag: '🇪🇹', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92 },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJD', flag: '🇫🇯', rate: 1 },
  { code: 'FKP', name: 'Falkland Islands Pound', symbol: 'FKP', flag: '🇫🇰', rate: 1 },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£', flag: '🇬🇧', rate: 0.79 },
  { code: 'GEL', name: 'Georgian Lari', symbol: 'GEL', flag: '🇬🇪', rate: 1 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GHS', flag: '🇬🇭', rate: 1 },
  { code: 'GIP', name: 'Gibraltar Pound', symbol: 'GIP', flag: '🇬🇮', rate: 1 },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'GMD', flag: '🇬🇲', rate: 1 },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'GNF', flag: '🇬🇳', rate: 1 },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'GTQ', flag: '🇬🇹', rate: 1 },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: 'GYD', flag: '🇬🇾', rate: 1 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', rate: 7.83 },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'HNL', flag: '🇭🇳', rate: 1 },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'HTG', flag: '🇭🇹', rate: 1 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'HUF', flag: '🇭🇺', rate: 1 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'IDR', flag: '🇮🇩', rate: 1 },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: 'ILS', flag: '🇮🇱', rate: 1 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 83.3 },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'IQD', flag: '🇮🇶', rate: 1 },
  { code: 'IRR', name: 'Iranian Rial', symbol: 'IRR', flag: '🇮🇷', rate: 1 },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'ISK', flag: '🇮🇸', rate: 1 },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'JMD', flag: '🇯🇲', rate: 1 },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JOD', flag: '🇯🇴', rate: 1 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 151.2 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KES', flag: '🇰🇪', rate: 1 },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'KGS', flag: '🇰🇬', rate: 1 },
  { code: 'KHR', name: 'Cambodian Riel', symbol: 'KHR', flag: '🇰🇭', rate: 1 },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'KMF', flag: '🇰🇲', rate: 1 },
  { code: 'KPW', name: 'North Korean Won', symbol: 'KPW', flag: '🇰🇵', rate: 1 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', rate: 1350 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KWD', flag: '🇰🇼', rate: 1 },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: 'KYD', flag: '🇰🇾', rate: 1 },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: 'KZT', flag: '🇰🇿', rate: 1 },
  { code: 'LAK', name: 'Lao Kip', symbol: 'LAK', flag: '🇱🇦', rate: 1 },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'LBP', flag: '🇱🇧', rate: 1 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'LKR', flag: '🇱🇰', rate: 1 },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'LRD', flag: '🇱🇷', rate: 1 },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'LSL', flag: '🇱🇸', rate: 1 },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'LYD', flag: '🇱🇾', rate: 1 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', flag: '🇲🇦', rate: 1 },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'MDL', flag: '🇲🇩', rate: 1 },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'MGA', flag: '🇲🇬', rate: 1 },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'MKD', flag: '🇲🇰', rate: 1 },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'MMK', flag: '🇲🇲', rate: 1 },
  { code: 'MNT', name: 'Mongolian Tögrög', symbol: 'MNT', flag: '🇲🇳', rate: 1 },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP', flag: '🇲🇴', rate: 1 },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'MRU', flag: '🇲🇷', rate: 1 },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: 'MUR', flag: '🇲🇺', rate: 1 },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'MVR', flag: '🇲🇻', rate: 1 },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MWK', flag: '🇲🇼', rate: 1 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', rate: 16.5 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'MYR', flag: '🇲🇾', rate: 1 },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MZN', flag: '🇲🇿', rate: 1 },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'NAD', flag: '🇳🇦', rate: 1 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: 'NGN', flag: '🇳🇬', rate: 1 },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'NIO', flag: '🇳🇮', rate: 1 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', rate: 10.9 },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'NPR', flag: '🇳🇵', rate: 1 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$', flag: '🇳🇿', rate: 1.66 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', flag: '🇴🇲', rate: 1 },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'PAB', flag: '🇵🇦', rate: 1 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'PEN', flag: '🇵🇪', rate: 1 },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'PGK', flag: '🇵🇬', rate: 1 },
  { code: 'PHP', name: 'Philippine Peso', symbol: 'PHP', flag: '🇵🇭', rate: 1 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'PKR', flag: '🇵🇰', rate: 1 },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'PLN', flag: '🇵🇱', rate: 1 },
  { code: 'PYG', name: 'Paraguayan Guaraní', symbol: 'PYG', flag: '🇵🇾', rate: 1 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QAR', flag: '🇶🇦', rate: 1 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'RON', flag: '🇷🇴', rate: 1 },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'RSD', flag: '🇷🇸', rate: 1 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', rate: 93.5 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RWF', flag: '🇷🇼', rate: 1 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', rate: 3.75 },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SBD', flag: '🇸🇧', rate: 1 },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: 'SCR', flag: '🇸🇨', rate: 1 },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'SDG', flag: '🇸🇩', rate: 1 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', rate: 10.7 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 1.35 },
  { code: 'SLE', name: 'Sierra Leone Leone', symbol: 'SLE', flag: '🇸🇱', rate: 1 },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'SOS', flag: '🇸🇴', rate: 1 },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: 'SRD', flag: '🇸🇷', rate: 1 },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: 'SSP', flag: '🇸🇸', rate: 1 },
  { code: 'STN', name: 'São Tomé and Príncipe Dobra', symbol: 'STN', flag: '🇸🇹', rate: 1 },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'SZL', flag: '🇸🇿', rate: 1 },
  { code: 'THB', name: 'Thai Baht', symbol: 'THB', flag: '🇹🇭', rate: 1 },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'TJS', flag: '🇹🇯', rate: 1 },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'TMT', flag: '🇹🇲', rate: 1 },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'TND', flag: '🇹🇳', rate: 1 },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'TOP', flag: '🇹🇴', rate: 1 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', rate: 32.0 },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TTD', flag: '🇹🇹', rate: 1 },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'TWD', flag: '🇹🇼', rate: 1 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TZS', flag: '🇹🇿', rate: 1 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: 'UAH', flag: '🇺🇦', rate: 1 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'UGX', flag: '🇺🇬', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1 },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: 'UYU', flag: '🇺🇾', rate: 1 },
  { code: 'UZS', name: 'Uzbekistani So\'m', symbol: 'UZS', flag: '🇺🇿', rate: 1 },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'VES', flag: '🇻🇪', rate: 1 },
  { code: 'VND', name: 'Vietnamese Đồng', symbol: 'VND', flag: '🇻🇳', rate: 1 },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VUV', flag: '🇻🇺', rate: 1 },
  { code: 'WST', name: 'Samoan Tala', symbol: 'WST', flag: '🇼🇸', rate: 1 },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'XAF', flag: '🇨🇫', rate: 1 },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'XOF', flag: '🇧🇯', rate: 1 },
  { code: 'XPF', name: 'CFP Franc', symbol: 'XPF', flag: '🇳🇨', rate: 1 },
  { code: 'YER', name: 'Yemeni Rial', symbol: 'YER', flag: '🇾🇪', rate: 1 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', rate: 18.8 },
  { code: 'ZiG', name: 'Zimbabwe Gold', symbol: 'ZiG', flag: '🇿🇼', rate: 1 },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZMW', flag: '🇿🇲', rate: 1 },
];

export type CategoryId = 'breakfast' | 'healthy' | 'meals' | 'drinks' | 'sweets' | 'toys';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
}

export const CATEGORIES: Record<CategoryId, Category> = {
  breakfast: { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
  healthy: { id: 'healthy', name: 'Healthy', icon: '🥗' },
  meals: { id: 'meals', name: 'Meals', icon: '🍔' },
  drinks: { id: 'drinks', name: 'Drinks', icon: '🥤' },
  sweets: { id: 'sweets', name: 'Sweets', icon: '🍩' },
  toys: { id: 'toys', name: 'Toys', icon: '🧸' },
};

export interface Item {
  id: string;
  name: string;
  emoji: string;
  categoryId: CategoryId;
  basePriceUSD: number;
  hunger: number;
  happiness: number;
  unlockLevel: number;
  color?: string;
}

export const INITIAL_ITEMS: Item[] = [
  // Breakfast
  { id: 'b1', name: 'Bread', emoji: '🍞', categoryId: 'breakfast', basePriceUSD: 2.5, hunger: 15, happiness: 5, unlockLevel: 1 },
  { id: 'b2', name: 'Fried Egg', emoji: '🍳', categoryId: 'breakfast', basePriceUSD: 1.5, hunger: 10, happiness: 5, unlockLevel: 1 },
  { id: 'b3', name: 'Cereal', emoji: '🥣', categoryId: 'breakfast', basePriceUSD: 3.0, hunger: 20, happiness: 10, unlockLevel: 1 },
  { id: 'b4', name: 'Bacon', emoji: '🥓', categoryId: 'breakfast', basePriceUSD: 4.0, hunger: 15, happiness: 15, unlockLevel: 1 },
  { id: 'b5', name: 'Croissant', emoji: '🥐', categoryId: 'breakfast', basePriceUSD: 3.5, hunger: 15, happiness: 10, unlockLevel: 1 },
  { id: 'b6', name: 'Waffle', emoji: '🧇', categoryId: 'breakfast', basePriceUSD: 4.5, hunger: 20, happiness: 15, unlockLevel: 1 },
  { id: 'b7', name: 'Pancakes', emoji: '🥞', categoryId: 'breakfast', basePriceUSD: 5.0, hunger: 25, happiness: 20, unlockLevel: 1 },
  
  // Healthy
  { id: 'h1', name: 'Apple', emoji: '🍎', categoryId: 'healthy', basePriceUSD: 1.0, hunger: 10, happiness: 5, unlockLevel: 1 },
  { id: 'h2', name: 'Banana', emoji: '🍌', categoryId: 'healthy', basePriceUSD: 0.8, hunger: 10, happiness: 5, unlockLevel: 1 },
  { id: 'h3', name: 'Carrot', emoji: '🥕', categoryId: 'healthy', basePriceUSD: 0.5, hunger: 5, happiness: 0, unlockLevel: 1 },
  { id: 'h4', name: 'Corn', emoji: '🌽', categoryId: 'healthy', basePriceUSD: 1.2, hunger: 10, happiness: 5, unlockLevel: 1 },
  { id: 'h5', name: 'Strawberry', emoji: '🍓', categoryId: 'healthy', basePriceUSD: 3.0, hunger: 5, happiness: 15, unlockLevel: 1 },
  { id: 'h6', name: 'Grapes', emoji: '🍇', categoryId: 'healthy', basePriceUSD: 2.5, hunger: 10, happiness: 15, unlockLevel: 1 },
  { id: 'h7', name: 'Broccoli', emoji: '🥦', categoryId: 'healthy', basePriceUSD: 1.5, hunger: 10, happiness: 0, unlockLevel: 1 },
  { id: 'h8', name: 'Watermelon', emoji: '🍉', categoryId: 'healthy', basePriceUSD: 4.0, hunger: 15, happiness: 20, unlockLevel: 1 },
  { id: 'h9', name: 'Pineapple', emoji: '🍍', categoryId: 'healthy', basePriceUSD: 3.5, hunger: 15, happiness: 15, unlockLevel: 1 },
  { id: 'h10', name: 'Salad', emoji: '🥗', categoryId: 'healthy', basePriceUSD: 6.0, hunger: 25, happiness: -5, unlockLevel: 1 },

  // Meals
  { id: 'm1', name: 'Sandwich', emoji: '🥪', categoryId: 'meals', basePriceUSD: 5.5, hunger: 25, happiness: 15, unlockLevel: 1 },
  { id: 'm2', name: 'Fries', emoji: '🍟', categoryId: 'meals', basePriceUSD: 3.0, hunger: 15, happiness: 25, unlockLevel: 1 },
  { id: 'm3', name: 'Hotdog', emoji: '🌭', categoryId: 'meals', basePriceUSD: 4.0, hunger: 20, happiness: 20, unlockLevel: 1 },
  { id: 'm4', name: 'Taco', emoji: '🌮', categoryId: 'meals', basePriceUSD: 3.5, hunger: 20, happiness: 20, unlockLevel: 1 },
  { id: 'm5', name: 'Spaghetti', emoji: '🍝', categoryId: 'meals', basePriceUSD: 8.0, hunger: 35, happiness: 25, unlockLevel: 1 },
  { id: 'm6', name: 'Pizza', emoji: '🍕', categoryId: 'meals', basePriceUSD: 12.0, hunger: 40, happiness: 30, unlockLevel: 1 },
  { id: 'm7', name: 'Ramen', emoji: '🍜', categoryId: 'meals', basePriceUSD: 9.0, hunger: 30, happiness: 25, unlockLevel: 1 },
  { id: 'm8', name: 'Burger', emoji: '🍔', categoryId: 'meals', basePriceUSD: 7.5, hunger: 35, happiness: 25, unlockLevel: 1 },
  { id: 'm9', name: 'Burrito', emoji: '🌯', categoryId: 'meals', basePriceUSD: 6.5, hunger: 35, happiness: 20, unlockLevel: 1 },
  { id: 'm10', name: 'Chicken Leg', emoji: '🍗', categoryId: 'meals', basePriceUSD: 5.0, hunger: 25, happiness: 15, unlockLevel: 1 },
  { id: 'm11', name: 'Sushi', emoji: '🍣', categoryId: 'meals', basePriceUSD: 14.0, hunger: 35, happiness: 35, unlockLevel: 1 },
  { id: 'm12', name: 'Steak', emoji: '🥩', categoryId: 'meals', basePriceUSD: 18.0, hunger: 45, happiness: 35, unlockLevel: 1 },

  // Drinks
  { id: 'd1', name: 'Water', emoji: '💧', categoryId: 'drinks', basePriceUSD: 1.0, hunger: 0, happiness: 0, unlockLevel: 1 },
  { id: 'd2', name: 'Milk', emoji: '🥛', categoryId: 'drinks', basePriceUSD: 1.5, hunger: 5, happiness: 5, unlockLevel: 1 },
  { id: 'd3', name: 'Juice Box', emoji: '🧃', categoryId: 'drinks', basePriceUSD: 2.0, hunger: 5, happiness: 10, unlockLevel: 1 },
  { id: 'd4', name: 'Green Tea', emoji: '🍵', categoryId: 'drinks', basePriceUSD: 2.5, hunger: 0, happiness: 5, unlockLevel: 1 },
  { id: 'd5', name: 'Soda', emoji: '🥤', categoryId: 'drinks', basePriceUSD: 2.0, hunger: 5, happiness: 15, unlockLevel: 1 },
  { id: 'd6', name: 'Coffee', emoji: '☕', categoryId: 'drinks', basePriceUSD: 3.5, hunger: 0, happiness: 10, unlockLevel: 1 },
  { id: 'd7', name: 'Boba Tea', emoji: '🧋', categoryId: 'drinks', basePriceUSD: 4.5, hunger: 10, happiness: 25, unlockLevel: 1 },

  // Sweets
  { id: 's1', name: 'Cookie', emoji: '🍪', categoryId: 'sweets', basePriceUSD: 1.5, hunger: 5, happiness: 20, unlockLevel: 1 },
  { id: 's2', name: 'Lollipop', emoji: '🍭', categoryId: 'sweets', basePriceUSD: 1.0, hunger: 0, happiness: 15, unlockLevel: 1 },
  { id: 's3', name: 'Chocolate', emoji: '🍫', categoryId: 'sweets', basePriceUSD: 2.5, hunger: 5, happiness: 25, unlockLevel: 1 },
  { id: 's4', name: 'Donut', emoji: '🍩', categoryId: 'sweets', basePriceUSD: 2.0, hunger: 10, happiness: 25, unlockLevel: 1 },
  { id: 's5', name: 'Ice Cream', emoji: '🍦', categoryId: 'sweets', basePriceUSD: 3.5, hunger: 10, happiness: 30, unlockLevel: 1 },
  { id: 's6', name: 'Pie', emoji: '🥧', categoryId: 'sweets', basePriceUSD: 4.0, hunger: 15, happiness: 20, unlockLevel: 1 },
  { id: 's7', name: 'Cake', emoji: '🍰', categoryId: 'sweets', basePriceUSD: 5.0, hunger: 15, happiness: 30, unlockLevel: 1 },

  // Toys
  { id: 'ball_red', emoji: '', name: 'Red Ball', basePriceUSD: 0, color: 'radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a)', unlockLevel: 1, categoryId: 'toys', hunger: 0, happiness: 10 },
  { id: 'ball_blue', emoji: '', name: 'Blue Ball', basePriceUSD: 50, color: 'radial-gradient(circle at 30% 30%, #339af0, #1864ab)', unlockLevel: 1, categoryId: 'toys', hunger: 0, happiness: 10 },
  { id: 'ball_green', emoji: '', name: 'Green Ball', basePriceUSD: 100, color: 'radial-gradient(circle at 30% 30%, #51cf66, #2b8a3e)', unlockLevel: 2, categoryId: 'toys', hunger: 0, happiness: 15 },
  { id: 'ball_purple', emoji: '', name: 'Purple Ball', basePriceUSD: 150, color: 'radial-gradient(circle at 30% 30%, #cc5de8, #862e9c)', unlockLevel: 3, categoryId: 'toys', hunger: 0, happiness: 15 },
  { id: 'ball_orange', emoji: '', name: 'Orange Ball', basePriceUSD: 200, color: 'radial-gradient(circle at 30% 30%, #ff922b, #d9480f)', unlockLevel: 4, categoryId: 'toys', hunger: 0, happiness: 20 },
  { id: 'ball_gold', emoji: '', name: 'Gold Ball', basePriceUSD: 500, color: 'radial-gradient(circle at 30% 30%, #fcc419, #f08c00)', unlockLevel: 5, categoryId: 'toys', hunger: 0, happiness: 25 },
  { id: 'ball_soccer', emoji: '⚽', name: 'Soccer Ball', basePriceUSD: 300, color: '#ffffff', unlockLevel: 3, categoryId: 'toys', hunger: 0, happiness: 20 },
  { id: 'ball_baseball', emoji: '⚾', name: 'Baseball', basePriceUSD: 250, color: '#f8f9fa', unlockLevel: 2, categoryId: 'toys', hunger: 0, happiness: 20 },
  { id: 'ball_basketball', emoji: '🏀', name: 'Basketball', basePriceUSD: 350, color: '#fd7e14', unlockLevel: 4, categoryId: 'toys', hunger: 0, happiness: 20 },
  { id: 'ball_football', emoji: '🏈', name: 'Football', basePriceUSD: 400, color: '#8b4513', unlockLevel: 5, categoryId: 'toys', hunger: 0, happiness: 25 },
  { id: 'ball_tennis', emoji: '🥎', name: 'Tennis Ball', basePriceUSD: 150, color: '#d4fc79', unlockLevel: 2, categoryId: 'toys', hunger: 0, happiness: 15 },
  { id: 'ball_rugby', emoji: '🏉', name: 'Rugby Ball', basePriceUSD: 400, color: '#a52a2a', unlockLevel: 5, categoryId: 'toys', hunger: 0, happiness: 25 },
  { id: 'ball_8ball', emoji: '🎱', name: '8-Ball', basePriceUSD: 600, color: '#212529', unlockLevel: 6, categoryId: 'toys', hunger: 0, happiness: 30 },
];



