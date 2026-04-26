import { Star, Quote } from "lucide-react";
import { reviews } from "@/data/reviews";
import { motion } from "framer-motion";

const ReviewsSection = () => {
  // Duplicate reviews array to create seamless infinite scroll
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section id="reviews" className="py-24 bg-muted/30 overflow-hidden">
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            animation: scroll 50s linear infinite;
            width: max-content;
          }
          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="container mx-auto mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-[2.5rem] font-display text-foreground leading-tight mb-4">
            Hear What Our <span className="text-primary italic">Customers</span> Say.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real stories from homeowners who transformed their kitchens with Us.
          </p>
        </motion.div>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="flex animate-infinite-scroll gap-6 px-4">
        {duplicatedReviews.map((review, index) => (
          <div 
            key={`${review.id}-${index}`} 
            className="w-[350px] md:w-[450px] shrink-0 bg-background p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-xl transition-all relative group cursor-grab active:cursor-grabbing"
          >
            <Quote size={40} className="absolute top-6 right-6 text-primary/5 group-hover:text-primary/10 transition-colors" strokeWidth={1} />
            
            <div className="flex gap-1 mb-6 text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
              ))}
            </div>

            <p className="text-foreground leading-relaxed italic mb-8 relative z-10">
              "{review.comment}"
            </p>

            <div className="flex items-center gap-4 mt-auto">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary shrink-0">
                {review.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-foreground leading-none mb-1">{review.name}</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">{review.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
