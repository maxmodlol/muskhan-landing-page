export type PublicPaymentInstructions = {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  branch: string;
  transferNote: string;
  isConfigured: boolean;
};

export function getPublicPaymentInstructions(): PublicPaymentInstructions {
  const bankName = (process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME ?? "").trim();
  const accountHolder = (
    process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_HOLDER ?? ""
  ).trim();
  const accountNumber = (
    process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER ?? ""
  ).trim();
  const iban = (process.env.NEXT_PUBLIC_PAYMENT_IBAN ?? "").trim();
  const branch = (process.env.NEXT_PUBLIC_PAYMENT_BRANCH ?? "").trim();
  const transferNote = (
    process.env.NEXT_PUBLIC_PAYMENT_TRANSFER_NOTE ?? ""
  ).trim();

  const isConfigured = Boolean(
    accountNumber || iban || (bankName && accountHolder),
  );

  return {
    bankName,
    accountHolder,
    accountNumber,
    iban,
    branch,
    transferNote,
    isConfigured,
  };
}
