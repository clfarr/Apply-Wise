# ApplyWise - Job Application Tracker

A modern, intuitive job application tracking system to help job seekers stay organized throughout their job search journey. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### MVP (Version 1)
- ✅ **CRUD Operations**: Add, edit, and delete job applications
- ✅ **Track Key Information**: Company, role, status, application date, job URL
- ✅ **Notes Section**: Add detailed notes for each application
- ✅ **Status Filtering**: Filter applications by status (Saved, Applied, Interviewing, Offer, Rejected, Ghosted)
- ✅ **Responsive Design**: Mobile-first UI that works on all devices
- ✅ **Clean UI**: Modern, professional interface with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend/Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Hosting**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier is sufficient)

### 1. Clone the Repository

```bash
git clone https://github.com/clfarr/Apply-Wise.git
cd Apply-Wise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for your database to be set up
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the migration script from `supabase/migrations/001_create_job_applications.sql`
5. Run the migration to create your database table

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to **Settings** → **API** in your Supabase dashboard
   - Copy the **Project URL** and **anon public** key

3. Update your `.env` file:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`

## Database Schema

The application uses a single `job_applications` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `company` | TEXT | Company name (required) |
| `role` | TEXT | Job role/position (required) |
| `status` | TEXT | Application status (required) |
| `application_date` | DATE | Date application was submitted (required) |
| `job_url` | TEXT | URL to job posting (optional) |
| `notes` | TEXT | Additional notes (optional) |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Application Statuses

- **Saved**: Job saved for later application
- **Applied**: Application submitted
- **Interviewing**: In the interview process
- **Offer**: Received job offer
- **Rejected**: Application rejected
- **Ghosted**: No response from company

## Project Structure

```
Apply-Wise/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── ApplicationCard.tsx    # Job application card component
│   │   ├── ApplicationForm.tsx    # Add/Edit form component
│   │   └── StatusFilter.tsx       # Status filter component
│   ├── context/
│   │   └── ApplicationContext.tsx # Global state management
│   ├── lib/
│   │   └── supabase.ts           # Supabase client configuration
│   ├── services/
│   │   └── applicationService.ts  # API service layer
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles + Tailwind imports
├── supabase/
│   └── migrations/
│       └── 001_create_job_applications.sql
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory, ready to deploy to Vercel or any static hosting service.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Future Enhancements (Version 2)

- 🔔 Follow-up reminders and notifications
- 📎 Document uploads (resume, cover letter, job descriptions)
- 📊 Analytics dashboard with metrics
- 🏷️ Custom tags/categories
- 💰 Salary range tracking
- 🔐 User authentication
- 📱 Mobile app (React Native)

## Contributing

This is a portfolio project, but suggestions and improvements are welcome! Feel free to open an issue or submit a pull request.

## License

MIT License - feel free to use this project for your own portfolio or job search!

## Author

Caroline Farr
- Portfolio: [carriefarr.com](https://carriefarr.com)
- GitHub: [@clfarr](https://github.com/clfarr)

---

Built with ❤️ to help job seekers stay organized and land their dream roles!
