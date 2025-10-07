import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
// import {ProductItem} from '~/components/ProductItem';
import { ArrowRight, Divide, Star } from 'lucide-react';
import ProductItem from '~/components/ProductItem';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {/* Hero Section */}
      <section className='relative h-screen min-h-[600px] bg-brand-navy'>
          <Image
             alt='Craftsmanship'
             className='absolute inset-0 w-full h-full object-cover opacity-70'
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
             loading="eager"
             data={{
              url: "/image/craftsmanship-handcrafting-leather-hands.jpg",
              width: 1920,
              height: 1080
             }}
          />
          <div className='relative container mx-auto !px-4 h-full flex items-center'>
            <div className='max-w-2xl'>
              <h1 className='font-family-playfair text-4xl md:text-6xl text-white !mb-6'>
                Artisinal Footwear for the Modern Sophisticate
              </h1>
              <p className='font-family-source text-lg text-gray-200 !mb-8'>
                Handcrafted excellence, designed for distinction
              </p>
              <Link 
                to='/collections/all'
                className='inline-flex items-center !px-8 !py-4 bg-brand-gold hover:bg-brand-goldDark 
                transition-colors duration-300 text-white font-family-source font-medium'
              >
                Explore Collection
                <ArrowRight className="ml-2 w-5 h-5"/>
              </Link>
            </div>
          </div>
      </section>

      {/* Recommended Products */}
      <section className='py-20 px-4 bg-white'>
        <div className='container mx-auto'>
          <h2 className='font-family-playfair text-3xl text-center !mb-12'>
            Our Latest Products
          </h2>
          <div>
            <Suspense 
               fallback={
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                  {
                    Array.from({length: 4}).map((_, i) => (
                      <div key={`skeleton-${i}`} className='flex flex-wrap gap-4 animate-pulse'>
                         <div className='w-20 h-20 bg-gray-200 rounded'/>
                          <div className='w-20 h-20 bg-gray-200 rounded'/>
                           <div className='w-20 h-20 bg-gray-200 rounded'/>
                      </div>
                    ))
                  }
                </div>
               }
            >
                <Await resolve={data.recommendedProducts}>
                  {(response) => (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                      {response?.products.nodes.map((product: any) => (
                        <ProductItem 
                           key={product.id}
                           product={product}
                           loading='lazy'
                           hidePrice                       
                        />
                      ))}
                    </div>
                  )}
                </Await>
            </Suspense>
          </div>
        </div>
      </section>

      {/* CraftsManship Section */}
      <section className='py-20 px-4'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div>
              <Image
                 alt='Craftsmanship'
                 className='w-full h-150 object-cover'
                 data={{
                  url: '/image/craftsmanship-sowing.jpg'
                 }}
                 sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw 33vw'
                 loading='lazy'
              />
            </div>
            
            <div className='max-w-xl'>
              <h2 className='font-family-playfair text-3xl !mb-6'>
                Crafted by Master Artisans
              </h2>
              <p className='font-family-source text-gray-600 !mb-8 leading-relaxed'>
                LureLab is your source for the best aluminum soft plastic fishing lure molds.
                 Revolving around the “Do-it yourselfers” in the fishing industry,
                  our products allow anglers to make high quality baits at severely reduced price.
              </p>
              <Link
                 to="/pages/our-craft"
                 className='inline-flex items-center font-family-source font-medium text-brand-navy hover:text-brand-gold transition-colors duration-300'
              >
                 Discover Our Process
                 <ArrowRight className='ml-2 w-5 h-5'/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className='py-20 px-4 bg-brand-navy text-white'>
        <div className='container mx-auto max-w-4xl text-center'>
          <div className='flex justify-center'>
            {Array.from({length: 5}).map((_, i) => (
              <Star
                 key={`start-${i}`}
                 fill="#C3A343"
                 color="#C3A343"
                 className="w-8 h-8 mb-8"         
              />
            ))}
          </div>
          <blockquote className='font-family-playfair text-2xl md:text-3xl mb-8'>
            The Leading Manufacturer of Aluminum Fishing Bait Molds
          </blockquote>
          <cite className='font-family-source text-gray-300 not-italic'>
            - The Luxury Team
          </cite>
        </div>
      </section>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2 className='text-pink-200 font-family-playfair font-bold text-2xl'>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product: any) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
         currencyCode
      }
    }
      featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 2) {
      nodes {
         id
      url
      altText
      width
      height
      }
    }

    variants(first: 1){
      nodes {
        selectedOptions{
          name
          value
        }
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
