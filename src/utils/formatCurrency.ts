export const formatCurrency = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    const numeric = typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(/[^0-9.\-]/g, ''));
    if (Number.isNaN(numeric)) return String(value);
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric);
  };