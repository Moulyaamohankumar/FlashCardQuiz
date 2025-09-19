-- Create quiz questions table
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer char(1) not null check (correct_answer in ('A', 'B', 'C', 'D')),
  category text,
  difficulty text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table public.quiz_questions enable row level security;

-- RLS policies for quiz questions
create policy "questions_select_all"
  on public.quiz_questions for select
  using (true); -- All users can see questions

create policy "questions_insert_authenticated"
  on public.quiz_questions for insert
  with check (auth.uid() is not null);

create policy "questions_update_own"
  on public.quiz_questions for update
  using (auth.uid() = created_by);

create policy "questions_delete_own"
  on public.quiz_questions for delete
  using (auth.uid() = created_by);
