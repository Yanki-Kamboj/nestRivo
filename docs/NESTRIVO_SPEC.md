# NESTRIVO — COMPLETE MERN STACK DEVELOPMENT MASTER PROMPT

## ROLE & OBJECTIVE

Act as a Senior Full-Stack Software Architect, Senior MERN Stack Developer, UI/UX Designer, Product Designer, Database Engineer, and QA Engineer.

Your task is to build a complete, professional, production-oriented accommodation booking platform named **NESTRIVO**.

Nestrivo is inspired by the functionality of Airbnb, Booking.com, and modern hospitality platforms, but it MUST have its own original branding, visual identity, layouts, interactions, and user experience.

This is not a basic CRUD project or a static frontend demo.

Build a fully functional MERN stack application with a real backend, MongoDB database, authentication, authorization, property management, booking workflows, payment integration architecture, host dashboard, guest dashboard, admin dashboard, and responsive frontend.

**Primary goal:** Deliver a complete, runnable, well-structured, visually impressive application.

Do not stop after creating a project plan, wireframes, or frontend mockups. Implement the actual application.

---

# 1. FIRST STEP — INSPECT THE EXISTING PROJECT

Before making any changes:

1. Inspect the complete existing repository.
2. Identify the current frontend and backend structure.
3. Read package.json and understand installed dependencies.
4. Inspect all existing models, routes, controllers, middleware, utilities, and configuration.
5. Identify existing working functionality.
6. Identify incomplete features, errors, and duplicated code.

IMPORTANT:

- Preserve existing working backend functionality.
- Do not unnecessarily delete or rename existing routes, controllers, models, or utility files.
- Reuse existing authentication and database logic wherever possible.
- Refactor only when required.
- Do not create duplicate implementations of existing functionality.
- Maintain compatibility with existing API endpoints wherever practical.
- If a feature already exists, improve it instead of rebuilding it unnecessarily.

If the repository is empty, establish the complete architecture described below.

Before implementation, create a concise implementation checklist and architecture plan, then proceed directly with development.

---

# 2. BRAND IDENTITY & DESIGN DIRECTION

## Brand Name
NESTRIVO

## Tagline
"Stay Somewhere Extraordinary."

## Brand Personality

- Premium
- Modern
- Trustworthy
- Welcoming
- Minimal
- Travel-oriented
- Sophisticated

## Visual Identity

Create an original visual design system.

Suggested colors:

- Primary: Deep Midnight Navy (#172B35)
- Secondary: Warm Ivory (#F8F6F1)
- Accent: Muted Terracotta (#C9795D)
- Supporting: Sage Green (#A6B5A0)
- Text: Charcoal (#252B2D)
- White: #FFFFFF

Typography:

- Use an elegant editorial serif font for major headings.
- Use a clean modern sans-serif font for navigation, forms, and body text.
- Suggested combinations: DM Serif Display + Manrope, or Playfair Display + Inter.

Design requirements:

- Large, beautiful property photography.
- Generous whitespace.
- Elegant rounded cards.
- Smooth transitions.
- Subtle shadows.
- Refined buttons.
- Consistent spacing.
- Premium icons.
- Beautiful empty states.
- Attractive loading skeletons.
- Micro-interactions.
- Responsive layouts.

DO NOT copy Airbnb's visual design.

Avoid:
- Airbnb-like pink branding.
- Identical navigation layouts.
- Generic Bootstrap dashboards.
- Boring white pages with basic cards.
- Excessive gradients.
- Unnecessary animations.

Create a unique Nestrivo visual language.

---

# 3. TECHNOLOGY STACK

## Frontend

- React.js
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Axios
- React Hook Form
- Zod
- TanStack Query
- React Hot Toast or Sonner
- Lucide React
- React Leaflet or an equivalent map integration

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- Cloudinary
- Cookie-parser
- Helmet
- CORS
- Express Rate Limit
- Nodemailer

## Payments

Design a payment architecture supporting Razorpay for Indian payments and Stripe as an optional international payment provider.

Use sandbox/test mode during development.

Never store card numbers, CVVs, or other sensitive payment credentials.

## Development Tools

- Git
- GitHub
- Postman
- MongoDB Atlas or local MongoDB
- ESLint
- Prettier

Use JavaScript throughout the project. Do not introduce TypeScript or Next.js.

Use compatible package versions and avoid unnecessary dependencies.

---

# 4. COMPLETE USER ROLES

Implement three roles.

## A. GUEST

Guests can:

- Register and log in.
- Browse properties.
- Search and filter properties.
- View property details.
- Save favorite properties.
- Book accommodations.
- Make payments.
- Cancel eligible reservations.
- Write reviews.
- View booking history.
- Manage their profile.
- Contact hosts.
- Receive notifications.

## B. HOST

Hosts can:

- Register as a host.
- Create property listings.
- Upload multiple images.
- Edit listings.
- Delete or deactivate listings.
- Manage availability.
- Set nightly prices.
- Set weekend prices.
- Set cleaning fees.
- Configure cancellation policies.
- View incoming bookings.
- Accept or reject booking requests when applicable.
- Manage reservations.
- View earnings.
- Access analytics.
- Respond to guest reviews.
- Communicate with guests.

## C. ADMIN

Create a separate admin dashboard.

Admin capabilities:

- View platform statistics.
- Manage users.
- Manage hosts.
- Approve or reject property listings.
- Suspend accounts.
- Remove inappropriate listings.
- View all reservations.
- Manage reported reviews.
- Monitor transactions.
- View platform revenue.
- Access analytics.
- Manage categories.
- View activity logs.

Never allow users to become admins simply by modifying frontend data.

Admin privileges must be verified by backend authorization middleware.

---

# 5. COMPLETE FRONTEND PAGES

Build the following pages.

## Public Pages

1. Home page
2. Explore stays page
3. Property details page
4. Search results page
5. Category pages
6. About Nestrivo
7. Contact page
8. Help center
9. FAQ
10. Login
11. Register
12. Forgot password
13. Reset password
14. Terms and conditions
15. Privacy policy

## Guest Dashboard

1. Overview
2. My trips
3. Upcoming reservations
4. Past reservations
5. Cancelled reservations
6. Wishlist
7. Messages
8. Notifications
9. Reviews
10. Personal information
11. Security settings
12. Payment history

## Host Dashboard

1. Host overview
2. My properties
3. Add new property
4. Edit property
5. Property availability calendar
6. Reservations
7. Guest details
8. Earnings
9. Analytics
10. Reviews
11. Messages
12. Host profile
13. Settings

## Admin Dashboard

1. Overview
2. Users
3. Hosts
4. Properties
5. Listing approval requests
6. Reservations
7. Transactions
8. Reviews and reports
9. Categories
10. Revenue analytics
11. Activity logs
12. Admin settings

Every page must have meaningful functionality.

Do not create empty dashboard pages simply to satisfy the page list.

---

# 6. HOMEPAGE — PREMIUM DESIGN

The homepage is the most important page.

Create a visually memorable landing experience.

## Hero Section

Design an editorial-style hero section featuring:

- Large destination photography.
- Bold heading: "Find Your Place in the World."
- Supporting text about discovering exceptional stays.
- Prominent search interface.
- Subtle motion effects.
- Strong call-to-action.

Search component should include:

- Destination.
- Check-in date.
- Check-out date.
- Number of guests.
- Number of rooms, if applicable.
- Search button.

Search must actually work with backend data.

## Explore Categories

Create attractive visual categories:

- Beachfront
- Mountain Escapes
- Luxury Villas
- Countryside
- City Apartments
- Cabins
- Heritage Homes
- Unique Stays
- Poolside
- Pet-Friendly

Selecting a category must filter properties.

## Featured Stays

Display beautiful property cards with:

- Large property images.
- Property name.
- Location.
- Rating.
- Price per night.
- Wishlist heart.
- Property category.
- Availability indicator.

## Additional Sections

- Popular destinations.
- Trending stays.
- Handpicked properties.
- Unique experiences.
- Become a host section.
- Why choose Nestrivo.
- Guest testimonials.
- Newsletter subscription.
- Premium footer.

Use realistic demo content and images.

Avoid repetitive placeholder content.

---

# 7. SEARCH & DISCOVERY ENGINE

Implement a proper property search system.

Search by:

- Destination.
- City.
- State.
- Country.
- Check-in.
- Check-out.
- Guests.
- Number of bedrooms.
- Number of bathrooms.
- Property type.

Advanced filters:

- Minimum and maximum price.
- Property category.
- Entire home or private room.
- Amenities.
- Guest rating.
- Instant booking.
- Free cancellation.
- Pet-friendly.
- Pool.
- Wi-Fi.
- Parking.
- Air conditioning.
- Kitchen.

Sorting:

- Recommended.
- Price: Low to High.
- Price: High to Low.
- Highest Rated.
- Most Reviewed.

Requirements:

- Backend filtering using MongoDB queries.
- Pagination.
- Query parameter persistence.
- Loading states.
- No-results state.
- Clear filters.
- Responsive filter drawer.
- Search results count.

Create a list/map toggle with property markers when map integration is configured.

---

# 8. PROPERTY DETAILS PAGE

Each property must have a premium detail page.

Include:

- Property name.
- Location.
- Image gallery.
- Image lightbox.
- Host profile.
- Host verification indicator.
- Overall rating.
- Review count.
- Description.
- Amenities.
- Property type.
- Bedrooms.
- Beds.
- Bathrooms.
- Maximum guests.
- Check-in and checkout information.
- House rules.
- Cancellation policy.
- Availability calendar.
- Guest reviews.
- Similar properties.

## Booking Widget

Create a sticky booking card on desktop and a suitable booking bar on mobile.

Display:

- Price per night.
- Selected dates.
- Guest count.
- Number of nights.
- Cleaning fee.
- Service fee.
- Taxes, where applicable.
- Total amount.

Prevent double bookings.

Calculate all booking totals on the backend.

Never trust prices submitted by the frontend.

---

# 9. AUTHENTICATION & SECURITY

Implement secure authentication.

Features:

- Email registration.
- Login.
- Logout.
- Password hashing using bcrypt.
- JWT authentication.
- Secure HTTP-only cookies.
- Protected routes.
- Role-based authorization.
- Forgot password.
- Password reset.
- Email verification.
- Change password.
- Profile management.

Security requirements:

- Validate all inputs on the backend.
- Prevent unauthorized access.
- Prevent privilege escalation.
- Use Helmet.
- Configure CORS correctly.
- Add rate limiting to sensitive routes.
- Sanitize user input.
- Protect against NoSQL injection.
- Do not expose secrets.
- Use environment variables.
- Never commit .env files.

---

# 10. HOST PROPERTY MANAGEMENT

Implement a complete property creation wizard.

## Step 1: Property Type

- Apartment
- House
- Villa
- Cabin
- Cottage
- Resort
- Guesthouse
- Other

## Step 2: Location

- Country
- State
- City
- Complete address
- Postal code
- Latitude and longitude, when available

## Step 3: Property Details

- Guests
- Bedrooms
- Beds
- Bathrooms
- Description
- Property title

## Step 4: Amenities

Allow hosts to select amenities using attractive selectable icons.

## Step 5: Upload Images

- Multiple image uploads.
- Image preview.
- Image deletion.
- Cover image selection.
- Drag-and-drop ordering.

## Step 6: Pricing

- Base nightly rate.
- Weekend pricing.
- Cleaning fee.
- Additional guest fee.
- Configurable service fee.

## Step 7: Policies

- Check-in time.
- Checkout time.
- House rules.
- Cancellation policy.
- Booking approval mode.

## Step 8: Publish

Show a listing preview before submission.

For development and testing, listings can be automatically approved. In production, require admin approval before public listing.

---

# 11. BOOKING & RESERVATION SYSTEM

This is a critical feature.

Implement a complete reservation lifecycle.

Booking statuses:

- Pending
- Confirmed
- Rejected
- Cancelled
- Completed

Features:

- Date selection.
- Availability verification.
- Guest selection.
- Price calculation.
- Reservation creation.
- Payment initiation.
- Payment verification.
- Booking confirmation.
- Cancellation.
- Refund tracking.
- Booking history.

IMPORTANT:

Use database-level safeguards and appropriate transaction handling to prevent two users from booking the same property for overlapping dates.

Availability must be checked again on the server immediately before confirming the booking.

Do not rely only on frontend calendar validation.

For concurrent booking attempts, ensure only a valid reservation can be confirmed.

Cancellation policy defaults:

- Full refund at least 48 hours before check-in.
- 50% refund 24–48 hours before check-in.
- No refund within 24 hours.

Make policies configurable per listing.

Handle payment failures, abandoned checkout sessions, duplicate payment callbacks, and booking expiration.

---

# 12. PAYMENT SYSTEM

Build a proper payment integration architecture.

Use Razorpay as the primary development payment provider.

Features:

- Create payment order on backend.
- Initiate checkout.
- Verify payment signature on backend.
- Update booking status only after verified payment.
- Maintain transaction records.
- Payment success page.
- Payment failure page.
- Refund tracking.

Use test credentials only.

Provide a clean fallback mock-payment mode for local development when payment credentials are not configured.

Mock payments must be clearly identified as test transactions and must never be represented as real payments.

---

# 13. WISHLIST & FAVORITES

Users should be able to:

- Add properties to wishlist.
- Remove favorites.
- View saved properties.
- Persist wishlist in MongoDB.
- Toggle favorite state without refreshing.
- Access favorites from their dashboard.

---

# 14. REVIEWS & RATINGS

Implement a complete review system.

Features:

- Only eligible guests can review completed stays.
- Star ratings from 1–5.
- Written reviews.
- Review dates.
- Guest profile information.
- Host responses.
- Review reporting.
- Admin moderation.

Calculate average ratings on the backend.

Prevent duplicate reviews for the same eligible reservation.

---

# 15. MESSAGING & NOTIFICATIONS

Build a communication system.

Messaging:

- Guest-to-host conversations.
- Conversation list.
- Message history.
- Read/unread indicators.
- Message timestamps.
- Real-time communication using Socket.IO where practical.

Notifications:

- Booking request received.
- Booking confirmed.
- Booking cancelled.
- Payment successful.
- New message.
- New review.
- Listing approved or rejected.

Use in-app notifications and optional email notifications.

---

# 16. HOST ANALYTICS & EARNINGS

Build an attractive analytics dashboard.

Show:

- Total bookings.
- Upcoming reservations.
- Completed stays.
- Gross booking value.
- Host earnings.
- Average nightly price.
- Occupancy rate.
- Property performance.

Include charts for:

- Monthly revenue.
- Booking trends.
- Occupancy.
- Property performance.

Use real database data rather than hardcoded chart values.

Calculate the platform fee using a configurable setting.

Default platform fee: 5%, configurable and disabled or set to 0% in development testing.

Do not treat test payments as actual earnings.

---

# 17. ADMIN ANALYTICS

Build a premium admin dashboard.

Overview cards:

- Total users.
- Active hosts.
- Total properties.
- Pending approvals.
- Total bookings.
- Platform revenue.

Charts:

- Monthly bookings.
- Monthly revenue.
- User registrations.
- Property category distribution.

Tables:

- Recent users.
- Recent bookings.
- Pending property approvals.
- Reported content.

Provide search, filters, sorting, pagination, and appropriate admin actions.

---

# 18. DATABASE DESIGN

Use MongoDB with Mongoose.

Create properly structured schemas.

Required models:

1. User
2. Property
3. Booking
4. Review
5. Wishlist
6. Conversation
7. Message
8. Notification
9. Transaction
10. Category
11. PlatformSettings
12. ActivityLog

Important schema fields:

### User

- name
- email
- password
- phone
- avatar
- role
- isVerified
- isSuspended
- hostProfile
- createdAt

### Property

- title
- description
- host
- location
- coordinates
- propertyType
- category
- images
- amenities
- bedrooms
- beds
- bathrooms
- maxGuests
- pricePerNight
- weekendPrice
- cleaningFee
- additionalGuestFee
- cancellationPolicy
- approvalStatus
- isActive
- averageRating
- reviewCount

### Booking

- guest
- host
- property
- checkIn
- checkOut
- guests
- nights
- pricingBreakdown
- totalAmount
- paymentStatus
- bookingStatus
- cancellationDetails

### Review

- guest
- property
- booking
- rating
- comment
- hostResponse

Create proper references, indexes, validation, timestamps, and database constraints where applicable.

Use atomic operations or transactions where needed.

---

# 19. BACKEND ARCHITECTURE

Use a clean MVC architecture.

Suggested structure:

server/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  validators/
  jobs/
  uploads/
  app.js
  server.js

Create:

- Centralized error handler.
- Authentication middleware.
- Admin middleware.
- Host authorization middleware.
- Validation middleware.
- Upload middleware.
- Payment service.
- Email service.
- Booking service.

Use consistent API response structures.

Example:

{
  "success": true,
  "message": "Property created successfully",
  "data": {}
}

Implement appropriate HTTP status codes.

Avoid putting business logic directly inside route files.

---

# 20. FRONTEND ARCHITECTURE

Suggested structure:

client/
  src/
    assets/
    components/
      common/
      layout/
      property/
      booking/
      forms/
      dashboard/
    pages/
      public/
      auth/
      guest/
      host/
      admin/
    context/
    hooks/
    services/
    utils/
    layouts/
    routes/
    App.jsx
    main.jsx

Requirements:

- Reusable components.
- Shared layouts.
- Protected routes.
- Role-based navigation.
- Centralized API client.
- Proper authentication state.
- Form validation.
- Error boundaries.
- Responsive design.
- Reusable loading and empty states.

Avoid massive single-file components.

---

# 21. RESPONSIVE DESIGN & ANIMATIONS

The entire application must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Implement:

- Responsive navigation.
- Mobile menu.
- Responsive property grids.
- Mobile booking interface.
- Responsive dashboards.
- Responsive tables.
- Responsive modals.

Use Framer Motion for meaningful transitions:

- Page transitions.
- Property card hover effects.
- Hero entrance animation.
- Modal transitions.
- Image gallery transitions.
- Dashboard interactions.

Keep animations smooth and lightweight.

Respect reduced-motion preferences.

Do not sacrifice usability for animation.

---

# 22. SAMPLE DATA & DEMO EXPERIENCE

Create a seed script.

Add realistic sample properties from different locations, including:

- Jaipur
- Udaipur
- Manali
- Goa
- Rishikesh
- Shimla
- Mumbai
- Delhi

Include:

- Different property categories.
- Different price ranges.
- Multiple hosts.
- Sample reviews.
- Different booking statuses.

Create documented development test accounts for:

- Guest.
- Host.
- Admin.

Never hardcode demo credentials into production.

Use environment-controlled seed scripts and secure demo password handling.

Use high-quality property images from properly licensed image sources or configured Cloudinary assets.

Provide graceful fallbacks when images fail to load.

---

# 23. ENVIRONMENT VARIABLES

Create `.env.example` files for both frontend and backend.

Backend examples:

PORT=
NODE_ENV=
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

Frontend examples:

VITE_API_URL=
VITE_RAZORPAY_KEY_ID=
VITE_MAP_API_KEY=

Never place private secrets in frontend variables.

Document which integrations are optional and which are required.

---

# 24. TESTING & QUALITY ASSURANCE

Test the entire application.

Backend tests:

- Authentication.
- Authorization.
- Property creation.
- Property editing.
- Search and filters.
- Booking creation.
- Overlapping booking prevention.
- Payment verification.
- Cancellation.
- Reviews.
- Admin permissions.

Frontend tests:

- Navigation.
- Forms.
- Login and logout.
- Search.
- Property details.
- Booking workflow.
- Dashboard functionality.
- Responsive layouts.

Use appropriate testing tools such as Vitest, React Testing Library, and Supertest.

Run:

- Dependency checks.
- Linting.
- Production build.
- Backend tests.
- Frontend tests.

Fix actual errors before declaring completion.

---

# 25. DEPLOYMENT READINESS

Prepare the application for deployment.

Include:

- Frontend deployment configuration.
- Backend deployment configuration.
- MongoDB Atlas connection instructions.
- Cloudinary setup instructions.
- Payment gateway setup instructions.
- CORS configuration.
- Production environment variables.
- Health-check endpoint.
- Logging.
- Error handling.

Create a complete README.md with:

1. Project overview.
2. Technology stack.
3. Screenshots section.
4. Folder structure.
5. Installation instructions.
6. Environment setup.
7. Database setup.
8. Seed instructions.
9. Run commands.
10. API overview.
11. Test instructions.
12. Deployment instructions.
13. Demo account instructions.

---

# 26. IMPORTANT DEVELOPMENT RULES

Follow these rules throughout implementation:

1. Do not generate only a UI prototype.
2. Do not leave core functionality as TODO comments.
3. Do not use fake backend API responses.
4. Do not hardcode booking data in the frontend.
5. Do not trust frontend prices or role information.
6. Do not expose private API credentials.
7. Do not create duplicate database models.
8. Do not break existing working features.
9. Do not leave broken links or buttons.
10. Do not ignore responsive layouts.
11. Do not skip loading, success, and error states.
12. Do not use insecure authentication practices.
13. Do not silently swallow API errors.
14. Do not claim a payment integration works without testing it.
15. Do not mark incomplete features as completed.

If a third-party integration requires credentials, implement the integration architecture, document setup, and provide a clearly labelled development fallback.

---

# 27. EXECUTION STRATEGY

Implement the project in the following phases.

### Phase 1 — Repository Analysis

Inspect existing files, identify existing functionality, and prepare the implementation plan.

### Phase 2 — Foundation

Set up frontend and backend architecture, database connection, configuration, and reusable components.

### Phase 3 — Authentication

Implement registration, login, logout, secure sessions, role-based access, and user profiles.

### Phase 4 — Property Management

Implement property creation, editing, deletion, uploads, categories, and listing approvals.

### Phase 5 — Search & Discovery

Implement search, advanced filtering, sorting, pagination, and property details.

### Phase 6 — Booking Engine

Implement availability, reservation management, price calculations, booking confirmation, and cancellation.

### Phase 7 — Payments

Implement payment gateway integration, payment verification, transactions, and refunds architecture.

### Phase 8 — Guest & Host Dashboards

Implement all dashboard functionality.

### Phase 9 — Admin Panel

Implement user management, listing moderation, transactions, analytics, and reports.

### Phase 10 — Communication

Implement messaging, notifications, and email integration.

### Phase 11 — UI Polish

Complete responsive design, animations, transitions, accessibility, and premium visual styling.

### Phase 12 — Testing & Deployment

Run tests, fix errors, create documentation, and verify production builds.

---

# 28. FINAL ACCEPTANCE CRITERIA

The project is considered complete only when:

- Frontend runs successfully.
- Backend runs successfully.
- MongoDB connects successfully.
- Registration and login work.
- Role-based permissions work.
- Hosts can create and manage listings.
- Guests can search and filter properties.
- Property detail pages display actual database information.
- Guests can create reservations.
- Overlapping bookings are prevented.
- Payment flow works in test mode or documented mock mode.
- Wishlist works.
- Reviews work.
- Host dashboard works.
- Guest dashboard works.
- Admin dashboard works.
- Notifications work.
- Responsive layouts work.
- No major broken buttons or navigation links remain.
- Production builds succeed.
- README and environment documentation are complete.

At the end, provide a final implementation report containing:

1. Features implemented.
2. Features requiring external credentials.
3. Database models created.
4. API endpoints created.
5. Project folder structure.
6. Test results.
7. Build results.
8. Exact installation commands.
9. Exact commands to start frontend and backend.
10. Known limitations, if any.

**MOST IMPORTANT FINAL INSTRUCTION:**

Think like a real startup engineering team building a commercial accommodation booking platform.

Prioritize functionality, security, maintainability, performance, and exceptional design.

Build NESTRIVO as an original product with a premium identity.

Do not stop at planning. Inspect, implement, test, fix, and document the complete project.