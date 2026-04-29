alter table public.customers
add column birthday date,
add column tags text[] not null default '{}'::text[];

create index customers_user_id_name_idx
on public.customers(user_id, name);
