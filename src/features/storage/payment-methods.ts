import { createJsonLocalStore } from "./local";

export const PAYMENT_METHODS_STORAGE_KEY = "facturabill-payment-methods";

export type PaymentMethodKey =
  | "bankTransfer"
  | "sepaDebit"
  | "card"
  | "bizum"
  | "paypal";
export type PaymentTerms = "uponReceipt" | "15days" | "30days" | "60days";

export type PaymentMethodSettings = {
  accountHolder: string;
  bankName: string;
  iban: string;
  bic: string;
  sepaCreditorId: string;
  paymentReference: string;
  cardGateway: string;
  bizumPhone: string;
  paypalEmail: string;
  paymentInstructions: string;
  defaultTerms: PaymentTerms;
  methods: Record<PaymentMethodKey, boolean>;
};

export const DEFAULT_PAYMENT_SETTINGS: PaymentMethodSettings = {
  accountHolder: "",
  bankName: "",
  iban: "",
  bic: "",
  sepaCreditorId: "",
  paymentReference: "",
  cardGateway: "",
  bizumPhone: "",
  paypalEmail: "",
  paymentInstructions: "",
  defaultTerms: "30days",
  methods: {
    bankTransfer: true,
    sepaDebit: false,
    card: true,
    bizum: false,
    paypal: false,
  },
};

export function normalizePaymentSettings(
  value?: Partial<PaymentMethodSettings> | null,
): PaymentMethodSettings {
  return {
    ...DEFAULT_PAYMENT_SETTINGS,
    ...value,
    methods: {
      ...DEFAULT_PAYMENT_SETTINGS.methods,
      ...(value?.methods || {}),
    },
  };
}

const paymentMethodsStore = createJsonLocalStore<PaymentMethodSettings>(
  PAYMENT_METHODS_STORAGE_KEY,
  {
    fallback: DEFAULT_PAYMENT_SETTINGS,
    migrate(value) {
      return normalizePaymentSettings(
        value && typeof value === "object"
          ? (value as Partial<PaymentMethodSettings>)
          : null,
      );
    },
  },
);

export function readPaymentMethodSettings() {
  return paymentMethodsStore.read();
}

export function writePaymentMethodSettings(value: PaymentMethodSettings) {
  paymentMethodsStore.write(normalizePaymentSettings(value));
}
