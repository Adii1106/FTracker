export const getCurrencySymbol = (code) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥'
  };
  return symbols[code] || '$';
};

export const formatCurrency = (amount, code = 'USD') => {
  const symbol = getCurrencySymbol(code);
  return `${symbol}${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
