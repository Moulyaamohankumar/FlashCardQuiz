-- Create game matches table
create table if not exists public.game_matches (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  status text default 'waiting' check (status in ('waiting', 'in_progress', 'completed', 'cancelled')),
  max_players integer default 4,
  current_question_index integer default 0,
  current_question_id uuid references public.quiz_questions(id),
  question_start_time timestamp with time zone,
  question_end_time timestamp with time zone,
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  started_at timestamp with time zone,
  completed_at timestamp with time zone
);

-- Enable RLS
alter table public.game_matches enable row level security;

-- RLS policies for game matches
create policy "matches_select_all"
  on public.game_matches for select
  using (true); -- All users can see matches to join

create policy "matches_insert_authenticated"
  on public.game_matches for insert
  with check (auth.uid() is not null);

create policy "matches_update_creator_or_participant"
  on public.game_matches for update
  using (
    auth.uid() = created_by or 
    exists (
      select 1 from public.match_participants 
      where match_id = id and user_id = auth.uid()
    )
  );

create policy "matches_delete_creator"
  on public.game_matches for delete
  using (auth.uid() = created_by);

-- Create function to generate unique room codes
create or replace function public.generate_room_code()
returns text
language plpgsql
as $$
declare
  code text;
  exists_check boolean;
begin
  loop
    -- Generate a 6-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if code already exists
    select exists(select 1 from public.game_matches where room_code = code) into exists_check;
    
    -- If code doesn't exist, return it
    if not exists_check then
      return code;
    end if;
  end loop;
end;
$$;
