-- clients
create table if not exists clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  domain     text not null unique,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists clients_created_at_idx on clients (created_at);

-- pageviews
create table if not exists pageviews (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references clients (id) on delete cascade,
  url        text not null,
  referrer   text,
  user_agent text,
  country    text,
  city       text,
  session_id text,
  created_at timestamptz not null default now()
);

create index if not exists pageviews_client_id_idx  on pageviews (client_id);
create index if not exists pageviews_created_at_idx on pageviews (created_at);
create index if not exists pageviews_session_id_idx on pageviews (session_id);

-- events
create table if not exists events (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references clients (id) on delete cascade,
  event_name text not null,
  properties jsonb,
  session_id text,
  created_at timestamptz not null default now()
);

create index if not exists events_client_id_idx  on events (client_id);
create index if not exists events_created_at_idx on events (created_at);
create index if not exists events_event_name_idx on events (event_name);
create index if not exists events_session_id_idx on events (session_id);

-- leads
create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references clients (id) on delete cascade,
  name       text,
  email      text,
  phone      text,
  source_url text,
  form_name  text,
  created_at timestamptz not null default now()
);

create index if not exists leads_client_id_idx  on leads (client_id);
create index if not exists leads_created_at_idx on leads (created_at);

-- form_submissions
create table if not exists form_submissions (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references clients (id) on delete cascade,
  form_name  text not null,
  data       jsonb,
  created_at timestamptz not null default now()
);

create index if not exists form_submissions_client_id_idx  on form_submissions (client_id);
create index if not exists form_submissions_created_at_idx on form_submissions (created_at);
