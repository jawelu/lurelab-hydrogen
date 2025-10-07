import type { ProductVariantFragment } from 'storefrontapi.generated';
import { Image } from '@shopify/hydrogen';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Divide, X } from 'lucide-react';

type GalleryImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

type ProductImageProps = {
  images: GalleryImage[];
  selectedVariantImage: ProductVariantFragment['image'];
};


const ProductImage = ({ images, selectedVariantImage }: ProductImageProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number>(0);

  const [touchStart, setTouchStart] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);


  const allImages = selectedVariantImage ?
    [selectedVariantImage, ...images.filter((img) => img.id !== selectedVariantImage.id)] :
    images;




  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.touches[0].clientX;
    const offset = currentTouch - touchStart;
    setDragOffset(offset);

  }

  const handleTouchEnd = (e: React.TouchEvent) => {

    if (!isDragging) return;

    const minSwipeDistance = 50; // Minimum distance to be considered a swipe
    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1);
        if (modalOpen) setModalIndex((prev) => prev - 1);
      } else if (dragOffset < 0 && selectedIndex < allImages.length - 1) {
        setSelectedIndex((prev) => prev + 1);
        if (modalOpen) setModalIndex((prev) => prev + 1);
      }
    }
    setIsDragging(false);
    setDragOffset(0);

  }

  const getImagePosition = (index: number) => {
    const baseTransform = isDragging ? dragOffset : 0;
    const diff = index - (modalOpen ? modalIndex : selectedIndex);
    return `translate3d(calc(${diff * 100}% + ${baseTransform}px), 0, 0)`;
  }

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  }

  if (allImages.length < 1) {
    return (
      <div className='aspect-square bg-amber-50 rounded-lg animate-pulse' />
    )
  }

  return (
    <>
      {/* Image Carousel */}
      <div className='space-y-4'>
        {/* Main Image Container */}
        <div className='aspect-square relative rounded-lg overflow-hidden bg-amber-50 cursor-zoom-in'
          onClick={() => !isDragging && openModal(selectedIndex)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}

        >

          {/* Image container */}
          <div className='absolute inset-0'>
            {allImages.map((image, index) => (
              <div key={`image-${image.id || index}`}
                className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out ${!isDragging ? 'transition-transform duration-300' : 'transition-none'}`}
                style={{ transform: getImagePosition(index) }}
              >

                <Image
                  alt={image.altText || `Product image}`}
                  data={image}
                  sizes="(min-width: 1024px) 600px, 50vw, 100vw"
                  className='w-full h-full object-cover'
                />


              </div>

            ))}

          </div>

          {/* Navigation Arrows - desktop */}
          <div className='absolute inset-0 hidden md:flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity'>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedIndex > 0) {
                  setSelectedIndex((prev) => prev - 1);

                }
              }}
              className='bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors'
              disabled={selectedIndex === 0}
            >
              <ChevronLeft className='w-6 h-6 text-brand-navy' />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedIndex < allImages.length - 1) {
                  setSelectedIndex((prev) => prev + 1);

                }
              }}
              className='bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors'
              disabled={selectedIndex === allImages.length - 1}
            >
              <ChevronRight className='w-6 h-6 text-brand-navy' />
            </button>
          </div>

          {/* Thumbnail Strip */}
        </div>

        <div className=' hidden md:grid grid-cols-[repeat(auto-fill,_5rem)] gap-4 py-2 px-1'>
          {allImages.map((image, index) => (
            <button
              key={`thumbnail-${index}-${image.id || 'x'}`}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square w-20 rounded-md overflow-hidden transition-all duration-300 ease-out ${selectedIndex === index ? 'ring-2  ring-amber-300 ring-offset-2' : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 opacity-70 hover:opacity-100'}`}
            >
              <Image
                alt={image.altText || `Product thumbnail`}
                data={image}
                sizes="80px"
                className='w-full h-full object-cover'
              />
            </button>
          ))}
        </div>


        {/* Dot Indicators */}
        <div className='flex md:hidden justify-center space-x-2 mt-4'>
          {allImages.map((_, index) => (
            <button
              onClick={() => setSelectedIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedIndex === index ? 'bg-amber-500 w-4' : 'bg-gray-300 hover:bg-gray-400'}`}
              key={`dot-${index}`} />))}
        </div>
      </div>
      {/* Modal / Popup */}
      {modalOpen && (
        <div className='w-full h-full fixed top-0 left-0 !my-0 inset-0 z-50 bg-black/95 backdrop-blur-sm'>
          <div className='absolute inset-0 overflow-hidden'>



            {/* Close Button */}
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 z-50 text-white/80 p-2 hover:text-white transition-colors'
            >
              <X className='w-6 h-6' />

            </button>


            {/* Image Counter */}
            <div className='absolute top-4 left-4 z-50'>
              <p className='text-white/80 font-family-source text-sm'>
                {modalIndex + 1} / {allImages.length}
              </p>
            </div>


            {/* Modal Image */}
            <div
              className='w-full h-full flex items-center justify-center p-0 md:p-8'
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className='relative w-full h-full'>
                     {allImages.map((image, index) => (
                  <div 
                  key={`modal-image-${image.id || 'x'} - ${index}`}
                  className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out
                   ${!isDragging ? 'transition-transform' : 'transition-none'}`}
                  style={{ transform: getImagePosition(index) }}
                  >
                    <div className='relative w-full h-full flex items-center justify-center'>
                       <Image
                      alt={image.altText || `Product image`}
                      data={image}
                      sizes="90vw"
                      className='max-w-full max-h-[85vh] object-contain'
                    />   
                    </div>
                    </div>
                    ))}
              </div>
            </div>
            {/* Modal Navigation Arrows */}

             <div className='absolute inset-0 hidden md:flex items-center justify-between px-4'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (modalIndex > 0) {
                  setModalIndex((prev) => prev - 1);
                }
              }}
              className='bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors'
              disabled={modalIndex === 0}
            >
              <ChevronLeft className='w-8 h-8' />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (modalIndex < allImages.length - 1) {
                  setModalIndex((prev) => prev + 1);

                }
              }}
              className='bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors'
              disabled={selectedIndex === allImages.length - 1}
            >
              <ChevronRight className='w-8 h-8' />
            </button>
          </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductImage;


