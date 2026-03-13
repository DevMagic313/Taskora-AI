-- =========================
-- CLEAN OLD TABLES (SAFE RESET)
-- =========================
drop table if exists public.profiles cascade;
-- =========================
-- CREATE PROFILES TABLE
-- =========================
create table public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    full_name text,
    avatar_url text,
    role text default 'user',
    email text,
    email_confirmed boolean default false,
    bio text,
    timezone text,
    language text default 'en',
    notification_preferences jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =========================
-- CREATE WORKSPACES TABLE
-- =========================
create table if not exists public.workspaces (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    logo_url text,
    slug text unique not null,
    owner_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.workspace_members (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references public.workspaces(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text check (role in ('owner', 'admin', 'member', 'viewer')) default 'member',
    joined_at timestamptz default now(),
    unique(workspace_id, user_id)
);

create table if not exists public.workspace_invites (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references public.workspaces(id) on delete cascade,
    email text not null,
    role text check (role in ('admin', 'member', 'viewer')) default 'member',
    invited_by uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz default now(),
    accepted_at timestamptz
);

create table if not exists public.api_keys (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    workspace_id uuid references public.workspaces(id) on delete cascade,
    name text not null,
    key_hash text not null,
    preview text not null,
    last_used_at timestamptz,
    created_at timestamptz default now(),
    revoked_at timestamptz
);
-- =========================
-- CREATE TASKS TABLE
-- =========================
create table if not exists public.tasks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    -- Core fields
    title text not null,
    description text default '',
    -- Organization
    category text default 'General',
    priority text check (priority in ('low', 'medium', 'high')) default 'medium',
    status text check (
        status in ('pending', 'in_progress', 'completed')
    ) default 'pending',
    -- Assignment
    assigned_to text,
    pending_reason text,
    -- Tracking
    checked boolean default false,
    start_date timestamptz,
    due_date timestamptz,
    completed_at timestamptz,
    -- Extra info
    comments text,
    notes text,
    remarks text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
-- =========================
-- CREATE TASK LOGS TABLE
-- =========================
create table if not exists public.task_logs (
    id uuid primary key default gen_random_uuid(),
    task_id uuid references public.tasks(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    action_type text check (
        action_type in ('created', 'updated', 'completed', 'deleted')
    ) not null,
    created_at timestamptz default now()
);
-- =========================
-- SAFEGUARD FOR EXISTING TABLES
-- =========================
-- (In case the tasks table was created previously without these columns)
DO $$ BEGIN IF EXISTS (
    SELECT
    FROM information_schema.tables
    WHERE table_schema = 'public'
        AND table_name = 'tasks'
) THEN
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS description text default '';
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS category text default 'General';
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS priority text default 'medium';
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS status text default 'pending';
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS assigned_to text;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS pending_reason text;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS checked boolean default false;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS start_date timestamptz;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS due_date timestamptz;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS comments text;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS remarks text;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS created_at timestamptz default now();
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now();
-- Drop existing constraints to prevent conflicts with new check constraints
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;
-- Re-add constraints
ALTER TABLE public.tasks
ADD CONSTRAINT tasks_status_check CHECK (
        status IN ('pending', 'in_progress', 'completed')
    );
ALTER TABLE public.tasks
ADD CONSTRAINT tasks_priority_check CHECK (priority IN ('low', 'medium', 'high'));
END IF;
IF EXISTS (
    SELECT
    FROM information_schema.tables
    WHERE table_schema = 'public'
        AND table_name = 'task_logs'
) THEN
ALTER TABLE public.task_logs
ADD COLUMN IF NOT EXISTS created_at timestamptz default now();
END IF;
END $$;
-- =========================
-- INDEXES
-- =========================
create index if not exists idx_tasks_user_status on public.tasks(user_id, status);
create index if not exists idx_tasks_user_due on public.tasks(user_id, due_date);
create index if not exists idx_tasks_user_created on public.tasks(user_id, created_at desc);
create index if not exists idx_logs_task on public.task_logs(task_id);
create index if not exists idx_logs_user_time on public.task_logs(user_id, created_at desc);
-- =========================
-- UPDATED_AT TRIGGERS
-- =========================
create or replace function public.update_updated_at_column() returns trigger as $$ begin new.updated_at = now();
return new;
end;
$$ language plpgsql;
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at before
update on public.profiles for each row execute function public.update_updated_at_column();
drop trigger if exists update_tasks_updated_at on public.tasks;
create trigger update_tasks_updated_at before
update on public.tasks for each row execute function public.update_updated_at_column();
-- =========================
-- ENABLE RLS
-- =========================
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.task_logs enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invites enable row level security;
alter table public.api_keys enable row level security;
-- =========================
-- WORKSPACES AND API KEYS RLS POLICIES
-- =========================
create policy "Users can view own workspaces" on public.workspaces for
select using (auth.uid() = owner_id OR auth.uid() IN (SELECT user_id FROM public.workspace_members WHERE workspace_id = id));
create policy "Users can create own workspaces" on public.workspaces for
insert with check (auth.uid() = owner_id);
create policy "Users can update own workspaces" on public.workspaces for
update using (auth.uid() = owner_id OR auth.uid() IN (SELECT user_id FROM public.workspace_members WHERE workspace_id = id AND role IN ('owner', 'admin')));
create policy "Users can delete own workspaces" on public.workspaces for
delete using (auth.uid() = owner_id);

create policy "Users can view own workspace members" on public.workspace_members for
select using (user_id = auth.uid() OR workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid() OR id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())));
create policy "Users can modify workspace members" on public.workspace_members for
all using (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid() OR id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))));

create policy "Users can view own workspace invites" on public.workspace_invites for
select using (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid() OR id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())));
create policy "Users can modify workspace invites" on public.workspace_invites for
all using (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid() OR id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))));

create policy "Users can manage own api keys" on public.api_keys for
all using (auth.uid() = user_id);

-- =========================
-- PROFILES RLS POLICIES
-- =========================
-- User can view their own profile
create policy "Users can view own profile" on public.profiles for
select using (auth.uid() = id);
-- User can update their own profile
create policy "Users can update own profile" on public.profiles for
update using (auth.uid() = id);
-- User can insert their own profile
create policy "Users can insert own profile" on public.profiles for
insert with check (auth.uid() = id);
-- =========================
-- TASKS RLS POLICIES
-- =========================
drop policy if exists "Users can view own tasks" on public.tasks;
create policy "Users can view own tasks" on public.tasks for
select using (auth.uid() = user_id);
drop policy if exists "Users can create own tasks" on public.tasks;
create policy "Users can create own tasks" on public.tasks for
insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own tasks" on public.tasks;
create policy "Users can update own tasks" on public.tasks for
update using (auth.uid() = user_id);
drop policy if exists "Users can delete own tasks" on public.tasks;
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);
-- =========================
-- TASK LOGS RLS POLICIES
-- =========================
drop policy if exists "Users can view own logs" on public.task_logs;
create policy "Users can view own logs" on public.task_logs for
select using (auth.uid() = user_id);
drop policy if exists "Users can insert own logs" on public.task_logs;
create policy "Users can insert own logs" on public.task_logs for
insert with check (auth.uid() = user_id);
-- =========================
-- AUTO CREATE PROFILE AFTER SIGNUP
-- =========================
create or replace function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$ begin
insert into public.profiles (id, full_name, email, email_confirmed)
values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.email,
        false
    );
return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();
-- =========================
-- AI GENERATION HISTORY TABLE
-- =========================
create table if not exists public.ai_generation_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    goal text not null,
    result jsonb not null default '[]'::jsonb,
    created_at timestamptz default now()
);
create index if not exists idx_ai_history_user_created on public.ai_generation_history(user_id, created_at desc);
-- =========================
-- AI GENERATION HISTORY RLS
-- =========================
alter table public.ai_generation_history enable row level security;
drop policy if exists "Users can view own ai history" on public.ai_generation_history;
create policy "Users can view own ai history" on public.ai_generation_history for
select using (auth.uid() = user_id);
drop policy if exists "Users can insert own ai history" on public.ai_generation_history;
create policy "Users can insert own ai history" on public.ai_generation_history for
insert with check (auth.uid() = user_id);

-- =========================
-- STORAGE BUCKETS
-- =========================
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true), ('workspace-logos', 'workspace-logos', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using (bucket_id in ('avatars', 'workspace-logos'));
create policy "Auth Insert" on storage.objects for insert with check (auth.role() = 'authenticated' and bucket_id in ('avatars', 'workspace-logos'));
create policy "Auth Update" on storage.objects for update using (auth.role() = 'authenticated' and bucket_id in ('avatars', 'workspace-logos'));
create policy "Auth Delete" on storage.objects for delete using (auth.role() = 'authenticated' and bucket_id in ('avatars', 'workspace-logos'));