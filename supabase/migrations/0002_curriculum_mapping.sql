-- Curriculum mapping: link lessons and questions to TLILIC0003
-- Knowledge Evidence (KE) and Performance Evidence (PE) items so coverage
-- can be reported and audited.

create table public.curriculum_items (
  code         text primary key,            -- e.g. 'KE05'
  unit         text not null default 'TLILIC0003',
  kind         text not null check (kind in ('knowledge', 'performance')),
  description  text not null,
  position     integer not null
);

alter table public.lessons   add column refs text[] not null default '{}';
alter table public.questions add column refs text[] not null default '{}';

create index on public.lessons using gin (refs);
create index on public.questions using gin (refs);

alter table public.curriculum_items enable row level security;
create policy "curriculum: read all" on public.curriculum_items for select using (true);

-- Keep the earlier column grant on questions (refs is server/admin only).

insert into public.curriculum_items (code, kind, position, description) values
  ('KE01', 'knowledge',  1, 'Australian and industry standards, codes of practice and guidelines for safe forklift operation'),
  ('KE02', 'knowledge',  2, 'Communication methods: warning devices, hand signals, questioning techniques, signage, traffic warning systems, two-way radio, written instructions'),
  ('KE03', 'knowledge',  3, 'Forklift characteristics, capabilities, manufacturer requirements and attachment instructions'),
  ('KE04', 'knowledge',  4, 'Effects of brake or steering loss, equipment failure, and causes of instability (ground, overloading, pick-up/placement, irregular loads, ramps, uneven surfaces, restricted spaces)'),
  ('KE05', 'knowledge',  5, 'Determining load weight: data plates, load labels/markings, consignment notes, running sheets, weighbridge dockets, weighing cartons, manufacturer documentation'),
  ('KE06', 'knowledge',  6, 'Responses to unsafe conditions: wind, lightning, wet or icy surfaces, rain, extreme heat, UV exposure'),
  ('KE07', 'knowledge',  7, 'Responses to faults and unsafe situations, including lock out / tag out'),
  ('KE08', 'knowledge',  8, 'Refuelling and recharging procedures with PPE: gas bottles, batteries and chargers, refuelling'),
  ('KE09', 'knowledge',  9, 'Recording, reporting and maintaining workplace records'),
  ('KE10', 'knowledge', 10, 'Risk assessment and the hierarchy of control'),
  ('KE11', 'knowledge', 11, 'Safe use and lifting capacity of attachments: bale clamps, carpet spikes, drum carriers, jibs, paper roll clamps, personnel platforms, rotators, slippers / fork extensions'),
  ('KE12', 'knowledge', 12, 'Shutdown procedures and traffic management plans'),
  ('KE13', 'knowledge', 13, 'Common routine problems and their corrections'),
  ('KE14', 'knowledge', 14, 'Work area surface suitability: backfill, damaged concrete/bitumen, compacted and soft soil, potholes, railway tracks, slopes, steel decks, grates, trench covers'),
  ('KE15', 'knowledge', 15, 'Workplace procedures, including verbal, written and electronic work plans'),
  ('KE16', 'knowledge', 16, 'WHS/OHS requirements and safe work procedures'),
  ('PE01', 'performance', 17, 'Operate safely: safe speed, load at suitable travel height, follow manufacturer requirements, data plate and approved attachment rules'),
  ('PE02', 'performance', 18, 'Pre-start checks and visual inspection'),
  ('PE03', 'performance', 19, 'Risk and hazard assessment: lighting, dangerous goods, overhead hazards, ventilation, surfaces, collision risks, weather'),
  ('PE04', 'performance', 20, 'Comply with WHS/OHS legislation, regulations and workplace procedures'),
  ('PE05', 'performance', 21, 'Operational checks: controls, hydraulics, warning systems, start-up, steering, transmission, brakes, unusual noises, records, traffic management plan'),
  ('PE06', 'performance', 22, 'Refuel and isolate fuel/power source to manufacturer requirements with PPE'),
  ('PE07', 'performance', 23, 'Lifting and load handling: attachment selection, load assessment (unbalanced, irregular, dynamic, centre of gravity, tyne position, weight), tag out defects, interpret documents, communicate, three points of contact'),
  ('PE08', 'performance', 24, 'Handle loads: trial lift, horn and mirrors, observer when vision restricted, travel forward/reverse, lower to travel height, place loads at height, tilt/side shift, gluts/dunnage'),
  ('PE09', 'performance', 25, 'Report deficient risk controls and set up an exclusion zone'),
  ('PE10', 'performance', 26, 'Park, secure and shut down: lower tynes, park brake, isolate power, remove key')
on conflict (code) do update
  set kind = excluded.kind, description = excluded.description, position = excluded.position;

-- Coverage view: how many lessons and questions address each item.
create or replace view public.curriculum_coverage
with (security_invoker = true) as
select
  ci.code,
  ci.kind,
  ci.description,
  (select count(*) from public.lessons l where ci.code = any (l.refs))   as lesson_count,
  (select count(*) from public.questions q where ci.code = any (q.refs)) as question_count
from public.curriculum_items ci
order by ci.position;

-- Admin / reporting only (query it in the SQL editor or with the service role).
revoke all on public.curriculum_coverage from anon, authenticated;
