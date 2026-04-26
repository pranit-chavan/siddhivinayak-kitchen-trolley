import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL, WHATSAPP_COLOR } from "@/data/constants";

const WhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
      style={{ backgroundColor: WHATSAPP_COLOR }}
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default WhatsAppButton;
