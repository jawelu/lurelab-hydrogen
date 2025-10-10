// import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
// import {useLoaderData, type MetaFunction} from 'react-router';
// import {
//   getSelectedProductOptions,
//   Analytics,
//   useOptimisticVariant,
//   getProductOptions,
//   getAdjacentAndFirstAvailableVariants,
//   useSelectedOptionInUrlParam,
// } from '@shopify/hydrogen';
// import {ProductPrice} from '~/components/ProductPrice';
// import ProductImage from '~/components/ProductImage';
// import {ProductForm} from '~/components/ProductForm';
// import {redirectIfHandleIsLocalized} from '~/lib/redirect';

// export const meta: MetaFunction<typeof loader> = ({data}) => {
//   return [
//     {title: `Hydrogen | ${data?.product.title ?? ''}`},
//     {
//       rel: 'canonical',
//       href: `/products/${data?.product.handle}`,
//     },
//   ];
// };

// export async function loader(args: LoaderFunctionArgs) {
//   // Start fetching non-critical data without blocking time to first byte
//   const deferredData = loadDeferredData(args);

//   // Await the critical data required to render initial state of the page
//   const criticalData = await loadCriticalData(args);

//   return {...deferredData, ...criticalData};
// }

// /**
//  * Load data necessary for rendering content above the fold. This is the critical data
//  * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
//  */
// async function loadCriticalData({
//   context,
//   params,
//   request,
// }: LoaderFunctionArgs) {
//   const {handle} = params;
//   const {storefront} = context;

//   if (!handle) {
//     throw new Error('Expected product handle to be defined');
//   }

//   const [{product}] = await Promise.all([
//     storefront.query(PRODUCT_QUERY, {
//       variables: {handle, selectedOptions: getSelectedProductOptions(request)},
//     }),
//     // Add other queries here, so that they are loaded in parallel
//   ]);

//   if (!product?.id) {
//     throw new Response(null, {status: 404});
//   }

//   // The API handle might be localized, so redirect to the localized handle
//   redirectIfHandleIsLocalized(request, {handle, data: product});

//   return {
//     product,
//   };
// }

// /**
//  * Load data for rendering content below the fold. This data is deferred and will be
//  * fetched after the initial page load. If it's unavailable, the page should still 200.
//  * Make sure to not throw any errors here, as it will cause the page to 500.
//  */
// function loadDeferredData({context, params}: LoaderFunctionArgs) {
//   // Put any API calls that is not critical to be available on first page render
//   // For example: product reviews, product recommendations, social feeds.

//   return {};
// }

// export default function Product() {
//   const {product} = useLoaderData<typeof loader>();

//   // Optimistically selects a variant with given available variant information
//   const selectedVariant = useOptimisticVariant(
//     product.selectedOrFirstAvailableVariant,
//     getAdjacentAndFirstAvailableVariants(product),
//   );

//   // Sets the search param to the selected variant without navigation
//   // only when no search params are set in the url
//   useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

//   // Get the product options array
//   const productOptions = getProductOptions({
//     ...product,
//     selectedOrFirstAvailableVariant: selectedVariant,
//   });

//   const {title, descriptionHtml} = product;

//   return (
//     <div className="product">
//       <ProductImage image={selectedVariant?.image} />
//       <div className="product-main">
//         <h1>{title}</h1>
//         <ProductPrice
//           price={selectedVariant?.price}
//           compareAtPrice={selectedVariant?.compareAtPrice}
//         />
//         <br />
//         <ProductForm
//           productOptions={productOptions}
//           selectedVariant={selectedVariant}
//         />
//         <br />
//         <br />
//         <p>
//           <strong>Description</strong>
//         </p>
//         <br />
//         <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
//         <br />
//       </div>
//       <Analytics.ProductView
//         data={{
//           products: [
//             {
//               id: product.id,
//               title: product.title,
//               price: selectedVariant?.price.amount || '0',
//               vendor: product.vendor,
//               variantId: selectedVariant?.id || '',
//               variantTitle: selectedVariant?.title || '',
//               quantity: 1,
//             },
//           ],
//         }}
//       />
//     </div>
//   );
// }

// const PRODUCT_VARIANT_FRAGMENT = `#graphql
//   fragment ProductVariant on ProductVariant {
//     availableForSale
//     compareAtPrice {
//       amount
//       currencyCode
//     }
//     id
//     image {
//       __typename
//       id
//       url
//       altText
//       width
//       height
//     }
//     price {
//       amount
//       currencyCode
//     }
//     product {
//       title
//       handle
//     }
//     selectedOptions {
//       name
//       value
//     }
//     sku
//     title
//     unitPrice {
//       amount
//       currencyCode
//     }
//   }
// ` as const;

// const PRODUCT_FRAGMENT = `#graphql
//   fragment Product on Product {
//     id
//     title
//     vendor
//     handle
//     descriptionHtml
//     description
//     encodedVariantExistence
//     encodedVariantAvailability
//     options {
//       name
//       optionValues {
//         name
//         firstSelectableVariant {
//           ...ProductVariant
//         }
//         swatch {
//           color
//           image {
//             previewImage {
//               url
//             }
//           }
//         }
//       }
//     }
//     selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
//       ...ProductVariant
//     }
//     adjacentVariants (selectedOptions: $selectedOptions) {
//       ...ProductVariant
//     }
//     seo {
//       description
//       title
//     }
//   }
//   ${PRODUCT_VARIANT_FRAGMENT}
// ` as const;

// const PRODUCT_QUERY = `#graphql
//   query Product(
//     $country: CountryCode
//     $handle: String!
//     $language: LanguageCode
//     $selectedOptions: [SelectedOptionInput!]!
//   ) @inContext(country: $country, language: $language) {
//     product(handle: $handle) {
//       ...Product
//     }
//   }
//   ${PRODUCT_FRAGMENT}
// ` as const;



// import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
// import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';

// // 首先定义 PRODUCT_QUERY
// const PRODUCT_QUERY = `#graphql
//   query Product($handle: String!, $country: CountryCode, $language: LanguageCode)
//   @inContext(country: $country, language: $language) {
//     product(handle: $handle) {
//       id
//       title
//       vendor
//       descriptionHtml
//       featuredImage {
//         url
//         altText
//       }
//       priceRange {
//         minVariantPrice {
//           amount
//           currencyCode
//         }
//       }
//       variants(first: 10) {
//         nodes {
//           id
//           title
//           availableForSale
//           price {
//             amount
//             currencyCode
//           }
//         }
//       }
//     }
//   }
// ` as const;

// export async function loader({ params, context }: LoaderFunctionArgs) {
//   const { productHandle } = params;

//   // 验证参数
//   if (!productHandle) {
//     throw new Response('Product handle is required', { status: 400 });
//   }

//   try {
//     const { product } = await context.storefront.query(PRODUCT_QUERY, {
//       variables: {
//         handle: productHandle,
//         country: context.storefront.i18n?.country,
//         language: context.storefront.i18n?.language,
//       },
//     });

//     if (!product) {
//       throw new Response('Product not found', { status: 404 });
//     }

//     // 使用 json 而不是 defer（除非你需要流式渲染）
//     return {
//       product,
//     }

//   } catch (error) {
//     console.error('Error loading product:', error);
//     throw new Response('Error loading product', { status: 500 });
//   }
// }

// // 定义 TypeScript 类型
// interface ProductData {
//   product: {
//     id: string;
//     title: string;
//     vendor: string;
//     descriptionHtml: string;
//     featuredImage?: {
//       url: string;
//       altText?: string;
//     };
//     priceRange: {
//       minVariantPrice: {
//         amount: string;
//         currencyCode: string;
//       };
//     };
//     variants: {
//       nodes: Array<{
//         id: string;
//         title: string;
//         availableForSale: boolean;
//         price: {
//           amount: string;
//           currencyCode: string;
//         };
//       }>;
//     };
//   };
// }

// export default function Product() {
//   const { product } = useLoaderData<typeof loader>() as ProductData;
//   const { title, vendor, descriptionHtml, featuredImage, priceRange } = product;

//   return (
//     <div className="product-page">
//       {/* 产品图片 */}
//       {featuredImage && (
//         <img
//           src={featuredImage.url}
//           alt={featuredImage.altText || title}
//           className="product-image"
//         />
//       )}

//       {/* 产品信息 */}
//       <h1>{title}</h1>
//       {vendor && <h2>品牌: {vendor}</h2>}

//       {/* 价格 */}
//       <div className="price">
//         {priceRange.minVariantPrice.amount} {priceRange.minVariantPrice.currencyCode}
//       </div>

//       {/* 产品描述 */}
//       <div
//         className="product-description"
//         dangerouslySetInnerHTML={{ __html: descriptionHtml }}
//       />

//       {/* 产品变体 */}
//       <div className="variants">
//         <h3>选择规格</h3>
//         {product.variants.nodes.map((variant) => (
//           <div key={variant.id} className="variant">
//             <span>{variant.title}</span>
//             <span>{variant.price.amount} {variant.price.currencyCode}</span>
//             <button
//               disabled={!variant.availableForSale}
//             >
//               {variant.availableForSale ? '加入购物车' : '缺货'}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






// Product3DImage组件
// "use client";

// import React, { Suspense, useRef, useState, useEffect } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import * as THREE from "three";
// import { ChevronLeft, ChevronRight, Plus, Minus, RotateCcw, Cuboid } from "lucide-react";

// type ProductMedia = {
//   mediaContentType: string;
//   previewImage?: { url: string; altText?: string };
//   sources?: { url: string; format: string; mimeType?: string }[];
// };

// type ProductMediaViewerProps = {
//   media: ProductMedia[];
//   width?: string;
//   height?: string;
// };

// const Model3D: React.FC<{ url: string; scale: number }> = ({ url, scale }) => {
//     console.log('url in Model3D', url)
//   const group = useRef<THREE.Group>(null);
//   const { scene } = useGLTF(url);
//   scene.scale.setScalar(scale)
//   return <primitive ref={group} object={scene} scale={scale} />;
// };

// const ModelSkeleton = () => (
//   <div className="flex items-center justify-center w-full h-full bg-gray-100 animate-pulse">
//     <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-transparent animate-spin" />
//   </div>
// );

// const ProductMediaViewer: React.FC<ProductMediaViewerProps> = ({
//   media,
//   width = "100%",
//   height = "500px",
// }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [hovered, setHovered] = useState(false);

//   // ✅ 每个模型都有独立状态
//   const [modelStates, setModelStates] = useState<
//     Record<number, { scale: number; orbitRef?: any }>
//   >({});

//   // 初始化每个模型的默认状态
//   useEffect(() => {
//     setModelStates((prev) => {
//       const updated = { ...prev };
//       media.forEach((_, i) => {
//         if (!updated[i]) updated[i] = { scale: 0.025 };
//       });
//       return updated;
//     });
//   }, [media]);

//   const currentState = modelStates[currentIndex];
//   const currentMedia = media[currentIndex];


//   const handlePrev = () =>
//     setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));

//   const handleNext = () =>
//     setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));

//   const handleZoomIn = () =>
//     setModelStates((prev) => ({
//       ...prev,
//       [currentIndex]: {
//         ...prev[currentIndex],
//         scale: Math.min(prev[currentIndex].scale * 1.2, 0.25),
//       },
//     }));

//   const handleZoomOut = () =>
//     setModelStates((prev) => ({
//       ...prev,
//       [currentIndex]: {
//         ...prev[currentIndex],
//         scale: Math.max(prev[currentIndex].scale / 1.2, 0.005),
//       },
//     }));

//   const handleReset = () =>
//     setModelStates((prev) => {
//       const orbit = prev[currentIndex].orbitRef;
//       if (orbit) {
//         orbit.reset();
//       }
//       return {
//         ...prev,
//         [currentIndex]: { ...prev[currentIndex], scale: 0.025 },
//       };
//     });

//   return (
//     <div
//       className="relative w-full group select-none overflow-hidden rounded-2xl shadow-md"
//       style={{ width, height }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* 主展示内容 */}
//       <div className="w-full h-full bg-gray-100">
//         {currentMedia.mediaContentType === "IMAGE" &&
//           currentMedia.previewImage?.url && (
//             <img
//               src={currentMedia.previewImage.url}
//               alt={currentMedia.previewImage.altText || ""}
//               className="w-full h-full object-cover transition-opacity duration-300"
//             />
//           )}

//         {currentMedia.mediaContentType === "MODEL_3D" &&
//           currentMedia.sources?.length && (
//             <Suspense fallback={<ModelSkeleton />}>
//               <Canvas
//                key={currentIndex}
//                 camera={{ position: [2, 0, 12.25], fov: 15 }}
//                 style={{ width: "100%", height: "100%" }}
//               >
//                 <ambientLight intensity={1.25} />
//                 <directionalLight intensity={0.4} />
//                 <Model3D
//                   url={
//                     currentMedia.sources.find((s) => s.format === "glb")?.url ||
//                     ""
//                   }
//                   scale={currentState?.scale}
//                 />
//                 <OrbitControls
//                   ref={(ref) => {
//                     if (ref && modelStates[currentIndex]?.orbitRef !== ref) {
//                       setModelStates((prev) => ({
//                         ...prev,
//                         [currentIndex]: { ...prev[currentIndex], orbitRef: ref },
//                       }));
//                     }
//                   }}
//                   enableZoom={false} // ❌ 禁止滚轮缩放
//                 />
//               </Canvas>

//               {/* ✅ 控制区 */}
//               <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
//                 {/* 3D 标签 */}
//                 <div className="flex items-center bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow">
//                   <Cuboid  className="w-4 h-4 mr-1 text-brand-navy" />
//                   3D Model
//                 </div>

//                 {/* 控制按钮组 */}
//                 <div className="flex bg-white/80 backdrop-blur-sm rounded-full shadow">
//                   <button
//                     onClick={handleZoomOut}
//                     className="p-1.5 hover:bg-gray-100 rounded-l-full"
//                     title="Zoom Out"
//                   >
//                     <Minus className="w-4 h-4" />
//                   </button>
//                   <div className="w-px bg-gray-300" />
//                   <button
//                     onClick={handleZoomIn}
//                     className="p-1.5 hover:bg-gray-100"
//                     title="Zoom In"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                   <div className="w-px bg-gray-300" />
//                   <button
//                     onClick={handleReset}
//                     className="p-1.5 hover:bg-gray-100 rounded-r-full"
//                     title="Reset View"
//                   >
//                     <RotateCcw className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </Suspense>
//           )}
//       </div>

//       {/* Hover 时显示左右切换按钮 */}
//       {hovered && (
//         <>
//           <button
//             onClick={handlePrev}
//             className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>

//           <button
//             onClick={handleNext}
//             className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProductMediaViewer;
