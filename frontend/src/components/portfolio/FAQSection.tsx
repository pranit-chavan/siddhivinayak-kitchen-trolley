import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shared/ui/accordion";
import { faqs } from "@/data/faqs";

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-muted/20">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display mb-6">Frequently Asked <span className="text-primary italic">Questions</span></h2>
          <p className="text-lg text-muted-foreground">Find answers to the most common queries about our modular kitchen and furniture solutions.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-none bg-background shadow-sm rounded-2xl px-6">
              <AccordionTrigger className="text-left py-6 hover:no-underline font-bold text-lg text-foreground hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground leading-relaxed text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
