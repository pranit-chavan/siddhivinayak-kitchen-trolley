# Siddhivinayak Kitchen Trolley: Comprehensive Project Documentation
*An Examination-Ready Project Report*

---

## 1. Project Overview & Problem Statement

### The Problem
In the custom furniture and interior manufacturing industry—specifically for small to medium-sized enterprises (SMEs) like kitchen trolley manufacturers—daily operations are highly fragmented. 
Currently, business owners rely on a chaotic mix of disconnected tools:
* **Lead Generation:** Inquiries come through scattered WhatsApp messages or phone calls.
* **Quotations & Design:** Estimates are written on paper or basic Excel sheets, and design visualizations are rarely integrated with the pricing.
* **Production Tracking:** Manufacturing progress is tracked purely through verbal communication between the workshop floor and the showroom.
* **Customer Communication:** Customers constantly call to ask, "Is my kitchen ready?", causing frustration on both sides due to a lack of transparency.

### Why This Matters
This fragmentation results in severe operational inefficiencies. Leads are forgotten, manual quotations lead to mathematical errors, lack of manufacturing oversight causes delayed deliveries, and constant customer follow-ups drain the business owner's time. 

### The Gap
There is a massive gap in the market for an affordable, unified system tailored specifically for bespoke furniture manufacturers. While enterprise-level ERPs (Enterprise Resource Planning) like SAP exist, they are overly complex, extremely expensive, and not built for the fast-paced, WhatsApp-driven workflow of local Indian businesses.

---

## 2. Proposed Solution

The **Kitchen Trolley ERP & Portfolio System** is a full-stack, cloud-based web application designed to digitize the entire lifecycle of a custom furniture project from the first customer click to the final installation.

### How It Solves the Problem
The system provides a unified platform divided into two main experiences:
1. **The Public Portfolio & Tracker:** A modern, aesthetic website where potential customers can view past work (Craftfolio), browse product catalogs, and submit inquiries. 
2. **The Admin ERP Dashboard:** A secure, internal portal for the business owner to manage the entire company workflow.

### Key Benefits & Improvements
* **Automated Lead Management:** Website inquiries bypass WhatsApp and drop directly into the ERP's Lead Management board.
* **One-Click Quotations:** The Quotation Builder auto-calculates GST, sub-totals, and grand totals, eliminating math errors.
* **3D Design Studio:** A built-in visualization tool allows the admin to render basic room dimensions and cabinet colors.
* **Live Production Tracking:** Workshop staff click buttons ("Cutting", "Lamination", "Polishing") which instantly updates the database.
* **The "Magic" Customer Tracker:** Once a project is created, the system generates a unique ID (e.g., `PRJ-4892`). The admin can send a WhatsApp link to the customer containing this ID. The customer can visit the link anytime to see a live-updating progress bar of their kitchen, entirely eliminating "Where is my order?" phone calls.

### Why It Is Better
Unlike existing alternatives, this system does not force the business owner to change how they communicate. Instead, it *enhances* it by generating deep-links that seamlessly integrate with their existing WhatsApp workflow.

---

## 3. Technology Stack & Justification

Every technology was chosen purposefully to ensure scalability, speed, and maintainability.

### Frontend Layer (The User Interface)
* **React.js:** Chosen as the core UI library. *Why?* React's component-based architecture allows us to build reusable pieces (like buttons and tracking bars). *Alternatives considered:* Angular (too steep learning curve and verbose) and plain HTML/JS (too difficult to manage complex state like 3D designs).
* **Vite:** Used as the build tool instead of Create React App. *Why?* Vite is significantly faster, offering near-instant hot module replacement during development.
* **Tailwind CSS:** A utility-first CSS framework. *Why?* It allows for rapid styling directly inside React components without maintaining massive, confusing CSS files. *Alternatives considered:* Bootstrap (looks too generic and outdated).
* **Framer Motion:** A React animation library. *Why?* Used to add smooth slide-over panels and dynamic progress bar animations, giving the app a premium feel.
* **React Three Fiber (Three.js):** *Why?* Specifically used to render the 3D kitchen previews in the browser without requiring external software.

### Backend Layer (The Server & Logic)
* **Node.js:** The runtime environment. *Why?* Allows the use of JavaScript on both the frontend and backend, reducing context-switching for the developer.
* **NestJS:** The backend framework. *Why?* NestJS enforces a strict, modular architecture (Controllers, Services, Modules). As an ERP grows, code organization is critical. *Alternatives considered:* Express.js. Express was rejected because it is unopinionated; in large projects, Express codebases easily become messy "spaghetti code." NestJS forces clean, enterprise-level structure out of the box.

### Database Layer (Data Storage)
* **PostgreSQL:** An advanced relational database. *Why?* An ERP system requires strict data relationships (e.g., a Quotation *must* belong to a Project, which *must* belong to a Customer). Relational databases guarantee data integrity. *Alternatives considered:* MongoDB (NoSQL). MongoDB was rejected because NoSQL is poor at handling highly structured, interrelated financial and project data.
* **Prisma ORM (Object-Relational Mapper):** *Why?* Prisma translates Javascript backend code into SQL automatically. It provides "type safety," meaning if a developer accidentally tries to save a word into a number field, the code will refuse to compile, preventing database crashes.
* **NeonDB:** A serverless cloud provider for PostgreSQL. *Why?* It is cost-effective, scales to zero when not in use, and provides immediate connection pooling.

### Security & Infrastructure
* **JSON Web Tokens (JWT) & bcrypt:** Used for authentication. bcrypt scrambles (hashes) the admin password so even database administrators cannot read it. JWT creates a temporary digital "passport" so the admin doesn't have to log in on every page click.
* **Vercel:** Hosts the React frontend. *Why?* Optimized specifically for React/Vite SPAs (Single Page Applications) with ultra-fast global edge delivery.
* **Railway:** Hosts the Node.js backend. *Why?* Easy CI/CD deployment directly from GitHub with automatic build scripts.

---

## 4. Software Development Life Cycle (SDLC) Breakdown

This project followed the **Agile** methodology, allowing for iterative development and continuous feedback.

### Phase 1: Planning & Requirements Analysis
* **What was done:** Met with the business stakeholder to understand their daily pain points. Mapped out the core features needed: Lead capture, Quotation math, and Production tracking.
* **Deliverables:** A feature list and system architecture outline.

### Phase 2: Design
* **What was done:** Designed the database schema using Prisma. Mapped out relationships (Customer ➡️ Project ➡️ ProductionJob). Designed the UI wireframes focusing on a clean, modern aesthetic (dark mode/glassmorphism).
* **Methodologies:** Entity-Relationship (ER) modeling for the database.
* **Deliverables:** `schema.prisma` file, Figma/Mental wireframes.

### Phase 3: Development / Implementation
* **What was done:** The actual coding phase. We utilized a **Monorepo** structure, keeping frontend and backend code in one repository for easier management.
* **Methodologies:** API-First development. We built the NestJS REST APIs first, tested them, and then built the React frontend to consume those APIs. 
* **Deliverables:** The complete, functional codebase.

### Phase 4: Testing
* **What was done:** Verified that all modules interact correctly. 
* **Methodologies:** 
  * *Unit Testing:* Ensuring quotation math calculates taxes correctly.
  * *API Testing:* Using Postman to send fake data to the NestJS server to ensure it handles errors gracefully.
  * *Manual UI Testing:* Clicking through the app to find bugs (e.g., discovering the "Production Tracking" buttons weren't syncing to the backend, which was subsequently fixed).
* **Deliverables:** A bug-free, stable application.

### Phase 5: Deployment
* **What was done:** Pushing the code to live servers so anyone on the internet can access it.
* **Methodologies:** CI/CD (Continuous Integration/Continuous Deployment). Code pushed to GitHub automatically triggers Vercel and Railway to build and deploy the latest version.
* **Deliverables:** Live URLs (`siddhivinayak-kitchens.shop`).

### Phase 6: Maintenance
* **What was done:** Monitoring the live app for crashes. For example, fixing a critical SPA Routing issue where Vercel threw a 404 error when users refreshed the tracker page.

---

## 5. Examination-Ready Q&A

This section anticipates technical and conceptual questions an examiner might ask during a project defense.

**Q1: Why did you choose NestJS over a simpler framework like Express.js for your backend?**
**Answer:** While Express is great for small apps, an ERP system involves complex business logic (Users, Leads, Projects, Quotes, Payments). NestJS uses a modular architecture (Controllers handle routes, Services handle logic) and provides built-in Dependency Injection. This makes the code highly organized, scalable, and much easier to maintain over time compared to the unstructured nature of Express.

**Q2: You mentioned using PostgreSQL instead of MongoDB. Why?**
**Answer:** An ERP system is heavily reliant on structured, relational data. A single `Payment` must tie perfectly to a `Quotation`, which ties to a `Project`, which ties to a `Customer`. PostgreSQL (a SQL database) enforces strict rules and foreign-key constraints to guarantee data integrity. MongoDB (NoSQL) stores data as loose documents, which is great for flexible data like social media posts, but highly risky for financial and project management tracking.

**Q3: How does the "Customer Tracking ID" feature work technically?**
**Answer:** When the Admin converts a Lead into a Project, the backend automatically generates a unique string (e.g., `PRJ-8821`) and saves it in the database. When the customer visits `website.com/track/PRJ-8821`, the React frontend reads the ID from the URL parameters using React Router. It then makes an HTTP GET request to the NestJS API (`/projects/tracker/PRJ-8821`). The backend fetches the project's production stages, calculates the completion percentage, and sends the data back to the frontend to render the progress bar.

**Q4: How did you secure the Admin Dashboard?**
**Answer:** We implemented JWT (JSON Web Token) authentication. When the admin logs in, the backend verifies their hashed password using `bcrypt` and generates a signed JWT. The frontend stores this token in local storage and attaches it to the `Authorization` header of every subsequent API request. On the backend, we use NestJS Auth Guards (`@Roles()`) that intercept requests, verify the token's cryptographic signature, and block access if the user is not authenticated or lacks Admin privileges.

**Q5: What was the most difficult technical challenge you faced, and how did you solve it?**
**Answer:** We faced a major issue with client-side routing upon deployment. The WhatsApp Tracking links worked perfectly when clicked from inside the app, but if a customer refreshed the page or opened the link directly, Vercel threw a "404 Not Found" error. 
*How we solved it:* We realized this was a Single Page Application (SPA) routing issue. Vercel's servers were looking for a physical file named `PRJ-123.html`. We solved this by creating a `vercel.json` configuration file with a rewrite rule that forces the server to route all traffic back to `index.html`, allowing React Router to take over and load the correct component.

**Q6: How did you handle state management on the frontend?**
**Answer:** We primarily used React's built-in Hooks (`useState`, `useEffect`). For isolated components, local state was sufficient. For example, in the Production Tracker, when an admin clicks "Cutting Done", we do an "Optimistic UI Update"—we instantly update the local React state so the UI feels incredibly fast, while simultaneously sending a background `PATCH` request to the backend to permanently save the state in the PostgreSQL database.

**Q7: What are the limitations of your current system, and what are the future scopes?**
**Answer:** 
* *Current Limitation:* The system currently lacks an automated inventory management module. If materials are consumed in production, it does not automatically deduct from a raw materials stock table.
* *Future Scope:* We plan to integrate an Inventory Module, automated email notifications (using Nodemailer) to send PDF quotations directly from the dashboard, and a mobile application for workshop floor workers to update production stages via their smartphones without needing dashboard access.
