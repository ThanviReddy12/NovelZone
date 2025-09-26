# NovelZone

**NovelZone** is a MERN stack-based web application designed to provide an engaging and user-friendly platform for book lovers to explore, review, and manage their favorite books. The application offers a modern interface, personalized features, and seamless interaction between the frontend and backend.  

## Table of Contents
1. [Project Overview](#project-overview)  
2. [Existing System and Drawbacks](#existing-system-and-drawbacks)  
3. [Proposed System and Features](#proposed-system-and-features)  
4. [Modules Description](#modules-description)  
5. [Technology Stack](#technology-stack)  

---

## Project Overview

NovelZone allows users to:  
- Browse a library of books displayed in card format with title, author, and cover image.  
- Add or remove books from favorites.  
- Write and read reviews.  
- Manage personal book quotes.  
- Search for books quickly using keywords or titles.  
- Filter and sort books by genre, rating, reviews, or alphabetical order.  
- Receive real-time notifications for actions.  

The frontend is built with **React.js**, the backend uses **Node.js** and **Express.js**, and **MongoDB** stores user, book, review, quote, and favorite data.  

---

## Existing System and Drawbacks

- Users need to visit multiple websites (Amazon, Goodreads) to get interested novels.  
- Most platforms focus on sales rather than interactive reading experiences.  
- No unified system to save or manage personal book quotes.  
- Limited interaction with other readers’ reviews.  
- Real-time feedback during user actions is missing.  
- Search, genre filtering, and sorting options are often limited or not user-friendly.  

---

## Proposed System and Features

**NovelZone** offers a comprehensive, interactive platform for book lovers:  

**Key Features:**  
- Unified platform for browsing, reviewing, managing favorites, and saving quotes.  
- Search bar for quick book lookup.  
- Sorting options: Alphabetical (A–Z), Rating (High to Low), Number of Reviews.  
- Genre-based filters: Horror, Crime, Romance, Educational, Fantasy, and more.  
- Clean and intuitive interface for distraction-free reading and reviewing.  
- Detailed book pages with summaries, star ratings, user reviews, and Amazon purchase links.  
- Real-time notifications for user actions.  
- Personal quote management: Add, edit, delete quotes.  
- Social interaction: Like and view other users’ reviews.  
- Responsive frontend with React.js.  
- Secure backend using Node.js, Express.js, and MongoDB.  

---

## Modules Description

1. **Homepage**  
   - Displays NovelZone logo, tagline, and featured books.  
   - Smooth navigation and keyboard shortcuts.  
   - “Browse” button for easy library access.  

2. **Browse Books**  
   - Displays books in a paginated card layout.  
   - Search by title or keyword.  
   - Filter by genre and sort by rating, reviews, or name.  

3. **Book Details**  
   - Book title, author, genre, summary, and cover image.  
   - Star rating and reviews.  
   - Link to purchase on Amazon.  

4. **User Account**  
   - Secure registration and login with strong password requirements.  
   - Access to personalized areas for favorites, reviews, and quotes.  

5. **Favorites Management**  
   - Add or remove books from favorites.  
   - Real-time notifications confirm actions.  

6. **Review System**  
   - Write and submit book reviews.  
   - View all reviews and like others’ reviews.  

7. **Quote Management**  
   - Save favorite quotes from books.  
   - Edit or delete quotes anytime.  

8. **Notification**  
   - Real-time alerts and toast messages guide user actions.  
   - Prompts login for restricted actions.  

---

## Technology Stack

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB 
- **Version Control:** Git, GitHub  

1. **Clone the repository:**

```bash
git clone https://github.com/ThanviReddy12/NovelZone.git
```

2. **Install dependencies:**

* **Backend:**

```bash
cd backend
npm install
```

* **Frontend:**

```bash
cd frontend
npm install
```

3. **Run the application:**

* **Backend:**

```bash
node index.js
```

* **Frontend:**

```bash
npm start
```

4. **Access the application:**

* Open your browser at `http://localhost:3000` (React frontend).

---
