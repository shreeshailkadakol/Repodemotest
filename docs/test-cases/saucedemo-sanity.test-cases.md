# Sauce Demo Sanity Journey - Test Cases

**Component:** Sanity  
**Automated spec:** `tests/specs/sanityComponent.spec.ts`  
**Page object:** `components/sanityComponent.ts` (composes `LoginComponent` and `CartCheckoutComponent`)  
**Run:** `npm run test:sanity` (`@Sanity`)

## Journey

| Stage | Method | Site | Verifies |
|---|---|---|---|
| 1. Login | `loginAsStandardUser` | saucedemo.com | Login UI available; `standard_user` lands on `inventory.html` with the product list |
| 2. Add to cart | `selectProductAndAddToCart` | sauce-demo.myshopify.com | Catalog has products; Grey Jacket page details; header count 0 -> 1 |
| 3. Cart | `verifyCartFromHeader` | sauce-demo.myshopify.com | Header leads to `/cart`; name, £55.00 price, quantity 1, total, enabled checkout |
| 4. Checkout | `proceedToCheckout` | sauce-demo.myshopify.com | Checkout page URL/title, contact email field, £55.00 order total |

| ID | Title | Tags |
|---|---|---|
| TC-S01 | Login, add to cart, verify cart and reach checkout | @Sanity @Smoke |

## Known Limitations

- Login and shopping are on two different sites with no shared session, so login is verified as its own stage rather than gating the cart.
- Checkout stops at the checkout page; the form is never submitted, so no order is placed ("checkout completion" is not exercised).
- The Shopify store rate-limits repeated adds (429); avoid running the full browser matrix repeatedly in a short time.
