alter table public.products
add column category text;

create index products_user_id_name_idx
on public.products(user_id, name);
