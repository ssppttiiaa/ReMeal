export const SELLER_DEV_MODE =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_SELLER_DEV_MODE === "true";
