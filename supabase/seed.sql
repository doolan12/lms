-- Seed: Forklift Theory Practice (Australia) — an independent study aid.
--
-- Original study material. Internally mapped to the public TLILIC0003 "Licence
-- to operate a forklift truck" Knowledge Evidence (KE) and Performance Evidence
-- (PE) so nothing is missed. Do NOT market it as delivering the unit — only RTOs
-- can deliver nationally recognised training (NVR Act s123A).
-- Every lesson and question carries `refs` so coverage can be audited
-- (see the curriculum_coverage view / scripts/coverage-report.mjs).
--
-- This content does NOT reproduce any National Assessment Instrument (NAI)
-- question — NAIs are confidential to accredited assessors.
-- Have an experienced forklift trainer/assessor check the content for accuracy.
-- Study aid only: a High Risk Work Licence requires training and assessment
-- through an RTO and an accredited assessor.
--
-- Requires migrations 0001 and 0002. Safe to re-run.

create or replace function pg_temp.add_lesson(
  p_module uuid, p_course uuid, p_pos int, p_slug text, p_title text,
  p_minutes int, p_preview boolean, p_refs text[], p_body text
) returns uuid language plpgsql as $$
declare v_id uuid;
begin
  insert into public.lessons (module_id, course_id, slug, title, position, duration_minutes, is_preview, refs)
  values (p_module, p_course, p_slug, p_title, p_pos, p_minutes, p_preview, p_refs)
  returning id into v_id;
  insert into public.lesson_content (lesson_id, body_md) values (v_id, p_body);
  return v_id;
end $$;

create or replace function pg_temp.add_q(
  p_quiz uuid, p_pos int, p_refs text[], p_prompt text, p_explanation text, p_correct int, p_opts text[]
) returns void language plpgsql as $$
declare v_q uuid; i int;
begin
  if p_correct < 1 or p_correct > array_length(p_opts, 1) then
    raise exception 'Question % has invalid correct index %', p_prompt, p_correct;
  end if;
  insert into public.questions (quiz_id, prompt, explanation, position, refs)
  values (p_quiz, p_prompt, p_explanation, p_pos, p_refs) returning id into v_q;
  for i in 1 .. array_length(p_opts, 1) loop
    insert into public.options (question_id, text, position, is_correct)
    values (v_q, p_opts[i], i, i = p_correct);
  end loop;
end $$;

-- Calculation question: same as add_q, flagged is_calculation.
create or replace function pg_temp.add_cq(
  p_quiz uuid, p_pos int, p_refs text[], p_prompt text, p_explanation text, p_correct int, p_opts text[]
) returns void language plpgsql as $$
begin
  perform pg_temp.add_q(p_quiz, p_pos, p_refs, p_prompt, p_explanation, p_correct, p_opts);
  update public.questions set is_calculation = true where quiz_id = p_quiz and position = p_pos;
end $$;

do $seed$
declare
  c uuid; m1 uuid; m2 uuid; m3 uuid; m4 uuid; m5 uuid; m6 uuid; mc uuid;
  q uuid;
begin
  delete from public.courses where slug = 'forklift-licence-theory';

  insert into public.courses (slug, title, summary, description, price_cents, currency, published)
  values (
    'forklift-licence-theory',
    'Forklift Theory Practice (LF)',
    'Learn and practise forklift theory for your LF licence assessment — at your own pace, on any device.',
    'Learn and practise the forklift theory you''ll be assessed on for your LF High Risk Work Licence: WHS law '
    || 'and standards, hazards, ground conditions and weather, traffic management, pre-start and operational checks, '
    || 'faults and lock out/tag out, stability, rated capacity, load weight and load centre calculations, attachments, '
    || 'safe operating and stacking, shutdown, refuelling and recharging. Each module ends with a quiz, and a final '
    || 'practice exam helps you check your knowledge. An independent study aid to use alongside your training with '
    || 'an RTO — not nationally recognised training, and it does not give you a licence.',
    1500, 'aud', true
  ) returning id into c;

  insert into public.modules (course_id, title, position) values (c, 'Licensing, law and standards', 1) returning id into m1;
  insert into public.modules (course_id, title, position) values (c, 'Planning, hazards and traffic management', 2) returning id into m2;
  insert into public.modules (course_id, title, position) values (c, 'Checks, faults and failures', 3) returning id into m3;
  insert into public.modules (course_id, title, position) values (c, 'Loads, stability and attachments', 4) returning id into m4;
  insert into public.modules (course_id, title, position) values (c, 'Load calculations', 5) returning id into mc;
  insert into public.modules (course_id, title, position) values (c, 'Safe operation and load handling', 6) returning id into m5;
  insert into public.modules (course_id, title, position) values (c, 'Shutdown, refuelling and recharging', 7) returning id into m6;

  -- ════════════════════════════════════════════════════════════════════
  -- Module 1 — Licensing, law and standards
  -- ════════════════════════════════════════════════════════════════════
  perform pg_temp.add_lesson(m1, c, 1, 'high-risk-work-licence', 'The forklift High Risk Work Licence', 6, true,
    array['KE16','PE04'], $md$
## Why you need a licence

Operating a forklift is **high risk work** under Australia's Work Health and Safety (WHS) laws. To operate one you must hold a **High Risk Work Licence (HRWL)** for the right class — or be a trainee working under supervision while you train.

| Class | Covers |
|---|---|
| **LF** | Forklift truck (counterbalance, reach trucks and similar) |
| **LO** | Order-picking forklift truck |

### How you get licensed

1. Train with a **Registered Training Organisation (RTO)**.
2. Pass a knowledge **and** practical assessment with an **accredited assessor**.
3. Apply to your state or territory regulator (e.g. SafeWork NSW, WorkSafe Victoria, WorkSafe Queensland) within the required time.

You must be **at least 18**. Licences are recognised nationally and must be renewed (generally every five years).

> This online course is theory preparation. It does not on its own give you a licence.
$md$);

  perform pg_temp.add_lesson(m1, c, 2, 'whs-duties', 'Your duties under WHS law', 6, false,
    array['KE16','KE15','PE04'], $md$
## Everyone has duties

WHS laws (in Victoria, the OHS Act) place duties on everyone at a workplace.

**The business (PCBU / employer) must**, so far as is reasonably practicable:
- provide safe plant — a forklift that is maintained and fit for use
- provide information, training, instruction and supervision
- set up safe systems of work, such as a **traffic management plan**

**As an operator you must:**
- take reasonable care for your own health and safety
- take reasonable care that what you do (or don't do) doesn't harm others
- follow reasonable instructions, policies and **workplace procedures**
- **report hazards, incidents and defects**

### Work plans and procedures

Your instructions may come as a **verbal** instruction from a supervisor, a **written** job sheet, safe work procedure or SWMS, or an **electronic** work order on a scanner or tablet. Whatever form they take: read or listen carefully, ask questions if anything is unclear, and follow them.

If you're unsure, **stop and ask**.
$md$);

  perform pg_temp.add_lesson(m1, c, 3, 'standards-codes-records', 'Standards, codes of practice and records', 7, false,
    array['KE01','KE09','KE15'], $md$
## Where the rules come from

| Source | What it is |
|---|---|
| **WHS Act and Regulations** | The law. Must be followed. |
| **Codes of practice** | Practical guidance on meeting the law — e.g. Safe Work Australia's *Managing the risks of plant in the workplace*. Courts can use them as evidence of what is reasonably practicable. |
| **Australian Standards** | Technical requirements — e.g. the **AS 2359** series for powered industrial trucks (forklifts). |
| **Guidelines** | Further guidance — e.g. Safe Work Australia's *General guide for workplace traffic management*. |
| **Manufacturer's manual** | How *this* forklift must be operated, checked and maintained. |
| **Workplace procedures** | How *your site* does things — traffic plan, SWMS, emergency procedures. |

## Records you keep

Good records prove checks were done and problems were followed up:

- **Pre-start checklists** — every shift
- **Defect and fault reports**
- **Incident and near-miss reports**
- **Maintenance and service records** for the forklift
- **Trainee logbook** — if you're training, record your supervised operating hours

Records must be **accurate, legible, dated and signed**, and kept where your workplace procedures say.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m1, 'Module 1 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, array['KE16'], 'Which licence class covers a standard counterbalance forklift?',
    'LF is the forklift truck class. LO covers order-picking forklifts.', 2,
    array['LO', 'LF', 'C2', 'WP']);
  perform pg_temp.add_q(q, 2, array['KE16'], 'What is the minimum age to hold a High Risk Work Licence?',
    'You must be at least 18 years old.', 3,
    array['16', '17', '18', '21']);
  perform pg_temp.add_q(q, 3, array['KE16','PE04'], 'You notice the forklift''s horn isn''t working. Under WHS law you must:',
    'Workers have a duty to report defects and hazards. Do not operate it until it''s fixed.', 1,
    array['Report it and not use the forklift until it is fixed', 'Use it carefully and mention it at the end of the shift', 'Fix it yourself without telling anyone', 'Ignore it if the area is quiet']);
  perform pg_temp.add_q(q, 4, array['KE01'], 'What is the main purpose of a code of practice?',
    'Codes of practice give practical guidance on how to meet duties under WHS laws.', 3,
    array['It replaces the WHS Act', 'It is the manufacturer''s operating manual', 'It gives practical guidance on how to meet your WHS duties', 'It is only for supervisors']);
  perform pg_temp.add_q(q, 5, array['KE01','KE03'], 'Where would you find how a particular forklift must be operated and serviced?',
    'The manufacturer''s operator manual sets the requirements for that machine.', 4,
    array['A newspaper article', 'A general WHS poster', 'The site''s fire plan', 'The manufacturer''s operator manual']);
  perform pg_temp.add_q(q, 6, array['KE09'], 'Which of these is a workplace record a forklift operator should complete?',
    'Pre-start checklists, defect reports and incident reports are all records operators complete.', 2,
    array['The company''s tax return', 'The pre-start checklist', 'The forklift purchase invoice', 'The visitor sign-in book only']);

  -- ════════════════════════════════════════════════════════════════════
  -- Module 2 — Planning, hazards and traffic management
  -- ════════════════════════════════════════════════════════════════════
  perform pg_temp.add_lesson(m2, c, 1, 'planning-and-communication', 'Planning the task and communicating', 8, false,
    array['KE15','KE02','PE07'], $md$
## Plan before you lift

- **The load** — weight, size, shape, centre of gravity; is it stable and secure?
- **The forklift** — is the load within its **rated capacity**? Is the right attachment fitted?
- **The route** — surfaces, slopes, doorways, overhead clearances, blind corners.
- **The destination** — racking capacity, where the load will be placed.
- **People** — who else is working nearby, and how will you communicate?

## Communication methods

| Method | Use it for |
|---|---|
| **Warning devices** — horn, flashing beacon, reversing alarm, lights | Alerting people to the forklift |
| **Hand signals** | Directions from a spotter or observer. Agree the signals **before** starting. |
| **Two-way radio** | Coordinating over distance. Use clear, short messages and confirm you've understood. |
| **Signage and traffic warning systems** | Speed limits, pedestrian crossings, no-go zones, warning lights at doorways |
| **Written instructions** | Job sheets, work orders, SWMS, consignment paperwork |
| **Verbal instructions and questioning** | Ask questions to check you understand — e.g. "So you want these three pallets in bay 4, top level?" |

Always make **eye contact with pedestrians** before moving near them.
$md$);

  perform pg_temp.add_lesson(m2, c, 2, 'hazards-and-controls', 'Identifying hazards and choosing controls', 8, false,
    array['KE10','PE03'], $md$
## Common forklift hazards

- **Pedestrians**, other plant and vehicles — collision risk
- **Overhead hazards** — powerlines (see the next lesson), low beams, doorways, sprinklers, lights, fixed structures
- **Poor lighting** and blind corners
- **Dangerous goods** — check labels/placards and the Safety Data Sheet (SDS); know the spill procedure
- **Restricted or poorly ventilated areas** — LPG, petrol and diesel forklifts give off **carbon monoxide** in exhaust
- **Ground conditions** and **weather** (later in this module)
- Unstable or damaged loads

## Hazard or risk — what's the difference?

- A **hazard** is anything that **could cause harm** — injury, illness or damage. It's the *thing* or *situation*: a pedestrian near your work area, an oil spill, a powerline, a pothole, a damaged pallet.
- A **risk** is the **chance that the hazard will actually hurt someone, and how bad it would be**. It's about *likelihood* and *consequence*.

| Hazard (what could cause harm) | Risk (how likely, and how bad) |
|---|---|
| Pedestrians walking through the loading area | Being struck by the forklift — likely in a busy area, and could be fatal |
| Oil spill on the floor | The forklift skids or someone slips — likely if it's on your route |
| Overhead powerline near the yard | Electrocution if the mast gets close — less likely if you plan, but the consequence is death |
| Damaged pallet | The load collapses or falls — injury or damaged stock |

> **Spot the hazard → assess the risk → control it.** The hazard is the thing; the risk is how likely and how serious the harm is.

## Assessing the risk

Ask two questions about each hazard:

1. **Likelihood** — how likely is it to cause harm? (*Rare, possible, likely*)
2. **Consequence** — if it does, how bad would it be? (*Minor first aid, serious injury, death*)

A hazard that is **likely** to happen **and** could cause **serious injury or death** is a **high risk** — fix it before you start work. Low risks still need controlling.

## The risk management steps

1. **Identify** the hazards — walk the route and look around before you start.
2. **Assess** the risk — likelihood and consequence.
3. **Control** it using the hierarchy of control.
4. **Review** — are the controls working? Has anything changed?

## The hierarchy of control

Use the most effective control you can, then work down:

1. **Eliminate** the hazard
2. **Substitute** with something safer
3. **Isolate** people from it (barriers, separate walkways, exclusion zones)
4. **Engineering controls** (mirrors, warning lights, speed limiters)
5. **Administrative controls** (procedures, signage, training, traffic plans)
6. **PPE** — the last line of defence

If a control is missing or not working, **report it**.
$md$);

  perform pg_temp.add_lesson(m2, c, 3, 'powerlines', 'Powerlines: keep clear, and the 5-step contact protocol', 8, false,
    array['PE03','KE07','KE04'], $md$
## Look up and live

Overhead powerlines are one of the deadliest hazards for forklift operators. Electricity can **jump (arc)** across a gap — you don't have to touch the line to be electrocuted. Treat **every line as live**.

Before you start work outdoors or near doorways and awnings:

- **Look up** — find every overhead line before you move or raise the mast.
- **Keep the minimum approach distance** for your state and the line's voltage. For example, SafeWork NSW sets **3 m** for lines up to 132,000 volts, **6 m** up to 330,000 volts and **8 m** above that. Your site may set a bigger distance.
- Remember lines **sag** in heat and **swing** in wind — and a raised mast or load is higher than you think.
- **Lower the mast and tynes** before you travel near lines.
- Use a **spotter** when working near lines, and ask for the power to be **switched off or the lines covered** if you have to work close to them.

## If the forklift touches a powerline — the 5 steps

**Stay → Warn → Break → Call → Jump**

1. **STAY on the forklift.** Stay calm, stay seated and don't touch any metal parts. The forklift may be live — the ground around it can be too.
2. **WARN others.** Shout to everyone to keep **at least 8 metres** away. No one should touch the forklift or try to help you.
3. **BREAK contact — only if it's safe.** Lower the mast or tynes, or drive the forklift clear of the line, but only if it won't cause another hazard.
4. **CALL for help.** Call **000** and the local electricity network operator (e.g. Ausgrid 13 13 88, Endeavour Energy 13 10 03, Essential Energy 13 20 80) and ask them to switch the power off. **Stay where you are** until they confirm the power is off.
5. **JUMP clear — only if you must** (e.g. the forklift is on fire). Jump well clear with your **feet together**, never touching the forklift and the ground at the same time. Land with feet together, then **shuffle or bunny-hop** with feet together until you are **at least 8 metres** away. **Never go back** until the power is confirmed off.

## Afterwards

- Don't use the forklift again until it has been **inspected**.
- Report it to your supervisor straight away. Contact with a powerline is a **notifiable incident** — your employer must notify the WHS regulator.

> If you see someone else's machine touching a line: **stay back at least 8 m**, call 000 and the network operator, and tell them to stay on the machine.
$md$);

  perform pg_temp.add_lesson(m2, c, 4, 'ground-and-weather', 'Ground surfaces and weather', 8, false,
    array['KE14','KE06','KE04','PE03'], $md$
## Is the surface suitable?

A loaded forklift is extremely heavy — the counterweight alone can weigh more than the load. Check the surface can take it.

| Surface | Risk / what to do |
|---|---|
| **Backfilled ground** (e.g. over a trench) | May collapse — avoid unless confirmed compacted and suitable |
| **Soft soil, mud, sand** | Wheels sink, forklift can tip — avoid or use suitable equipment |
| **Hard compacted soil** | Usually OK, but check after rain |
| **Damaged or cracked concrete / bitumen, potholes** | Jolts the load and forklift — slow down, go around, report |
| **Railway tracks** | Cross slowly and at an angle where possible so wheels don't drop into the gap |
| **Rough or sloped terrain** | Instability — slow down, keep the load low, follow ramp rules |
| **Steel decks, grates, trench covers, dock plates** | Must be rated for the **combined weight** of forklift and load, and secured |

## Unsafe weather and conditions

| Condition | Response |
|---|---|
| **Strong wind** | Large flat loads (sheet material, boards) act like a sail — slow down or stop work if unsafe |
| **Lightning** | Stop outdoor work, park safely and take shelter |
| **Rain, wet or icy surfaces** | Reduce speed, brake and turn gently, allow much longer stopping distances |
| **Extreme heat** | Drink water, take breaks, watch for heat stress; watch engine temperature |
| **UV exposure** | Sun protection — hat, long sleeves, sunscreen, sunglasses |

If conditions make the job unsafe, **stop and tell your supervisor**.
$md$);

  perform pg_temp.add_lesson(m2, c, 5, 'traffic-management-exclusion-zones', 'Traffic management plans and exclusion zones', 6, false,
    array['KE12','PE09','KE02','PE05'], $md$
## Traffic management plans

Workplaces where forklifts operate should have a **traffic management plan (TMP)**. It typically sets out:

- **forklift routes** and **pedestrian walkways**, separated where possible
- **pedestrian crossing points** and no-go zones
- **speed limits**
- **one-way systems**, loading and parking areas
- **signage**, line marking, mirrors and warning lights
- rules for visitors and delivery drivers

Know the TMP for your site and **follow it every time**.

## Exclusion zones

An **exclusion zone** is an area around forklift work that people must not enter. Set one up with **barriers, bollards, cones, bunting and signs** — for example while loading a truck or stacking at height.

- Check the zone is in place before you start.
- **Stop** if anyone enters it.
- If a control is missing or damaged (a broken barrier, a faded walkway, a mirror knocked out of position), **report it** to your supervisor.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m2, 'Module 2 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, array['KE10'], 'Which control is the MOST effective in the hierarchy of control?',
    'Elimination removes the hazard entirely.', 1,
    array['Elimination', 'PPE', 'Signage', 'Training']);
  perform pg_temp.add_q(q, 2, array['KE10','PE09'], 'Separating forklifts and pedestrians with physical barriers is an example of:',
    'Physically separating people from the hazard is isolation.', 3,
    array['Substitution', 'PPE', 'Isolation', 'An administrative control']);
  perform pg_temp.add_q(q, 3, array['KE02'], 'Before a spotter guides you with hand signals, you should:',
    'Agree on the signals before starting so there is no confusion.', 2,
    array['Turn off your horn', 'Agree on the signals you will both use', 'Ask them to stand behind the forklift', 'Raise the load so they can see it']);
  perform pg_temp.add_q(q, 4, array['PE03'], 'Why is operating an LPG forklift in a poorly ventilated area a hazard?',
    'LPG, petrol and diesel engines produce carbon monoxide, which builds up in poorly ventilated areas.', 4,
    array['The tyres overheat', 'The horn can''t be heard', 'The mast won''t lift', 'Carbon monoxide from the exhaust can build up']);
  perform pg_temp.add_q(q, 5, array['KE14'], 'You need to drive over a steel trench cover. What must you check first?',
    'It must be rated for the combined weight of the forklift and load, and secured.', 1,
    array['That it is rated for the combined weight of the forklift and load', 'That it has been painted', 'That it is wider than the forklift', 'Nothing — steel is always strong enough']);
  perform pg_temp.add_q(q, 6, array['KE06'], 'A thunderstorm with lightning moves in while you''re working outside. You should:',
    'Stop outdoor work, park the forklift safely and take shelter.', 3,
    array['Speed up to finish the job', 'Raise the mast to keep loads dry', 'Stop work, park safely and take shelter', 'Keep working but stay in the seat']);
  perform pg_temp.add_q(q, 7, array['KE06','KE04'], 'The yard is wet after rain. How should you change the way you drive?',
    'Wet surfaces reduce grip: slow down, brake and turn gently, and allow longer stopping distances.', 2,
    array['No change is needed', 'Reduce speed and allow longer stopping distances', 'Drive faster to get out of the rain', 'Brake harder than usual']);
  perform pg_temp.add_q(q, 8, array['KE12','PE09'], 'A pedestrian walks into the exclusion zone while you''re loading a truck. You:',
    'Stop work immediately until the person has left the zone, then report the breach if required.', 4,
    array['Sound the horn and keep working', 'Keep going — they should know better', 'Raise the load higher so it''s out of the way', 'Stop work until they have left the zone']);
  perform pg_temp.add_q(q, 9, array['KE07','PE03'], 'The mast of your forklift touches an overhead powerline. What should you do FIRST?',
    'Step 1 is STAY: stay seated on the forklift and don''t touch any metal parts. Getting off could electrocute you.', 2,
    array['Jump off and run', 'Stay on the forklift and don''t touch any metal parts', 'Climb down using three points of contact', 'Push the line away with a piece of timber']);
  perform pg_temp.add_q(q, 10, array['KE07','PE03'], 'A forklift is touching a powerline. How far away should everyone else stay?',
    'Step 2 is WARN: keep everyone at least 8 metres away, and no one touches the forklift.', 3,
    array['1 metre', '3 metres', 'At least 8 metres', 'It is safe to stand next to it if you don''t touch it']);
  perform pg_temp.add_q(q, 11, array['KE07','KE04'], 'Your forklift is touching a powerline and catches fire. How should you get off?',
    'Step 5 is JUMP — only if you must. Jump clear with feet together, never touching the forklift and the ground at the same time, then shuffle with feet together at least 8 m away.', 1,
    array['Jump clear with feet together, then shuffle with feet together at least 8 m away', 'Climb down slowly holding the handrail', 'Step down and run away as fast as you can', 'Stay on the forklift no matter what']);
  perform pg_temp.add_q(q, 12, array['KE07'], 'What is the correct order of the 5-step powerline contact protocol?',
    'Stay → Warn → Break contact (if safe) → Call for help → Jump clear (only if you must).', 4,
    array['Jump, Call, Warn, Stay, Break', 'Call, Jump, Stay, Break, Warn', 'Break, Jump, Warn, Call, Stay', 'Stay, Warn, Break contact, Call, Jump clear']);
  perform pg_temp.add_q(q, 13, array['KE10','PE03'], 'What is a hazard?',
    'A hazard is anything that could cause harm — injury, illness or damage. Risk is the chance it will cause harm, and how bad that harm would be.', 1,
    array['Anything that could cause harm', 'The chance that someone will be hurt', 'A report you fill in after an incident', 'A control such as a barrier']);
  perform pg_temp.add_q(q, 14, array['KE10','PE03'], 'What is a risk?',
    'Risk combines likelihood (how likely the hazard is to cause harm) and consequence (how bad the harm would be).', 3,
    array['Any object in the workplace', 'A sign that warns people', 'How likely a hazard is to cause harm, and how bad the harm would be', 'The cost of fixing a forklift']);
  perform pg_temp.add_q(q, 15, array['KE10','PE03'], 'Pedestrians often walk through the loading bay where you work. Which statement is correct?',
    'The pedestrians in your work area are the hazard. Being struck by the forklift — likely, and possibly fatal — is the risk.', 2,
    array['The pedestrians are the risk; being hit is the hazard', 'The pedestrians are the hazard; the chance of hitting one, and how bad it would be, is the risk', 'There is no hazard if pedestrians wear hi-vis', 'Hazards and risks mean exactly the same thing']);
  perform pg_temp.add_q(q, 16, array['KE10','PE03'], 'A hazard is likely to happen and could kill someone. How should you rate the risk?',
    'Likely + a serious consequence = high risk. Control it before you start work.', 4,
    array['Low — it hasn''t happened yet', 'Medium — it depends on the day', 'No risk if you are careful', 'High — control it before you start work']);

  -- ════════════════════════════════════════════════════════════════════
  -- Module 3 — Checks, faults and failures
  -- ════════════════════════════════════════════════════════════════════
  perform pg_temp.add_lesson(m3, c, 1, 'pre-start-checks', 'Pre-start (visual) checks', 9, true,
    array['PE02','KE03','PE07','KE09'], $md$
## Do it every shift

Carry out a pre-start check **before every shift**, using the site checklist and the operator's manual. With the engine **off**, walk around and check:

- **Data plate** — present, legible, and **correct for the attachment fitted**
- **Structure** — look for **cracked or stressed welds** and **paint separation** (cracked or flaking paint at joints can show a crack underneath)
- **Tynes (forks) / attachments** — cracks, bends, heel wear; **locking pins in place** and attachments **secure**
- **Mast, chains and carriage** — damage, wear, chain tension
- **Hydraulics** — hoses, fittings and the ground underneath for **leaks**
- **Fluids** — engine oil, hydraulic oil, coolant, **fuel / LPG level**
- **Battery** (electric) — **charge level**, cables and connectors, no damage
- **Tyres and wheels** — damage, wear, **correct inflation**, wheel nuts
- **Overhead guard and load backrest** — fitted and undamaged
- **Lights, safety equipment** (e.g. fire extinguisher if fitted) and **signs and labels** — present and legible
- **Logbook / checklist** — available, and previous defects followed up

## Getting on and off

Use the steps and handholds and keep **three points of contact** (two hands and a foot, or two feet and a hand). Never jump down.

Once seated, **adjust the seat and mirrors** and **fasten and test the seatbelt**.

Record the check, and **record any damage** you find.
$md$);

  perform pg_temp.add_lesson(m3, c, 2, 'operational-checks-and-defects', 'Operational checks and lock out / tag out', 7, false,
    array['PE05','KE07','KE09','PE07'], $md$
## Operational checks (engine running)

Start the forklift **as the manufacturer requires** and check:

- **Locate, identify and test every control**
- **Gauges and warning lights**
- **Horn, lights, beacon and reversing alarm**
- **Steering** — smooth, no excessive play
- **Transmission** — forward, neutral, reverse, inching
- **Service and park brakes**
- **Hydraulics** — run lift, tilt and side shift through their **full range**; movement should be smooth
- **Attachments** — operate smoothly
- **Listen** for unusual noises

Record the results on the checklist.

## Lock out / tag out (LOTO)

If you find a fault, the forklift must not be used until it's fixed:

1. **Stop** and park safely.
2. **Isolate** the power — turn off, remove the key, close the LPG valve or disconnect the battery as your procedure says.
3. **Tag** it — attach an "Out of service / Do not operate" tag (and a lock if your site uses them).
4. **Report** the fault to your supervisor and record it.

Only an **authorised person** may remove the tag, once the repair is done and checked.
$md$);

  perform pg_temp.add_lesson(m3, c, 3, 'faults-failures-routine-problems', 'Equipment failure and routine problems', 8, false,
    array['KE04','KE07','KE13'], $md$
## If something fails while operating

| Failure | What to do |
|---|---|
| **Brake failure** | Take your foot off the accelerator, **warn others with the horn**, steer away from people and obstacles, and use the park brake to bring the forklift to a stop. Lower the load. Tag out and report. |
| **Steering failure** | Stop as quickly and safely as you can, warn others, lower the load. Tag out and report. |
| **Hydraulic failure** (load drops or won't hold) | Keep everyone clear of the load, stop, lower it if you can. Tag out and report. |
| **Forklift starts to tip** | **Do not jump.** Stay in the seat with the seatbelt on, hold the steering wheel firmly, brace your feet and **lean away** from the direction of the fall. |

Equipment failure on a ramp, at height or near people is very dangerous — which is why pre-start and operational checks matter.

## Common routine problems

| Sign | Likely cause | Correction |
|---|---|---|
| Engine stutters / loses power (LPG) | Cylinder running empty | Park safely, change the cylinder following the procedure |
| Battery indicator low | Battery discharged | Return to the charging area; charge or swap |
| Hydraulics slow or jerky | Low hydraulic oil or a leak | Check the level per the manual; if leaking, **tag out** and report |
| Temperature gauge high | Overheating | Stop, shut down, let it cool — never open a hot radiator cap. Report it. |
| Light, horn or alarm not working | Globe, fuse or fault | Report it — don't operate until fixed |
| Tyre looks low or damaged | Puncture / wear | Report — repairs by a competent person only |

Only fix problems that are **within your competence** and allowed by your workplace procedures. Everything else: tag out and report.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m3, 'Module 3 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, array['PE02'], 'When should a pre-start check be carried out?',
    'Pre-start checks are done before every shift, before the forklift is used.', 2,
    array['Once a week', 'Before every shift', 'Only after a breakdown', 'Only when a supervisor asks']);
  perform pg_temp.add_q(q, 2, array['PE02','KE03'], 'A side shifter has been fitted to the forklift. What must you check on the data plate?',
    'The data plate must match the attachment fitted, because attachments change capacity.', 3,
    array['That it shows the purchase date', 'That it is the same colour as the forklift', 'That it is correct for the attachment fitted', 'Nothing — attachments don''t matter']);
  perform pg_temp.add_q(q, 3, array['PE02'], 'During the walk-around you see flaking paint around a weld on the mast. This could indicate:',
    'Paint separation around welds can be a sign of a crack or stressed weld underneath. Record and report it.', 1,
    array['A crack or stressed weld underneath', 'The forklift needs washing', 'Normal wear that can be ignored', 'Low tyre pressure']);
  perform pg_temp.add_q(q, 4, array['PE07'], 'How should you get on and off a forklift?',
    'Use the steps and handholds with three points of contact. Never jump.', 4,
    array['Jump down to save time', 'Use the steering wheel to swing off', 'Step on the forks', 'Use the steps and handholds with three points of contact']);
  perform pg_temp.add_q(q, 5, array['PE05'], 'During operational checks, the hydraulic functions should be:',
    'Run lift, tilt and side shift through their full range and check they move smoothly.', 2,
    array['Tested only if the load is heavy', 'Run through their full range to check smooth operation', 'Left untested to save time', 'Tested with a full load at maximum height']);
  perform pg_temp.add_q(q, 6, array['KE07'], 'What is the correct order for lock out / tag out?',
    'Stop and park safely, isolate the power, tag it out of service, then report and record the fault.', 1,
    array['Stop, isolate the power, tag it, report it', 'Report it, then keep using it until it''s collected', 'Tag it, keep the engine running, report it', 'Remove the tag, then report it']);
  perform pg_temp.add_q(q, 7, array['KE04'], 'Your forklift begins to tip over sideways. What should you do?',
    'Never jump. Stay in the seat with the belt on, hold the wheel, brace your feet and lean away from the fall.', 3,
    array['Jump clear on the low side', 'Jump clear on the high side', 'Stay seated with the seatbelt on, hold the wheel, brace and lean away from the fall', 'Raise the mast to rebalance it']);
  perform pg_temp.add_q(q, 8, array['KE13'], 'Your LPG forklift starts to stutter and lose power. The most likely cause is:',
    'A stuttering LPG engine usually means the cylinder is running empty. Park safely and change it following procedure.', 2,
    array['A flat tyre', 'The gas cylinder is running empty', 'The seatbelt is undone', 'The forks are too low']);

  -- ════════════════════════════════════════════════════════════════════
  -- Module 4 — Loads, stability and attachments
  -- ════════════════════════════════════════════════════════════════════
  perform pg_temp.add_lesson(m4, c, 1, 'stability-triangle', 'Centre of gravity and the stability triangle', 8, false,
    array['KE04','KE03'], $md$
## How a counterbalance forklift stays upright

A counterbalance forklift works like a **see-saw**: the front wheels are the pivot (fulcrum), the load is on one side and the counterweight on the other.

Most counterbalance forklifts have **three-point suspension**: the two front wheels and the pivot point of the rear axle. These form the **stability triangle**.

- The **combined centre of gravity** of the forklift and load must stay **inside the stability triangle**.
- If it moves outside, the forklift tips.

### Causes of instability

- **Overloading** — lifting more than the rated capacity
- **Lifting high** — raises the centre of gravity
- **Tilting forward** with a raised load
- **Turning sharply or too fast**
- **Ramps, slopes and uneven surfaces**
- **Ground giving way** — soft, backfilled or deteriorating ground
- **Irregular or unbalanced loads**
- **Picking up or placing loads** carelessly — e.g. catching a rack, dropping a load
- **Restricted spaces** that force tight turns or awkward approaches
- **Sudden braking or acceleration**

That's why you **travel with the load low and tilted back**, turn slowly, and never turn on a slope.
$md$);

  perform pg_temp.add_lesson(m4, c, 2, 'load-charts', 'The data plate and rated capacity', 9, false,
    array['KE03','PE01'], $md$
## Rated capacity

Every forklift has a manufacturer's **data plate**. It shows the forklift's **rated capacity** — the **maximum weight it can safely lift**.

> **Never lift more than the rated capacity.** If the load is heavier, don't lift it.

The data plate also shows the **load centre** the capacity is rated at. The most common is **600 mm**.

- **Load centre** — the distance from the vertical face of the tynes to the load's centre of gravity (the middle of its weight).
- The rated capacity applies when the load centre is **no more than** the one on the data plate. If a load's centre of gravity is **further out** than that (for example a long crate), **don't lift it** — ask your supervisor.
- **Attachments** — when an attachment is fitted, use the data plate for that attachment.

### Example

Forklift A's data plate says **2,500 kg at a 600 mm load centre**. A pallet weighing **1,900 kg** with its load centre at **600 mm** is within capacity — **OK to lift**. A machine weighing **2,700 kg** is **200 kg over** — **don't lift it**.

> Never add extra counterweight or put people on the back to "balance" a load.

Only use attachments and modifications **approved by the manufacturer**, with a matching data plate.
$md$);

  perform pg_temp.add_lesson(m4, c, 3, 'working-out-load-weight', 'Working out the weight of a load', 8, false,
    array['KE05','PE07'], $md$
## Know the weight before you lift

You can't check the load against the rated capacity if you don't know the weight. Ways to find it:

- **Load labels and markings** on the item or pallet
- **Consignment notes** and **running sheets** from the transport company
- **Weighbridge dockets**
- **Manufacturer's documentation** (e.g. for a machine or tank)
- **The data plate** on equipment being moved (many machines show their own weight)
- **Weighing** — weigh one carton and multiply, or use scales / a load-weighing indicator on the forklift

If you can't confirm the weight — **don't lift it**. Ask your supervisor.

## Calculating from cartons

**Total weight = (number of cartons × weight of one carton) + weight of the pallet**

### Worked example

A pallet holds **5 layers of 8 cartons**. Each carton weighs **20 kg**. The pallet weighs **25 kg**.

1. **Count** the cartons: 5 × 8 = **40 cartons**
2. **Multiply** by the carton weight: 40 × 20 = **800 kg**
3. **Add** the pallet: 800 + 25 = **825 kg**

Then compare it with the forklift's **rated capacity** on the data plate. If 825 kg is less than or equal to the rated capacity, it's OK to lift.

> **Count → Multiply → Add the pallet.** Use a calculator and write each step down — that's what you'll do in the assessment too.
$md$);

  perform pg_temp.add_lesson(m4, c, 4, 'attachments', 'Attachments and their capacity', 9, false,
    array['KE11','KE03','PE01','PE07'], $md$
## Attachments reduce capacity

An attachment **adds weight** to the front of the forklift and usually **moves the load centre forward**. Both reduce how much you can safely lift.

- Only fit attachments **approved by the manufacturer** for that forklift.
- The forklift must have a **data plate that covers the attachment**.
- Check the attachment is **secured** (locking pins, bolts, hydraulic connections) before use.
- Follow the **attachment manufacturer's instructions**.

## Common attachments

| Attachment | Used for | Key safety points |
|---|---|---|
| **Side shifter** | Moving the tynes sideways to line up loads | Centre the load before travelling |
| **Fork extensions (slippers)** | Long or deep loads | Must be rated and the right size for the tynes, fully secured; capacity reduces |
| **Jib** | Lifting a load from a hook | The suspended load **swings** — move slowly; capacity varies by hook position |
| **Carpet spike / pole** | Carpet rolls, coils | Insert fully; watch for loads sliding off |
| **Drum carrier / clamp** | Drums | Drum must be gripped securely; liquids can slosh |
| **Bale clamp** | Bales (wool, cotton, hay, paper) | Correct clamp pressure — too little drops it, too much damages it |
| **Paper roll clamp** | Large paper rolls | Correct clamp pressure; rolls are heavy for their size |
| **Rotator** | Rotating or tipping loads | Rotating shifts the centre of gravity — rotate with the load low and the forklift stationary |
| **Personnel (work) platform** | Lifting people to work at height | Only a purpose-built platform designed for the forklift, secured to it, with the operator at the controls. **Never** lift people on the tynes or a pallet. |
$md$);

  perform pg_temp.add_lesson(m4, c, 5, 'unusual-loads', 'Unbalanced, irregular and dynamic loads', 7, false,
    array['KE04','PE07','PE08'], $md$
## Unbalanced loads

If the weight isn't centred, the centre of gravity shifts **sideways** and the forklift is easier to tip in a turn.

- Position the tynes so the load is **centred** between them — use the side shift if fitted.
- If a load is badly stacked, have it **restacked** before lifting.

## Irregular loads

Long, wide, tall or odd-shaped loads (pipes, timber, machinery):

- Spread the tynes **as wide as practical** for the load.
- Allow **extra clearance** — long loads swing wide on turns.
- Use an **observer** if the load blocks your view.
- Secure the load if needed.

## Dynamic loads

A **dynamic load** moves while you're carrying it — liquids in drums or IBCs, or a load hanging from a jib. The movement adds force and shifts the centre of gravity.

- Accelerate, brake and turn **smoothly**.
- Travel **slowly**, with the load low.
- Avoid sudden stops — a swinging load keeps moving.

## Loads without pallets

Use **gluts or dunnage** (timber blocks or bearers) under loads so the tynes can be inserted and withdrawn without damaging the load.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m4, 'Module 4 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, array['KE04'], 'The stability triangle of a counterbalance forklift is formed by:',
    'The two front wheels and the rear axle pivot point form the stability triangle.', 2,
    array['All four wheels', 'The two front wheels and the rear axle pivot point', 'The mast and the two front wheels', 'The tynes and the counterweight']);
  perform pg_temp.add_q(q, 2, array['KE03'], 'What does the rated capacity on a forklift''s data plate tell you?',
    'The rated capacity is the maximum weight the forklift can safely lift. Never lift more than it.', 3,
    array['The forklift''s top speed', 'How much fuel it holds', 'The maximum weight it can safely lift', 'How high the mast can reach']);
  perform pg_temp.add_cq(q, 3, array['KE05'], 'A pallet has 40 cartons weighing 20 kg each. The pallet weighs 20 kg. What is the total weight?',
    '40 × 20 = 800 kg, plus the 20 kg pallet = 820 kg.', 2,
    array['800 kg', '820 kg', '840 kg', '860 kg']);
  perform pg_temp.add_q(q, 4, array['KE05'], 'Which document from a transport company may show the weight of a load?',
    'Consignment notes and running sheets often list the weight of each item.', 1,
    array['A consignment note', 'A pre-start checklist', 'A traffic management plan', 'A fire evacuation map']);
  perform pg_temp.add_q(q, 5, array['KE05'], 'You can''t find the weight of a load anywhere. What should you do?',
    'Never guess. Don''t lift until the weight is confirmed — ask your supervisor or weigh it.', 4,
    array['Lift it slowly and see what happens', 'Estimate it by eye', 'Lift it on the strongest forklift available', 'Don''t lift it until you''ve confirmed the weight']);
  perform pg_temp.add_q(q, 6, array['KE11'], 'Fitting an attachment to a forklift will usually:',
    'Attachments add weight and move the load centre forward, so capacity goes down.', 1,
    array['Reduce its lifting capacity', 'Increase its lifting capacity', 'Have no effect on capacity', 'Allow it to carry passengers']);
  perform pg_temp.add_q(q, 7, array['KE11'], 'Which is the ONLY acceptable way to lift a person with a forklift?',
    'Only a purpose-built work platform designed for the forklift, secured to it, with the operator at the controls.', 3,
    array['Standing on the tynes', 'Standing on a pallet', 'In a purpose-built work platform secured to the forklift', 'Sitting on the load']);
  perform pg_temp.add_q(q, 8, array['KE04','PE07'], 'Which is an example of a dynamic load?',
    'Liquid in a drum or IBC moves while you travel, shifting the centre of gravity.', 2,
    array['A pallet of bricks', 'A drum of liquid', 'A stack of timber', 'A crate of tiles']);
  perform pg_temp.add_q(q, 9, array['PE07'], 'A load is heavier on one side. Before lifting, you should:',
    'Position the tynes (or use side shift) so the load is centred, or have it restacked.', 3,
    array['Lift it high to balance it', 'Drive faster so it doesn''t tip', 'Centre the load on the tynes or have it restacked', 'Tilt the mast forward']);

  -- ════════════════════════════════════════════════════════════════════
  -- Module 5 — Load calculations
  -- ════════════════════════════════════════════════════════════════════
  perform pg_temp.add_lesson(mc, c, 1, 'weights-and-quantities', 'Load weights: units, totals and maximum quantities', 9, false,
    array['KE05'], $md$
## Maths made simple

Every load calculation uses the same few steps. Take it slowly, **use a calculator**, and **write each step down**.

> **Count → Multiply → Add the pallet**

## Tonnes and kilograms

Rated capacity on the data plate is in **kilograms (kg)**. Paperwork sometimes uses **tonnes (t)**.

**1 tonne = 1,000 kg.** To change tonnes into kilograms, **multiply by 1,000**.

| Tonnes | Kilograms |
|---|---|
| 0.5 t | 500 kg |
| 1.5 t | 1,500 kg |
| 2.5 t | 2,500 kg |

## Adding up several items

When a pallet has different items on it, **add every item, then add the pallet**.

> A pallet weighing **50 kg** carries items of **400 kg**, **350 kg** and **600 kg**.
> 400 + 350 + 600 = 1,350 kg → add the pallet: 1,350 + 50 = **1,400 kg**

## Cartons in layers

1. **Count:** layers × cartons in each layer
2. **Multiply:** number of cartons × weight of one carton
3. **Add** the pallet

> 5 layers of 10 cartons, 20 kg each, on a 30 kg pallet:
> 5 × 10 = 50 cartons → 50 × 20 = 1,000 kg → 1,000 + 30 = **1,030 kg**

## Weighbridge dockets

A weighbridge weighs the whole truck. **Load = loaded truck − empty truck.**

> Loaded truck **18,000 kg**, empty truck **12,000 kg** → load = **6,000 kg**.
> If that's **4 identical pallets**: 6,000 ÷ 4 = **1,500 kg each**.

## The most cartons you can carry

1. Take the pallet off the limit: **limit − pallet**
2. Divide by the weight of one carton
3. If the answer has a decimal, **round DOWN** — never up

> Limit **1,000 kg**, pallet **20 kg**, cartons **30 kg** each:
> 1,000 − 20 = 980 → 980 ÷ 30 = 32.67 → **32 cartons**.
> Check: 33 cartons would be 33 × 30 + 20 = **1,010 kg** — over the limit.
$md$);

  perform pg_temp.add_lesson(mc, c, 2, 'working-out-load-centre', 'Working out the load centre', 7, false,
    array['KE03','KE04','PE07'], $md$
## What you're measuring

The **load centre** is the distance from the **front face of the tynes** (where the load sits against the backrest) to the **middle of the load's weight** (its centre of gravity).

Most forklift data plates are rated at a **600 mm** load centre.

## Even loads pushed hard against the backrest

If the weight is spread evenly, the centre of gravity is in the **middle** of the load.

**Load centre = depth of the load ÷ 2** (half the depth)

> A crate **1,200 mm** deep, pushed hard against the backrest → 1,200 ÷ 2 = **600 mm**.

## If there's a gap

If the load **isn't hard against the backrest**, add the gap.

**Load centre = gap + half the depth**

> A **1,000 mm** deep load sitting **200 mm** away from the backrest → 200 + 500 = **700 mm**.

That's why you **insert the tynes fully** — a gap pushes the load centre forward, past the 600 mm the rated capacity is based on. If the load centre is more than the data plate's load centre, **don't lift** — ask your supervisor.

## Uneven loads

If one end is heavier (e.g. a machine with the motor at one end), the centre of gravity **isn't in the middle**. Check markings or paperwork for the centre of gravity, put the **heavy end towards the mast**, and ask your supervisor if you're unsure.
$md$);

  perform pg_temp.add_lesson(mc, c, 3, 'reading-a-load-chart', 'Checking a load against rated capacity, step by step', 10, false,
    array['KE03','KE05','PE01'], $md$
## Three steps

1. **Weight** — work out how heavy the load is (Count → Multiply → Add the pallet).
2. **Load centre** — check the load's centre is **no more than** the data plate's load centre (usually **600 mm**). If it's further out, **don't lift** — ask your supervisor.
3. **Compare** — is the load **less than or equal to** the **rated capacity**? Yes → OK to lift. No → **do not lift**.

## Practice data plate (fictional)

**Forklift A — rated capacity 2,500 kg at a 600 mm load centre.**

## Worked example 1 — OK to lift

A pallet weighs **1,900 kg** and its load centre is **600 mm**.
1,900 is less than 2,500 → **OK to lift.** You have 2,500 − 1,900 = **600 kg** to spare.

## Worked example 2 — too heavy

A crate weighs **2.7 t**. 2.7 × 1,000 = **2,700 kg**.
2,700 is more than 2,500 → **Do not lift** — it's **200 kg over**.

## Worked example 3 — cartons

48 cartons of **50 kg** on a **30 kg** pallet: 48 × 50 = 2,400 → + 30 = **2,430 kg**.
2,430 is less than 2,500 → **OK to lift**, with **70 kg** to spare.

## Worked example 4 — the most you can lift

How many **600 kg** drums can Forklift A carry at once (on a drum carrier rated 2,500 kg)?
2,500 ÷ 600 = 4.17 → round **down** → **4 drums** (2,400 kg). Five would be 3,000 kg — too heavy.

> If the answer has a decimal, **always round down**. Rounding up puts you over the rated capacity.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, mc, 'Module 5 quiz — calculations', 80) returning id into q;
  perform pg_temp.add_cq(q, 1, array['KE05'],
    'A pallet holds 5 layers of 10 cartons. Each carton weighs 20 kg and the pallet weighs 30 kg. What is the total weight?',
    '5 × 10 = 50 cartons. 50 × 20 = 1,000 kg. 1,000 + 30 = 1,030 kg.', 2,
    array['1,000 kg', '1,030 kg', '1,050 kg', '1,300 kg']);
  perform pg_temp.add_cq(q, 2, array['KE05'],
    'A consignment note shows a load of 1.5 t. How many kilograms is that?',
    '1 tonne = 1,000 kg, so 1.5 × 1,000 = 1,500 kg.', 3,
    array['15 kg', '150 kg', '1,500 kg', '15,000 kg']);
  perform pg_temp.add_cq(q, 3, array['KE05'],
    'One pallet (50 kg) carries three items: 400 kg, 350 kg and 600 kg. What is the total weight?',
    '400 + 350 + 600 = 1,350 kg. Add the 50 kg pallet = 1,400 kg.', 2,
    array['1,350 kg', '1,400 kg', '1,450 kg', '1,300 kg']);
  perform pg_temp.add_cq(q, 4, array['KE05'],
    'A weighbridge docket shows the loaded truck at 18,000 kg and the empty truck at 12,000 kg. The load is 4 identical pallets. How much does each pallet weigh?',
    'Load = 18,000 − 12,000 = 6,000 kg. 6,000 ÷ 4 = 1,500 kg per pallet.', 1,
    array['1,500 kg', '3,000 kg', '4,500 kg', '6,000 kg']);
  perform pg_temp.add_cq(q, 5, array['KE05'],
    'You may lift a maximum of 1,000 kg. The pallet weighs 40 kg and each carton weighs 30 kg. What is the most cartons you can load?',
    '1,000 − 40 = 960. 960 ÷ 30 = 32 cartons. Check: 32 × 30 + 40 = 1,000 kg.', 2,
    array['30', '32', '33', '34']);
  perform pg_temp.add_cq(q, 6, array['KE05'],
    'You may lift a maximum of 1,000 kg. The pallet weighs 20 kg and each carton weighs 30 kg. What is the most cartons you can load?',
    '1,000 − 20 = 980. 980 ÷ 30 = 32.67 — always round DOWN: 32. 33 cartons would weigh 1,010 kg with the pallet.', 1,
    array['32', '33', '34', '31']);
  perform pg_temp.add_cq(q, 7, array['KE03'],
    'An evenly loaded crate is 1,200 mm deep and sits hard against the backrest. What is its load centre?',
    'Half the depth: 1,200 ÷ 2 = 600 mm.', 2,
    array['300 mm', '600 mm', '1,200 mm', '2,400 mm']);
  perform pg_temp.add_cq(q, 8, array['KE03','PE07'],
    'An evenly loaded crate 1,000 mm deep is sitting 200 mm away from the backrest. What is its load centre?',
    'Gap + half the depth = 200 + 500 = 700 mm.', 3,
    array['500 mm', '600 mm', '700 mm', '1,200 mm']);
  perform pg_temp.add_cq(q, 9, array['KE03','PE01'],
    'Forklift A has a rated capacity of 2,500 kg at a 600 mm load centre. Can it lift a 1,900 kg pallet with a 600 mm load centre?',
    '1,900 kg is less than the 2,500 kg rated capacity, and the load centre is 600 mm — OK to lift, with 600 kg to spare.', 1,
    array['Yes — it''s 600 kg under the rated capacity', 'No — it''s 600 kg over the rated capacity', 'No — the load centre is too far out', 'Only if someone sits on the back']);
  perform pg_temp.add_cq(q, 10, array['KE03','PE01'],
    'Forklift A is rated at 2,500 kg. A crate on a consignment note weighs 2.7 t. Can it lift the crate?',
    '2.7 × 1,000 = 2,700 kg. That''s 200 kg more than the 2,500 kg rated capacity — do not lift.', 2,
    array['Yes — 2.7 t is less than 2,500 kg', 'No — it''s 200 kg over the rated capacity', 'Yes — it''s only 200 kg over', 'No — it''s 2,000 kg over']);
  perform pg_temp.add_cq(q, 11, array['KE03','KE05'],
    'A forklift is rated at 2,000 kg. A pallet holds 48 cartons of 40 kg each, and the pallet weighs 30 kg. Is the load within the rated capacity?',
    '48 × 40 = 1,920 kg. 1,920 + 30 = 1,950 kg. That''s 50 kg under the 2,000 kg rated capacity — OK to lift.', 1,
    array['Yes — 1,950 kg is within 2,000 kg', 'No — 2,050 kg is over 2,000 kg', 'No — 1,950 kg is over 1,920 kg', 'Yes — 1,920 kg is within 2,000 kg']);
  perform pg_temp.add_cq(q, 12, array['KE03','KE05'],
    'A forklift is rated at 1,500 kg. Paperwork says the load is 1.8 t. What should you do?',
    '1.8 × 1,000 = 1,800 kg — 300 kg over the 1,500 kg rated capacity. Don''t lift it; tell your supervisor.', 3,
    array['Lift it slowly', 'Lift it with the load tilted back', 'Don''t lift it — it''s 300 kg over the rated capacity', 'Lift it if the ground is flat']);
  perform pg_temp.add_cq(q, 13, array['KE03','KE05'],
    'A forklift with a drum carrier is rated at 2,500 kg. Each full drum weighs 600 kg. What is the most drums it can carry at once?',
    '2,500 ÷ 600 = 4.17 — always round down: 4 drums (2,400 kg). Five drums would be 3,000 kg.', 2,
    array['3', '4', '5', '6']);
  perform pg_temp.add_cq(q, 14, array['KE03','KE05'],
    'A forklift is rated at 2,500 kg. It is carrying a 1,800 kg crate. How much more weight could be added without going over the rated capacity?',
    '2,500 − 1,800 = 700 kg.', 1,
    array['700 kg', '800 kg', '1,700 kg', '4,300 kg']);

  -- ════════════════════════════════════════════════════════════════════
  -- Module 6 — Safe operation and load handling
  -- ════════════════════════════════════════════════════════════════════
  perform pg_temp.add_lesson(m5, c, 1, 'travelling-safely', 'Travelling, ramps and visibility', 9, false,
    array['PE01','PE08','KE04'], $md$
## Travelling

- Wear your **seatbelt**.
- Travel with the load **low** — just high enough to clear the ground and suit the surface (commonly around 100–150 mm) — and the mast **tilted back**.
- Keep a **safe speed** for the load, surface and surroundings, within site limits.
- **Look in the direction of travel.** If the load blocks your forward view, **travel in reverse** or use an **observer (spotter)**.
- Use your **mirrors** and **sound the horn** at blind corners, doorways and intersections.
- Turn **slowly** — especially when carrying a load.
- **Never carry passengers.**
- Keep arms, legs and head **inside** the overhead guard.

## Ramps and slopes

- **Loaded:** keep the **load on the uphill side** — drive **forwards up**, **reverse down**.
- **Unloaded:** keep the **tynes pointing downhill** — reverse up, drive forwards down.
- **Never turn** on a ramp or slope, and never travel across it.

## Pedestrians

Follow the traffic management plan, use forklift routes, make eye contact, and **stop** if anyone enters your work area.
$md$);

  perform pg_temp.add_lesson(m5, c, 2, 'picking-up-and-stacking', 'Picking up, the trial lift and stacking', 10, false,
    array['PE08','PE07','KE04'], $md$
## Picking up a load

1. Approach **slowly and squarely**, tynes level, at the right height.
2. **Position the tynes** to suit the pallet or load — spread as wide as practical, load centred.
3. Insert the tynes **fully**, so the load is against the backrest.
4. **Trial lift:** lift the load just clear of its support and check — is the forklift stable? Is the load secure and balanced? If the rear wheels feel light or anything moves, **lower it straight away** and reassess.
5. **Tilt back** slightly, check behind you, and reverse out slowly.
6. **Lower to travel height** before moving off.

## Placing a load at height (racking)

- Check the **racking is compliant** and its capacity suits the load.
- Approach squarely and **stop** before the rack.
- Only raise or lower the load **when stationary**.
- Raise to the required height, **level the tynes**, then **inch forward**.
- Use **tilt and side shift** to position the load accurately.
- Lower onto the beams, withdraw the tynes, then lower to travel height before moving.

Use an **observer** whenever your view is restricted — agree hand signals first.

## Placing on an elevated flat surface (e.g. a mezzanine or truck deck)

The surface must be **flat, stable and strong enough**. Use **gluts or dunnage** under unpalletised loads so you can withdraw the tynes cleanly.
$md$);

  perform pg_temp.add_lesson(m5, c, 3, 'loading-trucks', 'Loading and unloading trucks', 6, false,
    array['PE03','KE14','PE09'], $md$
## Before you start

- Check the truck **can't move** — handbrake on, wheels chocked or vehicle restraint engaged, driver in a safe area away from the loading zone.
- Set up an **exclusion zone** around the truck.
- Check **dock plates** are secure and rated for the forklift plus load.
- Check the trailer floor is sound and can take the weight.
- Watch for **dock edges** — keep well back.

## Side loading from the ground

- Check **overhead hazards** — powerlines, awnings.
- Make sure the ground is **firm and level**.
- Watch for loads shifting on the deck when straps are removed — **check before unstrapping**.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m5, 'Module 6 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, array['PE01'], 'You are carrying a load up a ramp. How should you travel?',
    'Loaded, keep the load uphill: forwards up, reverse down.', 1,
    array['Drive forwards up the ramp, load uphill', 'Reverse up the ramp, load downhill', 'Drive across the ramp diagonally', 'Raise the load high for better visibility']);
  perform pg_temp.add_q(q, 2, array['PE08'], 'The load is blocking your forward view. What should you do?',
    'Travel in reverse, looking in the direction of travel, or use an observer.', 2,
    array['Raise the load higher', 'Travel in reverse or use an observer', 'Lean out the side and drive forwards', 'Sound the horn continuously and drive forwards']);
  perform pg_temp.add_q(q, 3, array['PE08'], 'What is the purpose of a trial lift?',
    'Lifting just clear of the support lets you confirm the forklift is stable and the load is secure before moving.', 3,
    array['To test the horn', 'To warm up the hydraulics', 'To check the forklift is stable and the load is secure before moving', 'To measure the height of the rack']);
  perform pg_temp.add_q(q, 4, array['PE08'], 'When may you raise or lower a load?',
    'Only when the forklift is stationary.', 3,
    array['While turning', 'While travelling slowly', 'Only when the forklift is stationary', 'Any time if the area is clear']);
  perform pg_temp.add_q(q, 5, array['PE08'], 'A crate has no pallet. How can you lift it without damaging it?',
    'Place it on gluts or dunnage so the tynes can be inserted and withdrawn.', 4,
    array['Push the tynes under it', 'Tip it onto its side', 'Lift it with a chain around the mast', 'Place it on gluts or dunnage']);
  perform pg_temp.add_q(q, 6, array['PE01'], 'A co-worker asks for a lift across the warehouse on the forklift. You should:',
    'Never carry passengers.', 4,
    array['Let them stand on the tynes', 'Let them sit on the counterweight', 'Drive slowly with them on board', 'Refuse — forklifts must never carry passengers']);
  perform pg_temp.add_q(q, 7, array['PE03'], 'Before loading a truck at a dock, you must make sure:',
    'The truck must be secured so it can''t move, and the dock plate must be secure and rated.', 2,
    array['The truck''s engine is running', 'The truck is secured from moving and the dock plate is secure and rated', 'The truck driver stays in the cab', 'The dock plate is removed']);

  -- ════════════════════════════════════════════════════════════════════
  -- Module 7 — Shutdown, refuelling and recharging
  -- ════════════════════════════════════════════════════════════════════
  perform pg_temp.add_lesson(m6, c, 1, 'shutting-down', 'Shutting down and parking', 5, false,
    array['PE10','KE12'], $md$
## Parking the forklift

Park in a **designated safe area** — never on a slope, and never blocking exits, walkways, fire equipment or electrical switchboards.

1. Stop and select **neutral**.
2. Apply the **park brake**.
3. **Lower the tynes** (or attachment) fully to the ground, tilted forward so the tips rest on the floor.
4. Shut down as the manufacturer requires, **isolate the power source** (e.g. LPG valve or battery isolator, per site procedure) and **remove the key**.
5. Secure the forklift against **unauthorised use**.
6. Do a **post-operational check** and record and report any defects from the shift.
$md$);

  perform pg_temp.add_lesson(m6, c, 2, 'lpg-and-batteries', 'Refuelling and recharging', 9, false,
    array['KE08','PE06'], $md$
## Changing an LPG cylinder

- Only in a **well-ventilated area**, away from ignition sources — **no smoking** or naked flames.
- Wear **PPE** — gloves and eye protection. LPG can cause **cold burns**.
- **Close the cylinder valve** and let the engine run until it stops, then turn the ignition off.
- Disconnect and remove the cylinder; check the new cylinder's **valve, O-ring/seal and connection** for damage.
- Fit it with the **locating pin** in place and the cylinder secured.
- Open the valve slowly and **check for leaks** with soapy water or leak-detection solution — **never a flame**.

## Petrol and diesel

- Engine **off**, no smoking, in the designated refuelling area.
- Don't overfill; clean up spills straight away.

## Charging electric forklift batteries

- Only in the **designated charging area**.
- Charging gives off **hydrogen gas**, which is explosive — the area must be **ventilated** and free of ignition sources.
- Wear **PPE** — battery acid is corrosive. Know where the **eyewash** station is.
- **Turn the charger off before connecting or disconnecting** the battery, to avoid sparks.
- Check cables and plugs for damage; follow the manufacturer's instructions for electrolyte levels.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m6, 'Module 7 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, array['PE10'], 'When parking a forklift, the tynes should be:',
    'Lower them fully to the ground with the tips resting on the floor.', 2,
    array['Raised to chest height', 'Fully lowered to the ground', 'Raised slightly so they''re visible', 'Left at travel height']);
  perform pg_temp.add_q(q, 2, array['KE08'], 'Which gas is released when charging a lead-acid forklift battery?',
    'Charging releases hydrogen, which is explosive — ventilation is essential.', 1,
    array['Hydrogen', 'Carbon dioxide', 'Nitrogen', 'Oxygen only']);
  perform pg_temp.add_q(q, 3, array['KE08','PE06'], 'How should you check a newly fitted LPG cylinder for leaks?',
    'Use soapy water or a leak-detection solution. Never a flame.', 3,
    array['With a lighter', 'By smell only', 'With soapy water or leak-detection solution', 'By running the engine at full revs']);
  perform pg_temp.add_q(q, 4, array['KE08','PE06'], 'What PPE should you wear when changing an LPG cylinder?',
    'Gloves and eye protection — LPG can cause cold burns.', 4,
    array['None is needed', 'A hard hat only', 'Hearing protection only', 'Gloves and eye protection']);
  perform pg_temp.add_q(q, 5, array['PE10','KE12'], 'Where should you NOT park a forklift?',
    'Never block exits, walkways, fire equipment or switchboards, and never park on a slope.', 4,
    array['In the designated parking bay', 'On level ground', 'Away from walkways', 'In front of a fire extinguisher']);

  -- ════════════════════════════════════════════════════════════════════
  -- Final practice exam — spans every KE item
  -- ════════════════════════════════════════════════════════════════════
  insert into public.quizzes (course_id, module_id, title, pass_mark, is_final)
  values (c, null, 'Final practice exam', 80, true) returning id into q;

  perform pg_temp.add_q(q, 1, array['KE16'], 'Who issues a High Risk Work Licence?',
    'The state or territory WHS regulator issues the licence after an accredited assessor assesses you.', 3,
    array['Your employer', 'The forklift manufacturer', 'The state or territory WHS regulator', 'Any trainer on the spot']);
  perform pg_temp.add_q(q, 2, array['KE01'], 'The AS 2359 series of Australian Standards relates to:',
    'AS 2359 covers powered industrial trucks — forklifts.', 2,
    array['Scaffolding', 'Powered industrial trucks (forklifts)', 'Electrical wiring', 'Cranes only']);
  perform pg_temp.add_q(q, 3, array['KE15'], 'Your supervisor gives you a verbal instruction you don''t fully understand. You should:',
    'Use questioning to confirm the instruction before you start.', 1,
    array['Ask questions to confirm what is needed before starting', 'Do what you think they meant', 'Ignore it', 'Wait until the end of the shift']);
  perform pg_temp.add_q(q, 4, array['KE02'], 'Which is a "traffic warning system"?',
    'Warning lights and signs at doorways and intersections are traffic warning systems.', 4,
    array['A fire extinguisher', 'A pre-start checklist', 'A data plate', 'Flashing warning lights at a doorway']);
  perform pg_temp.add_q(q, 5, array['KE10'], 'PPE sits where in the hierarchy of control?',
    'PPE is the least effective control — the last line of defence.', 4,
    array['First — most effective', 'Second', 'In the middle', 'Last — least effective']);
  perform pg_temp.add_q(q, 6, array['PE03'], 'Which of these is an overhead hazard?',
    'Powerlines, low beams and doorways can be struck by the mast or load.', 3,
    array['A pothole', 'An oil spill', 'Electrical powerlines', 'A pedestrian walkway']);
  perform pg_temp.add_q(q, 7, array['KE14'], 'Why should you avoid driving on recently backfilled ground?',
    'Backfilled ground may not be compacted and can collapse under the forklift.', 2,
    array['It is too slippery', 'It may collapse under the weight of the forklift', 'It damages the tyres', 'It is always a pedestrian area']);
  perform pg_temp.add_q(q, 8, array['KE06'], 'You''re moving sheets of plywood outdoors on a very windy day. The main risk is:',
    'Large flat loads catch the wind like a sail and can become unstable.', 1,
    array['The load catches the wind and becomes unstable', 'The engine overheats', 'The horn won''t be heard', 'The tyres lose pressure']);
  perform pg_temp.add_q(q, 9, array['KE06'], 'What is a sensible response to working in extreme heat?',
    'Drink water, take breaks and watch for heat stress; use sun protection outdoors.', 3,
    array['Work faster to finish early', 'Remove your seatbelt to stay cool', 'Drink water, take breaks and watch for heat stress', 'Nothing — heat doesn''t affect operators']);
  perform pg_temp.add_q(q, 10, array['KE12','PE09'], 'A traffic management plan is used to:',
    'It separates people and vehicles and sets routes, speed limits, crossings and signage.', 2,
    array['Record forklift fuel use', 'Separate pedestrians and vehicles and set routes and speed limits', 'List the weight of loads', 'Schedule forklift servicing']);
  perform pg_temp.add_q(q, 11, array['PE02'], 'During the pre-start you find a crack at the heel of a tyne. You should:',
    'A cracked tyne is a serious defect. Tag the forklift out and report it.', 2,
    array['Use the forklift for light loads only', 'Tag it out of service and report it', 'Swap the tynes around', 'Continue and report at the end of the shift']);
  perform pg_temp.add_q(q, 12, array['PE05'], 'During operational checks you hear a grinding noise from the mast. You should:',
    'Unusual noises are a sign of a fault — stop, tag out and report.', 4,
    array['Turn the radio up', 'Keep working and see if it stops', 'Spray it with water', 'Stop, tag it out and report it']);
  perform pg_temp.add_q(q, 13, array['KE07'], 'Who may remove an "Out of service" tag from a forklift?',
    'Only an authorised person, once the repair has been completed and checked.', 1,
    array['Only an authorised person once the repair is done and checked', 'Any operator who needs the forklift', 'The person who found the fault, after lunch', 'Anyone, if the supervisor is away']);
  perform pg_temp.add_q(q, 14, array['KE04'], 'The service brakes fail while you are travelling. What should you do?',
    'Take your foot off the accelerator, warn others with the horn, steer clear of people and obstacles, and use the park brake to stop.', 3,
    array['Jump off the forklift', 'Raise the load to slow down', 'Warn others with the horn, steer to a safe area and use the park brake to stop', 'Accelerate to get to the parking bay']);
  perform pg_temp.add_q(q, 15, array['KE13'], 'The temperature gauge shows the engine is overheating. You should:',
    'Stop and shut down safely, let it cool, and report it. Never open a hot radiator cap.', 2,
    array['Open the radiator cap straight away', 'Stop, shut down, let it cool and report it', 'Keep driving to cool it with airflow', 'Pour cold water on the engine']);
  perform pg_temp.add_q(q, 16, array['KE04'], 'For the forklift to stay stable, the combined centre of gravity must stay:',
    'It must stay within the stability triangle.', 1,
    array['Inside the stability triangle', 'Over the tynes', 'Behind the counterweight', 'Above the mast']);
  perform pg_temp.add_q(q, 17, array['KE03'], 'Where do you find a forklift''s rated capacity?',
    'The rated capacity is on the manufacturer''s data plate.', 2,
    array['The fuel gauge', 'The data plate', 'The traffic management plan', 'The racking label only']);
  perform pg_temp.add_cq(q, 18, array['KE05'], 'A pallet holds 50 cartons of 20 kg each. The pallet weighs 25 kg. What is the total load weight?',
    '50 × 20 = 1,000 kg, plus the 25 kg pallet = 1,025 kg.', 3,
    array['1,000 kg', '1,020 kg', '1,025 kg', '1,250 kg']);
  perform pg_temp.add_q(q, 19, array['KE05'], 'Which document records a load''s weight measured at a weighbridge?',
    'A weighbridge docket shows the measured weight.', 4,
    array['A pre-start checklist', 'A SWMS', 'A hazard report', 'A weighbridge docket']);
  perform pg_temp.add_q(q, 20, array['KE11'], 'You''re using a jib attachment. What extra hazard must you manage?',
    'A load hanging from a jib can swing — move slowly and smoothly; capacity depends on hook position.', 1,
    array['The suspended load can swing', 'The tyres wear faster', 'The horn stops working', 'There are no extra hazards']);
  perform pg_temp.add_q(q, 21, array['KE11'], 'Before using a rotator attachment to tip a load, you should:',
    'Rotating shifts the centre of gravity — keep the load low and the forklift stationary.', 3,
    array['Raise the load to full height', 'Travel at speed', 'Keep the load low and the forklift stationary', 'Remove the data plate']);
  perform pg_temp.add_q(q, 22, array['PE08'], 'Driving an unloaded forklift down a ramp, you should:',
    'Unloaded, keep the tynes pointing downhill: drive forwards down the ramp.', 3,
    array['Reverse down with tynes uphill', 'Turn halfway down', 'Drive forwards down with the tynes pointing downhill', 'Raise the tynes high']);
  perform pg_temp.add_q(q, 23, array['PE08'], 'During a trial lift the rear wheels start to feel light. You should:',
    'The forklift is near its tipping point — lower the load straight away and reassess.', 2,
    array['Lift higher to rebalance', 'Lower the load straight away and reassess', 'Have someone sit on the back', 'Drive forwards quickly']);
  perform pg_temp.add_q(q, 24, array['KE08'], 'Why must you turn the charger off before disconnecting a forklift battery?',
    'Disconnecting while charging can create a spark, which could ignite hydrogen gas.', 1,
    array['To avoid a spark that could ignite hydrogen gas', 'To save electricity', 'To reset the battery gauge', 'It doesn''t matter']);
  perform pg_temp.add_q(q, 25, array['PE10','KE09'], 'After parking at the end of the shift, what else should you do?',
    'Do a post-operational check, then record and report any defects found during the shift.', 4,
    array['Leave the key in for the next operator', 'Leave the tynes raised', 'Nothing else', 'Record and report any defects from the shift']);

  -- Final exam: calculation questions
  perform pg_temp.add_cq(q, 26, array['KE05'],
    'A pallet holds 6 layers of 5 cartons. Each carton weighs 20 kg and the pallet weighs 20 kg. What is the total weight?',
    '6 × 5 = 30 cartons. 30 × 20 = 600 kg. 600 + 20 = 620 kg.', 2,
    array['600 kg', '620 kg', '640 kg', '720 kg']);
  perform pg_temp.add_cq(q, 27, array['KE05'],
    'A running sheet lists a load as 2.5 t. How many kilograms is that?',
    '2.5 × 1,000 = 2,500 kg.', 3,
    array['250 kg', '2,050 kg', '2,500 kg', '25,000 kg']);
  perform pg_temp.add_cq(q, 28, array['KE03','KE05','PE01'],
    'An evenly loaded crate 1,100 mm deep weighs 2,200 kg and sits hard against the backrest. The forklift is rated at 2,500 kg at a 600 mm load centre. Can it lift the crate?',
    'Load centre = 1,100 ÷ 2 = 550 mm — within 600 mm. 2,200 kg is less than 2,500 kg. OK to lift.', 1,
    array['Yes — load centre 550 mm, and 2,200 kg is within 2,500 kg', 'No — the load centre is 1,100 mm', 'No — 2,200 kg is over 2,500 kg', 'Yes — but only below 3 metres']);
  perform pg_temp.add_cq(q, 29, array['KE03','KE05','PE01'],
    'A forklift is rated at 2,500 kg. Which ONE of these loads is within its rated capacity?',
    '45 × 50 = 2,250 kg + 30 kg pallet = 2,280 kg — within 2,500 kg. The others are 2,600 kg, 2,600 kg and 2,530 kg — all over.', 3,
    array['A machine weighing 2.6 t', 'Two pallets of 1,300 kg each, lifted together', '45 cartons of 50 kg on a 30 kg pallet', 'A 2,500 kg crate on a 30 kg pallet']);
  perform pg_temp.add_cq(q, 30, array['KE05'],
    'The forklift''s rated capacity is 1,300 kg. The pallet weighs 25 kg and each carton weighs 25 kg. What is the most cartons you can load?',
    '1,300 − 25 = 1,275. 1,275 ÷ 25 = 51 cartons. Check: 51 × 25 + 25 = 1,300 kg. 52 cartons would be 1,325 kg.', 2,
    array['50', '51', '52', '53']);
  perform pg_temp.add_q(q, 31, array['KE07','PE03'], 'A forklift has touched a powerline. When is it safe to go back to it?',
    'Only once the electricity network operator confirms the power is off. Until then, stay at least 8 m away.', 3,
    array['As soon as the mast is no longer touching the line', 'After waiting 5 minutes', 'Only when the electricity network operator confirms the power is off', 'When it stops sparking']);
  perform pg_temp.add_q(q, 32, array['KE10','PE03'], 'Which of these is a HAZARD rather than a risk?',
    'An oil spill is a hazard — something that could cause harm. The chance of skidding on it, and how bad that would be, is the risk.', 2,
    array['The chance of a collision', 'An oil spill on the forklift''s route', 'How serious an injury could be', 'The likelihood of the load falling']);
  perform pg_temp.add_q(q, 33, array['KE10','PE03'], 'When you assess a risk, which two things do you consider?',
    'Risk = likelihood (how likely is harm?) and consequence (how bad would it be?).', 1,
    array['How likely the harm is, and how bad it would be', 'The time of day and the weather', 'The colour of the forklift and the load', 'Who is to blame and the cost']);
end
$seed$;
