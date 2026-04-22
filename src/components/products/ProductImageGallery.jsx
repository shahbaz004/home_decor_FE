import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/utils/cn.js';

function ProductImageGallery({ images = [], productName = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const fallbackImages = [
    { url: 'https://picsum.photos/seed/decor1/600/600', alt: productName },
    { url: 'https://picsum.photos/seed/decor2/600/600', alt: productName },
    { url: 'https://picsum.photos/seed/decor3/600/600', alt: productName },
  ];

  const galleryImages = images.length > 0
    ? images.map((img, i) => ({
        url: typeof img === 'string' ? img : img.url,
        alt: typeof img === 'object' ? img.alt : `${productName} ${i + 1}`,
      }))
    : fallbackImages;

  const prev = () => setActiveIndex((i) => (i === 0 ? galleryImages.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === galleryImages.length - 1 ? 0 : i + 1));

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-50 aspect-square">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <div
              className={cn(
                'w-full h-full overflow-hidden',
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              )}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { if (isZoomed) setIsZoomed(false); }}
            >
              <img
                src={galleryImages[activeIndex].url}
                alt={galleryImages[activeIndex].alt || productName}
                className={cn(
                  'w-full h-full object-cover transition-transform duration-200',
                  isZoomed && 'scale-150'
                )}
                style={
                  isZoomed
                    ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                    : {}
                }
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-neutral-700 hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-neutral-700 hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Hint */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          <ZoomIn className="w-3 h-3" />
          <span>Click to zoom</span>
        </div>

        {/* Image Counter */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {activeIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {galleryImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200',
                activeIndex === index
                  ? 'border-primary-500 ring-2 ring-primary-500/30'
                  : 'border-neutral-200 hover:border-neutral-400'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={img.url}
                alt={img.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageGallery;
