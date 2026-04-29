create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  user_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  full_name text not null check (length(trim(full_name)) > 0),
  brand_name text,
  phone text,
  pix_key text,
  primary_category text not null check (length(trim(primary_category)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_id_matches_user_id_check check (id = user_id),
  unique (id, user_id)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  price_cents integer not null check (price_cents >= 0),
  repurchase_interval_days integer check (repurchase_interval_days is null or repurchase_interval_days > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  customer_id uuid not null,
  payment_status text not null default 'pending',
  delivery_status text not null default 'to_prepare',
  total_cents integer not null default 0 check (total_cents >= 0),
  payment_due_date date,
  delivery_due_date date,
  paid_at timestamptz,
  delivered_at timestamptz,
  canceled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_payment_status_check check (payment_status in ('pending', 'paid', 'canceled')),
  constraint orders_delivery_status_check check (delivery_status in ('to_prepare', 'prepared', 'delivered', 'canceled')),
  constraint orders_customer_same_user_fk foreign key (customer_id, user_id) references public.customers(id, user_id) on delete restrict,
  unique (id, user_id)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  order_id uuid not null,
  product_id uuid,
  product_name_snapshot text not null check (length(trim(product_name_snapshot)) > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  line_total_cents integer not null check (line_total_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint order_items_line_total_check check (line_total_cents = unit_price_cents * quantity),
  constraint order_items_order_same_user_fk foreign key (order_id, user_id) references public.orders(id, user_id) on delete cascade,
  constraint order_items_product_same_user_fk foreign key (product_id, user_id) references public.products(id, user_id) on delete restrict,
  unique (id, user_id)
);

create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  customer_id uuid not null,
  product_id uuid,
  order_id uuid,
  type text not null,
  status text not null default 'pending',
  due_date date not null,
  message_snapshot text,
  done_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint follow_ups_type_check check (type in ('payment', 'repurchase', 'delivery', 'custom')),
  constraint follow_ups_status_check check (status in ('pending', 'done', 'dismissed')),
  constraint follow_ups_customer_same_user_fk foreign key (customer_id, user_id) references public.customers(id, user_id) on delete cascade,
  constraint follow_ups_product_same_user_fk foreign key (product_id, user_id) references public.products(id, user_id) on delete restrict,
  constraint follow_ups_order_same_user_fk foreign key (order_id, user_id) references public.orders(id, user_id) on delete cascade,
  unique (id, user_id)
);

create index customers_user_id_idx on public.customers(user_id);
create index products_user_id_idx on public.products(user_id);
create index orders_user_id_idx on public.orders(user_id);
create index orders_customer_id_idx on public.orders(customer_id);
create index orders_payment_status_idx on public.orders(user_id, payment_status);
create index orders_delivery_status_idx on public.orders(user_id, delivery_status);
create index order_items_user_id_idx on public.order_items(user_id);
create index order_items_order_id_idx on public.order_items(order_id);
create index follow_ups_user_id_idx on public.follow_ups(user_id);
create index follow_ups_due_date_idx on public.follow_ups(user_id, due_date);
create index follow_ups_status_idx on public.follow_ups(user_id, status);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger set_order_items_updated_at
before update on public.order_items
for each row execute function public.set_updated_at();

create trigger set_follow_ups_updated_at
before update on public.follow_ups
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.follow_ups enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (user_id = auth.uid());

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using (user_id = auth.uid());

create policy "customers_select_own"
on public.customers
for select
to authenticated
using (user_id = auth.uid());

create policy "customers_insert_own"
on public.customers
for insert
to authenticated
with check (user_id = auth.uid());

create policy "customers_update_own"
on public.customers
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "customers_delete_own"
on public.customers
for delete
to authenticated
using (user_id = auth.uid());

create policy "products_select_own"
on public.products
for select
to authenticated
using (user_id = auth.uid());

create policy "products_insert_own"
on public.products
for insert
to authenticated
with check (user_id = auth.uid());

create policy "products_update_own"
on public.products
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "products_delete_own"
on public.products
for delete
to authenticated
using (user_id = auth.uid());

create policy "orders_select_own"
on public.orders
for select
to authenticated
using (user_id = auth.uid());

create policy "orders_insert_own"
on public.orders
for insert
to authenticated
with check (user_id = auth.uid());

create policy "orders_update_own"
on public.orders
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "orders_delete_own"
on public.orders
for delete
to authenticated
using (user_id = auth.uid());

create policy "order_items_select_own"
on public.order_items
for select
to authenticated
using (user_id = auth.uid());

create policy "order_items_insert_own"
on public.order_items
for insert
to authenticated
with check (user_id = auth.uid());

create policy "order_items_update_own"
on public.order_items
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "order_items_delete_own"
on public.order_items
for delete
to authenticated
using (user_id = auth.uid());

create policy "follow_ups_select_own"
on public.follow_ups
for select
to authenticated
using (user_id = auth.uid());

create policy "follow_ups_insert_own"
on public.follow_ups
for insert
to authenticated
with check (user_id = auth.uid());

create policy "follow_ups_update_own"
on public.follow_ups
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "follow_ups_delete_own"
on public.follow_ups
for delete
to authenticated
using (user_id = auth.uid());
