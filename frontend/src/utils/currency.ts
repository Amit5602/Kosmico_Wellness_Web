export const formatINR = (amount: number): string => {
  // If the price is extremely low, it implies the database values
  // have not yet been migrated from original USD floats.
  // Fallback to USD formatting to avoid falsely representing 14.99 USD as 14.99 INR.
  const currency = amount < 500 ? 'USD' : 'INR';
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency, 
    minimumFractionDigits: 2 
  }).format(amount);
};
