
import i18n from './i18n';

export const formatCurrency = (amount: number | string, currency = 'INR'): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  
  if (isNaN(numericAmount)) return String(amount);

  try {
    return new Intl.NumberFormat(i18n.language || 'en', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(numericAmount);
  } catch (error) {
    return String(amount);
  }
};

export const formatDate = (date: number | string | Date): string => {
  try {
    return new Intl.DateTimeFormat(i18n.language || 'en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  } catch (error) {
    return String(date);
  }
};

export const formatTime = (date: number | string | Date): string => {
  try {
    return new Intl.DateTimeFormat(i18n.language || 'en', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  } catch (error) {
    return String(date);
  }
};
