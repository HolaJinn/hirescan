Personal Features : 
1. Having multiple recruiters within same company
SHOULD DO FOR THE PREVIOUS STEP:
DONE make the initial user has owner role (just for separation between owner and recruiter)
DONE update job description schema to make it have the ID of the company aswell
DONE show jobs by company
DONE make filters to show the jobs created by the user 
DONE Only the OWNNER role can do the modification of the company's info, CRUD recruiters and payment methods
DONE show recruiters list for all the recruiters(still only owner can create recruiters) or just remove the recruiters tab for non owners


DONE optimize logic of resume uploading : first upload, then make the call to the AI API so it doesn't slow the app

Make sure to prevent the actions of the recruiter that are not allowed on a server side (e.g : add recuiter, I removed the button for the recuiter but he can still access the endpoint, still he should be unauthorized to do it)

Test file upload to a file service

2. Stripe payment

✅ CORE FEATURES & CHECKLIST
🔐 1. User Authentication & Account Management
Checklist:

 Sign up with email/password

 Login/logout

 Password hashing and storage (e.g., bcrypt)

 Session management (NextAuth or similar)

 Email validation on signup

 Error handling on login failure

TODO Forgot password / Reset password flow

 Profile settings page (update name, email, picture)

 Role-based access control (recruiter vs admin, etc.)


📤 3. Resume Submission (for Candidates)
Checklist:

 Email confirmation to candidate



📋 5. Resume Management (for Recruiters)
Checklist:

 Mark applicants (shortlist / rejected etc.)

 Export applicant data (CSV)


📡 6. Public Job Application Links
Checklist:

 SEO-optimized metadata for job pages

 QR code to share job link (optional)


🧪 7. Validation & Error Handling
Checklist:

 Client-side form validation (e.g., required fields)

 Server-side validation (check job exists, file type, etc.)

 404 or fallback pages for invalid routes

 Display API/network errors in 
 

🧾 8. Dashboard & UI
Checklist:

 Dashboard with job/resume stats (add charts)

 Responsive layout (mobile & desktop)

 ShadCN / Tailwind consistency

 Accessible components (buttons, forms)

 Branded UI with logo, colors

 Dark mode toggle (optional)



📬 2. Notifications
 Email notification on new resume submission

 Recruiter gets notified of high match candidates

 Candidate gets confirmation email

📁 3. Resume Search & Filter
 Full-text search by candidate name, email

 Filter by score range or submission date

 Tag or label candidates

👥 4. Team Collaboration
 Multiple recruiters per company

 Job ownership or shared access

 Comment system on resumes

🌍 5. Internationalization
 Language selector

 Support for RTL languages (Arabic, etc.)

 Currency/date localization

🔐 6. Admin Panel (optional)
 Manage users & jobs

 Monitor AI usage

 View app logs or performance metrics

🧪 Testing & QA
Checklist:

 Unit tests for utils (e.g. AI scoring function)

 E2E tests for application flow

 Error boundaries for unexpected issues

 Load testing for resume uploads

🚀 Deployment & DevOps
Checklist:

 Deployed on Vercel / similar

 .env environment variables are secured

 Cloud storage for uploaded files (e.g., S3)

 Database backups (PostgreSQL, etc.)

 AI key rate-limiting or retries

