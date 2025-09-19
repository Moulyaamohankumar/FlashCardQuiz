-- Function to calculate points based on response time and correctness
create or replace function public.calculate_points(
  is_correct boolean,
  response_time_ms integer,
  max_time_ms integer default 30000
)
returns integer
language plpgsql
as $$
begin
  if not is_correct then
    return 0;
  end if;
  
  -- Base points for correct answer: 1000
  -- Time bonus: up to 500 points based on speed
  -- Faster answers get more points
  return 1000 + (500 * (max_time_ms - least(response_time_ms, max_time_ms)) / max_time_ms)::integer;
end;
$$;

-- Function to update participant scores
create or replace function public.update_participant_score()
returns trigger
language plpgsql
as $$
begin
  -- Update the participant's score and stats
  update public.match_participants
  set 
    score = score + new.points_earned,
    correct_answers = correct_answers + case when new.is_correct then 1 else 0 end,
    total_answers = total_answers + 1
  where match_id = new.match_id and user_id = new.user_id;
  
  return new;
end;
$$;

-- Create trigger to auto-update participant scores
create trigger update_participant_score_trigger
  after insert on public.question_responses
  for each row
  execute function public.update_participant_score();

-- Function to update user profile stats when match completes
create or replace function public.update_profile_stats()
returns trigger
language plpgsql
as $$
declare
  winner_id uuid;
begin
  -- Only update when match status changes to 'completed'
  if old.status != 'completed' and new.status = 'completed' then
    -- Find the winner (highest score)
    select user_id into winner_id
    from public.match_participants
    where match_id = new.id
    order by score desc, correct_answers desc
    limit 1;
    
    -- Update all participants' profile stats
    update public.profiles
    set 
      total_games = total_games + 1,
      total_wins = total_wins + case when profiles.id = winner_id then 1 else 0 end,
      total_score = total_score + coalesce(mp.score, 0)
    from public.match_participants mp
    where profiles.id = mp.user_id and mp.match_id = new.id;
  end if;
  
  return new;
end;
$$;

-- Create trigger to update profile stats
create trigger update_profile_stats_trigger
  after update on public.game_matches
  for each row
  execute function public.update_profile_stats();
