import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { PaymentMenthodResponseI } from '../../interfaces/payment.interfaces';
import { CreditCardIcon, TrashIcon } from '../../utils/iconsUtils';


interface PaymentMethodCardProps {
    paymentMethod: PaymentMenthodResponseI;
    changeDefault: () => void;
    deleteMethod: () => void;
}

const PaymentMethodCard = ({ paymentMethod, changeDefault, deleteMethod }: PaymentMethodCardProps) => {

    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const card = `rounded-2xl border transition-colors ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`

    return (
        <div className={`${card} p-5 mb-4`}>
            <div className="flex w-80 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-7 rounded-md flex items-center justify-center ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <CreditCardIcon isDark={dark}/>
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>•••• •••• •••• {paymentMethod.last4}</p>
                        <p className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>Expires {paymentMethod.expMonth} / {paymentMethod.expYear} · {paymentMethod.isDefault ? <span className='text-red-500'>Default</span> : ''}</p>
                        <p className={`text-xs ${dark ? 'text-white' : 'text-gray-400'}`}>{paymentMethod.brand}</p>
                    </div>
                </div>
                <div className='flex justify-center'>
                    {!paymentMethod.isDefault && (
                        <button 
                            onClick={changeDefault}
                            className="
                            inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium
                            border border-blue-500/30 bg-blue-500/10 text-blue-400
                            hover:bg-blue-500/20 hover:border-blue-500/50
                            transition-all duration-150
                        ">
                            <i className="ti ti-star text-[13px]" aria-hidden="true" />
                            Set as default
                        </button>
                    )}

                    {!paymentMethod.isDefault && (
                        <button
                            onClick={deleteMethod}
                            className="
                                inline-flex items-center justify-center w-7 h-7 rounded-lg
                                border border-red-500/20 bg-red-500/10 text-red-400
                                hover:bg-red-500/20 hover:border-red-500/40
                                transition-all duration-150 ml-1.5
                            "
                        aria-label="Delete payment method"
                    >
                        <TrashIcon isDark={dark} />
                    </button>
                    )}
                </div>

            </div>
        </div>
    )
}

export default PaymentMethodCard