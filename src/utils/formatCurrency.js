export function formatCurrency(amount, locale = "en-US", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

// Ví dụ sử dụng
console.log(formatCurrency(1000)); // $1,000.00
console.log(formatCurrency(1000, "vi-VN", "VND")); // 1.000 ₫
