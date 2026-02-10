import { QuotationItem } from '../types';

export const formatWhatsAppMessage = (items: QuotationItem[], total: number) => {
    let message = `*Quotation Request from Anu Creation*\n\n`;

    items.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (${item.productCode})\n`;
        message += `   Qty: ${item.quantity} x Rs.${item.price.toLocaleString()}\n`;
        message += `   Subtotal: Rs.${(item.quantity * item.price).toLocaleString()}\n\n`;
    });

    message += `*Total Amount: Rs.${total.toLocaleString()}*\n\n`;
    message += `Please confirm availability and shipping details.`;

    return encodeURIComponent(message);
};
