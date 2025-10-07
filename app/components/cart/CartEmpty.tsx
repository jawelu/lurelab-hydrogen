import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import type {CartMainProps} from '~/components/cart/CartMain';
import {ShoppingBag, ArrowRight} from 'lucide-react';


const CartEmpty =({
                     hidden = false,
                   }: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) =>  {
  const {close} = useAside();

  if(hidden){
    return null
  }

  return (
    <div className={`h-full flex flex-col items-center justify-center text-center p-6`}>
      {/*Icon*/}

      <div className='relative mb-8'>
        <div className='absolute inset-0 bg-brand-cream rounded-full scale-[1.8] blur-xl opacity-50'/>
        <div className='relative w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center'>
          <ShoppingBag className='w-8 h-8 text-navy'/>
        </div>
      </div>
       {/*Content*/}
      <div className='max-w-md space-y-4'>
        <h2 className='font-family-playfair text-2xl text-brand-navy'>
          Your Shopping Cart is Empty
        </h2>
        <p className='font-family-source text-brand-gold leading-relaxed'>
          Discover our collection of handcrafted footwear, where traditional artisanship meets contemporary elegance.
        </p>

      </div>


      {/*Primary CTA*/}
      <Link
         to="/"
         onClick={close}
         prefetch='intent'
         className='inline-flex items-center justify-center px-8 py-4 mt-6 bg-blue-800  text-white font-family-source font-medium hover:bg-brand-navy'
      >
        Explore Our Products
        <ArrowRight className='h-5 w-5 ml-2'/>

      </Link>

      {/*Collections/all CTA*/}
      <div className='pt-8 space-y-3 border-t border-gray-100 mt-8'>
        <p className='font-family-source text-sm text-gray-400 uppercase tracking-wider'>
          Featured Products
        </p>
        <div className='flex flex-wrap justify-center gap-4 text-sm'>
          <Link
            to='/collections/all'
            onClick={close}
            prefetch='intent'
            className='text-amber-300 hover:text-amber-100 transition-colors duration-300'
          >
            View All
          </Link>
        </div>
      </div>
      {/*Contract Information*/}
      <div className='text-sm text-gray-500 pt-6'>
        <p className='font-family-source'>
          Need assistance? Contact our atelier
        </p>
        <a href="mailto:atelier@cadence.com"
        className='font-family-source text-amber-300 hover:text-amber-100 transition-colors duration-300'
        >
          atelier@cadence.com
        </a>

      </div>

    </div>
  )

}

export default CartEmpty;