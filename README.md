# Pulpoffe website

A static, photo-led coffee website built around the supplied brand materials and visual references. Six original images were created in Canva AI and optimized to WebP. No videos or WebGL renderer are used.

Serve `dist` through an HTTP server. No build step is required. Google Fonts supplies Poppins and Cormorant Garamond, with system fallbacks.

Interactions include scroll reveals and gentle image parallax, collection filters, accessible coffee detail dialogs, mobile navigation, and a blend preference brief download. No order or enquiry is transmitted. Reduced motion is respected.

Imagery is illustrative; packaging, pricing, testimonials and contact details have not been invented.

Canva image creation workspace: https://www.canva.com/ai/thread/53d29246-3e16-4f31-804d-1029e1110b0f

Catalogue update: 24 documented coffee variants, search and collection filters, a device-local enquiry basket with quantity controls and download, compact homepage cards, and repeatable scroll animations. Razorpay is the selected future provider; live payments are not implemented or enabled because pack sizes, prices and payment account setup are missing. No order is submitted.


## Accounts and business enquiries

The website includes built-in email and password authentication powered by SQLite/D1. Customer registration, login, and enquiries are stored securely. Admin access is server-authorised for dmin@pulpoffe.com and configured via the ADMIN_EMAILS runtime secret.

### Demo Test Credentials
- **Customer Account:** `customer@pulpoffe.com` / `Password123!`
- **Admin Workspace:** `admin@pulpoffe.com` / `AdminPassword123!`

Customer and admin account pages, enquiry submission/history/status changes, and draft/published contact settings use the /api routes in worker/index.mjs. The nine backend tests cover authentication, access control, validation, customer isolation and contact-setting publication.

Build: node scripts/build-worker.mjs. Local QA: node scripts/local-preview.mjs --test-user binds 127.0.0.1 only with an explicit test identity. This option is not part of the production Worker. Test records remain in work/pulpoffe-preview, not the published archive.

Four supplied estate photos and the Illustrator logo’s original vector paths replace the previous boxed logo and generated estate image. Videos are not used. Contact details start unpublished with sample placeholders in admin. No email or WhatsApp notification is sent automatically; the admin inbox is the enquiry destination.

