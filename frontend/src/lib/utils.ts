export const TAX_RATE = 0.06; // 6% tax rate

export const calculatePricing = (price: number, quantity: number, discountPercent: number = 0) => {
  const subtotal = price * quantity;
  const discount = (subtotal * discountPercent) / 100;
  const afterDiscount = subtotal - discount;
  const taxes = afterDiscount * TAX_RATE;
  const total = afterDiscount + taxes;

  return {
    subtotal: Math.round(subtotal),
    discount: Math.round(discount),
    taxes: Math.round(taxes),
    total: Math.round(total),
  };
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
