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
    billing_plan text default 'starter',
    billing_status text default 'active',
    billing_cycle_anchor timestamptz default now(),
    notification_preferences jsonb default '{}'::jsonb,
    fcm_token text,
    security_question text,
    security_answer_hash text,
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
    invited_by uuid references auth.users(id) on delete
    set null,
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
    workspace_id uuid references public.workspaces(id) on delete cascade,
    title text not null,
    description text default '',
    category text default 'General',
    priority text check (priority in ('low', 'medium', 'high')) default 'medium',
    status text check (
        status in ('pending', 'in_progress', 'completed')
    ) default 'pending',
    assigned_to text,
    pending_reason text,
    checked boolean default false,
    start_date timestamptz,
    due_date timestamptz,
    completed_at timestamptz,
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
-- AI GENERATION HISTORY TABLE
-- =========================
create table if not exists public.ai_generation_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    goal text not null,
    result jsonb not null default '[]'::jsonb,
    created_at timestamptz default now()
);
create table if not exists public.ai_usage_events (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    feature text default 'generation',
    created_at timestamptz default now()
);
create table if not exists public.billing_transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    plan text check (plan in ('pro', 'team')) not null,
    amount_cents integer not null,
    status text check (status in ('succeeded', 'failed')) default 'succeeded',
    payment_method text default 'dummy_card',
    card_last4 text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);
-- =========================
-- SAFEGUARD FOR EXISTING TABLES
-- =========================
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
ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE;
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS created_at timestamptz default now();
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now();
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;
ALTER TABLE public.tasks
ADD CONSTRAINT tasks_status_check CHECK (
        status IN ('pending', 'in_progress', 'completed')
    );
ALTER TABLE public.tasks
ADD CONSTRAINT tasks_priority_check CHECK (
        priority IN ('low', 'medium', 'high')
    );
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
IF EXISTS (
    SELECT
    FROM information_schema.tables
    WHERE table_schema = 'public'
        AND table_name = 'workspace_members'
) THEN
ALTER TABLE public.workspace_members
ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES auth.users(id) ON DELETE
SET NULL;
END IF;
IF EXISTS (
    SELECT
    FROM information_schema.tables
    WHERE table_schema = 'public'
        AND table_name = 'profiles'
) THEN
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS billing_plan text default 'starter';
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS billing_status text default 'active';
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS billing_cycle_anchor timestamptz default now();
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS security_question text;
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS security_answer_hash text;
END IF;
END $$;
-- =========================
-- INDEXES
-- =========================
create index if not exists idx_tasks_user_status on public.tasks(user_id, status);
create index if not exists idx_tasks_user_due on public.tasks(user_id, due_date);
create index if not exists idx_tasks_user_created on public.tasks(user_id, created_at desc);
create index if not exists idx_tasks_workspace on public.tasks(workspace_id);
create index if not exists idx_logs_task on public.task_logs(task_id);
create index if not exists idx_logs_user_time on public.task_logs(user_id, created_at desc);
create index if not exists idx_ai_history_user_created on public.ai_generation_history(user_id, created_at desc);
create index if not exists idx_ai_usage_events_user_created on public.ai_usage_events(user_id, created_at desc);
create index if not exists idx_billing_transactions_user_created on public.billing_transactions(user_id, created_at desc);
create index if not exists idx_workspace_members_workspace on public.workspace_members(workspace_id);
create index if not exists idx_workspace_members_user on public.workspace_members(user_id);
create index if not exists idx_workspace_invites_workspace on public.workspace_invites(workspace_id);
create index if not exists idx_workspace_invites_email on public.workspace_invites(email);
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
drop trigger if exists update_workspaces_updated_at on public.workspaces;
create trigger update_workspaces_updated_at before
update on public.workspaces for each row execute function public.update_updated_at_column();
-- =========================
-- AUTO ADD OWNER TO WORKSPACE MEMBERS
-- =========================
create or replace function public.handle_new_workspace() returns trigger language plpgsql security definer
set search_path = public as $$ begin
insert into public.workspace_members (workspace_id, user_id, role)
values (NEW.id, NEW.owner_id, 'owner') on conflict (workspace_id, user_id) do nothing;
return NEW;
end;
$$;
drop trigger if exists on_workspace_created on public.workspaces;
create trigger on_workspace_created
after
insert on public.workspaces for each row execute function public.handle_new_workspace();
-- =========================
-- AUTO CREATE PROFILE AFTER SIGNUP
-- =========================
create or replace function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$ begin
insert into public.profiles (
        id,
        full_name,
        email,
        email_confirmed,
        security_question,
        security_answer_hash
    )
values (
        new.id,
        coalesce(
            new.raw_user_meta_data->>'name',
            new.raw_user_meta_data->>'full_name'
        ),
        new.email,
        false,
        new.raw_user_meta_data->>'security_question',
        new.raw_user_meta_data->>'security_answer' -- Plan is to use direct answer for now or hash it before passing to meta
    );
return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();
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
alter table public.ai_generation_history enable row level security;
alter table public.ai_usage_events enable row level security;
alter table public.billing_transactions enable row level security;
-- =========================
-- HELPER FUNCTIONS (RLS)
-- =========================
create or replace function public.is_workspace_owner(ws_id uuid) returns boolean language plpgsql security definer
set search_path = public as $$ begin return exists (
        select 1
        from workspaces
        where id = ws_id
            and owner_id = auth.uid()
    );
end;
$$;
create or replace function public.is_workspace_admin(ws_id uuid) returns boolean language plpgsql security definer
set search_path = public as $$ begin return exists (
        select 1
        from workspace_members
        where workspace_id = ws_id
            and user_id = auth.uid()
            and role in ('owner', 'admin')
    );
end;
$$;
create or replace function public.is_workspace_member(ws_id uuid) returns boolean language plpgsql security definer
set search_path = public as $$ begin return exists (
        select 1
        from workspace_members
        where workspace_id = ws_id
            and user_id = auth.uid()
    );
end;
$$;
-- =========================
-- WORKSPACES RLS POLICIES
-- =========================
drop policy if exists "Users can view own workspaces" on public.workspaces;
drop policy if exists "Users can create own workspaces" on public.workspaces;
drop policy if exists "Users can update own workspaces" on public.workspaces;
drop policy if exists "Users can delete own workspaces" on public.workspaces;
create policy "Users can view own workspaces" on public.workspaces for
select using (
        auth.uid() = owner_id
        OR public.is_workspace_member(id)
    );
create policy "Users can create own workspaces" on public.workspaces for
insert with check (auth.uid() = owner_id);
create policy "Users can update own workspaces" on public.workspaces for
update using (
        auth.uid() = owner_id
        OR public.is_workspace_admin(id)
    );
create policy "Users can delete own workspaces" on public.workspaces for delete using (auth.uid() = owner_id);
-- =========================
-- WORKSPACE MEMBERS RLS POLICIES
-- =========================
drop policy if exists "Users can view own workspace members" on public.workspace_members;
drop policy if exists "Users can modify workspace members" on public.workspace_members;
create policy "Users can view own workspace members" on public.workspace_members for
select using (
        user_id = auth.uid()
        OR public.is_workspace_owner(workspace_id)
        OR public.is_workspace_member(workspace_id)
    );
create policy "Users can modify workspace members" on public.workspace_members for all using (
    public.is_workspace_owner(workspace_id)
    OR (
        public.is_workspace_admin(workspace_id)
        AND role in ('member', 'viewer')
    )
);
-- =========================
-- WORKSPACE INVITES RLS POLICIES
-- ✅ FIXED: Replaced auth.users subquery with auth.email()
-- =========================
drop policy if exists "Users can view own workspace invites" on public.workspace_invites;
drop policy if exists "Users can modify workspace invites" on public.workspace_invites;
drop policy if exists "Invited users can view their invites" on public.workspace_invites;
create policy "Users can view own workspace invites" on public.workspace_invites for
select using (
        email = auth.email()
        OR public.is_workspace_owner(workspace_id)
        OR public.is_workspace_member(workspace_id)
    );
create policy "Users can modify workspace invites" on public.workspace_invites for all using (
    public.is_workspace_owner(workspace_id)
    OR public.is_workspace_admin(workspace_id)
);
-- =========================
-- API KEYS RLS POLICIES
-- =========================
drop policy if exists "Users can manage own api keys" on public.api_keys;
create policy "Users can manage own api keys" on public.api_keys for all using (auth.uid() = user_id);
-- =========================
-- PROFILES RLS POLICIES
-- =========================
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Members can view workspace profiles" on public.profiles;
create policy "Users can view own profile" on public.profiles for
select using (auth.uid() = id);
create policy "Members can view workspace profiles" on public.profiles for
select using (
        auth.uid() = id
        OR exists (
            select 1
            from public.workspace_members wm1
                join public.workspace_members wm2 on wm1.workspace_id = wm2.workspace_id
            where wm1.user_id = auth.uid()
                and wm2.user_id = profiles.id
        )
    );
create policy "Users can update own profile" on public.profiles for
update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for
insert with check (auth.uid() = id);
-- =========================
-- TASKS RLS POLICIES
-- =========================
drop policy if exists "Users can view own tasks" on public.tasks;
drop policy if exists "Users can create own tasks" on public.tasks;
drop policy if exists "Users can update own tasks" on public.tasks;
drop policy if exists "Users can delete own tasks" on public.tasks;
drop policy if exists "Users can view workspace tasks" on public.tasks;
drop policy if exists "Users can create workspace tasks" on public.tasks;
drop policy if exists "Users can update workspace tasks" on public.tasks;
drop policy if exists "Users can delete workspace tasks" on public.tasks;
create policy "Users can view workspace tasks" on public.tasks for
select using (
        auth.uid() = user_id
        OR public.is_workspace_member(workspace_id)
    );
create policy "Users can create workspace tasks" on public.tasks for
insert with check (
        auth.uid() = user_id
        AND (
            workspace_id IS NULL
            OR EXISTS (
                select 1
                from workspace_members
                where workspace_id = tasks.workspace_id
                    and user_id = auth.uid()
                    and role in ('owner', 'admin', 'member')
            )
        )
    );
create policy "Users can update workspace tasks" on public.tasks for
update using (
        auth.uid() = user_id
        OR public.is_workspace_admin(workspace_id)
    );
create policy "Users can delete workspace tasks" on public.tasks for delete using (
    auth.uid() = user_id
    OR public.is_workspace_admin(workspace_id)
);
-- =========================
-- TASK LOGS RLS POLICIES
-- =========================
drop policy if exists "Users can view own logs" on public.task_logs;
drop policy if exists "Users can insert own logs" on public.task_logs;
create policy "Users can view own logs" on public.task_logs for
select using (auth.uid() = user_id);
create policy "Users can insert own logs" on public.task_logs for
insert with check (auth.uid() = user_id);
-- =========================
-- AI GENERATION HISTORY RLS
-- =========================
drop policy if exists "Users can view own ai history" on public.ai_generation_history;
drop policy if exists "Users can insert own ai history" on public.ai_generation_history;
create policy "Users can view own ai history" on public.ai_generation_history for
select using (auth.uid() = user_id);
create policy "Users can insert own ai history" on public.ai_generation_history for
insert with check (auth.uid() = user_id);
drop policy if exists "Users can view own ai usage" on public.ai_usage_events;
drop policy if exists "Users can insert own ai usage" on public.ai_usage_events;
create policy "Users can view own ai usage" on public.ai_usage_events for
select using (auth.uid() = user_id);
create policy "Users can insert own ai usage" on public.ai_usage_events for
insert with check (auth.uid() = user_id);
drop policy if exists "Users can view own billing transactions" on public.billing_transactions;
drop policy if exists "Users can insert own billing transactions" on public.billing_transactions;
create policy "Users can view own billing transactions" on public.billing_transactions for
select using (auth.uid() = user_id);
create policy "Users can insert own billing transactions" on public.billing_transactions for
insert with check (auth.uid() = user_id);
-- =========================
-- STORAGE BUCKETS
-- =========================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true),
    ('workspace-logos', 'workspace-logos', true) on conflict (id) do nothing;
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Auth Insert" on storage.objects;
drop policy if exists "Auth Update" on storage.objects;
drop policy if exists "Auth Delete" on storage.objects;
create policy "Public Access" on storage.objects for
select using (bucket_id in ('avatars', 'workspace-logos'));
create policy "Auth Insert" on storage.objects for
insert with check (
        auth.role() = 'authenticated'
        and bucket_id in ('avatars', 'workspace-logos')
    );
create policy "Auth Update" on storage.objects for
update using (
        auth.role() = 'authenticated'
        and bucket_id in ('avatars', 'workspace-logos')
    );
create policy "Auth Delete" on storage.objects for delete using (
    auth.role() = 'authenticated'
    and bucket_id in ('avatars', 'workspace-logos')
);
-- =========================
-- BACKFILL: Add existing workspace
-- owners to workspace_members
-- =========================
insert into public.workspace_members (workspace_id, user_id, role)
select id,
    owner_id,
    'owner'
from public.workspaces on conflict (workspace_id, user_id) do nothing;
-- =========================
-- BACKFILL: Link orphan tasks 
-- to user's first owned workspace
-- =========================
update public.tasks
set workspace_id = (
        select id
        from public.workspaces
        where owner_id = tasks.user_id
        limit 1
    )
where workspace_id is null;
-- =========================
-- AUTO ACCEPT PENDING INVITES RPC
-- =========================
create or replace function public.accept_pending_invites() returns void language plpgsql security definer
set search_path = public as $$
declare v_user_id uuid;
v_user_email text;
v_invite record;
begin v_user_id := auth.uid();
v_user_email := auth.email();
if v_user_id is null
or v_user_email is null then return;
end if;
for v_invite in
select id,
    workspace_id,
    role,
    invited_by
from public.workspace_invites
where lower(email) = lower(v_user_email)
    and accepted_at is null loop -- Insert into members
insert into public.workspace_members (workspace_id, user_id, role, invited_by)
values (
        v_invite.workspace_id,
        v_user_id,
        v_invite.role,
        v_invite.invited_by
    ) on conflict (workspace_id, user_id) do
update
set role = excluded.role;
-- Mark invite as accepted
update public.workspace_invites
set accepted_at = now()
where id = v_invite.id;
end loop;
end;
$$;