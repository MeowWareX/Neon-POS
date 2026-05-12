insert into public.users (id, full_name, email, role)
values
  ('11111111-1111-1111-1111-111111111111', 'Admin Neon', 'admin@neon.local', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Operador Neon', 'operator@neon.local', 'operator')
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role;

delete from public.product_types where code = 'premium';
delete from public.extras where name in ('Chamoy', 'Kit de dulces', 'Gomitas enchiladas');
delete from public.inventory_items where name in ('Chamoy', 'Kit de dulces', 'Gomitas enchiladas', 'Jeringa con licor', 'Líquido Chicle', 'Líquido Sandía', 'Líquido Maracumango', 'Líquido Limón', 'Gomitas', 'Chicles de cuadritos', 'Pitillo', 'Vaso especial transparente 16 oz');

insert into public.products (id, name, is_active)
values
  ('aaaaaaa1-1111-1111-1111-111111111111', 'Raspado Base', true)
on conflict (id) do update
set
  name = excluded.name,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.inventory_items (id, name, unit, category, current_stock, reorder_point, unit_cost)
values
  ('66666666-0001-0001-0001-000000000001', 'Base 8 oz (receta)', 'porcion', 'produccion', 200, 50, 1200),
  ('66666666-0002-0002-0002-000000000002', 'Base 12 oz (receta)', 'porcion', 'produccion', 200, 50, 1600),
  ('66666666-0003-0003-0003-000000000003', 'Base 16 oz (receta)', 'porcion', 'produccion', 200, 50, 2650),
  ('66666666-0004-0004-0004-000000000004', 'Especial cremoso 16 oz (adicional receta)', 'porcion', 'produccion', 150, 40, 1900),
  ('66666666-0005-0005-0005-000000000005', 'Especial picoso 16 oz (adicional receta)', 'porcion', 'produccion', 150, 40, 4250),
  ('66666666-1001-1001-1001-000000000001', 'Chamoi', 'porcion', 'extras', 120, 30, 700),
  ('66666666-1002-1002-1002-000000000002', 'Lengua', 'unidad', 'extras', 180, 40, 350),
  ('66666666-1003-1003-1003-000000000003', 'Perlas explosivas', 'cucharada', 'extras', 140, 35, 900),
  ('66666666-1004-1004-1004-000000000004', 'Jeringa de sirope', 'unidad', 'extras', 120, 30, 450),
  ('66666666-1005-1005-1005-000000000005', 'Jeringa de licor', 'unidad', 'extras', 90, 25, 1000),
  ('66666666-1006-1006-1006-000000000006', 'Chupeta', 'unidad', 'extras', 220, 60, 500),
  ('66666666-c001-c001-c001-000000000001', 'Líquido Chicle', 'ml', 'sabores', 1800, 400, 45),
  ('66666666-c002-c002-c002-000000000002', 'Líquido Sandía', 'ml', 'sabores', 1600, 400, 42),
  ('66666666-c003-c003-c003-000000000003', 'Líquido Maracumango', 'ml', 'sabores', 1500, 400, 50),
  ('66666666-c004-c004-c004-000000000004', 'Líquido Limón', 'ml', 'sabores', 1400, 350, 40),
  ('66666666-c100-c100-c100-000000000100', 'Gomitas', 'u', 'insumos', 220, 50, 80),
  ('66666666-c101-c101-c101-000000000101', 'Chicles de cuadritos', 'u', 'insumos', 260, 60, 30),
  ('66666666-c102-c102-c102-000000000102', 'Pitillo', 'u', 'insumos', 500, 100, 20),
  ('66666666-c103-c103-c103-000000000103', 'Vaso especial transparente 16 oz', 'u', 'envases', 85, 25, 900)
on conflict (name) do update
set
  unit = excluded.unit,
  category = excluded.category,
  current_stock = excluded.current_stock,
  reorder_point = excluded.reorder_point,
  unit_cost = excluded.unit_cost,
  updated_at = now();

insert into public.product_sizes (id, code, label, ounces, base_price, base_cost, inventory_item_id, usage_quantity)
values
  ('33333333-1111-1111-1111-111111111111', '8oz', '8 oz', 8, 5000, 1200, '66666666-0001-0001-0001-000000000001', 1),
  ('33333333-2222-2222-2222-222222222222', '12oz', '12 oz', 12, 8000, 1600, '66666666-0002-0002-0002-000000000002', 1),
  ('33333333-3333-3333-3333-333333333333', '16oz', '16 oz', 16, 10000, 2650, '66666666-0003-0003-0003-000000000003', 1)
on conflict (code) do update
set
  label = excluded.label,
  ounces = excluded.ounces,
  base_price = excluded.base_price,
  base_cost = excluded.base_cost,
  inventory_item_id = excluded.inventory_item_id,
  usage_quantity = excluded.usage_quantity,
  updated_at = now();

insert into public.product_types (id, code, label, price_modifier, cost_modifier, inventory_item_id, usage_quantity)
values
  ('44444444-1111-1111-1111-111111111111', 'basico', 'Base', 0, 0, null, 1),
  ('44444444-3333-3333-3333-333333333333', 'cremoso', 'Especial Cremoso (16 oz)', 7000, 1900, '66666666-0004-0004-0004-000000000004', 1),
  ('44444444-4444-4444-4444-444444444444', 'picoso', 'Especial Picoso (16 oz)', 5000, 4250, '66666666-0005-0005-0005-000000000005', 1)
on conflict (code) do update
set
  label = excluded.label,
  price_modifier = excluded.price_modifier,
  cost_modifier = excluded.cost_modifier,
  inventory_item_id = excluded.inventory_item_id,
  usage_quantity = excluded.usage_quantity,
  updated_at = now();

insert into public.extras (id, name, price, cost, inventory_item_id, usage_quantity)
values
  ('77777777-1111-1111-1111-111111111111', 'Chamoi', 2000, 700, '66666666-1001-1001-1001-000000000001', 1),
  ('77777777-2222-2222-2222-222222222222', 'Lengua', 1000, 350, '66666666-1002-1002-1002-000000000002', 1),
  ('77777777-3333-3333-3333-333333333333', 'Perlas explosivas', 2000, 900, '66666666-1003-1003-1003-000000000003', 1),
  ('77777777-4444-4444-4444-444444444444', 'Jeringa de sirope', 1000, 450, '66666666-1004-1004-1004-000000000004', 1),
  ('77777777-5555-5555-5555-555555555555', 'Jeringa de licor', 2000, 1000, '66666666-1005-1005-1005-000000000005', 1),
  ('77777777-6666-6666-6666-666666666666', 'Chupeta', 1000, 500, '66666666-1006-1006-1006-000000000006', 1)
on conflict (name) do update
set
  price = excluded.price,
  cost = excluded.cost,
  inventory_item_id = excluded.inventory_item_id,
  usage_quantity = excluded.usage_quantity,
  updated_at = now();

insert into public.flavors (id, name, color, is_active, inventory_item_id)
values
  ('55555555-1111-1111-1111-111111111111', 'Chicle', '#ff73e3', true, '66666666-c001-c001-c001-000000000001'),
  ('55555555-2222-2222-2222-222222222222', 'Sandia', '#3de8c2', true, '66666666-c002-c002-c002-000000000002'),
  ('55555555-3333-3333-3333-333333333333', 'Maracuya', '#ffd24d', true, '66666666-c003-c003-c003-000000000003'),
  ('55555555-4444-4444-4444-444444444444', 'Limon', '#7df97f', true, '66666666-c004-c004-c004-000000000004')
on conflict (name) do update
set
  color = excluded.color,
  is_active = excluded.is_active,
  inventory_item_id = excluded.inventory_item_id,
  updated_at = now();

insert into public.inventory_consumption_rules (
  id,
  product_type_id,
  product_size_id,
  extra_id,
  consumes_selected_flavor,
  inventory_item_id,
  quantity,
  note,
  is_active
)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', '44444444-1111-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', null, true, null, 1, 'Base 8 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000002', '44444444-1111-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', null, false, '66666666-1111-1111-1111-111111111111', 1, 'Vaso 8 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000003', '44444444-1111-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', null, false, '66666666-c100-c100-c100-000000000100', 2, 'Gomitas base', true),
  ('aaaaaaaa-0000-0000-0000-000000000004', '44444444-1111-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', null, false, '66666666-c101-c101-c101-000000000101', 1, 'Chicles base', true),
  ('aaaaaaaa-0000-0000-0000-000000000005', '44444444-1111-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', null, false, '66666666-1006-1006-1006-000000000006', 1, 'Chupeta base', true),
  ('aaaaaaaa-0000-0000-0000-000000000006', '44444444-1111-1111-1111-111111111111', '33333333-1111-1111-1111-111111111111', null, false, '66666666-c102-c102-c102-000000000102', 1, 'Pitillo base', true),
  ('aaaaaaaa-0000-0000-0000-000000000007', '44444444-1111-1111-1111-111111111111', '33333333-2222-2222-2222-222222222222', null, true, null, 1, 'Base 12 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000008', '44444444-1111-1111-1111-111111111111', '33333333-2222-2222-2222-222222222222', null, false, '66666666-2222-2222-2222-222222222222', 1, 'Vaso 12 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000009', '44444444-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', null, true, null, 1, 'Base 16 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000010', '44444444-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', null, false, '66666666-3333-3333-3333-333333333333', 1, 'Vaso 16 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000011', '44444444-3333-3333-3333-333333333333', '33333333-1111-1111-1111-111111111111', null, true, null, 1, 'Cremoso 8 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000012', '44444444-3333-3333-3333-333333333333', '33333333-1111-1111-1111-111111111111', null, false, '66666666-c103-c103-c103-000000000103', 1, 'Vaso especial 8 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000013', '44444444-3333-3333-3333-333333333333', '33333333-2222-2222-2222-222222222222', null, true, null, 1, 'Cremoso 12 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000014', '44444444-3333-3333-3333-333333333333', '33333333-2222-2222-2222-222222222222', null, false, '66666666-c103-c103-c103-000000000103', 1, 'Vaso especial 12 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000015', '44444444-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', null, true, null, 1, 'Cremoso 16 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000016', '44444444-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', null, false, '66666666-c103-c103-c103-000000000103', 1, 'Vaso especial 16 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000017', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', null, true, null, 1, 'Picoso 16 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000018', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', null, false, '66666666-c103-c103-c103-000000000103', 1, 'Vaso especial 16 oz', true),
  ('aaaaaaaa-0000-0000-0000-000000000019', null, null, '77777777-1111-1111-1111-111111111111', false, '66666666-4444-4444-4444-444444444444', 1, 'Chamoy', true),
  ('aaaaaaaa-0000-0000-0000-000000000020', null, null, '77777777-2222-2222-2222-222222222222', false, '66666666-9999-9999-9999-999999999999', 1, 'Lengua', true),
  ('aaaaaaaa-0000-0000-0000-000000000021', null, null, '77777777-3333-3333-3333-333333333333', false, '66666666-6666-6666-6666-666666666666', 1, 'Perlas explosivas', true),
  ('aaaaaaaa-0000-0000-0000-000000000022', null, null, '77777777-4444-4444-4444-444444444444', false, '66666666-7777-7777-7777-777777777777', 1, 'Gomitas enchiladas', true),
  ('aaaaaaaa-0000-0000-0000-000000000023', null, null, '77777777-5555-5555-5555-555555555555', false, '66666666-8888-8888-8888-888888888888', 1, 'Jeringa con licor', true),
  ('aaaaaaaa-0000-0000-0000-000000000024', null, null, '77777777-6666-6666-6666-666666666666', false, '66666666-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 'Jeringa de sirope', true),
  ('aaaaaaaa-0000-0000-0000-000000000025', null, null, '77777777-7777-7777-7777-777777777777', false, '66666666-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'Chupeta', true)
on conflict (id) do update
set
  product_type_id = excluded.product_type_id,
  product_size_id = excluded.product_size_id,
  extra_id = excluded.extra_id,
  consumes_selected_flavor = excluded.consumes_selected_flavor,
  inventory_item_id = excluded.inventory_item_id,
  quantity = excluded.quantity,
  note = excluded.note,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.active_flavors (flavor_id, business_date, tank_number)
values
  ('55555555-1111-1111-1111-111111111111', current_date, 1),
  ('55555555-2222-2222-2222-222222222222', current_date, 2),
  ('55555555-3333-3333-3333-333333333333', current_date, 3)
on conflict (business_date, tank_number) do update
set
  flavor_id = excluded.flavor_id;
