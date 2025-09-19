-- Create match participants table
create table if not exists public.match_participants (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.game_matches(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  score integer default 0,
  correct_answers integer default 0,
  total_answers integer default 0,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(match_id, user_id)
);

-- Enable RLS
alter table public.match_participants enable row level security;

-- RLS policies for match participants
create policy "participants_select_all"
  on public.match_participants for select
  using (true); -- All users can see participants for leaderboards

create policy "participants_insert_own"
  on public.match_participants for insert
  with check (auth.uid() = user_id);

create policy "participants_update_own"
  on public.match_participants for update
  using (auth.uid() = user_id);

create policy "participants_delete_own"
  on public.match_participants for delete
  using (auth.uid() = user_id);
