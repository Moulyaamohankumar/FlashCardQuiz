-- Create question responses table
create table if not exists public.question_responses (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.game_matches(id) on delete cascade not null,
  question_id uuid references public.quiz_questions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  selected_answer char(1) not null check (selected_answer in ('A', 'B', 'C', 'D')),
  is_correct boolean not null,
  response_time_ms integer not null, -- Time taken to answer in milliseconds
  points_earned integer default 0,
  responded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(match_id, question_id, user_id)
);

-- Enable RLS
alter table public.question_responses enable row level security;

-- RLS policies for question responses
create policy "responses_select_match_participants"
  on public.question_responses for select
  using (
    exists (
      select 1 from public.match_participants 
      where match_id = question_responses.match_id and user_id = auth.uid()
    )
  );

create policy "responses_insert_own"
  on public.question_responses for insert
  with check (auth.uid() = user_id);

create policy "responses_update_own"
  on public.question_responses for update
  using (auth.uid() = user_id);

create policy "responses_delete_own"
  on public.question_responses for delete
  using (auth.uid() = user_id);
