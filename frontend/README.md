This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Seller Dashboard

The initial seller interface is available at `/seller` and is implemented with the Next.js App Router:

- `src/app/seller/layout.js` provides the seller navigation, responsive desktop sidebar/mobile navigation, store header, notification and profile controls, and route-specific page metadata.
- `src/app/seller/page.js` renders the dashboard summary, sample sales chart, stock reminders, and products nearing their sale cutoff.

Dashboard values and store/profile details are temporary UI sample data. They are not fetched from the API. QR pickup, reviews, store, and settings remain planned routes.

To run and check this interface, start in the `frontend` directory:

```bash
npm run dev
```

Open [http://localhost:3000/seller](http://localhost:3000/seller). Validate the seller files with `npm run lint -- src/app/seller` and check the production build with `npm run build`.

## Seller Product Management

Product Management is available at `/seller/products` and uses local sample data only; no database, API, or persistent storage is connected yet.

- `src/app/seller/products/_data/products.js` contains sample surplus-food products, food categories, regular and ReMeal prices, and IDR price formatting.
- `src/app/seller/products/_components/ProductList.js` provides responsive desktop/mobile product lists, search, category and status filters, empty states, edit links, and simulated deletion.
- `src/app/seller/products/_components/ProductForm.js` is shared by create and edit pages. It supports a local JPG/PNG/WebP photo preview (maximum 5 MB), required-field and numeric validation, simulated save feedback, and a cancel link back to the product list.
- `src/app/seller/products/page.js` renders `/seller/products`.
- `src/app/seller/products/new/page.js` renders `/seller/products/new`.
- `src/app/seller/products/[id]/edit/page.js` renders `/seller/products/{id}/edit` from the matching sample product ID; unknown IDs show the standard not-found page.
- `src/app/seller/products/create/page.js` and `src/app/seller/products/[id]/page.js` are compatibility aliases that redirect to the existing create and edit routes.

Sample product IDs include `roti-cokelat`, `croissant-mentega`, `donat-cokelat`, `brownies-potong`, `risoles-mayo`, `nasi-ayam`, `rice-bowl-ayam`, `salad-buah`, and `es-kopi-susu`. Categories are limited to Roti, Kue, Makanan Berat, Snack, Dessert, and Minuman. Run `npm run lint` and `npm run build` from `frontend` to verify this stage.

## Seller Orders

Seller Orders is available at `/seller/orders` and `/seller/orders/{orderId}` inside the existing seller layout.

- `src/app/seller/orders/_data/orders.js` holds local sample orders and the shared status/price helpers.
- `src/app/seller/orders/_components/OrderList.js` renders status summaries, search, status filtering, a desktop table, and mobile order cards.
- `src/app/seller/orders/[orderId]/page.js` renders sample order details and clearly marks fields not available in the sample data.
- `src/services/orders.js` prepares `getSellerOrders()`, `getSellerOrderById(orderId)`, and `confirmSellerOrder(orderId)` for the `/seller/orders` API paths. Configure `NEXT_PUBLIC_API_URL` before calling these functions.
- The list and detail pages currently use local sample data. They do not call the API or persist order changes. QR verification and order completion are not implemented.

## Seller QR Pickup

`/seller/qr-pickup` provides a local QR scan simulation using sample food orders. The "Simulasikan Scan QR" action selects a ready-for-pickup sample order; a separate failure simulation shows an invalid QR. Confirming pickup changes the selected order to "Selesai" only in the page's local state. The camera and persistence are not implemented.

`src/services/orders.js` also prepares `verifySellerOrderQR(qrCode)` and `completeSellerOrder(orderId)` for `POST /seller/orders/verify-qr` and `POST /seller/orders/{orderId}/complete`. The QR Pickup page does not call these endpoints; wire them after backend implementation is confirmed.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
