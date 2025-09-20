// Paystack Types
export interface PaystackConfig {
  key: string
  email: string
  amount: number
  currency: string
  ref: string
  callback: (response: PaystackResponse) => void
  onClose: () => void
}

export interface PaystackResponse {
  reference: string
  trans: string
  status: string
  message: string
  transaction: string
  trxref: string
}

export interface PaystackHandler {
  openIframe: () => void
  closeIframe: () => void
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => PaystackHandler
    }
  }
}
