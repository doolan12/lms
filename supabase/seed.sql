-- Seed: Forklift Licence Theory (Australia) sample course
-- Content is general study material aligned to the topics of TLILIC0003
-- "Licence to operate a forklift truck". Have your RTO / qualified trainer
-- review and adapt it before selling. This is theory preparation only —
-- a High Risk Work Licence requires assessment by an accredited assessor.

-- Temporary helpers ------------------------------------------------------
create or replace function pg_temp.add_lesson(
  p_module uuid, p_course uuid, p_pos int, p_slug text, p_title text,
  p_minutes int, p_preview boolean, p_body text
) returns uuid language plpgsql as $$
declare v_id uuid;
begin
  insert into public.lessons (module_id, course_id, slug, title, position, duration_minutes, is_preview)
  values (p_module, p_course, p_slug, p_title, p_pos, p_minutes, p_preview)
  returning id into v_id;
  insert into public.lesson_content (lesson_id, body_md) values (v_id, p_body);
  return v_id;
end $$;

create or replace function pg_temp.add_q(
  p_quiz uuid, p_pos int, p_prompt text, p_explanation text, p_correct int, p_opts text[]
) returns void language plpgsql as $$
declare v_q uuid; i int;
begin
  insert into public.questions (quiz_id, prompt, explanation, position)
  values (p_quiz, p_prompt, p_explanation, p_pos) returning id into v_q;
  for i in 1 .. array_length(p_opts, 1) loop
    insert into public.options (question_id, text, position, is_correct)
    values (v_q, p_opts[i], i, i = p_correct);
  end loop;
end $$;

do $seed$
declare
  c uuid; m1 uuid; m2 uuid; m3 uuid; m4 uuid; m5 uuid; m6 uuid;
  q uuid;
begin
  delete from public.courses where slug = 'forklift-licence-theory';

  insert into public.courses (slug, title, summary, description, price_cents, currency, published)
  values (
    'forklift-licence-theory',
    'Forklift Licence Theory (LF)',
    'Prepare for your forklift High Risk Work Licence theory assessment — at your own pace, on any device.',
    'This online course covers the knowledge you need before your practical forklift assessment: '
    || 'licensing and WHS law, hazard identification and controls, pre-start checks, load charts and stability, '
    || 'safe operating procedures, and shutting down, refuelling and recharging. Each module ends with a short quiz, '
    || 'and a final practice exam checks you are ready.',
    4900, 'aud', true
  ) returning id into c;

  insert into public.modules (course_id, title, position) values (c, 'Licensing and the law', 1) returning id into m1;
  insert into public.modules (course_id, title, position) values (c, 'Planning the work and controlling hazards', 2) returning id into m2;
  insert into public.modules (course_id, title, position) values (c, 'Pre-start and operational checks', 3) returning id into m3;
  insert into public.modules (course_id, title, position) values (c, 'Load charts and stability', 4) returning id into m4;
  insert into public.modules (course_id, title, position) values (c, 'Safe operation', 5) returning id into m5;
  insert into public.modules (course_id, title, position) values (c, 'Shutdown, refuelling and recharging', 6) returning id into m6;

  -- Module 1 ────────────────────────────────────────────────────────────
  perform pg_temp.add_lesson(m1, c, 1, 'high-risk-work-licence', 'The forklift High Risk Work Licence', 6, true, $md$
## Why you need a licence

Operating a forklift is **high risk work** under Australia's Work Health and Safety (WHS) laws. To operate one, you must hold a **High Risk Work Licence (HRWL)** for the right class, or be a trainee working under supervision while you train.

### Licence classes

| Class | Covers |
|---|---|
| **LF** | Forklift truck (counterbalance, reach trucks and similar) |
| **LO** | Order-picking forklift truck |

This course prepares you for the **LF** theory knowledge.

### How you get licensed

1. Complete training with a **Registered Training Organisation (RTO)**.
2. Pass a theory **and** practical assessment with an accredited assessor.
3. Apply to your state or territory regulator (for example SafeWork NSW, WorkSafe Victoria, WorkSafe Queensland) within the required time frame.

You must be **at least 18** to hold an HRWL. Licences are recognised in every state and territory and must be renewed (generally every five years).

> **Important:** this online course is theory preparation. It does not on its own give you a licence.
$md$);

  perform pg_temp.add_lesson(m1, c, 2, 'whs-duties', 'Your duties under WHS law', 6, false, $md$
## Everyone has duties

WHS laws (in Victoria, the OHS Act) place duties on everyone at a workplace.

**The business (PCBU / employer) must**, so far as is reasonably practicable:
- provide safe plant, including a forklift that is maintained and fit for use
- provide information, training, instruction and supervision
- set up safe systems of work, such as traffic management plans

**As a worker and operator you must:**
- take reasonable care for your own health and safety
- take reasonable care that what you do (or don't do) doesn't harm others
- follow reasonable instructions, policies and procedures
- **report hazards, incidents and defects**

### Know your sources of information

Before you start, you should know where to find:
- the **operator's manual** for the forklift
- the **data plate / load chart**
- site procedures, the traffic management plan and safe work method statements
- relevant Australian Standards and codes of practice

If you are unsure about anything, **stop and ask** your supervisor.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m1, 'Module 1 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, 'Which licence class covers a standard counterbalance forklift?',
    'LF is the forklift truck class. LO covers order-picking forklifts.', 2,
    array['LO', 'LF', 'C2', 'WP']);
  perform pg_temp.add_q(q, 2, 'What is the minimum age to hold a High Risk Work Licence?',
    'You must be at least 18 years old.', 3,
    array['16', '17', '18', '21']);
  perform pg_temp.add_q(q, 3, 'You notice the forklift''s horn is not working. What must you do?',
    'Workers must report defects and hazards. Do not operate a defective forklift — tag it out and report it.', 1,
    array['Report it and do not use the forklift until it is fixed', 'Use it carefully and mention it at the end of the shift', 'Fix it yourself', 'Ignore it if the area is quiet']);
  perform pg_temp.add_q(q, 4, 'Where would you find the safe working load for a particular forklift?',
    'The manufacturer''s data plate / load chart on the forklift shows its rated capacity.', 4,
    array['The site induction booklet', 'The fuel cylinder', 'The tyre sidewall', 'The data plate or load chart on the forklift']);

  -- Module 2 ────────────────────────────────────────────────────────────
  perform pg_temp.add_lesson(m2, c, 1, 'planning-the-task', 'Planning the task', 7, false, $md$
## Plan before you lift

Before moving anything, think the job through:

- **The load** — weight, size, shape, centre of gravity, is it stable and secure on the pallet?
- **The forklift** — is its rated capacity right for the load at the required height and load centre? Are the right attachments fitted?
- **The route** — surface condition, slopes and ramps, doorways, overhead clearances, blind corners.
- **The destination** — racking capacity, stack stability, where the load will be placed.
- **People** — who else is working in the area, and how will you communicate?

### Communication

Agree how you will communicate with others before starting: hand signals, two-way radio, horn at intersections and blind spots, and **eye contact with pedestrians** before moving near them.
$md$);

  perform pg_temp.add_lesson(m2, c, 2, 'hazards-and-controls', 'Identifying hazards and choosing controls', 8, false, $md$
## Common forklift hazards

- **Pedestrians** in or near the work area
- **Overhead hazards** — powerlines, low doorways, sprinklers, lights, racking beams
- **Ground conditions** — potholes, spills, slopes, uneven or soft ground, drains, dock edges
- **Other plant and vehicles**
- **Poor lighting and visibility**, blind corners
- **Dangerous goods** and unstable or damaged loads
- **Weather** when working outside — wind, rain, slippery surfaces

## The hierarchy of control

Always try the most effective control first and work down the list:

1. **Eliminate** the hazard
2. **Substitute** with something safer
3. **Isolate** people from the hazard (e.g. barriers, separate pedestrian walkways, exclusion zones)
4. **Engineering controls** (e.g. warning lights, mirrors, speed limiters)
5. **Administrative controls** (e.g. procedures, signage, training, traffic management plans)
6. **Personal protective equipment** (PPE) — the last line of defence

Often you will combine several controls.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m2, 'Module 2 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, 'Which control is the MOST effective in the hierarchy of control?',
    'Elimination removes the hazard entirely, so it is the most effective control.', 1,
    array['Elimination', 'PPE', 'Signage', 'Training']);
  perform pg_temp.add_q(q, 2, 'Separating forklifts from pedestrians with physical barriers is an example of:',
    'Physically separating people from the hazard is isolation.', 3,
    array['Substitution', 'PPE', 'Isolation', 'Administrative control']);
  perform pg_temp.add_q(q, 3, 'Before driving near a pedestrian you should:',
    'Make eye contact so you know they have seen you, and wait for them to be clear.', 2,
    array['Sound the horn and keep going', 'Make eye contact and make sure they are aware of you', 'Speed up to get past quickly', 'Raise the forks so they can see them']);
  perform pg_temp.add_q(q, 4, 'Which of these is an overhead hazard?',
    'Powerlines, doorways, lights and racking beams are overhead hazards that can be struck by the mast or load.', 4,
    array['A pothole', 'An oil spill', 'A pedestrian walkway', 'Electrical powerlines']);

  -- Module 3 ────────────────────────────────────────────────────────────
  perform pg_temp.add_lesson(m3, c, 1, 'pre-start-checks', 'Pre-start (visual) checks', 7, true, $md$
## Do it every shift

Carry out a pre-start check **before every shift** using the site checklist and the operator's manual. With the engine **off**, walk around and check:

- **Tyres and wheels** — damage, wear, inflation, wheel nuts
- **Forks** — cracks, bends, wear at the heel, locking pins in place
- **Mast, chains and carriage** — damage, wear, chain tension, lubrication
- **Hydraulics** — hoses, fittings and the ground underneath for leaks
- **Fluid levels** — engine oil, hydraulic oil, coolant, fuel / LPG / battery charge
- **Overhead guard and load backrest** — fitted and undamaged
- **Seat and seatbelt** — secure and working
- **Data plate** — present and readable
- **LPG cylinder** (if fitted) — secure, valve and fittings in good condition, no smell of gas

Record the check on the checklist.
$md$);

  perform pg_temp.add_lesson(m3, c, 2, 'operational-checks-and-defects', 'Operational checks and reporting defects', 6, false, $md$
## Operational checks (engine running)

Once the visual check is done, start the forklift **as per the manufacturer's instructions** and check:

- **Gauges and warning lights**
- **Horn, lights, beacons and reversing alarm**
- **Steering** — smooth with no excessive play
- **Service and park brakes**
- **Hydraulic controls** — lift, lower, tilt, side shift and any attachments operate smoothly
- **Inching / transmission** controls

## If you find a defect

1. **Do not use** the forklift.
2. **Tag it out** ("Out of service / Do not operate") and remove the key if your procedure says so.
3. **Report** the defect to your supervisor and record it.

A defective forklift is only returned to service after it is repaired and checked by a competent person.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m3, 'Module 3 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, 'When should a pre-start check be carried out?',
    'Pre-start checks are done before every shift, before the forklift is used.', 2,
    array['Once a week', 'Before every shift', 'Only after a breakdown', 'Only when a supervisor asks']);
  perform pg_temp.add_q(q, 2, 'Visual checks of tyres, forks and fluid levels are done with the engine:',
    'Visual pre-start checks are done with the engine off.', 1,
    array['Off', 'Running at high revs', 'Idling with forks raised', 'Running in gear']);
  perform pg_temp.add_q(q, 3, 'During operational checks the brakes feel spongy. What do you do?',
    'Any defect means do not operate: tag out and report.', 3,
    array['Drive slowly for the rest of the shift', 'Pump the brakes and continue', 'Stop, tag the forklift out of service and report it', 'Ask another operator to use it instead']);
  perform pg_temp.add_q(q, 4, 'Which item is checked in the operational (engine running) check?',
    'Horn, lights, steering, brakes and hydraulic functions are checked with the engine running.', 4,
    array['Fork heel wear', 'Tyre tread', 'Data plate condition', 'Hydraulic lift and tilt functions']);

  -- Module 4 ────────────────────────────────────────────────────────────
  perform pg_temp.add_lesson(m4, c, 1, 'stability-triangle', 'Centre of gravity and the stability triangle', 8, false, $md$
## How a counterbalance forklift stays upright

A counterbalance forklift works like a **see-saw**: the front wheels are the pivot (fulcrum), the load is on one side and the counterweight is on the other.

Most counterbalance forklifts have a **three-point suspension**: the two front wheels and the centre pivot of the rear axle. These points form the **stability triangle**.

- The **combined centre of gravity** of the forklift and its load must stay **inside the stability triangle**.
- If it moves outside the triangle, the forklift will tip.

### What moves the centre of gravity?

- **Lifting the load high** — raises the centre of gravity and makes the forklift less stable
- **Tilting forward** with a raised load
- **Turning sharply or too fast** — pushes the centre of gravity sideways
- **Slopes and uneven ground**
- **Sudden braking or acceleration**

That is why you **travel with the load low and tilted back**, turn slowly, and never turn on a slope.
$md$);

  perform pg_temp.add_lesson(m4, c, 2, 'load-charts', 'Reading the data plate and load chart', 9, false, $md$
## Rated capacity depends on load centre and lift height

Every forklift has a **data plate / load chart** from the manufacturer. It shows the **maximum weight** the forklift can safely lift at a given **load centre** and **lift height**, with the attachments fitted.

- **Load centre** — the distance from the vertical face of the forks (the fork heel) to the load's centre of gravity. A common standard is 500 mm or 600 mm.
- As the **load centre gets longer**, capacity **goes down**.
- As **lift height increases**, capacity usually **goes down**.
- **Attachments** (e.g. side shifters, jib attachments) change capacity — use the chart for the attachment fitted.

### Example (illustrative only)

A forklift rated **2,500 kg at a 500 mm load centre**. A long load has its centre of gravity **600 mm** from the fork face. The capacity at 600 mm is **less than 2,500 kg** — read the actual figure from the load chart.

> Always use the manufacturer's chart. **Never exceed** the rated capacity, and never add extra counterweight or people to the back of the forklift.

If the load's weight isn't marked, find out before you lift — check paperwork, ask, or weigh it.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m4, 'Module 4 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, 'The stability triangle of a counterbalance forklift is formed by:',
    'The two front wheels and the rear axle pivot point form the stability triangle.', 2,
    array['All four wheels', 'The two front wheels and the rear axle pivot point', 'The mast and the two front wheels', 'The forks and the counterweight']);
  perform pg_temp.add_q(q, 2, 'What happens to rated capacity as the load centre increases?',
    'A longer load centre increases leverage on the front wheels, so capacity decreases.', 3,
    array['It increases', 'It stays the same', 'It decreases', 'It doubles']);
  perform pg_temp.add_q(q, 3, 'The load centre is measured from:',
    'Load centre is measured from the vertical face (heel) of the forks to the load''s centre of gravity.', 1,
    array['The vertical face of the forks to the load''s centre of gravity', 'The fork tips to the mast', 'The front wheels to the counterweight', 'The ground to the top of the load']);
  perform pg_temp.add_q(q, 4, 'A load is too heavy for the forklift at its load centre. What should you do?',
    'Never exceed rated capacity or add counterweight. Use a forklift with suitable capacity or break the load down.', 4,
    array['Have someone sit on the counterweight', 'Lift it slowly', 'Add extra weight to the back', 'Use a forklift with enough capacity or reduce the load']);

  -- Module 5 ────────────────────────────────────────────────────────────
  perform pg_temp.add_lesson(m5, c, 1, 'travelling-safely', 'Travelling, ramps and pedestrians', 9, false, $md$
## Travelling

- Wear your **seatbelt**.
- Travel with the forks **just high enough to clear the ground** (commonly around 100–150 mm) and the mast **tilted back**.
- **Look in the direction of travel.** If the load blocks your forward view, **travel in reverse** (or use a spotter).
- Obey **site speed limits**; slow down at corners, doorways, intersections and on wet surfaces.
- **Sound the horn** at blind corners and intersections.
- **Never carry passengers** and never lift people unless using an approved work platform designed for the forklift.
- Keep **arms, legs and head inside** the overhead guard.

## Ramps and slopes

- **Loaded:** keep the **load on the uphill side** — drive **forwards up** and **reverse down**.
- **Unloaded:** keep the **forks pointing downhill** — reverse up, drive forwards down.
- **Never turn** on a ramp or slope, and never travel across it.

## Pedestrians

Follow the traffic management plan, use designated forklift routes, make eye contact, and **stop** if anyone enters your work area.
$md$);

  perform pg_temp.add_lesson(m5, c, 2, 'stacking-and-unloading', 'Picking up, stacking and unloading trucks', 9, false, $md$
## Picking up and placing a load

1. Approach the load **slowly and squarely**, forks level and spread to suit the pallet.
2. **Stop** in front of the load. Insert the forks fully (the load against the backrest).
3. Lift slightly, **tilt back**, check for clearance and reverse out slowly.
4. Lower to travel height **before** moving off.

## Stacking in racking

- Approach squarely and **stop** before the rack.
- Only raise or lower the load **when stationary** — never while travelling.
- Raise to the required height, level the forks, then **inch forward** carefully.
- Lower the load onto the beams, withdraw the forks, then lower them to travel height before moving.
- Check the **racking capacity** and never stack damaged or unstable loads.

## Loading and unloading trucks

- Check the truck **can't move** — handbrake on, wheels chocked or the vehicle restraint engaged, driver in a safe area.
- Check **dock plates** are secure and rated for the forklift plus load.
- Check the trailer floor is sound and can take the weight.
- Watch for **dock edges**.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m5, 'Module 5 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, 'You are carrying a load up a ramp. How should you travel?',
    'With a load, keep the load on the uphill side: forwards up, reverse down.', 1,
    array['Drive forwards up the ramp, load uphill', 'Reverse up the ramp, load downhill', 'Drive across the ramp diagonally', 'Raise the load high for better visibility']);
  perform pg_temp.add_q(q, 2, 'The load is blocking your forward view. What should you do?',
    'Travel in reverse (looking in the direction of travel) or use a spotter.', 2,
    array['Raise the load higher', 'Travel in reverse, looking in the direction of travel', 'Lean out the side and drive forwards', 'Sound the horn continuously and drive forwards']);
  perform pg_temp.add_q(q, 3, 'When may you raise or lower a load?',
    'Only raise or lower a load when the forklift is stopped.', 3,
    array['While turning', 'While travelling slowly', 'Only when the forklift is stationary', 'Any time if the area is clear']);
  perform pg_temp.add_q(q, 4, 'A co-worker asks for a lift to the other end of the warehouse on the forklift. You should:',
    'Never carry passengers on a forklift.', 4,
    array['Let them stand on the forks', 'Let them sit on the counterweight', 'Drive slowly with them on board', 'Refuse — forklifts must never carry passengers']);

  -- Module 6 ────────────────────────────────────────────────────────────
  perform pg_temp.add_lesson(m6, c, 1, 'shutting-down', 'Shutting down and parking', 5, false, $md$
## Parking the forklift

At the end of a task or shift, park in a **designated safe area** — never on a slope, and never blocking exits, walkways, fire equipment or electrical switchboards.

1. Bring the forklift to a stop and put the transmission in **neutral**.
2. Apply the **park brake**.
3. **Lower the forks** fully to the ground, tilted forward so the tips rest on the floor.
4. Turn the engine off as per the manufacturer's instructions and **remove the key**.
5. For LPG forklifts, follow site procedure for the cylinder valve.
6. Do a **post-operational check** and report any defects found during the shift.
$md$);

  perform pg_temp.add_lesson(m6, c, 2, 'lpg-and-batteries', 'LPG cylinders and battery charging', 8, false, $md$
## Changing an LPG cylinder

- Only change cylinders in a **well-ventilated area**, away from ignition sources — **no smoking** or naked flames.
- Wear the required **PPE** (e.g. gloves and eye protection) — LPG can cause cold burns.
- Turn the cylinder **valve off** and let the engine run until it stops, then turn the ignition off.
- Disconnect and remove the cylinder; check the new cylinder's **valve, O-ring and connection** for damage.
- Fit the new cylinder with the **locating pin** in place and secure it.
- Open the valve slowly and **check for leaks** (e.g. soapy water) — never use a flame.

## Charging electric forklift batteries

- Charge only in the **designated charging area**.
- Batteries give off **hydrogen gas** while charging — it is explosive, so keep the area **ventilated** and free of ignition sources.
- Wear PPE — battery acid is corrosive. Know where the **eyewash** station is.
- Turn the charger **off before connecting or disconnecting** to avoid sparks.
- Follow the manufacturer's instructions for checking electrolyte levels.
$md$);

  insert into public.quizzes (course_id, module_id, title, pass_mark) values (c, m6, 'Module 6 quiz', 75) returning id into q;
  perform pg_temp.add_q(q, 1, 'When parking a forklift, the forks should be:',
    'Lower the forks fully to the ground with the tips resting on the floor.', 2,
    array['Raised to chest height', 'Fully lowered to the ground', 'Raised slightly so they are visible', 'Left at travel height']);
  perform pg_temp.add_q(q, 2, 'Which gas is released when charging a lead-acid forklift battery?',
    'Charging releases hydrogen, which is explosive — ventilation is essential.', 1,
    array['Hydrogen', 'Carbon dioxide', 'Nitrogen', 'Oxygen only']);
  perform pg_temp.add_q(q, 3, 'How should you check a newly fitted LPG cylinder for leaks?',
    'Use a leak-detection solution such as soapy water. Never use a flame.', 3,
    array['With a lighter', 'By smell only', 'With soapy water or leak-detection solution', 'By running the engine at full revs']);
  perform pg_temp.add_q(q, 4, 'Where should you NOT park a forklift?',
    'Never block exits, walkways, fire equipment or switchboards, and never park on a slope.', 4,
    array['In the designated parking bay', 'On level ground', 'Away from walkways', 'In front of a fire extinguisher']);

  -- Final practice exam ───────────────────────────────────────────────
  insert into public.quizzes (course_id, module_id, title, pass_mark, is_final)
  values (c, null, 'Final practice exam', 80, true) returning id into q;
  perform pg_temp.add_q(q, 1, 'Who issues a High Risk Work Licence?',
    'The state or territory WHS regulator issues the licence after you pass an assessment by an accredited assessor.', 3,
    array['Your employer', 'The forklift manufacturer', 'The state or territory WHS regulator', 'Any RTO trainer on the spot']);
  perform pg_temp.add_q(q, 2, 'You must report a hazard you find at work because:',
    'Workers have a legal duty to take reasonable care for themselves and others, including reporting hazards.', 1,
    array['Workers have a duty to take reasonable care for themselves and others', 'It is optional but polite', 'Only supervisors need to report hazards', 'Only if someone is injured']);
  perform pg_temp.add_q(q, 3, 'PPE sits where in the hierarchy of control?',
    'PPE is the least effective control and the last line of defence.', 4,
    array['First — most effective', 'Second', 'In the middle', 'Last — least effective']);
  perform pg_temp.add_q(q, 4, 'During the pre-start you find a crack at the heel of a fork. You should:',
    'A cracked fork is a serious defect. Tag the forklift out and report it.', 2,
    array['Use the forklift for light loads only', 'Tag it out of service and report it', 'Swap the forks around', 'Continue and report at the end of the shift']);
  perform pg_temp.add_q(q, 5, 'Lifting a load higher makes the forklift:',
    'Raising the load raises the combined centre of gravity, reducing stability.', 3,
    array['More stable', 'No different', 'Less stable', 'Faster']);
  perform pg_temp.add_q(q, 6, 'For the forklift to stay stable, the combined centre of gravity must stay:',
    'It must stay within the stability triangle.', 1,
    array['Inside the stability triangle', 'Over the forks', 'Behind the counterweight', 'Above the mast']);
  perform pg_temp.add_q(q, 7, 'Where do you find the maximum load for a given load centre and height?',
    'The manufacturer''s data plate / load chart.', 2,
    array['The fuel gauge', 'The data plate / load chart', 'The traffic management plan', 'The racking label only']);
  perform pg_temp.add_q(q, 8, 'Driving an unloaded forklift down a ramp, you should:',
    'Unloaded, keep the forks pointing downhill: drive forwards down the ramp.', 3,
    array['Reverse down with forks uphill', 'Turn halfway down', 'Drive forwards down with forks pointing downhill', 'Raise the forks high']);
  perform pg_temp.add_q(q, 9, 'Before loading a truck from a dock, you must check that:',
    'The truck must be secured so it can''t move, and dock plates must be secure and rated.', 4,
    array['The truck engine is running', 'The truck driver is in the cab', 'The dock plate is removed', 'The truck is secured from moving and the dock plate is secure and rated']);
  perform pg_temp.add_q(q, 10, 'Why must the battery charging area be ventilated?',
    'Charging produces explosive hydrogen gas.', 1,
    array['To disperse explosive hydrogen gas', 'To cool the operator', 'To dry the floor', 'It does not need to be ventilated']);
end
$seed$;
