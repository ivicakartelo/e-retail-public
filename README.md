# 🛍️ E-Retail Public

Customer-facing storefront built with **React**, **Redux**, **Express**, **MySQL**, and **Google Generative AI**.  
Part of the full-stack E-Retail platform for managing products, orders, and users.

---

## 🚀 Features

- Browse products and categories  
- AI-powered Q&A using Google Generative AI  
- Cart and secure Stripe checkout  
- Responsive design for desktop & mobile  
- Backend communication via Express REST API

---

## 🖥️ Local Setup Guide

Follow these steps to install and run the app on your computer.

1. 📦 Install Required Tools

Make sure the following are installed:
- Node.js + npm: https://nodejs.org/
- Visual Studio Code: https://code.visualstudio.com/
- Git: https://git-scm.com/
- XAMPP: https://www.apachefriends.org/

2. 🔁 Clone the Repository

git clone https://github.com/ivicakartelo/e-retail-public.git  
cd e-retail-public

3. 🗄️ Import the Database

- Start XAMPP and open phpMyAdmin  
- Create a new database named: `e_retail`  
- Import the SQL file (find it in the backend repo or request it)

4. 🔐 Create a .env File

Create a file named `.env` in the root of the project and add your keys:

REACT_APP_GENAI_API_KEY=your_google_generativeai_api_key  
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key

5. ⚠️ Add .env to .gitignore

To keep your keys safe, add this to `.gitignore`:

.env

6. ▶️ Install & Run the App

npm install  
npm start

The app will run at: http://localhost:3000

---

## 📚 License

MIT License

---

## ✨ Author

Built by [@ivicakartelo](https://github.com/ivicakartelo)
