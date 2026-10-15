import type { ModuleVideo } from "./types";

export const module4: ModuleVideo = {
  module: 4,
  title: "Loads, stability and attachments",
  slides: [
    {
      visual: { kind: "title", title: "Loads, stability and attachments", subtitle: "Module 4" },
      say: ["Module 4 explains why forklifts tip over, how to read the data plate, how to work out a load's weight, and how attachments change things."],
    },
    {
      visual: { kind: "diagram", name: "stabilityTriangle", props: { cog: "inside" } },
      say: [
        "A counterbalance forklift works like a see-saw. The front wheels are the pivot. The load is on one side, and the heavy counterweight is on the other.",
        "Seen from above, the two front wheels and the middle of the back axle make a triangle. This is the stability triangle.",
        "The centre of gravity of the forklift and load together must stay inside this triangle.",
      ],
    },
    {
      visual: { kind: "diagram", name: "stabilityTriangle", props: { cog: "outside" } },
      say: [
        "If the centre of gravity moves outside the triangle, the forklift tips over.",
        "It moves when you overload, lift high, tilt forward with a raised load, turn too fast, brake hard, or drive on a slope. That's why you travel with the load low and tilted back.",
      ],
    },
    {
      visual: { kind: "diagram", name: "dataPlate" },
      say: [
        "Every forklift has a data plate. It shows the rated capacity: the most weight the forklift can safely lift.",
        "It also shows the load centre the capacity is rated at, usually six hundred millimetres. That's the distance from the front of the tynes to the middle of the load.",
        "Never lift more than the rated capacity. And if the load's centre is further out than the data plate says, don't lift it. Ask your supervisor.",
      ],
    },
    {
      visual: {
        kind: "sum",
        title: "Working out the weight",
        lines: [
          { text: "5 layers × 8 cartons = 40 cartons" },
          { text: "40 cartons × 20 kg = 800 kg" },
          { text: "800 kg + 25 kg pallet = 825 kg", result: true },
        ],
      },
      say: [
        "You need the weight before you can compare it with the rated capacity. Here's a pallet with five layers of eight cartons. Each carton is twenty kilos, and the pallet is twenty-five.",
        "Count. Five layers times eight cartons is forty cartons.",
        "Multiply. Forty cartons times twenty kilos is eight hundred kilos.",
        "Add the pallet. Eight hundred plus twenty-five is eight hundred and twenty-five kilos.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Where to find the weight",
        items: [
          { icon: "🏷️", text: "Labels and markings on the load" },
          { icon: "📄", text: "Consignment notes and running sheets" },
          { icon: "⚖️", text: "Weighbridge dockets" },
          { icon: "📘", text: "Manufacturer's documents" },
          { icon: "❓", text: "Can't find it? Don't lift it." },
        ],
      },
      say: [
        "Where do you find the weight?",
        "Look for labels and markings on the load.",
        "Check the consignment note or running sheet.",
        "Weighbridge dockets show what was weighed.",
        "Manufacturers' documents list the weight of machines and tanks.",
        "And if you can't find the weight, don't lift it. Ask your supervisor.",
      ],
    },
    {
      visual: {
        kind: "photo",
        src: "https://images.unsplash.com/photo-1763665814546-27c2c003317e?auto=format&fit=crop&w=1600&h=900&q=80",
        alt: "A red forklift fitted with a large clamp attachment",
        caption: "Attachments change the numbers",
        credit: { name: "Sergej *****", url: "https://unsplash.com/@skstrannik" },
      },
      say: [
        "This forklift has a clamp attachment fitted instead of plain tynes.",
        "It does a special job, but it also changes how much the forklift can safely lift.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Attachments",
        items: [
          { icon: "➖", text: "Add weight and push the load out → less capacity" },
          { icon: "✅", text: "Only approved attachments, with a matching data plate" },
          { icon: "🪝", text: "Jib — the hanging load swings" },
          { icon: "🔄", text: "Rotator — keep it low and stopped" },
          { icon: "🧍", text: "People — only in a purpose-built work platform" },
        ],
      },
      say: [
        "Attachments change how much you can lift.",
        "They add weight and push the load further out, so capacity goes down.",
        "Only use attachments approved by the manufacturer, with a data plate that matches.",
        "With a jib, the hanging load can swing. Move slowly and smoothly.",
        "With a rotator, keep the load low and the forklift stopped while you rotate.",
        "And only ever lift a person in a purpose-built work platform. Never on the tynes or a pallet.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Tricky loads",
        items: [
          { icon: "⚖️", text: "Heavier on one side — centre it" },
          { icon: "📏", text: "Long or wide — extra clearance, use a spotter" },
          { icon: "🛢️", text: "Liquids — smooth and slow" },
          { icon: "🪵", text: "No pallet — use gluts or dunnage" },
        ],
      },
      say: [
        "Some loads need extra care.",
        "If a load is heavier on one side, centre it on the tynes, or have it restacked.",
        "Long or wide loads swing out on turns. Give them extra room and use a spotter.",
        "Liquids slosh around and push the forklift. Accelerate, brake and turn smoothly and slowly.",
        "And if there's no pallet, put the load on timber gluts or dunnage, so you can get the tynes in and out.",
      ],
    },
    {
      visual: { kind: "title", title: "Module 4 complete", subtitle: "Keep it inside the triangle" },
      say: ["That's Module 4. Keep the centre of gravity inside the triangle, and never go over the rated capacity. Next up is the maths — and we'll go through it step by step."],
    },
  ],
};

export const module5: ModuleVideo = {
  module: 5,
  title: "Load calculations",
  slides: [
    {
      visual: { kind: "title", title: "Load calculations", subtitle: "Count → Multiply → Add the pallet" },
      say: ["Module 5 is the maths. Don't worry — we'll go slowly, one step at a time. Pause the video whenever you like and try it yourself."],
    },
    {
      visual: {
        kind: "points",
        title: "You can do this",
        items: [
          { icon: "🧮", text: "Use a calculator" },
          { icon: "✏️", text: "Write every step down" },
          { icon: "🐢", text: "Take your time — and check your answer" },
        ],
      },
      say: [
        "Three tips before we start.",
        "Use a calculator. There's one built into the quizzes.",
        "Write every step down. That's what you'll do in your assessment too.",
        "And take your time. Check your answer makes sense.",
      ],
    },
    {
      visual: {
        kind: "sum",
        title: "Tonnes → kilograms",
        lines: [{ text: "1 tonne = 1,000 kg" }, { text: "1.5 t × 1,000 = 1,500 kg", result: true }],
      },
      say: [
        "Rated capacity is in kilograms, but paperwork sometimes uses tonnes.",
        "One tonne is one thousand kilograms.",
        "So to change tonnes into kilograms, times by one thousand. One point five tonnes is fifteen hundred kilograms.",
      ],
    },
    {
      visual: {
        kind: "sum",
        title: "Cartons in layers",
        lines: [
          { text: "Count: 5 layers × 10 cartons = 50 cartons" },
          { text: "Multiply: 50 × 20 kg = 1,000 kg" },
          { text: "Add the pallet: 1,000 + 30 = 1,030 kg", result: true },
        ],
      },
      say: [
        "Here's a pallet with five layers. Each layer has ten cartons. Each carton is twenty kilos, and the pallet is thirty.",
        "Count. Five layers times ten cartons is fifty cartons.",
        "Multiply. Fifty cartons times twenty kilos is one thousand kilos.",
        "Add the pallet. One thousand plus thirty is one thousand and thirty kilos.",
      ],
    },
    {
      visual: {
        kind: "sum",
        title: "Weighbridge docket",
        lines: [
          { text: "Loaded truck: 18,000 kg" },
          { text: "− Empty truck: 12,000 kg" },
          { text: "= Load: 6,000 kg" },
          { text: "6,000 ÷ 4 pallets = 1,500 kg each", result: true },
        ],
      },
      say: [
        "A weighbridge weighs the whole truck. To get the load, take the empty truck away from the loaded truck.",
        "The loaded truck weighs eighteen thousand kilos.",
        "The empty truck weighs twelve thousand.",
        "So the load is six thousand kilos.",
        "If that's four pallets that are all the same, divide by four. Each pallet is fifteen hundred kilos.",
      ],
    },
    {
      visual: {
        kind: "sum",
        title: "Most cartons you can carry",
        lines: [
          { text: "Limit 1,000 − pallet 20 = 980 kg" },
          { text: "980 ÷ 30 kg = 32.67" },
          { text: "Round DOWN → 32 cartons", result: true },
          { text: "Check: 33 cartons = 1,010 kg ✗ too heavy" },
        ],
      },
      say: [
        "Sometimes you need the most cartons you can carry. Your limit is one thousand kilos, the pallet is twenty, and each carton is thirty.",
        "First, take the pallet off the limit. One thousand take away twenty is nine hundred and eighty.",
        "Then divide by the carton weight. Nine hundred and eighty divided by thirty is thirty-two point six seven.",
        "Always round down. So the answer is thirty-two cartons.",
        "Why not round up? Thirty-three cartons would be one thousand and ten kilos. That's too heavy.",
      ],
    },
    {
      visual: { kind: "diagram", name: "loadCentre", props: { depth: 1200, gap: 0 } },
      say: [
        "Now the load centre. It's the distance from the front of the tynes to the middle of the load's weight.",
        "For an even load pushed right back against the backrest, it's half the depth of the load.",
        "This crate is twelve hundred millimetres deep. Half of twelve hundred is six hundred millimetres.",
      ],
    },
    {
      visual: { kind: "diagram", name: "loadCentre", props: { depth: 1000, gap: 200 } },
      say: [
        "If there's a gap between the load and the backrest, add the gap.",
        "This crate is a thousand millimetres deep, so half is five hundred. The gap is two hundred. Five hundred plus two hundred is seven hundred millimetres.",
        "Seven hundred is further out than the six hundred on the data plate. So push the tynes all the way in, with the load against the backrest.",
      ],
    },
    {
      visual: {
        kind: "sum",
        title: "Rated capacity \u2014 OK to lift",
        lines: [
          {"text": "Forklift A: rated capacity 2,500 kg"},
          {"text": "Load: 1,900 kg, load centre 600 mm"},
          {"text": "1,900 is less than 2,500 \u2192 OK to lift \u2713", "result": true},
        ],
      },
      say: [
        "Now compare the load with the rated capacity. Forklift A's data plate says twenty-five hundred kilos at a six hundred millimetre load centre.",
        "Our pallet weighs nineteen hundred kilos, and its load centre is six hundred millimetres.",
        "Nineteen hundred is less than twenty-five hundred. It's OK to lift, with six hundred kilos to spare.",
      ],
    },
    {
      visual: {
        kind: "sum",
        title: "Rated capacity \u2014 too heavy",
        lines: [
          {"text": "2.7 t \u00d7 1,000 = 2,700 kg"},
          {"text": "Rated capacity: 2,500 kg"},
          {"text": "2,700 is more than 2,500 \u2192 DO NOT LIFT \u2717", "result": true},
        ],
      },
      say: [
        "This crate's paperwork says two point seven tonnes. Times by one thousand: twenty-seven hundred kilos.",
        "The rated capacity is twenty-five hundred kilos.",
        "Twenty-seven hundred is two hundred kilos too heavy. Do not lift it.",
      ],
    },
    {
      visual: {
        kind: "sum",
        title: "The most you can carry",
        lines: [
          {"text": "2,500 \u00f7 600 kg = 4.17"},
          {"text": "Round DOWN \u2192 4 drums \u2713", "result": true},
          {"text": "Check: 5 drums = 3,000 kg \u2717 too heavy"},
        ],
      },
      say: [
        "How many six hundred kilo drums can it carry at once? Divide the rated capacity by the weight of one drum. Twenty-five hundred divided by six hundred is four point one seven.",
        "Always round down. So the answer is four drums.",
        "Five drums would be three thousand kilos. That's too heavy.",
      ],
    },
    {
      visual: { kind: "title", title: "Module 5 complete", subtitle: "Weight → Load centre → Rated capacity" },
      say: ["That's the maths. Work out the weight, check the load centre, then compare it with the rated capacity. Have a go at the quiz — and use the calculator."],
    },
  ],
};

export const module6: ModuleVideo = {
  module: 6,
  title: "Safe operation and load handling",
  slides: [
    {
      visual: { kind: "title", title: "Safe operation and load handling", subtitle: "Module 6" },
      say: ["Module 6 is about driving safely, ramps, picking up loads, stacking, and loading trucks."],
    },
    {
      visual: { kind: "diagram", name: "travel" },
      say: [
        "When you travel, keep the load low — about a hundred to a hundred and fifty millimetres off the ground — and tilt the mast back.",
        "Look the way you're going. If the load blocks your view, drive in reverse, or use a spotter.",
        "Seatbelt on, no passengers ever, and slow down at corners, doorways and intersections.",
      ],
    },
    {
      visual: { kind: "diagram", name: "ramp", props: { loaded: true } },
      say: ["On a ramp with a load, keep the load on the uphill side. Drive forwards up, and reverse down."],
    },
    {
      visual: { kind: "diagram", name: "ramp", props: { loaded: false } },
      say: [
        "With no load, it's the other way around. Keep the tynes pointing downhill. Reverse up, and drive forwards down.",
        "And never turn on a ramp or drive across it.",
      ],
    },
    {
      visual: { kind: "diagram", name: "trialLift" },
      say: [
        "Before you move any load, do a trial lift. Lift it just clear of the ground, and stop.",
        "Is the forklift steady? Is the load secure and balanced? If the back wheels feel light, lower it straight away.",
      ],
    },
    {
      visual: {
        kind: "steps",
        title: "Stacking in racking",
        items: [
          { label: "Stop", text: "square to the rack" },
          { label: "Raise", text: "only when you're stopped" },
          { label: "Level", text: "the tynes, then inch forward" },
          { label: "Lower", text: "onto the beams, back out, lower to travel height" },
        ],
      },
      say: [
        "When you stack in racking, follow these steps.",
        "Stop square to the rack.",
        "Only raise or lower a load when you're stopped. Never while moving.",
        "Level the tynes, then inch forward slowly.",
        "Lower the load onto the beams, back out, and lower the tynes to travel height before you drive off.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Loading trucks",
        items: [
          { icon: "🛑", text: "Truck can't move — brakes on, wheels chocked" },
          { icon: "🚧", text: "Set up an exclusion zone" },
          { icon: "🔩", text: "Dock plate secure and rated" },
          { icon: "⚠️", text: "Keep back from dock edges" },
        ],
      },
      say: [
        "Loading trucks.",
        "Make sure the truck can't move. Brakes on, wheels chocked, and the driver somewhere safe.",
        "Set up an exclusion zone around the truck.",
        "Check the dock plate is secure, and rated for the forklift and the load.",
        "And keep well back from the dock edge.",
      ],
    },
    {
      visual: { kind: "title", title: "Module 6 complete", subtitle: "Low, slow, and look where you're going" },
      say: ["That's Module 6. Keep it low, keep it slow, and look where you're going. Read the lessons and try the quiz."],
    },
  ],
};

export const module7: ModuleVideo = {
  module: 7,
  title: "Shutdown, refuelling and recharging",
  slides: [
    {
      visual: { kind: "title", title: "Shutdown, refuelling and recharging", subtitle: "Module 7" },
      say: ["Module 7, the last one. How to park and shut down, change a gas bottle, and charge a battery safely."],
    },
    {
      visual: {
        kind: "photo",
        src: "https://images.unsplash.com/photo-1770827730773-cc7848b2ee61?auto=format&fit=crop&w=1600&h=900&q=80",
        alt: "An LPG forklift parked outside a building with its forks lowered",
        caption: "Finish the shift safely",
        credit: { name: "Osmany M Leyva Aldana", url: "https://unsplash.com/photos/IcB8U3l9Slg" },
      },
      say: [
        "At the end of the shift, the job isn't over until the forklift is parked safely.",
        "This one runs on LPG. You can see the gas cylinder on the back.",
      ],
    },
    {
      visual: { kind: "diagram", name: "parked" },
      say: [
        "When you finish, park in a safe, level area. Never block exits, walkways, fire equipment or switchboards.",
        "Select neutral. Put the park brake on. Lower the tynes flat on the ground.",
        "Turn it off, isolate the power, take the key, and report any defects from your shift.",
      ],
    },
    {
      visual: { kind: "diagram", name: "lpg" },
      say: [
        "Changing an L P G gas bottle? Do it in a well-ventilated area, with no flames and no smoking.",
        "Wear gloves and eye protection. L P G is so cold it can burn your skin.",
        "Close the valve, let the engine run until it stops, then swap the bottle. Make sure the locating pin is in and the bottle is secure.",
        "Check for leaks with soapy water. Bubbles mean a leak. Never use a flame.",
      ],
    },
    {
      visual: { kind: "diagram", name: "charging" },
      say: [
        "Charging a forklift battery gives off hydrogen gas, which can explode. Only charge in the charging area, with good airflow.",
        "Turn the charger off before you connect or disconnect the battery, so there's no spark.",
        "Battery acid burns. Wear your P P E, and know where the eyewash station is.",
      ],
    },
    {
      visual: { kind: "title", title: "Course complete!", subtitle: "Next: the final practice exam" },
      say: ["That's the last module. When you've finished all the lessons, try the final practice exam. Good luck with your assessment!"],
    },
  ],
};
