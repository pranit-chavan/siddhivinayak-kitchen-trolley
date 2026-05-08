import { WHATSAPP_URL } from "@/data/constants";

/**
 * Utility functions for generating WhatsApp deep links and pre-filled messages
 * for the Siddhivinayak ERP system.
 */

// Format output: https://yourdomain.com/track/SVK-YYYY-NNN
export function generateTrackerLink(projectId: string): string {
  const origin = window.location.origin;
  return `${origin}/track/${projectId}`;
}

export function openWhatsApp(message: string): void {
  const encodedText = encodeURIComponent(message);
  const finalUrl = `${WHATSAPP_URL}?text=${encodedText}`;
  window.open(finalUrl, "_blank", "noopener,noreferrer");
}

export function openWhatsAppForCustomer(phone: string, message: string): void {
  const cleanPhone = phone.replace(/\D/g, "");
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(message);
  const finalUrl = `https://wa.me/${finalPhone}?text=${encodedText}`;
  window.open(finalUrl, "_blank", "noopener,noreferrer");
}

export function buildContactMessage(form: { name: string; phone: string; address?: string; types?: string[]; message?: string }): string {
  let msg = `*New Customer Inquiry (Website)*\n\n`;
  msg += `*Name:* ${form.name}\n`;
  msg += `*Phone:* ${form.phone}\n`;
  if (form.address) msg += `*Location:* ${form.address}\n`;
  
  if (form.types && form.types.length > 0) {
    msg += `*Interested In:* ${form.types.join(", ")}\n`;
  }
  
  if (form.message) {
    msg += `\n*Message:* ${form.message}\n`;
  }
  
  return msg;
}

export function buildQuotationMessage(project: any, pdfUrl: string = ""): string {
  // project.customer is the name string in the ERP table mapping
  const customerName = (typeof project?.customer === "string"
    ? project.customer
    : project?.customer?.name || project?.customerName || "Customer"
  ).split(" ")[0];
  const type = project?.type || project?.furnitureType || "Furniture";
  const code = project?.id || project?.code || "N/A";
  const trackerLink = generateTrackerLink(code);

  return `Dear ${customerName}, your quotation for ${type} is ready.\n\n` +
         `View PDF: ${pdfUrl || "Attached Below"}\n\n` +
         `Track your project here: ${trackerLink}`;
}

export function buildOrderConfirmationMessage(project: any): string {
  // project.customer is the name string in the ERP table mapping
  const customerName = (typeof project?.customer === "string"
    ? project.customer
    : project?.customer?.name || project?.customerName || "Customer"
  ).split(" ")[0];
  const code = project?.id || project?.code || "N/A";
  const trackerLink = generateTrackerLink(code);

  return `*Order Confirmed! 🎉*\n\n` +
         `Dear ${customerName},\nThank you for choosing Siddhivinayak Kitchen Trolley System. Your project *(${code})* has been confirmed.\n\n` +
         `📍 Track your live project progress here:\n${trackerLink}\n\n` +
         `— Sachin Kuwar, SVK Kitchens`;
}
