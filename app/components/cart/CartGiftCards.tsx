import { CartForm, Money } from "@shopify/hydrogen";
import { Divide, Loader2, Ticket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFetcher, type FetcherWithComponents } from "react-router-dom";
import type { CartApiQueryFragment } from "storefrontapi.generated";

const CartGiftCards = ({
  giftCardCodes,
}: {
  giftCardCodes?: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) => {

    const [showInput, setShowInput] = useState<boolean>(false)
    const appliedGiftCardCodes = useRef<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null)

    const codes: string[] = giftCardCodes?.map(({lastCharacters}) => `... ${lastCharacters}`) || []

    const saveAppliedCode = (code: string) => {

        if(!inputRef.current){
            return
        }
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    inputRef.current.value = '';
    setShowInput(false)
  }

  return (
    <div className="py-4 border-t border-gray-100">
        {/* Applied Discounts */}
        {codes.length > 0 && <div></div> }

        {/* Discount Input */}
        {showInput ? (
                <UpdateGiftCardForm
                giftCardCodes={appliedGiftCardCodes.current}
                saveAppliedCode={saveAppliedCode}
                >
                    {(fetcher) => {
                        // handle loading state
                        const isLoading = fetcher.state !== 'idle'
                        return (
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                    ref={inputRef}
                                    type="text"
                                    name="giftCardCode"
                                    placeholder="Enter gift card code"
                                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-brand-navy font-family-source text-sm"
                                    disabled={isLoading}
                                    />
                                    {isLoading && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400"/>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                    type="submit"
                                    className={`px-4 py-2 bg-brand-navy text-white rounded text-sm font-family-source transition-colors duration-300  ${
                                        isLoading
                                        ? 'opacity-50 cursor-not-allowed'
                                        :'hover:bg-brand-navyLight'
                                    }`}>
                                        Apply
                                    </button>
                                    <button 
                                    type="button"
                                    onClick={() => setShowInput(false)}
                                    className="px-4 py-2 border border-gray-200 rounded text-sm font-family-source hover:border-gray-300 transition-colors duration-300"
                                    disabled={isLoading}
                                    >
                                        Cancel
                                    </button>

                                </div>
                            </div>
                        )
                    }}
                </UpdateGiftCardForm>) : (
                    <button
                    onClick={() => setShowInput(true)}
                    className="text-sm text-brand-gold hover:text-brand-goldDark font-family-source transition-colors inline-flex items-center gap-2"
                    >
                        <Ticket className="w-4 h-4"/>
                        Add Gift Card
                    </button>
                )
        }
           
            
        






    </div>
  )
}


function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  removeAppliedCode,
  fetcherKey,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void; 
  fetcherKey?: string;
  children: React.ReactNode | ((fetcher: any) => React.ReactNode) ;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get("giftCardCode")
        if(code && saveAppliedCode){
            saveAppliedCode(code as string)
        }
        return typeof children === "function" ? children(fetcher) : children
      }}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}

export default CartGiftCards