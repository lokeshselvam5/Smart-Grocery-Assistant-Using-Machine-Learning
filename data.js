/**
 * data.js - Persistent Data Management for Muthu Store
 * Handles localStorage operations and initial data seeding.
 */

const STORAGE_KEYS = {
    PRODUCTS: 'muthu_products',
    ORDERS: 'muthu_orders',
    CATEGORIES: 'muthu_categories',
    UNITS: 'muthu_units',
    VERSION: 'muthu_data_signature'
};

const DEFAULT_UNITS = [
    'Kg', 'g', 'L', 'ml', 'pcs', 'pkt', 'box', 'dozen'
];

const DEFAULT_PRODUCTS = [

    // Loose Items KG
    // Rice அரிசி
    { name: 'KDR Ponni Rice', category: 'Loose Items KG', subCategory: 'Rice அரிசி', price: 70, icon: '🌾' },
    { name: 'Red Sun Ponni Rice', category: 'Loose Items KG', subCategory: 'Rice அரிசி', price: 65, icon: '🌾' },
    { name: 'Krishna Ponni rice', category: 'Loose Items KG', subCategory: 'Rice அரிசி', price: 55, icon: '🌾' },
    { name: 'Pacharisi பச்சரிசி தரம் 1', category: 'Loose Items KG', subCategory: 'Rice அரிசி', price: 70, icon: '🌾' },
    { name: 'Pacharisi பச்சரிசி தரம் 2', category: 'Loose Items KG', subCategory: 'Rice அரிசி', price: 40, icon: '🌾' },
    { name: 'Idli Rice இட்லி அரிசி', category: 'Loose Items KG', subCategory: 'Rice அரிசி', price: 40, icon: '🌾' },
    { name: 'Seeragam Samba சீரகச் சம்பா', category: 'Loose Items KG', subCategory: 'Rice அரிசி', price: 160, icon: '🌾' },
    { name: 'Unity Biryani Rice', category: 'Loose Items KG', subCategory: 'Rice அரிசி', price: 80, icon: '🌾' },
    { name: 'Varsha Biryani Rice', category: 'Loose Items KG', subCategory: 'Rice அரிசி', price: 80, icon: '🌾' },

    // Dals பருப்பு
    { name: 'துவரம் பருப்பு தரம் 1', category: 'Loose Items KG', subCategory: 'Dals பருப்பு', price: 135, icon: '🥣' },
    { name: 'துவரம் பருப்பு தரம் 2', category: 'Loose Items KG', subCategory: 'Dals பருப்பு', price: 120, icon: '🥣' },
    { name: 'உளுந்து பருப்பு', category: 'Loose Items KG', subCategory: 'Dals பருப்பு', price: 120, icon: '🥣' },
    { name: 'கடலை பருப்பு', category: 'Loose Items KG', subCategory: 'Dals பருப்பு', price: 90, icon: '🥣' },
    { name: 'பாசி பருப்பு', category: 'Loose Items KG', subCategory: 'Dals பருப்பு', price: 116, icon: '🥣' },
    { name: 'பட்டாணி பருப்பு', category: 'Loose Items KG', subCategory: 'Dals பருப்பு', price: 100, icon: '🥣' },

    // Pulse & Grains 
    { name: 'Kambu கம்பு', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 220, icon: '🌾' },
    { name: 'Kelvaragu கேழ்வரகு', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 105, icon: '🌾' },
    { name: 'Mookkadalai சிறிய கருப்பு மூக்கடலை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 105, icon: '🌾' },
    { name: 'Mookkadalai பெரிய கருப்பு மூக்கடலை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 220, icon: '🌾' },
    { name: 'Mookkadalai சிறிய வெள்ளை மூக்கடலை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 120, icon: '🌾' },
    { name: 'Mookkadalai பெரிய வெள்ளை மூக்கடலை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 220, icon: '🌾' },
    { name: 'உடைத்த கடலை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Pattani பச்சை பட்டாணி', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Pattani வெள்ளை பட்டாணி', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Karamani கருப்பு காராமணி', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Karamani வெள்ளை காராமணி', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Mochai சிவப்பு மொச்சை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Mochai வெள்ளை மொச்சை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Green Gram பச்சை பயிறு', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Koothumai கோதுமை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Pacha Verkadalai பச்சை வேர்க்கடலை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },
    { name: 'Varutta Verkadalai வறுத்த வேர்க்கடலை', category: 'Loose Items KG', subCategory: 'Pulse & Grains', price: 130, icon: '🌾' },

    // Dry Chilli காய்ந்த மிளகாய் 
    { name: 'புது மிளகாய் தரம் 1', category: 'Loose Items KG', subCategory: 'Dry Chilli காய்ந்த மிளகாய்', price: 390, icon: '🌶️' },
    { name: 'புது மிளகாய் தரம் 2', category: 'Loose Items KG', subCategory: 'Dry Chilli காய்ந்த மிளகாய்', price: 200, icon: '🌶️' },
    { name: 'பழைய மிளகாய்', category: 'Loose Items KG', subCategory: 'Dry Chilli காய்ந்த மிளகாய்', price: 160, icon: '🌶️' },
    { name: 'நீட்டு மிளகாய்', category: 'Loose Items KG', subCategory: 'Dry Chilli காய்ந்த மிளகாய்', price: 300, icon: '🌶️' },

    // Tamarind புளி
    { name: 'Tamarind புது புளி', category: 'Loose Items KG', subCategory: 'Tamarind புளி', price: 200, icon: '🫛' },
    { name: 'Tamarind பழைய புளி', category: 'Loose Items KG', subCategory: 'Tamarind புளி', price: 160, icon: '🫛' },
    { name: 'Tamarind தோசை புளி', category: 'Loose Items KG', subCategory: 'Tamarind புளி', price: 140, icon: '🫛' },

    // Garlic பூண்டு
    { name: 'Small Garlic சிறிய பூண்டு', category: 'Loose Items KG', subCategory: 'Garlic பூண்டு', price: 260, icon: '🧄' },
    { name: 'Big Garlic பெரிய பூண்டு', category: 'Loose Items KG', subCategory: 'Garlic பூண்டு', price: 220, icon: '🧄' },

    // Flour மாவு 
    { name: 'Tiger Maida', category: 'Loose Items KG', subCategory: 'Flour மாவு', price: 105, icon: '🌾' },
    { name: 'Century Maida', category: 'Loose Items KG', subCategory: 'Flour மாவு', price: 220, icon: '🌾' },
    { name: 'Wheat Flour கோதுமை மாவு', category: 'Loose Items KG', subCategory: 'Flour மாவு', price: 120, icon: '🌾' },
    { name: 'Gram Flour கடலை மாவு', category: 'Loose Items KG', subCategory: 'Flour மாவு', price: 220, icon: '🌾' },

    // Sugar & Sweetness இனிப்பு
    { name: 'Sugar சர்க்கரை', category: 'Loose Items KG', subCategory: 'Sugar & Sweeteners இனிப்பு', price: 45, icon: '🍯' },
    { name: 'Palm Jaggery பனை கருப்பட்டி', category: 'Loose Items KG', subCategory: 'Sugar & Sweeteners இனிப்பு', price: 45, icon: '🍯' },

    // Loose Items Grams
    // Spices
    { name: 'Milagu மிளகு', category: 'Loose Items Grams', subCategory: 'Spices', price: 880, icon: '🧂' },
    { name: 'Jiragam சீரகம்', category: 'Loose Items Grams', subCategory: 'Spices', price: 340, icon: '🧂' },
    { name: 'Venthayam வெந்தயம்', category: 'Loose Items Grams', subCategory: 'Spices', price: 128, icon: '🧂' },
    { name: 'Kadugu கடுகு', category: 'Loose Items Grams', subCategory: 'Spices', price: 140, icon: '🧂' },
    { name: 'Sombu சோம்பு', category: 'Loose Items Grams', subCategory: 'Spices', price: 140, icon: '🧂' },
    { name: 'Pattai பட்டை தரம் 1', category: 'Loose Items Grams', subCategory: 'Spices', price: 160, icon: '🧂' },
    { name: 'Pattai பட்டை தரம் 2', category: 'Loose Items Grams', subCategory: 'Spices', price: 160, icon: '🧂' },
    { name: 'Lavangam லவங்கம்', category: 'Loose Items Grams', subCategory: 'Spices', price: 220, icon: '🧂' },
    { name: 'Elakkai ஏலக்காய்', category: 'Loose Items Grams', subCategory: 'Spices', price: 130, icon: '🧂' },
    { name: 'Sukku சுக்கு', category: 'Loose Items Grams', subCategory: 'Spices', price: 480, icon: '🧂' },
    { name: 'Annasi poo அன்னாசி பூ', category: 'Loose Items Grams', subCategory: 'Spices', price: 220, icon: '🧂' },
    { name: 'Manjal மஞ்சள்', category: 'Loose Items Grams', subCategory: 'Spices', price: 130, icon: '🧂' },
    { name: 'Karuvappatta பட்டை', category: 'Loose Items Grams', subCategory: 'Spices', price: 130, icon: '🧂' },
    { name: 'Masala', category: 'Loose Items Grams', subCategory: 'Spices', price: 130, icon: '🧂' },
    { name: 'Anasippoo', category: 'Loose Items Grams', subCategory: 'Spices', price: 130, icon: '🧂' },
    { name: 'Omam', category: 'Loose Items Grams', subCategory: 'Spices', price: 130, icon: '🧂' },

    // Dry Fruits & Nuts
    { name: 'Mundhiri முழு முந்திரி', category: 'Loose Items Grams', subCategory: 'Dry Fruits & Nuts', price: 940, icon: '🥜' },
    { name: 'Mundhiri பாதி முந்திரி', category: 'Loose Items Grams', subCategory: 'Dry Fruits & Nuts', price: 900, icon: '🥜' },
    { name: 'Patham பாதாம்', category: 'Loose Items Grams', subCategory: 'Dry Fruits & Nuts', price: 940, icon: '🥜' },
    { name: 'Ular Dhratchai  மஞ்சள் உலர் திராட்சை', category: 'Loose Items Grams', subCategory: 'Dry Fruits & Nuts', price: 480, icon: '🥜' },
    { name: 'Ular Dhratchai கருப்பு உலர் திராட்சை', category: 'Loose Items Grams', subCategory: 'Dry Fruits & Nuts', price: 520, icon: '🥜' },
    { name: 'Pistha பிஸ்தா', category: 'Loose Items Grams', subCategory: 'Dry Fruits & Nuts', price: 2600, icon: '🧂' },

    // Rice
    { name: 'Ponni Rice (1kg)', category: 'Rice', price: 65, icon: '🍚' },
    { name: 'Ponni Rice (1kg)', category: 'Rice', price: 65, icon: '🍚' },
    { name: 'Ponni Rice (1kg)', category: 'Rice', price: 65, icon: '🍚' },

    // Oil
    { name: 'Gold Winner Sunflower oil (500ml)', category: 'Oil', price: 89, icon: '🍾' },
    { name: 'Gold Winner Sunflower oil (1L)', category: 'Oil', price: 175, icon: '🍾' },
    { name: 'Gold Winner Sunflower oil (5L)', category: 'Oil', price: 890, icon: '🍾' },
    { name: 'SVS sunflower oil (500ml)', category: 'Oil', price: 185, icon: '🍾' },
    { name: 'SVS sunflower oil (1L)', category: 'Oil', price: 210, icon: '🍾' },
    { name: 'SVS sunflower oil (5L)', category: 'Oil', price: 880, icon: '🍾' },
    { name: 'SVS Vite Refined Groundnut Oil (1L)', category: 'Oil', price: 180, icon: '🍾' },

    // Ghee
    { name: 'RKG Ghee 50ml', category: 'Ghee', price: 880, icon: '🍾' },
    { name: 'RKG Ghee 100ml', category: 'Ghee', price: 180, icon: '🍾' },
    { name: 'RKG Ghee 200ml', category: 'Ghee', price: 180, icon: '🍾' },
    { name: 'RKG Ghee 500ml', category: 'Ghee', price: 180, icon: '🍾' },
    { name: 'GRB Ghee 50ml', category: 'Ghee', price: 180, icon: '🍾' },
    { name: 'GRB Ghee 100ml', category: 'Ghee', price: 180, icon: '🍾' },
    { name: 'GRB Ghee 200ml', category: 'Ghee', price: 180, icon: '🍾' },
    { name: 'GRB Ghee 500ml', category: 'Ghee', price: 180, icon: '🍾' },

    // Vanaspati
    { name: 'Dalda Vanaspati (200g)', category: 'Vanaspati', price: 180, icon: '🧈' },
    { name: 'Dalda Vanaspati (500g)', category: 'Vanaspati', price: 180, icon: '🧈' },
    { name: 'Dalda Vanaspati (1kg)', category: 'Vanaspati', price: 180, icon: '🧈' },
    { name: 'Dalda Vanaspati (2kg)', category: 'Vanaspati', price: 180, icon: '🧈' },

    // Flour 
    { name: 'Aashirvaad Atta (500g)', category: 'Flour', price: 45, icon: '🌾' },
    { name: 'Aashirvaad Atta (1kg)', category: 'Flour', price: 60, icon: '🌾' },
    { name: 'Aashirvaad Atta (2kg)', category: 'Flour', price: 105, icon: '🌾' },
    { name: 'Aashirvaad Atta (5kg)', category: 'Flour', price: 250, icon: '🌾' },
    { name: 'Fortune Atta 1+1 (1kg)', category: 'Flour', price: 220, icon: '🌾' },
    { name: 'Charminar Atta (5kg)', category: 'Flour', price: 220, icon: '🌾' },
    { name: 'Charminar Atta (10kg)', category: 'Flour', price: 220, icon: '🌾' },
    { name: 'Naga Maida (500g)', category: 'Flour', price: 45, icon: '🌾' },
    { name: 'Naga Maida (1kg)', category: 'Flour', price: 60, icon: '🌾' },

    // Masala
    { name: 'Turmeric Powder', category: 'Masala', price: 35, icon: '🌶️' },
    { name: 'Red Chilli Powder', category: 'Masala', price: 45, icon: '🌶️' },
    { name: 'Coriander Powder', category: 'Masala', price: 30, icon: '🌶️' },
    { name: 'Garam Masala', category: 'Masala', price: 50, icon: '🌶️' },

    // Salt & Sugar
    { name: 'Tata Iodized Salt (1kg)', category: 'Salt & Sugar', price: 28, icon: '🧂' },
    { name: 'Tata Crystal Salt (1kg)', category: 'Salt & Sugar', price: 15, icon: '🧂' },
    { name: 'Refined Sugar (1kg)', category: 'Salt & Sugar', price: 45, icon: '🍯' },
    { name: 'Organic Jaggery', category: 'Salt & Sugar', price: 60, icon: '🍯' },
    { name: 'Pure Honey (250g)', category: 'Salt & Sugar', price: 150, icon: '🍯' },

    // Tea & Coffee Powder
    { name: 'Red Label Tea (500g)', category: 'Tea & Coffee Powder', price: 250, icon: '🍵' },
    { name: 'Chakra Gold (50g)', category: 'Tea & Coffee Powder', price: 35, icon: '🍵' },
    { name: 'Chakra Gold (100g)', category: 'Tea & Coffee Powder', price: 70, icon: '🍵' },
    { name: 'Chakra Gold (250g)', category: 'Tea & Coffee Powder', price: 145, icon: '🍵' },

    // Biscuits
    { name: 'Cream Biscuits', category: 'Biscuits', price: 5, icon: '🍪' },
    { name: 'Bourbon Biscuits', category: 'Biscuits', price: 10, icon: '🍪' },
    { name: 'Marie Biscuits', category: 'Biscuits', price: 5, icon: '🍪' },
    { name: 'Glucose Biscuits', category: 'Biscuits', price: 5, icon: '🍪' },

    // Chocolates & Candies
    { name: 'Chocolate Biscuits', category: 'Chocolates & Candies', price: 40, icon: '🍫' },
    { name: 'Lollypop', category: 'Chocolates & Candies', price: 1, icon: '🍬' },
    { name: 'Chocolates', category: 'Chocolates & Candies', price: 10, icon: '🍫' },
    { name: 'Chocolates', category: 'Chocolates & Candies', price: 10, icon: '🍫' },
    { name: 'Chocolates', category: 'Chocolates & Candies', price: 10, icon: '🍫' },

    // Noodles & Pasta
    { name: 'Maggi Noodles (pk)', category: 'Noodles & Pasta', price: 15, icon: '🍜' },
    { name: 'Maggi Noodles Family Pack (pk)', category: 'Noodles & Pasta', price: 55, icon: '🍜' },
    { name: 'Yippee Noodles (pk)', category: 'Noodles & Pasta', price: 15, icon: '🍜' },
    { name: 'Yippee Noodles Family pack (pk)', category: 'Noodles & Pasta', price: 55, icon: '🍜' },
    { name: 'Masala Pasta', category: 'Noodles & Pasta', price: 45, icon: '🍝' },

    // Semiya
    { name: 'Anil Vermicelli (Semiya)', category: 'Semiya', price: 18, icon: '🍜' },
    { name: 'Suvai Ragi (Semiya)', category: 'Semiya', price: 20, icon: '🍜' },
    { name: 'Suvai Vermicelli 180 (Semiya)', category: 'Semiya', price: 18, icon: '🍜' },
    { name: 'Suvai Vermicelli 400 (Semiya)', category: 'Semiya', price: 40, icon: '🍜' },

    // Pickles
    { name: 'Mango Pickle', category: 'Pickles', price: 80, icon: '🥒' },
    { name: 'Lemon Pickle', category: 'Pickles', price: 75, icon: '🥒' },
    { name: 'Mixed Pickle', category: 'Pickles', price: 85, icon: '🥒' },

    // Sauces & Ketchups
    { name: 'Tomato Ketchup', category: 'Sauces & Ketchups', price: 120, icon: '🥫' },
    { name: 'Soy Sauce', category: 'Sauces & Ketchups', price: 90, icon: '🥫' },

    // Snacks & chips
    { name: 'Snacks', category: 'Snacks', price: 120, icon: '🍿' },
    { name: 'Snacks', category: 'Snacks', price: 90, icon: '🍿' },

    //Soft Drinks
    { name: 'Soft Drinks', category: 'Soft Drinks', price: 120, icon: '🥤' },
    { name: 'Soft Drinks', category: 'Soft Drinks', price: 90, icon: '🥤' },

    // Eggs முட்டை
    { name: 'Eggs முட்டை', category: 'Eggs முட்டை', price: 7.50, icon: '🥚' },

    // Baby Care Products
    { name: 'Baby Powder', category: 'Baby Care Products', price: 120, icon: '🧴' },
    { name: 'Baby Oil', category: 'Baby Care Products', price: 90, icon: '🧴' },

    // Personal Care Products (Men)
    { name: 'Shampoo', category: 'Personal Care Products (Men)', price: 120, icon: '🧴' },
    { name: 'Conditioner', category: 'Personal Care Products (Men)', price: 90, icon: '🧴' },
    { name: 'Soap', category: 'Personal Care Products (Men)', price: 20, icon: '🧼' },

    // Personal Care Products (Women)
    { name: 'Shampoo', category: 'Personal Care Products (Women)', price: 120, icon: '🧴' },
    { name: 'Conditioner', category: 'Personal Care Products (Women)', price: 90, icon: '🧴' },
    { name: 'Soap', category: 'Personal Care Products (Women)', price: 20, icon: '🧼' },

    // Toothpaste
    { name: 'Colgate 50g Toothpaste', category: 'Toothpaste', price: 20, icon: '🦷' },
    { name: 'Colgate 100g Toothpaste', category: 'Toothpaste', price: 80, icon: '🦷' },
    { name: 'Colgate 200g Toothpaste', category: 'Toothpaste', price: 220, icon: '🦷' },

    // Toothbrushes
    { name: 'Toothbrush', category: 'Toothbrushes', price: 120, icon: '🪥' },
    { name: 'Toothbrush', category: 'Toothbrushes', price: 90, icon: '🪥' },
    { name: 'Toothbrush', category: 'Toothbrushes', price: 20, icon: '🪥' },

    // Soaps
    { name: 'Soap', category: 'Soaps', price: 120, icon: '🧼' },
    { name: 'Soap', category: 'Soaps', price: 90, icon: '🧼' },
    { name: 'Soap', category: 'Soaps', price: 20, icon: '🧼' },

    //Shampoos
    { name: 'Shampoo', category: 'Shampoos', price: 120, icon: '🧴' },
    { name: 'Shampoo', category: 'Shampoos', price: 90, icon: '🧴' },
    { name: 'Shampoo', category: 'Shampoos', price: 20, icon: '🧴' },

    // Detergents & Cleaners
    { name: 'Detergent Powder (1kg)', category: 'Detergents & Cleaners', price: 156, icon: '🧺' },
    { name: 'Fabric Liquid Detergent', category: 'Detergents & Cleaners', price: 120, icon: '🧴' },
    { name: 'Detergent Soap Bar', category: 'Detergents & Cleaners', price: 15, icon: '🧼' },

    // Cleaning Supplies
    { name: 'Cleaning Supplies', category: 'Cleaning Supplies', price: 120, icon: '🧻' },
    { name: 'Cleaning Supplies', category: 'Cleaning Supplies', price: 90, icon: '🧻' },
    { name: 'Cleaning Supplies', category: 'Cleaning Supplies', price: 20, icon: '🧻' },

    // Household
    { name: 'Anti-Dandruff Shampoo', category: 'Household', price: 180, icon: '🧴' },
    { name: 'Detergent Powder (1kg)', category: 'Household', price: 156, icon: '🧺' },
    { name: 'Fabric Liquid Detergent', category: 'Household', price: 120, icon: '🧴' },
    { name: 'Detergent Soap Bar', category: 'Household', price: 15, icon: '🧼' },
    { name: 'Beauty Bar Soap', category: 'Household', price: 75, icon: '🧼' },
    { name: 'Vim Bar (Dishwash Soap)', category: 'Household', price: 20, icon: '🧽' },
    { name: 'Dish Wash Liquid (500ml)', category: 'Household', price: 95, icon: '🧽' },

    // Pooja Items
    { name: 'Pooja Items', category: 'Pooja Items', price: 120, icon: '🪔' },
    { name: 'Pooja Items', category: 'Pooja Items', price: 120, icon: '🪔' },
    { name: 'Pooja Items', category: 'Pooja Items', price: 120, icon: '🪔' },
    { name: 'Pooja Items', category: 'Pooja Items', price: 120, icon: '🪔' },
    { name: 'Pooja Items', category: 'Pooja Items', price: 120, icon: '🪔' },
    { name: 'Pooja Items', category: 'Pooja Items', price: 120, icon: '🪔' },
];

const DEFAULT_CATEGORIES = [
    { name: 'Loose Items KG', icon: '⚖️' },
    { name: 'Loose Items Grams', icon: '⚖️' },
    { name: 'Rice', icon: '🌾' },
    { name: 'Oil', icon: '🍾' },
    { name: 'Ghee', icon: '🍾' },
    { name: 'Vanaspati', icon: '🧈' },
    { name: 'Flour', icon: '🍚' },
    { name: 'Masala', icon: '🌶️' },
    { name: 'Salt & Sugar', icon: '🧂' },
    { name: 'Tea & Coffee', icon: '☕' },
    { name: 'Biscuits', icon: '🍪' },
    { name: 'Chocolates & Candies', icon: '🍫' },
    { name: 'Noodles & Pasta', icon: '🍜' },
    { name: 'Semiya', icon: '🍜' },
    { name: 'Pickles', icon: '🥒' },
    { name: 'Sauces & Ketchup', icon: '🥫' },
    { name: 'Snacks & Chips', icon: '🍪' },
    { name: 'Soft Drinks', icon: '🥤' },
    { name: 'Eggs', icon: '🥚' },
    { name: 'Baby Care Products', icon: '👶' },
    { name: 'Personal Care Products (Men)', icon: '🛀' },
    { name: 'Personal Care Products (Women)', icon: '💅' },
    { name: 'Toothpaste', icon: '🦷' },
    { name: 'Toothbrushes', icon: '🪥' },
    { name: 'Soaps', icon: '🧼' },
    { name: 'Shampoos', icon: '🧴' },
    { name: 'Detergents & Cleaners', icon: '🧻' },
    { name: 'Cleaning Supplies', icon: '🧻' },
    { name: 'Household', icon: '🧻' },
    { name: 'Pooja Items', icon: '🕯️' },

];
class DataStore {
    constructor() {
        this.init();
    }

    init() {
        // Generate a signature for the current hardcoded data
        const currentSignature = JSON.stringify(DEFAULT_PRODUCTS).length + '_' + JSON.stringify(DEFAULT_CATEGORIES).length + '_' + JSON.stringify(DEFAULT_UNITS).length;
        const storedSignature = localStorage.getItem(STORAGE_KEYS.VERSION);

        // If the signature has changed (code modified) OR it's the first run, refresh the data
        if (storedSignature !== currentSignature) {
            console.log('Detected data changes in data.js. Refreshing localStorage...');
            const productsWithIds = DEFAULT_PRODUCTS.map((p, idx) => ({
                id: 'PROD-' + (idx + 1) + '-' + Math.random().toString(36).substr(2, 4),
                ...p
            }));
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsWithIds));
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
            localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(DEFAULT_UNITS));
            localStorage.setItem(STORAGE_KEYS.VERSION, currentSignature);
        }

        // Always ensure orders exists
        if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
        }
    }

    // Products
    getProducts() {
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
        let modified = false;
        products.forEach((p, idx) => {
            if (!p.id) {
                p.id = 'PROD-' + (idx + 1) + '-' + Math.random().toString(36).substr(2, 4);
                modified = true;
            }
        });
        if (modified) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        }
        return products;
    }

    saveProduct(product, oldId) {
        const products = this.getProducts();
        product.icon = product.icon ? product.icon.trim() : '';
        if (!product.icon) {
            product.icon = this.getCategoryIcon(product.category);
        }
        if (oldId) {
            const index = products.findIndex(p => p.id === oldId);
            if (index !== -1) {
                product.id = oldId;
                products[index] = product;
            } else {
                if (!product.id) product.id = 'PROD-' + Date.now();
                products.push(product);
            }
        } else {
            product.id = 'PROD-' + Date.now();
            products.push(product);
        }
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return product;
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    // Categories
    getCategories() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    }

    // Units
    getUnits() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.UNITS)) || DEFAULT_UNITS;
    }

    // Orders
    getOrders() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    }

    saveOrder(order) {
        const orders = this.getOrders();
        order.id = 'ORD-' + Date.now();
        order.timestamp = new Date().toISOString();
        orders.push(order);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

        return order;
    }

    deleteOrder(id) {
        let orders = this.getOrders();
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }

    getCategoryIcon(category) {
        const cats = this.getCategories();
        const cat = cats.find(c => c.name === category);
        return cat ? cat.icon : '📦';
    }
}

const store = new DataStore();
window.store = store; // Make it globally accessible
