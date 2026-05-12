insert into public.users (id, full_name, email, role)
values
  ('11111111-1111-1111-1111-111111111111', 'Admin Neon', 'admin@neon.local', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Operador Neon', 'operator@neon.local', 'operator')
on conflict (id) do nothing;

insert into public.product_sizes (id, code, label, ounces, base_price, base_cost)
values
  ('33333333-1111-1111-1111-111111111111', '8oz', '8 oz', 8, 8000, 2600),
  ('33333333-2222-2222-2222-222222222222', '12oz', '12 oz', 12, 11000, 3400),
  ('33333333-3333-3333-3333-333333333333', '16oz', '16 oz', 16, 14000, 4200)
on conflict (code) do nothing;

insert into public.product_types (id, code, label, price_modifier, cost_modifier)
values
  ('44444444-1111-1111-1111-111111111111', 'basico', 'Básico', 0, 0),
  ('44444444-2222-2222-2222-222222222222', 'premium', 'Premium', 2500, 700),
  ('44444444-3333-3333-3333-333333333333', 'cremoso', 'Cremoso', 2000, 900),
  ('44444444-4444-4444-4444-444444444444', 'picoso', 'Picoso', 1500, 450)
on conflict (code) do nothing;

insert into public.flavors (id, name, color, is_active)
values
  ('55555555-1111-1111-1111-111111111111', 'Chicle', '#ff73e3', true),
  ('55555555-2222-2222-2222-222222222222', 'Sandía', '#3de8c2', true),
  ('55555555-3333-3333-3333-333333333333', 'Maracumango', '#ffd24d', true),
  ('55555555-4444-4444-4444-444444444444', 'Limón', '#7df97f', false)
on conflict (name) do nothing;

insert into public.inventory_items (id, name, unit, category, current_stock, reorder_point, unit_cost)
values
  ('66666666-1111-1111-1111-111111111111', 'Vaso 8 oz', 'u', 'envases', 120, 40, 500),
  ('66666666-2222-2222-2222-222222222222', 'Vaso 12 oz', 'u', 'envases', 110, 40, 650),
  ('66666666-3333-3333-3333-333333333333', 'Vaso 16 oz', 'u', 'envases', 90, 35, 800),
  ('66666666-4444-4444-4444-444444444444', 'Chamoy', 'porción', 'extras', 55, 15, 300),
  ('66666666-5555-5555-5555-555555555555', 'Kit de dulces', 'kit', 'extras', 31, 8, 850),
  ('66666666-6666-6666-6666-666666666666', 'Perlas explosivas', 'porción', 'extras', 28, 10, 900),
  ('66666666-7777-7777-7777-777777777777', 'Gomitas enchiladas', 'porción', 'extras', 42, 14, 650),
  ('66666666-8888-8888-8888-888888888888', 'Jeringa con licor', 'u', 'extras', 16, 6, 2400)
on conflict (name) do nothing;

insert into public.extras (id, name, price, cost, inventory_item_id)
values
  ('77777777-1111-1111-1111-111111111111', 'Chamoy', 1500, 300, '66666666-4444-4444-4444-444444444444'),
  ('77777777-2222-2222-2222-222222222222', 'Kit de dulces', 2500, 850, '66666666-5555-5555-5555-555555555555'),
  ('77777777-3333-3333-3333-333333333333', 'Perlas explosivas', 3000, 900, '66666666-6666-6666-6666-666666666666'),
  ('77777777-4444-4444-4444-444444444444', 'Gomitas enchiladas', 2200, 650, '66666666-7777-7777-7777-777777777777'),
  ('77777777-5555-5555-5555-555555555555', 'Jeringa con licor', 4500, 2400, '66666666-8888-8888-8888-888888888888')
on conflict (name) do nothing;

insert into public.active_flavors (flavor_id, business_date, tank_number)
values
  ('55555555-1111-1111-1111-111111111111', current_date, 1),
  ('55555555-2222-2222-2222-222222222222', current_date, 2),
  ('55555555-3333-3333-3333-333333333333', current_date, 3)
on conflict (business_date, tank_number) do nothing;
