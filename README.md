# 🛍️ E-Retail Public

This customer-facing storefront is built with **React**, **Redux**, **Express**, **MySQL**, and **Google Generative AI**.  
It is currently being migrated to the **Next.js** framework.

---

## 🚀 Features

- Browse products and categories  
- AI-powered product Q&A (Google Generative AI)  
- Cart and secure Stripe checkout  
- Responsive design for desktop & mobile  
- REST API connection to backend

---

## 🖥️ Local Setup Guide

Follow these steps to install and run the app on your computer.

---

### 1. 📦 Install Required Tools

Make sure the following tools are installed:

- Node.js + npm: https://nodejs.org/  
- Visual Studio Code: https://code.visualstudio.com/  
- Git: https://git-scm.com/  
- XAMPP: https://www.apachefriends.org/

---

### 2. 🔁 How to Clone and Run the App

1. Open your terminal or Git Bash  
2. Clone the repository:

```bash
git clone https://github.com/ivicakartelo/e-retail-public.git
```

3. Navigate into the project folder:

```bash
cd e-retail-public
```

4. Install the dependencies:

```bash
npm install
```

5. Start the app:

```bash
npm start
```

The app will run at: [http://localhost:3000](http://localhost:3000)

---

### 3. 🗄️ Import the Database

1. Start **XAMPP** and launch **phpMyAdmin**  
2. Create a new database named: `e_retail`  
3. Import the SQL file (from the backend or shared repository)

---

### 4. 🔐 Create a `.env` File

In the project root, create a file named `.env` and add your keys:

```env
REACT_APP_GENAI_API_KEY=your_google_generativeai_api_key  
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

---

### 5. ⚠️ Add `.env` to `.gitignore`

To keep your keys safe, make sure this line exists in `.gitignore`:

```
.env
```

---

## 📚 License

MIT License

---

## ✨ Author

Built by [@ivicakartelo](https://github.com/ivicakartelo)
