# Siddhivinayak TechSuite: Frontend Architecture Report

This document serves as the completion summary for Phase 1 (Frontend UI/UX) and is designed to be the foundational blueprint for developing the subsequent Backend and Database architecture.

---

## 1. Core Technology Stack
The application was built as a modern, high-performance Single Page Application (SPA).
* **Framework:** React 18 powered by Vite build engine.
* **Language:** TypeScript strictly utilized for type-safe interfaces (`Project`, `LineItem`, etc.).
* **Routing:** `react-router-dom` utilized to strictly separate Public spaces (`/`) from the private Admin ERP space (`/admin/*`).
* **Styling:** Tailwind CSS, operating on a custom configuration to enforce global design tokens.
* **Animations:** Framer Motion (`framer-motion`) powering complex layout shifts, interactive slide-overs, and staggered list renderings.
* **Data Visualization:** Recharts for SVGs and analytical data charts.
* **Icons:** Lucide React for consistent, scalable vector icons.

---

## 2. Design System & Typography
The system adheres to a "Bespoke, High-End" aesthetic, intentionally moving away from basic, clinical dashboards to create a premium working environment.
* **Display Font:** `Plus Jakarta Sans` (Class: `font-display`). Used for high-impact headers, numerical values, and IDs.
* **Body Font:** `Inter` (Class: `font-sans`). Used for densely packed tables and functional forms to optimize legibility.
* **Structural DNA:**
  * **Radii:** High border radii (`rounded-3xl`, `rounded-[2.5rem]`) to soften the dense analytical tables.
  * **Depth:** Utilization of `shadow-xl shadow-primary/20` to create colored, glowing drop shadows.
  * **Containers:** Dual-pane layouts where the left generally handles input/data, and the right focuses on visualization/financials.
  * **Micro-interactions:** Interactive hover scaling, color transitions on table rows, and pulsing notification markers.

---

## 3. Core Modules & Functionalities

### Public Facing Layer
1. **Project Portfolio (`/`)**: A landing page designed to capture leads directly to the ERP via a dynamic slide-over.
2. **Public Tracker Page (`/track/:projectId`)**: A beautiful, read-only dashboard allowing verified customers to view their project's 6-stage pulsing timeline, live completion percentage, and 3D UI call-to-actions.

### Internal ERP System (`/admin/*`)
1. **Security & Auth (`/admin/login`)**: A simulated `sessionStorage` guard component (`<ProtectedRoute>`) that instantly diverts unauthorized clicks back to a branded login screen. 
2. **Projects Manager (`/admin/projects`)**: Master table of all active/completed jobs. Features dynamic filtering, ID auto-generation (`SVK-YYYY-NNN`), and aggregated metric cards.
3. **Production Engine (`/admin/production`)**: An interactive 8-stage workshop tracker. State toggles dynamically calculate overall completion percentage.
4. **Quotation Builder (`/admin/quotation`)**: Replaces manual Excel work. Features a live math-engine allowing state-driven Line Item modification, instantly calculating Subtotals, 18% Output GST, and Grand Totals.
5. **Finance Ledger (`/admin/finance`)**: A dedicated module to log payments. Updates a central ledger table chronologically and instantly renders a Recharts-driven Profit & Loss composition.
6. **Cutting Optimizer (`/admin/cutting`)**: A powerful 2D JavaScript Bin-Packing algorithm tool. Takes a list of needed cabinet panels, calculates surface area, and renders a visual coordinate-based cutting layout for standard 8x4 plywood sheets.
7. **WhatsApp Engine (`src/lib/whatsapp.ts`)**: A centralized utility that formats dynamic states into deep-linked payloads, allowing 1-click customer communication.

---

## 4. The Complete Lifecycle Workflow
When we connect the backend Database, this is exactly how data will flow uninterrupted through the system:

**1. Onboarding (Lead to Project)**
* Customer fills contact form on Website → Database creates a new `Project` record.
* Admin views `Projects Manager`, clicks "New Inquiry". The system assigns an `SVK-ID`.

**2. Quoting & Finance (The Money Flow)**
* Admin goes to `Quotation Builder`, hits "Draft Quote", adds items.
* Admin clicks the WhatsApp button; the `whatsapp.ts` utility sends: *"Dear Amit, your quote is ready..."*
* Customer accepts. Admin logs a 50% UPI advance in `Finance Ledger`. The project status automatically shifts to "Order Confirmed".

**3. Workshop Execution (The Labor Flow)**
* Admin opens `Cutting Optimizer`, adds all necessary measurements, and hits "Run Algorithm". The UI visualizes piece placement and counts total required Plywood sheets to buy.
* Once raw materials arrive, Admin tracks progress via `Production Engine`, moving the job from *Carcass Assembly* → *Lamination* → *Finishing*.

**4. Customer Transparency (The Trust Flow)**
* As production advances, the Admin clicks "Send Tracker" in the ERP.
* The system deep-links a `wa.me` message with the unique `/track/SVK-XXX` URL.
* Customer clicks the link to see a gorgeous frontend UI proving their kitchen is "65% Complete" entirely negating the need for follow-up phone calls.
