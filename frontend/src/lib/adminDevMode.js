export const ADMIN_DEV_MODE =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_ADMIN_DEV_MODE === "true";
