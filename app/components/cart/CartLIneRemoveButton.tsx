import { CartForm } from '@shopify/hydrogen';
import { X } from 'lucide-react';
import React from 'react';

type CartLIneRemoveButtonProps = {
    lineIds: string[];
    disabled: boolean;
}

const CartLIneRemoveButton = ({lineIds, disabled}: CartLIneRemoveButtonProps) => {
    return (
        <CartForm
        route='/cart'
        action={CartForm.ACTIONS.LinesRemove}
        inputs={{lineIds}}
        >
           <button 
           className={`ml-3 text-gray-400 hover:text-gray-500 transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
           disabled={disabled}
           >
            <X className='w-4 h-4'/>

           </button>
        </CartForm>
    )
}

export default CartLIneRemoveButton;