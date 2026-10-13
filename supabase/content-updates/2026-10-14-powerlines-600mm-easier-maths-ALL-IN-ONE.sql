-- Forklift LMS content update — paste this whole file into Supabase → SQL Editor → New query → Run.
-- Adds the powerlines lesson, switches the practice chart to 600 mm, and simplifies the maths.
-- Runs as one transaction: if anything fails, nothing changes. Students' enrolments, progress and quiz results are kept.

begin;


update public.lessons set position = position + 1000 where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug in ($t$ground-and-weather$t$,$t$traffic-management-exclusion-zones$t$);

update public.lesson_content set body_md=$t$
## Common forklift hazards

- **Pedestrians**, other plant and vehicles — collision risk
- **Overhead hazards** — powerlines (see the next lesson), low beams, doorways, sprinklers, lights, fixed structures
- **Poor lighting** and blind corners
- **Dangerous goods** — check labels/placards and the Safety Data Sheet (SDS); know the spill procedure
- **Restricted or poorly ventilated areas** — LPG, petrol and diesel forklifts give off **carbon monoxide** in exhaust
- **Ground conditions** and **weather** (later in this module)
- Unstable or damaged loads

## Risk assessment

1. **Identify** the hazard.
2. **Assess** the risk — how likely, how bad?
3. **Control** it using the hierarchy of control.
4. **Review** — are the controls working?

## The hierarchy of control

Use the most effective control you can, then work down:

1. **Eliminate** the hazard
2. **Substitute** with something safer
3. **Isolate** people from it (barriers, separate walkways, exclusion zones)
4. **Engineering controls** (mirrors, warning lights, speed limiters)
5. **Administrative controls** (procedures, signage, training, traffic plans)
6. **PPE** — the last line of defence

If a control is missing or not working, **report it**.
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$hazards-and-controls$t$);

with l as (insert into public.lessons (module_id, course_id, slug, title, position, duration_minutes, is_preview, refs) values ((select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2), (select id from public.courses where slug='forklift-licence-theory'), $t$powerlines$t$, $t$Powerlines: keep clear, and the 5-step contact protocol$t$, 3, 8, false, array[$t$PE03$t$,$t$KE07$t$,$t$KE04$t$]::text[]) returning id) insert into public.lesson_content (lesson_id, body_md) select id, $t$
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
$t$ from l;

update public.lessons set module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2), position=4, title=$t$Ground surfaces and weather$t$, duration_minutes=8, is_preview=false, refs=array[$t$KE14$t$,$t$KE06$t$,$t$KE04$t$,$t$PE03$t$]::text[] where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$ground-and-weather$t$;

update public.lessons set module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2), position=5, title=$t$Traffic management plans and exclusion zones$t$, duration_minutes=6, is_preview=false, refs=array[$t$KE12$t$,$t$PE09$t$,$t$KE02$t$,$t$PE05$t$]::text[] where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$traffic-management-exclusion-zones$t$;

update public.lesson_content set body_md=$t$
## Rated capacity depends on load centre and lift height

Every forklift has a manufacturer's **data plate / load chart** showing the **maximum weight** it can lift at a given **load centre** and **lift height**, with the attachments fitted.

- **Load centre** — the distance from the vertical face of the tynes to the load's centre of gravity. The most common load centre on forklift data plates is **600 mm**.
- **Longer load centre → lower capacity.**
- **Higher lift → usually lower capacity.**
- **Attachments change capacity** — use the chart for the attachment fitted.

### Example (illustrative only)

A forklift is rated **2,500 kg at a 600 mm load centre**. It picks up a long crate whose centre of gravity is **800 mm** from the tyne face. At 800 mm it can lift **less than 2,500 kg** — on the practice chart in Module 5 it's only **1,800 kg**. Always read the actual figure from the chart.

> Always use the manufacturer's chart. **Never exceed** the rated capacity. Never add extra counterweight or put people on the back to "balance" a load.

Only use attachments and modifications **approved by the manufacturer**, with a matching data plate.
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$load-charts$t$);

update public.lesson_content set body_md=$t$
## Know the weight before you lift

You can't check the load chart if you don't know the weight. Ways to find it:

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

Then check: can the forklift lift **825 kg** at this load's load centre and the height you need?

> **Count → Multiply → Add the pallet.** Use a calculator and write each step down — that's what you'll do in the assessment too.
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$working-out-load-weight$t$);

update public.lesson_content set body_md=$t$
## Maths made simple

Every load calculation uses the same few steps. Take it slowly, **use a calculator**, and **write each step down**.

> **Count → Multiply → Add the pallet**

## Tonnes and kilograms

Load charts are in **kilograms (kg)**. Paperwork sometimes uses **tonnes (t)**.

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
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$weights-and-quantities$t$);

update public.lesson_content set body_md=$t$
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

That's why you **insert the tynes fully** — a gap pushes the load centre forward and cuts how much you can lift.

## Uneven loads

If one end is heavier (e.g. a machine with the motor at one end), the centre of gravity **isn't in the middle**. Check markings or paperwork for the centre of gravity, put the **heavy end towards the mast**, and ask your supervisor if you're unsure.
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$working-out-load-centre$t$);

update public.lesson_content set body_md=$t$
## Four steps

1. **Weight** — how heavy is the load?
2. **Load centre** — how far out is the middle of the load?
3. **Height** — how high does it need to go?
4. **Read the chart** — find the row and the column. If the load weighs **more** than the number in the chart, **don't lift it**.

### When your number falls between two lines

- Load centre **between two rows**? Use the **bigger load centre** (the row further down).
- Lift height **between two columns**? Use the **higher lift** (the column to the right).

Both rules give you the **smaller** capacity — the safe choice. **Never take an average.**

Only use the chart for the **forklift and attachment actually fitted**.

## Practice chart (fictional)

**Load chart — Forklift A (side shifter fitted)**

| Load centre | Lift up to 3,000 mm | Lift up to 4,500 mm |
|---|---:|---:|
| 600 mm | 2,500 kg | 2,000 kg |
| 700 mm | 2,100 kg | 1,700 kg |
| 800 mm | 1,800 kg | 1,500 kg |
| 900 mm | 1,600 kg | 1,300 kg |


## Worked example 1 — OK to lift

A **1,900 kg** pallet, load centre **600 mm**, lifted to **2,500 mm**.
Row 600 mm, column "up to 3,000 mm" → **2,500 kg**. 1,900 is less than 2,500 → **OK to lift.**

## Worked example 2 — too heavy

A **2,200 kg** pallet, load centre **600 mm**, going to a shelf at **4,000 mm**.
4,000 mm is above 3,000 mm, so use the "up to 4,500 mm" column → **2,000 kg**. 2,200 is more than 2,000 → **Do not lift** — it's 200 kg over.

## Worked example 3 — between two rows

A crate **1,300 mm** deep, weighing **2,000 kg**, lifted to **2,500 mm**.
Load centre = 1,300 ÷ 2 = **650 mm**. That's between the 600 and 700 rows, so use the **700 mm** row → **2,100 kg**. 2,000 is less than 2,100 → **OK to lift.**
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$reading-a-load-chart$t$);

with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2)), $t$The mast of your forklift touches an overhead powerline. What should you do FIRST?$t$, $t$Step 1 is STAY: stay seated on the forklift and don't touch any metal parts. Getting off could electrocute you.$t$, 9, array[$t$KE07$t$,$t$PE03$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$Jump off and run$t$, 1, false), ($t$Stay on the forklift and don't touch any metal parts$t$, 2, true), ($t$Climb down using three points of contact$t$, 3, false), ($t$Push the line away with a piece of timber$t$, 4, false)) as v(text, position, is_correct);


with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2)), $t$A forklift is touching a powerline. How far away should everyone else stay?$t$, $t$Step 2 is WARN: keep everyone at least 8 metres away, and no one touches the forklift.$t$, 10, array[$t$KE07$t$,$t$PE03$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$1 metre$t$, 1, false), ($t$3 metres$t$, 2, false), ($t$At least 8 metres$t$, 3, true), ($t$It is safe to stand next to it if you don't touch it$t$, 4, false)) as v(text, position, is_correct);

with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2)), $t$Your forklift is touching a powerline and catches fire. How should you get off?$t$, $t$Step 5 is JUMP — only if you must. Jump clear with feet together, never touching the forklift and the ground at the same time, then shuffle with feet together at least 8 m away.$t$, 11, array[$t$KE07$t$,$t$KE04$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$Jump clear with feet together, then shuffle with feet together at least 8 m away$t$, 1, true), ($t$Climb down slowly holding the handrail$t$, 2, false), ($t$Step down and run away as fast as you can$t$, 3, false), ($t$Stay on the forklift no matter what$t$, 4, false)) as v(text, position, is_correct);

with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2)), $t$What is the correct order of the 5-step powerline contact protocol?$t$, $t$Stay → Warn → Break contact (if safe) → Call for help → Jump clear (only if you must).$t$, 12, array[$t$KE07$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$Jump, Call, Warn, Stay, Break$t$, 1, false), ($t$Call, Jump, Stay, Break, Warn$t$, 2, false), ($t$Break, Jump, Warn, Call, Stay$t$, 3, false), ($t$Stay, Warn, Break contact, Call, Jump clear$t$, 4, true)) as v(text, position, is_correct);

update public.questions set prompt=$t$A pallet has 40 cartons weighing 20 kg each. The pallet weighs 20 kg. What is the total weight?$t$, explanation=$t$40 × 20 = 800 kg, plus the 20 kg pallet = 820 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=3;

update public.options set text=$t$800 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=3) and position=1;

update public.options set text=$t$820 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=3) and position=2;

update public.options set text=$t$840 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=3) and position=3;

update public.options set text=$t$860 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=3) and position=4;

update public.questions set prompt=$t$A pallet holds 5 layers of 10 cartons. Each carton weighs 20 kg and the pallet weighs 30 kg. What is the total weight?$t$, explanation=$t$5 × 10 = 50 cartons. 50 × 20 = 1,000 kg. 1,000 + 30 = 1,030 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=1;

update public.options set text=$t$1,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=1) and position=1;

update public.options set text=$t$1,030 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=1) and position=2;

update public.options set text=$t$1,050 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=1) and position=3;

update public.options set text=$t$1,300 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=1) and position=4;

update public.questions set prompt=$t$A consignment note shows a load of 1.5 t. How many kilograms is that?$t$, explanation=$t$1 tonne = 1,000 kg, so 1.5 × 1,000 = 1,500 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=2;

update public.options set text=$t$15 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=2) and position=1;

update public.options set text=$t$150 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=2) and position=2;

update public.options set text=$t$1,500 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=2) and position=3;

update public.options set text=$t$15,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=2) and position=4;

update public.questions set prompt=$t$One pallet (50 kg) carries three items: 400 kg, 350 kg and 600 kg. What is the total weight?$t$, explanation=$t$400 + 350 + 600 = 1,350 kg. Add the 50 kg pallet = 1,400 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=3;

update public.options set text=$t$1,350 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=3) and position=1;

update public.options set text=$t$1,400 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=3) and position=2;

update public.options set text=$t$1,450 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=3) and position=3;

update public.options set text=$t$1,300 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=3) and position=4;

update public.questions set prompt=$t$A weighbridge docket shows the loaded truck at 18,000 kg and the empty truck at 12,000 kg. The load is 4 identical pallets. How much does each pallet weigh?$t$, explanation=$t$Load = 18,000 − 12,000 = 6,000 kg. 6,000 ÷ 4 = 1,500 kg per pallet.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=4;

update public.options set text=$t$1,500 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=4) and position=1;

update public.options set text=$t$3,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=4) and position=2;

update public.options set text=$t$4,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=4) and position=3;

update public.options set text=$t$6,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=4) and position=4;

update public.questions set prompt=$t$You may lift a maximum of 1,000 kg. The pallet weighs 40 kg and each carton weighs 30 kg. What is the most cartons you can load?$t$, explanation=$t$1,000 − 40 = 960. 960 ÷ 30 = 32 cartons. Check: 32 × 30 + 40 = 1,000 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=5;


update public.options set text=$t$30$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=5) and position=1;

update public.options set text=$t$32$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=5) and position=2;

update public.options set text=$t$33$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=5) and position=3;

update public.options set text=$t$34$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=5) and position=4;

update public.questions set prompt=$t$You may lift a maximum of 1,000 kg. The pallet weighs 20 kg and each carton weighs 30 kg. What is the most cartons you can load?$t$, explanation=$t$1,000 − 20 = 980. 980 ÷ 30 = 32.67 — always round DOWN: 32. 33 cartons would weigh 1,010 kg with the pallet.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=6;

update public.options set text=$t$32$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=6) and position=1;

update public.options set text=$t$33$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=6) and position=2;

update public.options set text=$t$34$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=6) and position=3;

update public.options set text=$t$31$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=6) and position=4;

update public.questions set prompt=$t$An evenly loaded crate is 1,200 mm deep and sits hard against the backrest. What is its load centre?$t$, explanation=$t$Half the depth: 1,200 ÷ 2 = 600 mm.$t$, is_calculation=true, refs=array[$t$KE03$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=7;

update public.questions set prompt=$t$An evenly loaded crate 1,000 mm deep is sitting 200 mm away from the backrest. What is its load centre?$t$, explanation=$t$Gap + half the depth = 200 + 500 = 700 mm.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$PE07$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=8;

update public.questions set prompt=$t$Using the chart, can Forklift A lift a 1,900 kg load with a 600 mm load centre to 2,500 mm?


**Load chart — Forklift A (side shifter fitted)**

| Load centre | Lift up to 3,000 mm | Lift up to 4,500 mm |
|---|---:|---:|
| 600 mm | 2,500 kg | 2,000 kg |
| 700 mm | 2,100 kg | 1,700 kg |
| 800 mm | 1,800 kg | 1,500 kg |
| 900 mm | 1,600 kg | 1,300 kg |
$t$, explanation=$t$Row 600 mm, column up to 3,000 mm = 2,500 kg. 1,900 kg is less, so it's within capacity.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$PE01$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9;

update public.options set text=$t$Yes — capacity is 2,500 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9) and position=1;

update public.options set text=$t$No — capacity is 2,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9) and position=2;

update public.options set text=$t$No — capacity is 1,800 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9) and position=3;

update public.options set text=$t$Yes — capacity is 2,100 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9) and position=4;

update public.questions set prompt=$t$A 2,200 kg load (600 mm load centre) must go on a shelf at 4,000 mm. Can Forklift A do it?


**Load chart — Forklift A (side shifter fitted)**

| Load centre | Lift up to 3,000 mm | Lift up to 4,500 mm |
|---|---:|---:|
| 600 mm | 2,500 kg | 2,000 kg |
| 700 mm | 2,100 kg | 1,700 kg |
| 800 mm | 1,800 kg | 1,500 kg |
| 900 mm | 1,600 kg | 1,300 kg |
$t$, explanation=$t$4,000 mm is above 3,000 mm, so use the up to 4,500 mm column: 2,000 kg. 2,200 kg is 200 kg over — do not lift.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$PE01$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10;

update public.options set text=$t$Yes — capacity is 2,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10) and position=1;

update public.options set text=$t$No — capacity is 2,000 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10) and position=2;

update public.options set text=$t$Yes — capacity is 2,100 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10) and position=3;

update public.options set text=$t$No — capacity is 1,700 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10) and position=4;

update public.questions set prompt=$t$An evenly loaded crate 1,600 mm deep weighs 1,700 kg and sits hard against the backrest. It must be lifted to 2,500 mm. Can Forklift A do it?


**Load chart — Forklift A (side shifter fitted)**

| Load centre | Lift up to 3,000 mm | Lift up to 4,500 mm |
|---|---:|---:|
| 600 mm | 2,500 kg | 2,000 kg |
| 700 mm | 2,100 kg | 1,700 kg |
| 800 mm | 1,800 kg | 1,500 kg |
| 900 mm | 1,600 kg | 1,300 kg |
$t$, explanation=$t$Load centre = 1,600 ÷ 2 = 800 mm. Row 800 mm, column up to 3,000 mm = 1,800 kg. 1,700 kg is within capacity.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=11;

update public.options set text=$t$Yes — load centre 800 mm, capacity 1,800 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=11) and position=1;

update public.options set text=$t$No — load centre 800 mm, capacity 1,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=11) and position=2;

update public.options set text=$t$Yes — load centre 600 mm, capacity 2,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=11) and position=3;

update public.questions set prompt=$t$A 2,200 kg load has a load centre of 650 mm and will be lifted to 2,500 mm. Using the chart, can Forklift A lift it?


**Load chart — Forklift A (side shifter fitted)**

| Load centre | Lift up to 3,000 mm | Lift up to 4,500 mm |
|---|---:|---:|
| 600 mm | 2,500 kg | 2,000 kg |
| 700 mm | 2,100 kg | 1,700 kg |
| 800 mm | 1,800 kg | 1,500 kg |
| 900 mm | 1,600 kg | 1,300 kg |
$t$, explanation=$t$650 mm is between rows, so use the bigger load centre (700 mm): 2,100 kg. 2,200 kg is over — do not lift. Never take an average.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$PE01$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12;

update public.options set text=$t$Yes — use the 600 mm row: 2,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12) and position=1;

update public.options set text=$t$No — use the 700 mm row: 2,100 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12) and position=2;

update public.options set text=$t$Yes — average the rows: 2,300 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12) and position=3;


update public.options set text=$t$Yes — round down to the 600 mm row$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12) and position=4;

update public.questions set prompt=$t$What is the most Forklift A can lift with a 700 mm load centre to a height of 4,000 mm?


**Load chart — Forklift A (side shifter fitted)**

| Load centre | Lift up to 3,000 mm | Lift up to 4,500 mm |
|---|---:|---:|
| 600 mm | 2,500 kg | 2,000 kg |
| 700 mm | 2,100 kg | 1,700 kg |
| 800 mm | 1,800 kg | 1,500 kg |
| 900 mm | 1,600 kg | 1,300 kg |
$t$, explanation=$t$4,000 mm is above 3,000 mm, so use the up to 4,500 mm column. Row 700 mm = 1,700 kg.$t$, is_calculation=true, refs=array[$t$KE03$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13;

update public.options set text=$t$2,100 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13) and position=1;

update public.options set text=$t$1,700 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13) and position=2;

update public.options set text=$t$1,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13) and position=3;

update public.options set text=$t$2,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13) and position=4;

update public.questions set prompt=$t$A pallet holds 40 cartons of 40 kg each. The pallet weighs 50 kg. The load centre is 700 mm and it must go to 4,000 mm. Is the lift within capacity?


**Load chart — Forklift A (side shifter fitted)**

| Load centre | Lift up to 3,000 mm | Lift up to 4,500 mm |
|---|---:|---:|
| 600 mm | 2,500 kg | 2,000 kg |
| 700 mm | 2,100 kg | 1,700 kg |
| 800 mm | 1,800 kg | 1,500 kg |
| 900 mm | 1,600 kg | 1,300 kg |
$t$, explanation=$t$Weight = 40 × 40 + 50 = 1,650 kg. Row 700 mm, column up to 4,500 mm = 1,700 kg. 1,650 kg is within capacity.$t$, is_calculation=true, refs=array[$t$KE05$t$,$t$KE03$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14;

update public.options set text=$t$Yes — 1,650 kg is within 1,700 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14) and position=1;

update public.options set text=$t$No — 1,650 kg is more than 1,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14) and position=2;

update public.options set text=$t$No — 1,650 kg is more than 1,300 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14) and position=3;

update public.options set text=$t$Yes — 1,600 kg is within 2,100 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14) and position=4;

update public.questions set prompt=$t$A pallet holds 50 cartons of 20 kg each. The pallet weighs 25 kg. What is the total load weight?$t$, explanation=$t$50 × 20 = 1,000 kg, plus the 25 kg pallet = 1,025 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=18;

update public.options set text=$t$1,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=18) and position=1;

update public.options set text=$t$1,020 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=18) and position=2;

update public.options set text=$t$1,025 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=18) and position=3;

update public.options set text=$t$1,250 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=18) and position=4;

update public.questions set prompt=$t$A pallet holds 6 layers of 5 cartons. Each carton weighs 20 kg and the pallet weighs 20 kg. What is the total weight?$t$, explanation=$t$6 × 5 = 30 cartons. 30 × 20 = 600 kg. 600 + 20 = 620 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=26;

update public.options set text=$t$600 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=26) and position=1;

update public.options set text=$t$620 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=26) and position=2;

update public.options set text=$t$640 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=26) and position=3;

update public.options set text=$t$720 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=26) and position=4;

update public.questions set prompt=$t$A running sheet lists a load as 2.5 t. How many kilograms is that?$t$, explanation=$t$2.5 × 1,000 = 2,500 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=27;

update public.options set text=$t$250 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=27) and position=1;

update public.options set text=$t$2,050 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=27) and position=2;

update public.options set text=$t$2,500 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=27) and position=3;

update public.options set text=$t$25,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=27) and position=4;

update public.questions set prompt=$t$An evenly loaded crate 1,300 mm deep weighs 2,000 kg and sits hard against the backrest. It will be lifted to 2,500 mm. Using the chart, can Forklift A lift it?


**Load chart — Forklift A (side shifter fitted)**

| Load centre | Lift up to 3,000 mm | Lift up to 4,500 mm |
|---|---:|---:|
| 600 mm | 2,500 kg | 2,000 kg |
| 700 mm | 2,100 kg | 1,700 kg |
| 800 mm | 1,800 kg | 1,500 kg |
| 900 mm | 1,600 kg | 1,300 kg |
$t$, explanation=$t$Load centre = 1,300 ÷ 2 = 650 mm. That's between rows, so use the bigger load centre (700 mm): 2,100 kg. 2,000 kg is within capacity.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$KE05$t$,$t$PE01$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28;

update public.options set text=$t$Yes — use the 700 mm row: 2,100 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28) and position=1;

update public.options set text=$t$No — use the 700 mm row: 1,700 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28) and position=2;

update public.options set text=$t$No — use the 800 mm row: 1,800 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28) and position=3;

update public.options set text=$t$Yes — use the 600 mm row: 2,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28) and position=4;

update public.questions set prompt=$t$Using the chart, which ONE of these lifts is within Forklift A's capacity?


**Load chart — Forklift A (side shifter fitted)**

| Load centre | Lift up to 3,000 mm | Lift up to 4,500 mm |
|---|---:|---:|
| 600 mm | 2,500 kg | 2,000 kg |
| 700 mm | 2,100 kg | 1,700 kg |
| 800 mm | 1,800 kg | 1,500 kg |
| 900 mm | 1,600 kg | 1,300 kg |
$t$, explanation=$t$1,900 kg at 600 mm to 4,200 mm uses the up to 4,500 mm column: 2,000 kg — within capacity. The others are over 2,100 kg, 1,800 kg and 1,500 kg.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$PE01$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29;

update public.options set text=$t$2,200 kg, 700 mm load centre, lifted to 2,500 mm$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29) and position=1;

update public.options set text=$t$1,900 kg, 600 mm load centre, lifted to 4,200 mm$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29) and position=2;

update public.options set text=$t$1,900 kg, 800 mm load centre, lifted to 2,500 mm$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29) and position=3;

update public.options set text=$t$1,600 kg, 800 mm load centre, lifted to 4,500 mm$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29) and position=4;


update public.questions set prompt=$t$The load chart allows 1,300 kg for this lift. The pallet weighs 25 kg and each carton weighs 25 kg. What is the most cartons you can load?$t$, explanation=$t$1,300 − 25 = 1,275. 1,275 ÷ 25 = 51 cartons. Check: 51 × 25 + 25 = 1,300 kg. 52 cartons would be 1,325 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=30;

update public.options set text=$t$50$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=30) and position=1;

update public.options set text=$t$51$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=30) and position=2;

update public.options set text=$t$52$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=30) and position=3;

update public.options set text=$t$53$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=30) and position=4;

with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final), $t$A forklift has touched a powerline. When is it safe to go back to it?$t$, $t$Only once the electricity network operator confirms the power is off. Until then, stay at least 8 m away.$t$, 31, array[$t$KE07$t$,$t$PE03$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$As soon as the mast is no longer touching the line$t$, 1, false), ($t$After waiting 5 minutes$t$, 2, false), ($t$Only when the electricity network operator confirms the power is off$t$, 3, true), ($t$When it stops sparking$t$, 4, false)) as v(text, position, is_correct);

commit;

-- Check: should show 24 lessons and 92 questions
select (select count(*) from public.lessons) as lessons, (select count(*) from public.questions) as questions;
