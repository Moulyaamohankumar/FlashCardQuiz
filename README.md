🎯 Real-Time Quiz Game

A real-time multiplayer quiz game built with Next.js and Supabase, where players can join live quiz rooms, answer questions simultaneously, and see scores update instantly.

🚀 Features

🔐 User authentication (Supabase Auth)

🧠 Real-time quiz questions & answers

👥 Multiplayer quiz rooms

⚡ Live score updates using Supabase Realtime

⏱ Timed questions

📊 Leaderboard

📱 Responsive UI

🛠 Tech Stack

Frontend: Next.js (React, App Router)

Backend: Supabase

PostgreSQL Database

Realtime subscriptions

Authentication

Styling: Tailwind CSS (or your preferred CSS framework)

📁 Project Structure
.
├── app/                # Next.js app router
│   ├── page.tsx        # Home page
│   ├── quiz/           # Quiz pages
│   └── layout.tsx
├── components/         # Reusable UI components
├── lib/                # Supabase client & helpers
├── public/             # Static assets
├── styles/             # Global styles
├── .env.local          # Environment variables
└── README.md

🔧 Environment Variables

Create a .env.local file in the root directory:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

🗄 Database Schema (Example)
quizzes
Column	Type
id	uuid
title	text
created_at	timestamp
questions
Column	Type
id	uuid
quiz_id	uuid
question	text
options	json
correct_answer	text
players
Column	Type
id	uuid
name	text
score	integer
quiz_id	uuid
⚡ Real-Time Functionality

Supabase Realtime is used to:

Broadcast new questions

Sync player answers

Update scores live

Notify players when the quiz ends

Example subscription:

supabase
  .channel('quiz-room')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, payload => {
    console.log(payload)
  })
  .subscribe()

▶️ Getting Started
1. Clone the repository
git clone https://github.com/your-username/realtime-quiz-game.git
cd realtime-quiz-game

2. Install dependencies
npm install

3. Run the development server
npm run dev


Open http://localhost:3000
 in your browser.

🧪 Future Improvements

🎙 Voice or video quiz modes

🏆 Global rankings

🎨 Custom quiz themes

🤖 AI-generated questions

📡 WebSocket fallback support

🤝 Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests.

📄 License

This project is licensed under the MIT License.
