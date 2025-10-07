import type { OptimisticCartLine } from "@shopify/hydrogen";
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import CartLineUpdateButton from "./CartLineUpdateButton";
import CartLIneRemoveButton from "./CartLIneRemoveButton";
import { Minus, Plus } from "lucide-react";

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

type CartLineQuantityAdjusterProps = {
  line: CartLine;
};

const CartLineQuantityAdjuster = ({ line }: CartLineQuantityAdjusterProps) => {

    if(!line || typeof line.quantity === 'undefined') {
        return null;
    }

    const { id: lineId, quantity, isOptimistic } = line;
    const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
    const nextQuantity = Number(Math.round(quantity) + 1);

    return (
        <div className="flex items-center gap-2">
            <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
               <button disabled={quantity <= 1}
               className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${quantity <= 1 ? 'border-gray-200 text-gray-300' : 'border-gray-200 hover:border-gray-400 text-gray-500'} `}
               >
                  <Minus className="w-4 h-4"/>
               </button>
            </CartLineUpdateButton>

            <span className="font-family-source w-8 text-center">
                {quantity}

            </span>

             <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
               <button 
               className={`w-8 h-8 flex items-center justify-center rounded border transition-colors } `}
               >
                  <Plus className="w-4 h-4"/>
               </button>
            </CartLineUpdateButton>

             <CartLIneRemoveButton lineIds={[lineId]} 
             disabled={isOptimistic === true}
             />

        </div>
    )

}

export default CartLineQuantityAdjuster;