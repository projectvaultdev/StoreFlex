import PDFDocument from "pdfkit";

export const generateInvoice = (order, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`,
  );

  doc.pipe(res);

  doc.fontSize(20).text("StoreFlex Invoice");

  doc.moveDown();

  doc.fontSize(14).text(`Order ID: ${order._id}`);

  doc.text(`Date: ${order.createdAt.toDateString()}`);

  doc.text(`Customer: ${order.shippingAddress.fullName}`);

  doc.moveDown();

  order.orderItems.forEach((item) => {
    doc.text(`${item.name} x ${item.quantity}`);
  });

  doc.moveDown();

  doc.text(`Total Amount: ₹${order.totalAmount}`);

  doc.end();
};
