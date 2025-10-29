export const TAX_RATE = 0.06; // 6% tax rate

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const calculateSubtotal = (price: number, quantity: number): number => {
  return price * quantity;
};

export const calculateTax = (subtotal: number): number => {
  return subtotal * TAX_RATE;
};

export const calculateTotal = (
  subtotal: number,
  discount: number = 0
): number => {
  const discountAmount = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const tax = calculateTax(afterDiscount);
  return afterDiscount + tax;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const generatePDF = (booking: any) => {
  // Using dynamic import to avoid SSR issues
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(76, 175, 80);
    doc.text("Highway Delite", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Booking Receipt", 105, 30, { align: "center" });

    // Reference ID
    doc.setFontSize(12);
    doc.text(`Reference ID: ${booking.referenceId}`, 20, 50);

    // Booking Details
    doc.setFontSize(10);
    doc.text("Booking Details:", 20, 65);
    doc.text(`Experience: ${booking.experience.title}`, 20, 75);
    doc.text(`Date: ${formatDate(booking.date)}`, 20, 85);
    doc.text(`Time: ${booking.timeSlot}`, 20, 95);
    doc.text(`Quantity: ${booking.quantity}`, 20, 105);

    // Customer Details
    doc.text("Customer Details:", 20, 120);
    doc.text(`Name: ${booking.name}`, 20, 130);
    doc.text(`Email: ${booking.email}`, 20, 140);
    doc.text(`Phone: ${booking.phone}`, 20, 150);

    // Price Details
    doc.text("Price Details:", 20, 165);
    const subtotal = booking.experience.price * booking.quantity;
    const tax = calculateTax(subtotal);
    doc.text(`Subtotal: ${formatCurrency(subtotal)}`, 20, 175);
    doc.text(`Tax (6%): ${formatCurrency(tax)}`, 20, 185);
    doc.text(
      `Total: ${formatCurrency(booking.totalPrice)}`,
      20,
      195
    );

    // Footer
    doc.setFontSize(8);
    doc.text(
      "Thank you for choosing Highway Delite!",
      105,
      280,
      { align: "center" }
    );

    // Save
    doc.save(`booking-${booking.referenceId}.pdf`);
  });
};
