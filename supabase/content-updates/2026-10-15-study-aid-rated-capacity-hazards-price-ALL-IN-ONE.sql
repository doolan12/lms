-- Forklift LMS content update — paste this whole file into Supabase → SQL Editor → New query → Run.
-- Renames the course as a study aid, sets the price to $15, replaces load charts with a single rated capacity,
-- and adds hazard vs risk. Runs as one transaction: if anything fails, nothing changes.
-- Students' enrolments, progress and quiz results are kept. Expected content checksum afterwards: 022b681bcc411d5a9269c669ded36f4d (424).

begin;


update public.courses set title=$t$Forklift Theory Practice (LF)$t$, summary=$t$Learn and practise forklift theory for your LF licence assessment — at your own pace, on any device.$t$, description=$t$Learn and practise the forklift theory you'll be assessed on for your LF High Risk Work Licence: WHS law and standards, hazards, ground conditions and weather, traffic management, pre-start and operational checks, faults and lock out/tag out, stability, rated capacity, load weight and load centre calculations, attachments, safe operating and stacking, shutdown, refuelling and recharging. Each module ends with a quiz, and a final practice exam helps you check your knowledge. An independent study aid to use alongside your training with an RTO — not nationally recognised training, and it does not give you a licence.$t$, price_cents=1500, currency=$t$aud$t$, published=true where slug='forklift-licence-theory';

update public.lesson_content set body_md=$t$
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
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$planning-and-communication$t$);

update public.lesson_content set body_md=$t$
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
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$hazards-and-controls$t$);

update public.lesson_content set body_md=$t$
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
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$stability-triangle$t$);

update public.lessons set module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4), position=2, title=$t$The data plate and rated capacity$t$, duration_minutes=9, is_preview=false, refs=array[$t$KE03$t$,$t$PE01$t$]::text[] where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$load-charts$t$;

update public.lesson_content set body_md=$t$
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
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$load-charts$t$);

update public.lesson_content set body_md=$t$
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
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$working-out-load-weight$t$);

update public.lesson_content set body_md=$t$
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
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$attachments$t$);

update public.lesson_content set body_md=$t$
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

That's why you **insert the tynes fully** — a gap pushes the load centre forward, past the 600 mm the rated capacity is based on. If the load centre is more than the data plate's load centre, **don't lift** — ask your supervisor.

## Uneven loads

If one end is heavier (e.g. a machine with the motor at one end), the centre of gravity **isn't in the middle**. Check markings or paperwork for the centre of gravity, put the **heavy end towards the mast**, and ask your supervisor if you're unsure.
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$working-out-load-centre$t$);

update public.lessons set module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5), position=3, title=$t$Checking a load against rated capacity, step by step$t$, duration_minutes=10, is_preview=false, refs=array[$t$KE03$t$,$t$KE05$t$,$t$PE01$t$]::text[] where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$reading-a-load-chart$t$;

update public.lesson_content set body_md=$t$
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
$t$ where lesson_id=(select id from public.lessons where course_id=(select id from public.courses where slug='forklift-licence-theory') and slug=$t$reading-a-load-chart$t$);

with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2)), $t$What is a hazard?$t$, $t$A hazard is anything that could cause harm — injury, illness or damage. Risk is the chance it will cause harm, and how bad that harm would be.$t$, 13, array[$t$KE10$t$,$t$PE03$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$Anything that could cause harm$t$, 1, true), ($t$The chance that someone will be hurt$t$, 2, false), ($t$A report you fill in after an incident$t$, 3, false), ($t$A control such as a barrier$t$, 4, false)) as v(text, position, is_correct);

with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2)), $t$What is a risk?$t$, $t$Risk combines likelihood (how likely the hazard is to cause harm) and consequence (how bad the harm would be).$t$, 14, array[$t$KE10$t$,$t$PE03$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$Any object in the workplace$t$, 1, false), ($t$A sign that warns people$t$, 2, false), ($t$How likely a hazard is to cause harm, and how bad the harm would be$t$, 3, true), ($t$The cost of fixing a forklift$t$, 4, false)) as v(text, position, is_correct);

with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2)), $t$Pedestrians often walk through the loading bay where you work. Which statement is correct?$t$, $t$The pedestrians in your work area are the hazard. Being struck by the forklift — likely, and possibly fatal — is the risk.$t$, 15, array[$t$KE10$t$,$t$PE03$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$The pedestrians are the risk; being hit is the hazard$t$, 1, false), ($t$The pedestrians are the hazard; the chance of hitting one, and how bad it would be, is the risk$t$, 2, true), ($t$There is no hazard if pedestrians wear hi-vis$t$, 3, false), ($t$Hazards and risks mean exactly the same thing$t$, 4, false)) as v(text, position, is_correct);

with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=2)), $t$A hazard is likely to happen and could kill someone. How should you rate the risk?$t$, $t$Likely + a serious consequence = high risk. Control it before you start work.$t$, 16, array[$t$KE10$t$,$t$PE03$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$Low — it hasn't happened yet$t$, 1, false), ($t$Medium — it depends on the day$t$, 2, false), ($t$No risk if you are careful$t$, 3, false), ($t$High — control it before you start work$t$, 4, true)) as v(text, position, is_correct);

update public.questions set prompt=$t$A side shifter has been fitted to the forklift. What must you check on the data plate?$t$, explanation=$t$The data plate must match the attachment fitted, because attachments change capacity.$t$, is_calculation=false, refs=array[$t$PE02$t$,$t$KE03$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=3)) and position=2;

update public.questions set prompt=$t$What does the rated capacity on a forklift's data plate tell you?$t$, explanation=$t$The rated capacity is the maximum weight the forklift can safely lift. Never lift more than it.$t$, is_calculation=false, refs=array[$t$KE03$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=2;

update public.options set text=$t$The forklift's top speed$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=2) and position=1;

update public.options set text=$t$How much fuel it holds$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=2) and position=2;

update public.options set text=$t$The maximum weight it can safely lift$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=2) and position=3;

update public.options set text=$t$How high the mast can reach$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=4)) and position=2) and position=4;

update public.questions set prompt=$t$Forklift A has a rated capacity of 2,500 kg at a 600 mm load centre. Can it lift a 1,900 kg pallet with a 600 mm load centre?$t$, explanation=$t$1,900 kg is less than the 2,500 kg rated capacity, and the load centre is 600 mm — OK to lift, with 600 kg to spare.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$PE01$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9;

update public.options set text=$t$Yes — it's 600 kg under the rated capacity$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9) and position=1;

update public.options set text=$t$No — it's 600 kg over the rated capacity$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9) and position=2;

update public.options set text=$t$No — the load centre is too far out$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9) and position=3;

update public.options set text=$t$Only if someone sits on the back$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=9) and position=4;

update public.questions set prompt=$t$Forklift A is rated at 2,500 kg. A crate on a consignment note weighs 2.7 t. Can it lift the crate?$t$, explanation=$t$2.7 × 1,000 = 2,700 kg. That's 200 kg more than the 2,500 kg rated capacity — do not lift.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$PE01$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10;

update public.options set text=$t$Yes — 2.7 t is less than 2,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10) and position=1;

update public.options set text=$t$No — it's 200 kg over the rated capacity$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10) and position=2;

update public.options set text=$t$Yes — it's only 200 kg over$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10) and position=3;


update public.options set text=$t$No — it's 2,000 kg over$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=10) and position=4;

update public.questions set prompt=$t$A forklift is rated at 2,000 kg. A pallet holds 48 cartons of 40 kg each, and the pallet weighs 30 kg. Is the load within the rated capacity?$t$, explanation=$t$48 × 40 = 1,920 kg. 1,920 + 30 = 1,950 kg. That's 50 kg under the 2,000 kg rated capacity — OK to lift.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=11;

update public.options set text=$t$Yes — 1,950 kg is within 2,000 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=11) and position=1;

update public.options set text=$t$No — 2,050 kg is over 2,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=11) and position=2;

update public.options set text=$t$No — 1,950 kg is over 1,920 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=11) and position=3;

update public.options set text=$t$Yes — 1,920 kg is within 2,000 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=11) and position=4;

update public.questions set prompt=$t$A forklift is rated at 1,500 kg. Paperwork says the load is 1.8 t. What should you do?$t$, explanation=$t$1.8 × 1,000 = 1,800 kg — 300 kg over the 1,500 kg rated capacity. Don't lift it; tell your supervisor.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12;

update public.options set text=$t$Lift it slowly$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12) and position=1;

update public.options set text=$t$Lift it with the load tilted back$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12) and position=2;

update public.options set text=$t$Don't lift it — it's 300 kg over the rated capacity$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12) and position=3;

update public.options set text=$t$Lift it if the ground is flat$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=12) and position=4;

update public.questions set prompt=$t$A forklift with a drum carrier is rated at 2,500 kg. Each full drum weighs 600 kg. What is the most drums it can carry at once?$t$, explanation=$t$2,500 ÷ 600 = 4.17 — always round down: 4 drums (2,400 kg). Five drums would be 3,000 kg.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13;

update public.options set text=$t$3$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13) and position=1;

update public.options set text=$t$4$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13) and position=2;

update public.options set text=$t$5$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13) and position=3;

update public.options set text=$t$6$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=13) and position=4;

update public.questions set prompt=$t$A forklift is rated at 2,500 kg. It is carrying a 1,800 kg crate. How much more weight could be added without going over the rated capacity?$t$, explanation=$t$2,500 − 1,800 = 700 kg.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14;

update public.options set text=$t$700 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14) and position=1;

update public.options set text=$t$800 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14) and position=2;

update public.options set text=$t$1,700 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14) and position=3;

update public.options set text=$t$4,300 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and module_id=(select id from public.modules where course_id=(select id from public.courses where slug='forklift-licence-theory') and position=5)) and position=14) and position=4;

update public.options set text=$t$A data plate$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=4) and position=3;

update public.questions set prompt=$t$Where do you find a forklift's rated capacity?$t$, explanation=$t$The rated capacity is on the manufacturer's data plate.$t$, is_calculation=false, refs=array[$t$KE03$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=17;

update public.options set text=$t$The data plate$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=17) and position=2;

update public.questions set prompt=$t$An evenly loaded crate 1,100 mm deep weighs 2,200 kg and sits hard against the backrest. The forklift is rated at 2,500 kg at a 600 mm load centre. Can it lift the crate?$t$, explanation=$t$Load centre = 1,100 ÷ 2 = 550 mm — within 600 mm. 2,200 kg is less than 2,500 kg. OK to lift.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$KE05$t$,$t$PE01$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28;

update public.options set text=$t$Yes — load centre 550 mm, and 2,200 kg is within 2,500 kg$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28) and position=1;

update public.options set text=$t$No — the load centre is 1,100 mm$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28) and position=2;

update public.options set text=$t$No — 2,200 kg is over 2,500 kg$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28) and position=3;

update public.options set text=$t$Yes — but only below 3 metres$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=28) and position=4;

update public.questions set prompt=$t$A forklift is rated at 2,500 kg. Which ONE of these loads is within its rated capacity?$t$, explanation=$t$45 × 50 = 2,250 kg + 30 kg pallet = 2,280 kg — within 2,500 kg. The others are 2,600 kg, 2,600 kg and 2,530 kg — all over.$t$, is_calculation=true, refs=array[$t$KE03$t$,$t$KE05$t$,$t$PE01$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29;

update public.options set text=$t$A machine weighing 2.6 t$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29) and position=1;

update public.options set text=$t$Two pallets of 1,300 kg each, lifted together$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29) and position=2;

update public.options set text=$t$45 cartons of 50 kg on a 30 kg pallet$t$, is_correct=true where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29) and position=3;

update public.options set text=$t$A 2,500 kg crate on a 30 kg pallet$t$, is_correct=false where question_id=(select id from public.questions where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=29) and position=4;

update public.questions set prompt=$t$The forklift's rated capacity is 1,300 kg. The pallet weighs 25 kg and each carton weighs 25 kg. What is the most cartons you can load?$t$, explanation=$t$1,300 − 25 = 1,275. 1,275 ÷ 25 = 51 cartons. Check: 51 × 25 + 25 = 1,300 kg. 52 cartons would be 1,325 kg.$t$, is_calculation=true, refs=array[$t$KE05$t$]::text[] where quiz_id=(select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final) and position=30;


with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final), $t$Which of these is a HAZARD rather than a risk?$t$, $t$An oil spill is a hazard — something that could cause harm. The chance of skidding on it, and how bad that would be, is the risk.$t$, 32, array[$t$KE10$t$,$t$PE03$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$The chance of a collision$t$, 1, false), ($t$An oil spill on the forklift's route$t$, 2, true), ($t$How serious an injury could be$t$, 3, false), ($t$The likelihood of the load falling$t$, 4, false)) as v(text, position, is_correct);

with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values ((select id from public.quizzes where course_id=(select id from public.courses where slug='forklift-licence-theory') and is_final), $t$When you assess a risk, which two things do you consider?$t$, $t$Risk = likelihood (how likely is harm?) and consequence (how bad would it be?).$t$, 33, array[$t$KE10$t$,$t$PE03$t$]::text[], false) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ($t$How likely the harm is, and how bad it would be$t$, 1, true), ($t$The time of day and the weather$t$, 2, false), ($t$The colour of the forklift and the load$t$, 3, false), ($t$Who is to blame and the cost$t$, 4, false)) as v(text, position, is_correct);

commit;
