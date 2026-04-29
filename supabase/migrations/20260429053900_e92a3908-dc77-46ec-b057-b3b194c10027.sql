
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Anyone can read roles"
  on public.user_roles for select
  using (true);

-- Announcements
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  posted_on date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "Public can read announcements"
  on public.announcements for select using (true);
create policy "Admins can insert announcements"
  on public.announcements for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update announcements"
  on public.announcements for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete announcements"
  on public.announcements for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Macros
create table public.macros (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  title text not null,
  body text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.macros enable row level security;

create policy "Public can read macros"
  on public.macros for select using (true);
create policy "Admins can insert macros"
  on public.macros for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update macros"
  on public.macros for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete macros"
  on public.macros for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Scorecard weeks
create table public.scorecard_weeks (
  id uuid primary key default gen_random_uuid(),
  week_of date not null unique,
  label text not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.scorecard_weeks enable row level security;

create policy "Public can read scorecard_weeks"
  on public.scorecard_weeks for select using (true);
create policy "Admins can insert scorecard_weeks"
  on public.scorecard_weeks for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update scorecard_weeks"
  on public.scorecard_weeks for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete scorecard_weeks"
  on public.scorecard_weeks for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Scorecard entries
create table public.scorecard_entries (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.scorecard_weeks(id) on delete cascade,
  member text not null,
  hours_worked numeric not null default 0,
  hours_scheduled numeric not null default 0,
  qa_score numeric not null default 0,
  qa_max numeric not null default 40,
  ticket_target integer not null default 0,
  ticket_actual integer not null default 0,
  work_ethic_score numeric not null default 10,
  work_ethic_max numeric not null default 10,
  infractions integer not null default 0,
  overall_pct numeric not null default 0,
  created_at timestamptz not null default now(),
  unique (week_id, member)
);

alter table public.scorecard_entries enable row level security;

create policy "Public can read scorecard_entries"
  on public.scorecard_entries for select using (true);
create policy "Admins can insert scorecard_entries"
  on public.scorecard_entries for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update scorecard_entries"
  on public.scorecard_entries for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete scorecard_entries"
  on public.scorecard_entries for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger announcements_set_updated_at before update on public.announcements
  for each row execute function public.set_updated_at();
create trigger macros_set_updated_at before update on public.macros
  for each row execute function public.set_updated_at();
