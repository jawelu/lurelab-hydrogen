import type { Route } from './+types/collections.all';
import {
    Link,
    useLoaderData,
} from 'react-router';
import { getPaginationVariables, Image, Money } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';

import type { CollectionItemFragment } from 'storefrontapi.generated';
import ProductItem from '~/components/ProductItem';
import { ArrowRight } from 'lucide-react';

export const meta: Route.MetaFunction = () => {
    return [{ title: `Hydrogen | Products` }];
};

export async function loader(args: Route.LoaderArgs) {
    // Start fetching non-critical data without blocking time to first byte
    const deferredData = loadDeferredData(args);

    // Await the critical data required to render initial state of the page
    const criticalData = await loadCriticalData(args);

    return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, request }: Route.LoaderArgs) {
    const { storefront } = context;
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 8,
    });

    const [{ products }] = await Promise.all([
        storefront.query(CATALOG_QUERY, {
            variables: { ...paginationVariables },
        }),
        // Add other queries here, so that they are loaded in parallel
    ]);
    return { products };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
    return {};
}

export default function Collection() {
    const { products } = useLoaderData<typeof loader>();

    return (
        <div className='collection'>
            {/* Hero Section */}
            <section className='relative h-[80vh] min-h-[600px] bg-brand-navy'>
                <div className='absolute inset-0'>
                    <Image
                        alt='Craftsmanship'
                        className='absolute inset-0 w-full h-full object-cover opacity-70'
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="eager"
                        data={{
                            url: "/image/craftsman.png",
                            width: 1920,
                            height: 1080
                        }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-b from-brand-navy/50 to-brand-navy/80' />
                </div>
                <div className='relative container mx-auto !px-4 h-full flex items-center'>
                    <div className='max-w-2xl'>
                        <h1 className='font-family-playfair text-4xl md:text-6xl text-white !mb-6'>
                            Artisinal Footwear for the Modern Sophisticate
                        </h1>
                        <p className='font-family-source text-lg text-gray-200 !mb-8 max-w-xl'>
                            Handcrafted excellence, designed for distinction
                        </p>

                    </div>
                </div>
            </section>



            {/* Collection Navigation */}
            <section className='bg-brand-cream border-y border-brand-navy/10'>
                <div className='container mx-auto'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center py-8 px-4 gap-4'>
                        <div className='space-y-2'>
                            <h2 className='font-family-playfair text-2xl text-brand-navy'>
                                The Collection
                            </h2>
                            <p className='font-family-source text-brand-navy/60'>
                                Showing {products.nodes.length} handcrafted pieces
                            </p>
                        </div>
                        <div className='flex items-center gap-6'>
                            <button className='font-family-source text-sm text-brand-navy/60 hover:text-brand-navy transition-colors'>
                                Filter
                            </button>
                            <button className='font-family-source text-sm text-brand-navy/60 hover:text-brand-navy transition-colors'>
                                Sort
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className='bg-white py-6 md:py-24'>
                <div className='container mx-auto px-4'>
                    <PaginatedResourceSection
                        connection={products}
                        resourcesClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16'
                    >
                        {({ node: product, index }) => (
                            <ProductItem
                                key={product.id}
                                product={product}
                                loading='lazy'
                            />
                        )}
                    </PaginatedResourceSection>
                </div>
            </section>

            {/* Craftsmanship section */}
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
                                <ArrowRight className='ml-2 w-5 h-5' />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* Heritage banner */}
            <section className='bg-brand-cream py-16 md:py-24'>
                <div className='container mx-auto px-4'>
                    <div className='max-w-3xl mx-auto text-center'>
                        <h3 className='font-family-playfair text-2xl md:text-3xl text-brand-navy mb-6'>
                            A Legacy of Distinction
                        </h3>
                        <p className='font-family-source text-brand-navy/80 mb-4'>
                            Each LURELAB creation Represents over three decades of shoemaking expertise
                        </p>
                        <p className='font-family-source text-brand-navy/60 text-sm'>
                            Available for private consulation and bespoke commissions
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 10){
         nodes {
            id
            altText
            url
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
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;