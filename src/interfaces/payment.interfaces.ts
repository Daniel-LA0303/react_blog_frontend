
export interface PaymentMenthodResponseI{
    _id: string; 
    user: string;
    externalId: string; 
    methodType: string; 
    brand: string; 
    last4: string; 
    expMonth: number; 
    expYear: number; 
    isDefault: boolean;
}

export interface PaymentMenthodRequestI {
    user: string; 
    provider: string;
    methodType: string; 
    externalId: string; 
    brand: string; 
    last4: string; 
    expMonth: Number; 
    expYear: Number; 
    providerRaw?: Record<string, any>;
}
