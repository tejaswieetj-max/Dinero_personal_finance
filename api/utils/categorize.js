/**
 * Categorize a transaction name into 'Essential' or 'Leisure'
 * @param {string} name 
 * @returns {string} 'Essential' or 'Leisure'
 */
export function categorizeTransaction(name) {
  const essentialKeywords = [
    'rent', 'mortgage', 'groceries', 'electricity', 'water', 'gas', 
    'insurance', 'medical', 'pharmacy', 'transport', 'fuel', 'internet', 
    'phone', 'school', 'tuition', 'loan'
  ];
  
  const leisureKeywords = [
    'netflix', 'spotify', 'restaurant', 'cafe', 'bar', 'hotel', 'flight', 
    'amazon', 'shopping', 'game', 'cinema', 'gym', 'subscription'
  ];

  const lowerName = name.toLowerCase();

  const isEssential = essentialKeywords.some(kw => lowerName.includes(kw));
  if (isEssential) return 'Essential';

  const isLeisure = leisureKeywords.some(kw => lowerName.includes(kw));
  if (isLeisure) return 'Leisure';

  return 'Leisure'; // Default
}
