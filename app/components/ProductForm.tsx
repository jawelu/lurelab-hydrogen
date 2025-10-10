import { Link, useNavigate } from 'react-router';
import { type MappedProductOptions, RichText, type VariantOption, getProductOptions } from '@shopify/hydrogen';

import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import type { ProductVariantFragment, ProductFragment } from 'storefrontapi.generated';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';


export function ProductForm({
  product,
  productOptions,
  selectedVariant,
  className
}: {
  product: ProductFragment;
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  className?: string;
}) {

  console.log('product', product)

 

  const navigate = useNavigate();
  const { open } = useAside();
  // const options = getProductOptions(product);


  return (
    <div className={`flex flex-col ${className}`}>

      <div className='space-y-8'>

        {/* Variant Options */}

        {/* // todo 好像没什么效果， 回头打印下  */}
        <div className="product-form">
          {productOptions.map((option) => {
            // If there is only a single value in the option values, don't display the option
            if (option.optionValues.length === 1) return null;

            return (
              <div className="product-options" key={option.name}>
                <h5>{option.name}</h5>
                <div className="product-options-grid">
                  {option.optionValues.map((value) => {
                    const {
                      name,
                      handle,
                      variantUriQuery,
                      selected,
                      available,
                      exists,
                      isDifferentProduct,
                      swatch,
                    } = value;

                    if (isDifferentProduct) {
                      // SEO
                      // When the variant is a combined listing child product
                      // that leads to a different url, we need to render it
                      // as an anchor tag
                      return (
                        <Link
                          className="product-options-item"
                          key={option.name + name}
                          prefetch="intent"
                          preventScrollReset
                          replace
                          to={`/products/${handle}?${variantUriQuery}`}
                          style={{
                            border: selected
                              ? '1px solid black'
                              : '1px solid transparent',
                            opacity: available ? 1 : 0.3,
                          }}
                        >
                          <ProductOptionSwatch swatch={swatch} name={name} />
                        </Link>
                      );
                    } else {
                      // SEO
                      // When the variant is an update to the search param,
                      // render it as a button with javascript navigating to
                      // the variant so that SEO bots do not index these as
                      // duplicated links
                      return (
                        <button
                          type="button"
                          className={`product-options-item${exists && !selected ? ' link' : ''
                            }`}
                          key={option.name + name}
                          style={{
                            border: selected
                              ? '1px solid black'
                              : '1px solid transparent',
                            opacity: available ? 1 : 0.3,
                          }}
                          disabled={!exists}
                          onClick={() => {
                            if (!selected) {
                              void navigate(`?${variantUriQuery}`, {
                                replace: true,
                                preventScrollReset: true,
                              });
                            }
                          }}
                        >
                          <ProductOptionSwatch swatch={swatch} name={name} />
                        </button>
                      );
                    }
                  })}
                </div>
                <br />
              </div>
            );
          })}

        </div>





        {/* Add to Cart Section */}

        <div className="space-y-4">
          <div className='flex items-center justify-between'>
            <div className='text-sm font-family-source text-brand-navy/60'>
              {selectedVariant?.availableForSale ? `Ready to ship` : `Currently unavailable`}
            </div>
            {selectedVariant?.sku && (
              <div className='text-sm font-family-source text-brand-navy/60'>
                SKU: {selectedVariant?.sku}
              </div>
            )
            }
          </div>

          <AddToCartButton
            disabled={!selectedVariant}
            afterAddToCart={() => {
              open('cart')
            }}
            // onClick={() => {
            //   open('cart')
            // }}
   
            lines={
              selectedVariant ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant: selectedVariant
                }
              ] : []
            }
          >
            {/* {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'} */}
            Add to cart
          </AddToCartButton>
        </div>


        {/* Product Metafield Details Accordion */}

        <div className='mt-12 border-t border-brand-navy/10'>
          <div className='grid grid-cols-1 divide-y divide-brand-navy/10'>
            {/* Technical Specifications Section */}
            {
              product?.technicalSpecifications?.value && (
                <details className='group py-6'>
                  <summary className=' flex items-center justify-between cursor-pointer list-none'>
                    <h3 className='font-family-playfair text-lg text-brand-navy'>
                      Technical Specifications
                    </h3>
                    <span className='relative flex-shrink-0 ml-4 w-4 h-4 '>

                      <svg
                        className="absolute inset-0 w-4 h-4 transition duration-300 group-open:rotate-180 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>

                    </span>
                  </summary>

                  <div className='pt-4 prose font-family-source text-brand-navy/80'>
                    <RichText data={product.technicalSpecifications.value} />
                    {/* {
                      product.technicalSpecifications?.value && (
                        <div className='mt-4'>
                          <h4 className='font-family-playfair text-base text-brand-navy'> Technical Specifications</h4>
                          <p>{product.technicalSpecifications.value}</p>
                        </div>
                      )
                    } */}
                  </div>
                </details>
              )
            }



            {/* Materials & Compatibility Section */}
            {
              product?.materialsAndCompatibility?.value && (
                <details className='group py-6'>
                  <summary className=' flex items-center justify-between cursor-pointer list-none'>
                    <h3 className='font-family-playfair text-lg text-brand-navy'>
                       Materials & Compatibility
                    </h3>
                    <span className='relative flex-shrink-0 ml-4 w-4 h-4 '>

                      <svg
                        className="absolute inset-0 w-4 h-4 transition duration-300 group-open:rotate-180 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>

                    </span>
                  </summary>

                  <div className='pt-4 prose font-family-source text-brand-navy/80'>
                    <RichText data={product.materialsAndCompatibility.value} />
                    {/* {
                      product.technicalSpecifications?.value && (
                        <div className='mt-4'>
                          <h4 className='font-family-playfair text-base text-brand-navy'> Technical Specifications</h4>
                          <p>{product.technicalSpecifications.value}</p>
                        </div>
                      )
                    } */}
                  </div>
                </details>
              )
            }

            {/* usageAndTutorials Section */}
            {
              product?.usageAndTutorials?.value && (
                <details className='group py-6'>
                  <summary className=' flex items-center justify-between cursor-pointer list-none'>
                    <h3 className='font-family-playfair text-lg text-brand-navy'>
                      Usage & Tutorials
                    </h3>
                    <span className='relative flex-shrink-0 ml-4 w-4 h-4 '>

                      <svg
                        className="absolute inset-0 w-4 h-4 transition duration-300 group-open:rotate-180 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>

                    </span>
                  </summary>

                  <div className='pt-4 prose font-family-source text-brand-navy/80'>
                    <RichText data={product.usageAndTutorials.value} />
                    {/* {
                      product.technicalSpecifications?.value && (
                        <div className='mt-4'>
                          <h4 className='font-family-playfair text-base text-brand-navy'> Technical Specifications</h4>
                          <p>{product.technicalSpecifications.value}</p>
                        </div>
                      )
                    } */}
                  </div>
                </details>
              )
            }

             {/* packagingAndAccessories Section */}
            {
              product?.packagingAndAccessories?.value && (
                <details className='group py-6'>
                  <summary className=' flex items-center justify-between cursor-pointer list-none'>
                    <h3 className='font-family-playfair text-lg text-brand-navy'>
                      Packaging & Accessories
                    </h3>
                    <span className='relative flex-shrink-0 ml-4 w-4 h-4 '>

                      <svg
                        className="absolute inset-0 w-4 h-4 transition duration-300 group-open:rotate-180 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>

                    </span>
                  </summary>

                  <div className='pt-4 prose font-family-source text-brand-navy/80'>
                    <RichText data={product.packagingAndAccessories.value} />
                    {/* {
                      product.technicalSpecifications?.value && (
                        <div className='mt-4'>
                          <h4 className='font-family-playfair text-base text-brand-navy'> Technical Specifications</h4>
                          <p>{product.technicalSpecifications.value}</p>
                        </div>
                      )
                    } */}
                  </div>
                </details>
              )
            }

          </div>

        </div>






      </div>


    </div>

  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
