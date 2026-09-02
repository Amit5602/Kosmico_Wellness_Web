# Kosmiko Wellness - Information Architecture

## 1. Public Website Structure

- `/` - Home Page
- `/shop` - Product Listing Page (PLP)
- `/product/:slug` - Product Detail Page (PDP)
- `/about` - About the Brand
- `/ingredients` - Detailed Ingredient Breakdown
- `/benefits` - Health Benefits of Monk Fruit
- `/how-it-works` - Usage Instructions
- `/comparison` - Kosmiko Wellness vs. Sugar vs. Other Substitutes
- `/reviews` - Global Customer Reviews
- `/faq` - Frequently Asked Questions
- `/contact` - Customer Support / Contact Form
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/refunds` - Refund & Return Policy

## 2. Customer Portal (Requires Auth)

- `/login` - Login Page
- `/register` - Registration Page
- `/forgot-password` - Password Recovery
- `/reset-password/:token` - Password Reset
- `/account` - Dashboard Overview
- `/account/profile` - Personal Information Management
- `/account/addresses` - Address Book (CRUD)
- `/account/orders` - Order History
- `/account/orders/:id` - Detailed Order View / Tracking
- `/account/wishlist` - Saved Products (Wishlist)

## 3. Shopping Flow

- `/cart` - Full Cart Page (in addition to Cart Drawer)
- `/checkout` - Multi-step Checkout Process
- `/checkout/success/:orderId` - Order Confirmation Page

## 4. Admin Portal (Requires Admin Auth)

- `/admin/login` - Secure Admin Login
- `/admin` - Dashboard (Metrics & Overview)
- `/admin/products` - Product Management
- `/admin/categories` - Category Management
- `/admin/orders` - Order Fulfillment & Tracking
- `/admin/customers` - Customer Directory
- `/admin/reviews` - Review Moderation
- `/admin/coupons` - Discount & Promo Code Management
- `/admin/inventory` - Stock Monitoring & Alerts
- `/admin/payments` - Transaction Logs
- `/admin/settings` - Global Store Settings
