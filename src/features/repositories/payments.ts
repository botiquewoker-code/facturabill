import {
  readPaymentMethodSettings,
  writePaymentMethodSettings,
  type PaymentMethodSettings,
} from "@/features/storage/payment-methods";

export type PaymentRepository = {
  readSettings(): PaymentMethodSettings;
  saveSettings(value: PaymentMethodSettings): void;
};

export const localPaymentRepository: PaymentRepository = {
  readSettings: readPaymentMethodSettings,
  saveSettings: writePaymentMethodSettings,
};
