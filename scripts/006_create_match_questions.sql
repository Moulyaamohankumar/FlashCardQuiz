-- Create match questions table to track which questions are used in each match
create table if not exists public.match_questions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.game_matches(id) on delete cascade not null,
  question_id uuid references public.quiz_questions(id) on delete cascade not null,
  question_order integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(match_id, question_id),
  unique(match_id, question_order)
);

-- Enable RLS
alter table public.match_questions enable row level security;

-- RLS policies for match questions
create policy "match_questions_select_participants"
  on public.match_questions for select
  using (
    exists (
      select 1 from public.match_participants 
      where match_id = match_questions.match_id and user_id = auth.uid()
    )
  );

create policy "match_questions_insert_creator"
  on public.match_questions for insert
  with check (
    exists (
      select 1 from public.game_matches 
      where id = match_id and created_by = auth.uid()
    )
  );

create policy "match_questions_update_creator"
  on public.match_questions for update
  using (
    exists (
      select 1 from public.game_matches 
      where id = match_id and created_by = auth.uid()
    )
  );

create policy "match_questions_delete_creator"
  on public.match_questions for delete
  using (
    exists (
      select 1 from public.game_matches 
      where id = match_id and created_by = auth.uid()
    )
  );
