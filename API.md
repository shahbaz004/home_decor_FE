# Backend API Contract

This document describes the API endpoints and data structures that the frontend expects from the backend. The backend should be a Django REST API running on **http://localhost:5000** by default.

## Base Configuration

- **Base URL:** `http://localhost:5000/api/v1`
- **Authentication:** JWT Bearer tokens
- **Content-Type:** `application/json`

## Authentication Flow

The frontend uses JWT authentication with access and refresh tokens:

1. Login/register returns `access` and `refresh` tokens
2. Access token is sent in `Authorization: Bearer <token>` header
3. On 401 response, frontend automatically attempts token refresh
4. If refresh fails, user is logged out

---

## API Endpoints

### 🔐 Authentication

#### POST `/v1/auth/register/`
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890" // optional
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "is_staff": false
  },
  "access": "eyJ0eXAiOiJKV1QiLCJh...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

#### POST `/v1/auth/login/`
Login an existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_staff": false
  },
  "access": "eyJ0eXAiOiJKV1QiLCJh...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

#### POST `/v1/auth/logout/`
Logout user (blacklist refresh token).

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

**Response (200):**
```json
{
  "detail": "Successfully logged out"
}
```

#### POST `/v1/auth/google/`
Google OAuth login/register.

**Request:**
```json
{
  "credential": "google_oauth_credential_token"
}
```

**Response (200):**
```json
{
  "user": { /* user object */ },
  "access": "jwt_token",
  "refresh": "refresh_token"
}
```

#### POST `/v1/auth/token/refresh/`
Refresh access token.

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

**Response (200):**
```json
{
  "access": "new_access_token"
}
```

#### GET `/v1/auth/profile/`
Get current user profile (requires authentication).

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "is_staff": false,
  "created_at": "2026-01-15T10:30:00Z"
}
```

#### PATCH `/v1/auth/profile/`
Update user profile (requires authentication).

**Request:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+0987654321"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+0987654321",
  "is_staff": false
}
```

#### POST `/v1/auth/change-password/`
Change user password (requires authentication).

**Request:**
```json
{
  "old_password": "oldpass123",
  "new_password": "newpass456"
}
```

**Response (200):**
```json
{
  "detail": "Password changed successfully"
}
```

#### POST `/v1/auth/forgot-password/`
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "detail": "Password reset email sent"
}
```

#### POST `/v1/auth/reset-password/`
Reset password with token.

**Request:**
```json
{
  "token": "reset_token_from_email",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "detail": "Password reset successfully"
}
```

---

### 🛍️ Products

#### GET `/v1/products/`
List products with pagination and filters.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 12)
- `category` (string): Filter by category slug
- `search` (string): Search in name/description
- `min_price` (float): Minimum price filter
- `max_price` (float): Maximum price filter
- `colors` (string): Comma-separated color filters
- `rating` (float): Minimum rating filter
- `ordering` (string): Sort field (e.g., `-created_at`, `price`, `-price`)
- `is_featured` (boolean): Filter featured products

**Response (200):**
```json
{
  "count": 150,
  "next": "http://localhost:5000/api/v1/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Artisan Ceramic Vase",
      "slug": "artisan-ceramic-vase",
      "description": "Handcrafted ceramic vase with unique glaze patterns",
      "base_price": 2499.99,
      "sale_price": 1999.99,
      "discount_percentage": 20,
      "stock": 15,
      "is_featured": true,
      "category": {
        "id": 5,
        "name": "Vases & Planters",
        "slug": "vases-planters"
      },
      "category_name": "Vases & Planters",
      "images": [
        {
          "id": 1,
          "image": "https://example.com/media/products/vase-1.jpg",
          "url": "https://example.com/media/products/vase-1.jpg",
          "alt_text": "Front view",
          "is_primary": true
        }
      ],
      "primary_image": {
        "image": "https://example.com/media/products/vase-1.jpg",
        "url": "https://example.com/media/products/vase-1.jpg"
      },
      "average_rating": 4.5,
      "review_count": 23,
      "is_wishlisted": false,
      "created_at": "2026-01-10T08:00:00Z"
    }
  ]
}
```

#### GET `/v1/products/{slug}/`
Get single product details.

**Response (200):**
```json
{
  "id": 1,
  "name": "Artisan Ceramic Vase",
  "slug": "artisan-ceramic-vase",
  "description": "Detailed product description...",
  "base_price": 2499.99,
  "sale_price": 1999.99,
  "discount_percentage": 20,
  "stock": 15,
  "is_featured": true,
  "category": {
    "id": 5,
    "name": "Vases & Planters",
    "slug": "vases-planters"
  },
  "images": [
    {
      "id": 1,
      "image": "https://example.com/media/products/vase-1.jpg",
      "is_primary": true,
      "alt_text": "Front view"
    },
    {
      "id": 2,
      "image": "https://example.com/media/products/vase-2.jpg",
      "is_primary": false,
      "alt_text": "Side view"
    }
  ],
  "variants": [
    {
      "id": 1,
      "name": "Small",
      "sku": "VAC-SM-001",
      "price": 1999.99,
      "stock": 10
    }
  ],
  "average_rating": 4.5,
  "review_count": 23,
  "is_wishlisted": false,
  "related_products": [
    { /* simplified product objects */ }
  ]
}
```

#### GET `/v1/products/featured/`
Get featured products.

**Response (200):**
```json
{
  "results": [
    { /* product objects */ }
  ]
}
```

#### GET `/v1/products/categories/`
List all product categories.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Wall Art",
    "slug": "wall-art",
    "description": "Decorative wall hangings and paintings",
    "image": "https://example.com/media/categories/wall-art.jpg",
    "product_count": 45
  },
  {
    "id": 2,
    "name": "Furniture",
    "slug": "furniture",
    "description": "Artisan furniture pieces",
    "image": "https://example.com/media/categories/furniture.jpg",
    "product_count": 32
  }
]
```

#### GET `/v1/products/categories/{slug}/`
Get single category with products.

**Response (200):**
```json
{
  "id": 1,
  "name": "Wall Art",
  "slug": "wall-art",
  "description": "Decorative wall hangings and paintings",
  "image": "https://example.com/media/categories/wall-art.jpg",
  "products": [
    { /* product objects */ }
  ]
}
```

---

### 🛒 Shopping Cart

#### GET `/v1/cart/`
Get current user's cart (requires authentication).

**Response (200):**
```json
{
  "id": 1,
  "user": 1,
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Artisan Ceramic Vase",
        "slug": "artisan-ceramic-vase",
        "base_price": 2499.99,
        "sale_price": 1999.99,
        "primary_image": {
          "image": "https://example.com/media/products/vase-1.jpg"
        },
        "stock": 15
      },
      "variant": null,
      "quantity": 2,
      "price": 1999.99,
      "subtotal": 3999.98
    }
  ],
  "total": 3999.98,
  "item_count": 2,
  "coupon": null,
  "discount": 0,
  "shipping_cost": 0,
  "grand_total": 3999.98,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-20T10:15:00Z"
}
```

#### POST `/v1/cart/items/`
Add item to cart (requires authentication).

**Request:**
```json
{
  "product": 1,
  "variant": 1,  // optional
  "quantity": 2
}
```

**Response (201):**
```json
{
  "id": 1,
  "product": { /* product object */ },
  "variant": null,
  "quantity": 2,
  "price": 1999.99,
  "subtotal": 3999.98
}
```

#### PATCH `/v1/cart/items/{itemId}/`
Update cart item quantity (requires authentication).

**Request:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "id": 1,
  "quantity": 3,
  "subtotal": 5999.97
}
```

#### DELETE `/v1/cart/items/{itemId}/`
Remove item from cart (requires authentication).

**Response (204):** No content

#### POST `/v1/cart/merge/`
Merge guest cart with user cart after login (requires authentication).

**Request:**
```json
{
  "items": [
    {
      "product": 1,
      "quantity": 2
    }
  ]
}
```

**Response (200):**
```json
{
  /* updated cart object */
}
```

---

### ❤️ Wishlist

#### GET `/v1/wishlist/`
Get user's wishlist (requires authentication).

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Artisan Ceramic Vase",
        "slug": "artisan-ceramic-vase",
        "base_price": 2499.99,
        "sale_price": 1999.99,
        "primary_image": { "image": "url" },
        "stock": 15
      },
      "added_at": "2026-01-15T12:00:00Z"
    }
  ]
}
```

#### POST `/v1/wishlist/`
Add product to wishlist (requires authentication).

**Request:**
```json
{
  "product": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "product": { /* product object */ },
  "added_at": "2026-01-20T10:00:00Z"
}
```

#### DELETE `/v1/wishlist/{productId}/`
Remove product from wishlist (requires authentication).

**Response (204):** No content

---

### 📦 Orders

#### POST `/v1/orders/`
Create a new order (requires authentication).

**Request:**
```json
{
  "address": {
    "name": "John Doe",
    "phone": "+1234567890",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA"
  },
  "payment_method": "razorpay",
  "coupon_code": "SAVE20"
}
```

**Response (201):**
```json
{
  "id": 1,
  "order_number": "ORD-20260120-001",
  "user": 1,
  "items": [
    {
      "id": 1,
      "product": { /* product object */ },
      "quantity": 2,
      "price": 1999.99,
      "subtotal": 3999.98
    }
  ],
  "address": {
    "name": "John Doe",
    "address_line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001"
  },
  "status": "pending",
  "payment_method": "razorpay",
  "payment_status": "pending",
  "subtotal": 3999.98,
  "discount": 799.99,
  "shipping_cost": 0,
  "total": 3200.00,
  "created_at": "2026-01-20T10:30:00Z"
}
```

#### GET `/v1/orders/`
List user's orders (requires authentication).

**Query Parameters:**
- `page` (int): Page number
- `status` (string): Filter by status

**Response (200):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "order_number": "ORD-20260120-001",
      "status": "delivered",
      "payment_status": "completed",
      "total": 3200.00,
      "items_count": 2,
      "created_at": "2026-01-20T10:30:00Z"
    }
  ]
}
```

#### GET `/v1/orders/{id}/`
Get single order details (requires authentication).

**Response (200):**
```json
{
  "id": 1,
  "order_number": "ORD-20260120-001",
  "user": { /* user object */ },
  "items": [
    {
      "id": 1,
      "product": { /* product details */ },
      "quantity": 2,
      "price": 1999.99,
      "subtotal": 3999.98
    }
  ],
  "address": {
    "name": "John Doe",
    "phone": "+1234567890",
    "address_line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA"
  },
  "status": "delivered",
  "payment_method": "razorpay",
  "payment_status": "completed",
  "subtotal": 3999.98,
  "discount": 799.99,
  "shipping_cost": 0,
  "total": 3200.00,
  "tracking_number": "TRK123456789",
  "created_at": "2026-01-20T10:30:00Z",
  "updated_at": "2026-01-22T14:00:00Z",
  "delivered_at": "2026-01-22T14:00:00Z"
}
```

#### POST `/v1/orders/{id}/cancel/`
Cancel an order (requires authentication).

**Response (200):**
```json
{
  "detail": "Order cancelled successfully",
  "order": { /* updated order object */ }
}
```

---

### 💳 Payments

#### POST `/v1/payments/razorpay/create/`
Create Razorpay payment order (requires authentication).

**Request:**
```json
{
  "order_id": 1,
  "amount": 3200.00
}
```

**Response (200):**
```json
{
  "razorpay_order_id": "order_Abc123xyz456",
  "amount": 320000,
  "currency": "INR",
  "key": "rzp_live_xxxxx"
}
```

#### POST `/v1/payments/razorpay/verify/`
Verify Razorpay payment (requires authentication).

**Request:**
```json
{
  "order_id": 1,
  "razorpay_order_id": "order_Abc123xyz456",
  "razorpay_payment_id": "pay_Xyz789abc012",
  "razorpay_signature": "signature_hash"
}
```

**Response (200):**
```json
{
  "detail": "Payment verified successfully",
  "order": { /* updated order object */ }
}
```

#### POST `/v1/payments/stripe/create-intent/`
Create Stripe payment intent (requires authentication).

**Request:**
```json
{
  "order_id": 1
}
```

**Response (200):**
```json
{
  "client_secret": "pi_xxx_secret_yyy",
  "publishable_key": "pk_test_xxxxx"
}
```

---

### 🎟️ Coupons

#### POST `/v1/coupons/validate/`
Validate a coupon code (requires authentication).

**Request:**
```json
{
  "code": "SAVE20",
  "cart_total": 3999.98
}
```

**Response (200):**
```json
{
  "valid": true,
  "code": "SAVE20",
  "discount_type": "percentage",
  "discount_value": 20,
  "discount_amount": 799.99,
  "minimum_purchase": 1000.00,
  "maximum_discount": 1000.00
}
```

**Response (400) - Invalid:**
```json
{
  "valid": false,
  "message": "Coupon has expired"
}
```

---

### ⭐ Reviews

#### GET `/v1/reviews/`
Get product reviews.

**Query Parameters:**
- `product_id` (int): Filter by product ID
- `page` (int): Page number
- `rating` (int): Filter by rating (1-5)

**Response (200):**
```json
{
  "count": 23,
  "results": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "D."
      },
      "product": 1,
      "rating": 5,
      "title": "Absolutely beautiful!",
      "comment": "This vase exceeded my expectations. The craftsmanship is exceptional.",
      "verified_purchase": true,
      "status": "approved",
      "created_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

#### POST `/v1/reviews/`
Create a product review (requires authentication).

**Request:**
```json
{
  "product": 1,
  "rating": 5,
  "title": "Absolutely beautiful!",
  "comment": "This vase exceeded my expectations."
}
```

**Response (201):**
```json
{
  "id": 1,
  "user": { /* user object */ },
  "product": 1,
  "rating": 5,
  "title": "Absolutely beautiful!",
  "comment": "This vase exceeded my expectations.",
  "status": "pending",
  "created_at": "2026-01-20T10:00:00Z"
}
```

---

### 📍 Addresses

#### GET `/v1/addresses/`
List user's saved addresses (requires authentication).

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "phone": "+1234567890",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA",
    "is_default": true,
    "created_at": "2026-01-10T08:00:00Z"
  }
]
```

#### POST `/v1/addresses/`
Create a new address (requires authentication).

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "is_default": false
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "John Doe",
  "phone": "+1234567890",
  "address_line1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "is_default": false
}
```

#### PUT `/v1/addresses/{id}/`
Update an address (requires authentication).

**Request:** Same as POST

**Response (200):** Updated address object

#### DELETE `/v1/addresses/{id}/`
Delete an address (requires authentication).

**Response (204):** No content

---

### 📊 Admin Analytics

**Note:** All admin endpoints require staff/admin authentication (`is_staff: true`).

#### GET `/v1/analytics/dashboard/`
Get admin dashboard statistics (requires admin).

**Response (200):**
```json
{
  "total_revenue": 125000.50,
  "total_orders": 450,
  "total_customers": 320,
  "total_products": 150,
  "revenue_growth": 15.5,
  "orders_growth": 12.3,
  "customers_growth": 8.7,
  "recent_orders": [
    { /* order objects */ }
  ],
  "top_products": [
    { /* product objects with sales data */ }
  ]
}
```

#### GET `/v1/analytics/sales-chart/`
Get sales chart data (requires admin).

**Query Parameters:**
- `period` (string): "day", "week", "month", "year"
- `start_date` (date): Start date
- `end_date` (date): End date

**Response (200):**
```json
{
  "labels": ["2026-01-01", "2026-01-02", "2026-01-03"],
  "data": [1200.50, 1550.75, 1800.25]
}
```

#### GET `/v1/analytics/top-products/`
Get top-selling products (requires admin).

**Query Parameters:**
- `limit` (int): Number of products (default: 10)
- `period` (string): "week", "month", "year", "all"

**Response (200):**
```json
[
  {
    "product": { /* product object */ },
    "total_sold": 45,
    "total_revenue": 8999.55
  }
]
```

---

### 🔧 Admin Management

#### GET `/v1/auth/customers/`
List all customers (requires admin).

**Query Parameters:**
- `page` (int): Page number
- `search` (string): Search by name/email

**Response (200):**
```json
{
  "count": 320,
  "results": [
    {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "total_orders": 5,
      "total_spent": 12500.00,
      "date_joined": "2026-01-01T10:00:00Z"
    }
  ]
}
```

#### GET `/v1/products/` (Admin view)
Admin products list with additional fields (requires admin).

#### POST `/v1/products/`
Create a new product (requires admin).

**Request:**
```json
{
  "name": "New Ceramic Vase",
  "slug": "new-ceramic-vase",
  "description": "Beautiful handcrafted vase",
  "base_price": 2499.99,
  "sale_price": 1999.99,
  "stock": 20,
  "category": 5,
  "is_featured": false,
  "images": [
    {
      "image": "base64_or_url",
      "is_primary": true
    }
  ]
}
```

**Response (201):** Product object

#### PUT `/v1/products/{id}/`
Update a product (requires admin).

**Request:** Same as POST

**Response (200):** Updated product object

#### DELETE `/v1/products/{id}/`
Delete a product (requires admin).

**Response (204):** No content

#### PATCH `/v1/orders/{id}/update_status/`
Update order status (requires admin).

**Request:**
```json
{
  "status": "shipped",
  "tracking_number": "TRK123456789"
}
```

**Response (200):**
```json
{
  "id": 1,
  "status": "shipped",
  "tracking_number": "TRK123456789"
}
```

#### GET `/v1/coupons/admin/`
List all coupons (requires admin).

**Response (200):**
```json
{
  "results": [
    {
      "id": 1,
      "code": "SAVE20",
      "discount_type": "percentage",
      "discount_value": 20,
      "minimum_purchase": 1000.00,
      "maximum_discount": 1000.00,
      "valid_from": "2026-01-01T00:00:00Z",
      "valid_to": "2026-12-31T23:59:59Z",
      "usage_limit": 100,
      "used_count": 45,
      "is_active": true
    }
  ]
}
```

#### POST `/v1/coupons/admin/`
Create a coupon (requires admin).

**Request:**
```json
{
  "code": "NEWYEAR2026",
  "discount_type": "percentage",
  "discount_value": 25,
  "minimum_purchase": 2000.00,
  "maximum_discount": 1500.00,
  "valid_from": "2026-01-01T00:00:00Z",
  "valid_to": "2026-01-31T23:59:59Z",
  "usage_limit": 500,
  "is_active": true
}
```

**Response (201):** Coupon object

#### PUT `/v1/coupons/admin/{id}/`
Update a coupon (requires admin).

#### DELETE `/v1/coupons/admin/{id}/`
Delete a coupon (requires admin).

#### POST `/v1/reviews/{id}/approve/`
Approve a review (requires admin).

**Response (200):**
```json
{
  "id": 1,
  "status": "approved"
}
```

#### POST `/v1/reviews/{id}/reject/`
Reject a review (requires admin).

**Response (200):**
```json
{
  "id": 1,
  "status": "rejected"
}
```

---

## Common Data Models

### Order Status Values
- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed
- `processing` - Order is being prepared
- `shipped` - Order has been shipped
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled
- `refunded` - Order refunded

### Payment Status Values
- `pending` - Payment pending
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

### Review Status Values
- `pending` - Awaiting moderation
- `approved` - Approved and visible
- `rejected` - Rejected by admin

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request data",
  "errors": {
    "email": ["This field is required"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "An error occurred processing your request."
}
```

---

## Notes

1. **Pagination:** All list endpoints use cursor or offset pagination
2. **Authentication:** JWT tokens expire after a configured time (typically 24 hours for access, 7 days for refresh)
3. **File Uploads:** Product images should support multipart/form-data or base64 encoding
4. **Webhooks:** Consider implementing webhooks for payment gateway callbacks (Razorpay, Stripe)
5. **CORS:** Backend must allow CORS for `http://localhost:3000` in development
6. **Timestamps:** All timestamps are in ISO 8601 format (UTC)
7. **Currency:** All prices are in the smallest currency unit (paise/cents) on some endpoints, rupees/dollars on others - frontend uses decimal values
