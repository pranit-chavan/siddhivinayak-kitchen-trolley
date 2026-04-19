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
  const customerName = project?.customer?.split(" ")[0] || "Customer";
  const type = project?.type || "Furniture";
  const trackerLink = generateTrackerLink(project?.id || "N/A");

  return `Dear ${customerName}, your quotation for ${type} is ready.\n\n` +
         `View PDF: ${pdfUrl || "Attached Below"}\n\n` +
         `Tracker Link: ${trackerLink}`;
}

export function buildOrderConfirmationMessage(project: any): string {
  const customerName = project?.customer?.split(" ")[0] || "Customer";
  const trackerLink = generateTrackerLink(project?.id || "N/A");

  return `*Order Confirmed!*\n\n` +
         `Dear ${customerName},\nThank you for choosing Siddhivinayak Kitchen Trolley System. Your order (${project?.id}) has been confirmed and moved to Manufacturing.\n\n` +
         `You can track your project's live progress at any time here:\n${trackerLink}\n\n` +
         `- Sachin Kuwar`;
}
