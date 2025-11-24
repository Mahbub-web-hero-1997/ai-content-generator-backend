# AI Content Generator SaaS – Backend

This repository contains the **backend** of the AI Content Generator SaaS, built with **Node.js, Express.js, MongoDB (Mongoose)**.  
It provides APIs for user authentication, AI content generation, template management, subscription, payment, and generation history tracking.

---

## 🔹 **Tech Stack**

- **Node.js** – Runtime
- **Express.js** – Backend framework
- **MongoDB** + **Mongoose** – Database
- **JWT** – Access & Refresh token authentication
- **Bcrypt** – Password hashing
- **Cloudinary** – User avatar uploads
- **Multer** – File uploads
- **Stripe** – Subscription & payment system
- **OpenAI API** – AI content generation
- **Middleware** – Role-based access control, API error handling, rate limiting

---

## 🔹 **Project Structure**

```
backend/
│
├─ controllers/           # All API controllers
├─ middlewares/           # Auth, error handling, rate limiting
├─ models/                # MongoDB models
├─ routes/                # API routes
├─ utils/                 # API response, error handling
├─ db/                # DB & environment config
├─ app.js                 # Express app entry
└─ index.js              # Server startup
```

---

## 🔹 **Database Models**

### 1️⃣ User

- `name` – string
- `email` – string, unique
- `password` – hashed string
- `avatar` – string (Cloudinary URL)
- `role` – enum ["user", "admin"]
- `credits` – number
- `subscriptionPlan` – string
- `subscriptionExpiry` – Date
- `timestamps` – createdAt, updatedAt

### 2️⃣ Template

- `title`, `slug`, `description`
- `category` – blog, marketing, social media, etc.
- `inputFields` – array of fields {name, type, placeholder, required}
- `aiPrompt` – string
- `exampleOutput` – string
- `createdBy` – ObjectId (User)
- `timestamps`

### 3️⃣ GenerationHistory

- `user` – ObjectId
- `template` – ObjectId
- `inputData` – Object
- `generatedOutput` – String
- `tokensUsed` – Number
- `creditsUsed` – Number
- `timestamps`

### 4️⃣ SubscriptionPlan

- `name`, `price`, `credits`
- `features` – array

### 5️⃣ Payment

- `user` – ObjectId
- `amount` – number
- `stripeId` – string
- `status` – string

---

## 🔹 **API Endpoints**

### **Auth**

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| POST   | `/api/auth/register`      | Register user     |
| POST   | `/api/auth/login`         | Login user        |
| POST   | `/api/auth/logout`        | Logout            |
| POST   | `/api/auth/refresh-token` | Refresh JWT token |

### **User**

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/api/users/profile` | Get user profile                   |
| PATCH  | `/api/users/update`  | Update profile / password / avatar |

### **Template**

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| GET    | `/api/templates`       | Get all templates       |
| GET    | `/api/templates/:slug` | Get template by slug    |
| POST   | `/api/templates`       | Create template (admin) |
| PATCH  | `/api/templates/:id`   | Update template (admin) |
| DELETE | `/api/templates/:id`   | Delete template (admin) |

### **Generation History**

| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/api/generation-history`     | Create new generation history   |
| GET    | `/api/generation-history`     | Get all history (user-specific) |
| GET    | `/api/generation-history/:id` | Get single history record       |
| PATCH  | `/api/generation-history/:id` | Update history (optional/admin) |
| DELETE | `/api/generation-history/:id` | Delete history record           |

### **Subscription / Payment**

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | `/api/plans`     | Get subscription plans |
| POST   | `/api/subscribe` | Subscribe user to plan |

### **Admin Analytics**

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/admin/users`     | Get all users        |
| GET    | `/api/admin/analytics` | Get system analytics |

---

## 🔹 **Setup Instructions**

1. **Clone the repository**

```bash
git clone <repo-url>
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai_content_saas
ACCESS_TOKEN_SECRET=<your_jwt_secret>
REFRESH_TOKEN_SECRET=<your_refresh_secret>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
OPENAI_API_KEY=<your_openai_api_key>
```

4. **Start server (development)**

```bash
npm run dev
```

5. **Server should run on** `http://localhost:5000`

6. **Test APIs**  
   Use **Postman** or **Insomnia** to test endpoints.

---

## 🔹 **Features**

- User Authentication & Authorization (JWT + Role-Based)
- Cloudinary-based avatar uploads
- AI Content Generation via OpenAI API
- Templates CRUD (Admin)
- Generation History tracking
- Subscription & Credit system via Stripe
- Admin Dashboard & Analytics
- Protected & validated API responses
- Error handling with custom `apiErrors` & `apiResponse`

---

## 🔹 **Notes**

- All **protected routes** require JWT access token.
- User can only access/modify their own generation history.
- Admin can manage templates and view analytics.
- Every AI generation deducts **credits** and logs **tokensUsed**.

---
