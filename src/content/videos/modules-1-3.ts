import type { ModuleVideo } from "./types";

export const module1: ModuleVideo = {
  module: 1,
  title: "Licensing, law and standards",
  slides: [
    {
      visual: { kind: "title", title: "Licensing, law and standards", subtitle: "Module 1" },
      say: [
        "Welcome to Module 1. In this short video we'll cover why you need a licence to drive a forklift, your duties under safety law, and where the safety rules come from.",
      ],
    },
    {
      visual: {
        kind: "photo",
        src: "https://images.unsplash.com/photo-1684695749267-233af13276d0?auto=format&fit=crop&w=1600&h=900&q=80",
        alt: "A large warehouse with tall racking full of stock",
        caption: "Busy sites need licensed operators",
        credit: { name: "Alberto Rodr\u00edguez", url: "https://unsplash.com/@albertorodriguez" },
      },
      say: [
        "Forklifts work in busy places like this, close to people, racking and other vehicles.",
        "One mistake can injure or kill someone. That's why the law treats forklift driving as high risk work.",
      ],
    },
    {
      visual: { kind: "diagram", name: "licenceCard" },
      say: [
        "Driving a forklift is high risk work. To do it, you need a High Risk Work Licence, class L F.",
        "There's also a class L O, for order-picking forklifts. This course prepares you for class L F.",
      ],
    },
    {
      visual: {
        kind: "steps",
        title: "How you get your licence",
        items: [
          { label: "Train", text: "with a Registered Training Organisation (RTO)" },
          { label: "Pass", text: "a theory AND a practical assessment" },
          { label: "Apply", text: "to your state or territory regulator" },
        ],
      },
      say: [
        "Here's how you get your licence.",
        "First, train with a Registered Training Organisation.",
        "Second, pass both a theory and a practical assessment with an accredited assessor.",
        "Third, apply to your state or territory regulator. You must be at least eighteen, and you'll renew the licence about every five years.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "The business must…",
        items: [
          { icon: "🏭", text: "Provide a safe, well-maintained forklift" },
          { icon: "📘", text: "Give you training, information and supervision" },
          { icon: "🚦", text: "Set up safe systems, like a traffic management plan" },
        ],
      },
      say: [
        "Everyone at work has safety duties. The business must do three main things.",
        "Provide a forklift that's safe and properly maintained.",
        "Give you the training, information and supervision you need.",
        "And set up safe ways of working, like a traffic management plan.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "You must…",
        items: [
          { icon: "🦺", text: "Take care of your own safety" },
          { icon: "👥", text: "Take care not to hurt anyone else" },
          { icon: "📋", text: "Follow instructions and site procedures" },
          { icon: "📣", text: "Report hazards, incidents and defects" },
        ],
      },
      say: [
        "As the operator, you have duties too.",
        "Take care of your own safety.",
        "Take care that what you do doesn't hurt anyone else.",
        "Follow reasonable instructions and your site's procedures. If you don't understand an instruction, ask.",
        "And report every hazard, incident and defect you find.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Where the rules come from",
        items: [
          { icon: "⚖️", text: "WHS Act & Regulations — the law" },
          { icon: "📗", text: "Codes of practice — how to meet the law" },
          { icon: "📐", text: "Australian Standards — e.g. AS 2359 for forklifts" },
          { icon: "📕", text: "Manufacturer's manual — this forklift" },
          { icon: "🏢", text: "Workplace procedures — your site" },
        ],
      },
      say: [
        "Safety rules come from a few places.",
        "The Work Health and Safety Act and Regulations. That's the law.",
        "Codes of practice, which explain how to meet the law.",
        "Australian Standards. For forklifts, that's the A S twenty-three fifty-nine series.",
        "The manufacturer's manual for the forklift you're driving.",
        "And your own workplace's procedures.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Keep good records",
        items: [
          { icon: "✅", text: "Pre-start checklist — every shift" },
          { icon: "🔧", text: "Defect and fault reports" },
          { icon: "⚠️", text: "Incident and near-miss reports" },
          { icon: "📒", text: "Logbook of your supervised hours (trainees)" },
        ],
      },
      say: [
        "Good records show checks were done and problems were fixed. Make them accurate, neat, dated and signed.",
        "Fill in a pre-start checklist every shift.",
        "Write up defect and fault reports.",
        "Report incidents, and near misses too.",
        "And if you're a trainee, keep your logbook of supervised hours up to date.",
      ],
    },
    {
      visual: { kind: "title", title: "Module 1 complete", subtitle: "Next: read the lessons, then take the quiz" },
      say: ["That's Module 1. Next, read through the lessons, then take the quiz. And remember: if you're not sure, stop and ask."],
    },
  ],
};

export const module2: ModuleVideo = {
  module: 2,
  title: "Planning, hazards and traffic management",
  slides: [
    {
      visual: { kind: "title", title: "Planning, hazards and traffic management", subtitle: "Module 2" },
      say: ["Module 2 is about planning your work and spotting hazards before they hurt someone — including what to do if you hit a powerline."],
    },
    {
      visual: {
        kind: "points",
        title: "Plan before you lift",
        items: [
          { icon: "📦", text: "The load — weight, size, is it secure?" },
          { icon: "🚜", text: "The forklift — can it lift this, this high?" },
          { icon: "🛣️", text: "The route — surfaces, slopes, doorways, overhead" },
          { icon: "📍", text: "The destination — where will it go?" },
          { icon: "👷", text: "People — who's nearby?" },
        ],
      },
      say: [
        "Before you lift anything, think the job through.",
        "The load. How heavy is it, how big, and is it secure?",
        "The forklift. Can it lift this load, as high as you need?",
        "The route. Check the ground, slopes, doorways and anything overhead.",
        "The destination. Where exactly will the load go?",
        "And people. Who else is working nearby, and how will you talk to them?",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Communicate",
        items: [
          { icon: "📢", text: "Horn, beacon and reversing alarm" },
          { icon: "✋", text: "Hand signals — agree them first" },
          { icon: "📻", text: "Two-way radio — short, clear messages" },
          { icon: "👀", text: "Eye contact with pedestrians" },
        ],
      },
      say: [
        "Good communication prevents accidents.",
        "Use your horn, beacon and reversing alarm.",
        "If a spotter is guiding you with hand signals, agree on the signals before you start.",
        "On a two-way radio, keep messages short and clear, and confirm you understood.",
        "And always make eye contact with pedestrians before you move near them.",
      ],
    },
    {
      visual: { kind: "diagram", name: "hierarchy" },
      say: [
        "When you find a hazard, use the hierarchy of control. Start at the top — the most effective — and work down.",
        "One. Eliminate the hazard completely.",
        "Two. Substitute it with something safer.",
        "Three. Isolate people from it, with barriers or separate walkways.",
        "Four. Engineering controls, like mirrors and warning lights.",
        "Five. Administrative controls, like procedures, signs and training.",
        "Six. Personal protective equipment. That's the last line of defence.",
      ],
    },
    {
      visual: {
        kind: "photo",
        src: "https://images.unsplash.com/photo-1574173799345-e672ea143892?auto=format&fit=crop&w=1600&h=900&q=80",
        alt: "Looking up at a high-voltage transmission tower and lines",
        caption: "Outside? Look up.",
        credit: { name: "Jonathan Hanna", url: "https://unsplash.com/@funnelhead" },
      },
      say: [
        "When you work outside, always look up before you lift.",
        "High-voltage electricity can jump across a gap, so you don't have to touch a powerline to be killed by it.",
      ],
    },
    {
      visual: { kind: "diagram", name: "powerlineContact", props: { phase: "approach" } },
      say: [
        "Overhead powerlines can kill. Electricity can jump across a gap, so you don't even have to touch the line.",
        "Always look up. Keep the minimum distance for your state. In New South Wales, that's three metres for most local lines, and more for bigger lines.",
        "Lower the mast before you travel, and use a spotter when you're working near lines.",
      ],
    },
    {
      visual: {
        kind: "steps",
        title: "If you hit a powerline",
        tone: "danger",
        items: [
          { label: "STAY", text: "on the forklift. Don't touch metal parts." },
          { label: "WARN", text: "everyone to keep 8 m away" },
          { label: "BREAK", text: "contact — only if it's safe" },
          { label: "CALL", text: "000 and the electricity company" },
          { label: "JUMP", text: "clear — only if you must (e.g. fire)" },
        ],
      },
      say: [
        "If your forklift touches a powerline, remember five steps. Stay. Warn. Break. Call. Jump.",
        "Step one. Stay on the forklift. Stay calm, and don't touch any metal parts.",
        "Step two. Warn everyone to keep at least eight metres away. Nobody touches the forklift.",
        "Step three. Break contact, by lowering the mast or driving clear — but only if it's safe.",
        "Step four. Call triple zero and the electricity company, and ask them to turn the power off. Stay where you are until they say it's off.",
        "Step five. Only if you must get off — for example, if there's a fire — jump clear.",
      ],
    },
    {
      visual: { kind: "diagram", name: "powerlineContact", props: { phase: "contact" } },
      say: [
        "The ground around a live forklift can be live too. That's why the eight metre rule matters.",
        "Everyone else stays at least eight metres away, and no one tries to help you until the power is confirmed off.",
      ],
    },
    {
      visual: { kind: "diagram", name: "jumpClear" },
      say: [
        "If you have to get off, jump well clear with your feet together. Never touch the forklift and the ground at the same time.",
        "Land with your feet together. Then shuffle or bunny-hop, keeping your feet together, until you're at least eight metres away.",
        "Don't go back until the electricity company confirms the power is off. Then report it — it's a notifiable incident.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Is the ground OK?",
        items: [
          { icon: "🕳️", text: "Potholes, cracked concrete — slow down or go around" },
          { icon: "🟫", text: "Soft soil, backfill — may collapse" },
          { icon: "🛤️", text: "Railway tracks — cross slowly, at an angle" },
          { icon: "🔩", text: "Steel plates, grates — rated for the total weight?" },
        ],
      },
      say: [
        "A loaded forklift is very heavy. Check the ground can take it.",
        "Potholes and cracked concrete jolt the load. Slow down, or go around them, and report them.",
        "Soft soil and backfilled trenches can collapse. Avoid them.",
        "Cross railway tracks slowly, at an angle if you can.",
        "And steel plates, grates and trench covers must be rated for the forklift and the load together.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Weather",
        items: [
          { icon: "💨", text: "Wind — big flat loads act like a sail" },
          { icon: "⚡", text: "Lightning — stop, park, take shelter" },
          { icon: "🌧️", text: "Rain or ice — slow down, brake gently" },
          { icon: "🌡️", text: "Heat & UV — water, breaks, sun protection" },
        ],
      },
      say: [
        "Weather changes the risks outside.",
        "In strong wind, big flat loads like sheets of plywood catch the wind like a sail.",
        "If there's lightning, stop work, park safely, and take shelter.",
        "On wet or icy ground, slow down, brake gently, and leave a much bigger stopping distance.",
        "In heat, drink water, take breaks, and protect yourself from the sun.",
      ],
    },
    {
      visual: {
        kind: "photo",
        src: "https://images.unsplash.com/photo-1586528116022-aeda1613c63d?auto=format&fit=crop&w=1600&h=900&q=80",
        alt: "Workers walking along a marked aisle in a large warehouse",
        caption: "People share your workplace",
        credit: { name: "Adrian Sulyok", url: "https://unsplash.com/photos/c_4eaGRDSVU" },
      },
      say: [
        "In a real warehouse, people walk the same aisles you drive.",
        "Marked walkways, barriers and exclusion zones keep pedestrians and forklifts apart.",
      ],
    },
    {
      visual: { kind: "diagram", name: "exclusionZone" },
      say: [
        "A traffic management plan keeps people and forklifts apart, with walkways, crossings, speed limits and signs. Follow it every time.",
        "When you're loading a truck or stacking high, set up an exclusion zone with barriers and signs.",
        "If anyone walks into it, stop work until they've left.",
      ],
    },
    {
      visual: { kind: "title", title: "Module 2 complete", subtitle: "Stay · Warn · Break · Call · Jump" },
      say: ["That's Module 2. Remember the powerline steps: stay, warn, break, call, jump. Now read the lessons and try the quiz."],
    },
  ],
};

export const module3: ModuleVideo = {
  module: 3,
  title: "Checks, faults and failures",
  slides: [
    {
      visual: { kind: "title", title: "Checks, faults and failures", subtitle: "Module 3" },
      say: ["Module 3 covers the checks you do every shift, what to do when you find a fault, and what to do if something fails while you're driving."],
    },
    {
      visual: {
        kind: "photo",
        src: "https://images.unsplash.com/photo-1779155413504-7608a08d4873?auto=format&fit=crop&w=1600&h=900&q=80",
        alt: "A forklift operator's seat, steering wheel and controls",
        caption: "Your pre-start check starts here",
        credit: { name: "Cooper Kuppens", url: "https://unsplash.com/@ckuppens" },
      },
      say: [
        "Before every shift, you check the forklift, inside and out.",
        "That includes the seat, seatbelt, controls and gauges, as well as the outside of the machine.",
      ],
    },
    {
      visual: { kind: "diagram", name: "prestart" },
      say: [
        "Do a pre-start check before every shift, with the engine off. Walk all the way around the forklift.",
        "One. The tynes. Look for cracks, bends and wear, and check the locking pins.",
        "Two. The mast and chains. Look for damage and worn or loose chains.",
        "Three. Hydraulic hoses. Check for leaks, and look at the ground underneath.",
        "Four. Tyres and wheels. Check for damage, wear and the right pressure.",
        "Five. The overhead guard and load backrest must be fitted and undamaged.",
        "Six. The data plate must be there, readable, and match any attachment.",
        "Seven. Fluids and fuel — oil, coolant, and the gas bottle or battery charge.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Getting on",
        items: [
          { icon: "🪜", text: "Three points of contact — never jump down" },
          { icon: "💺", text: "Adjust the seat and mirrors" },
          { icon: "🔒", text: "Seatbelt on — and test it" },
        ],
      },
      say: [
        "Getting on and off is where a lot of injuries happen.",
        "Use the steps and handholds with three points of contact. Never jump down.",
        "Once you're seated, adjust the seat and mirrors.",
        "Put your seatbelt on, and check it works.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Checks with the engine running",
        items: [
          { icon: "🔊", text: "Horn, lights, beacon, reversing alarm" },
          { icon: "🎛️", text: "Find and test every control" },
          { icon: "↕️", text: "Lift, tilt, side shift — full range, smooth" },
          { icon: "🛑", text: "Brakes, steering, transmission" },
          { icon: "👂", text: "Listen for unusual noises" },
        ],
      },
      say: [
        "Next, start the forklift the way the manufacturer says, and do your operational checks.",
        "Test the horn, lights, beacon and reversing alarm.",
        "Find and test every control.",
        "Run the lift, tilt and side shift through their full range. They should move smoothly.",
        "Check the brakes, steering and transmission.",
        "And listen for any unusual noises. Write the results on your checklist.",
      ],
    },
    {
      visual: {
        kind: "steps",
        title: "Found a fault? Lock out / tag out",
        items: [
          { label: "Stop", text: "and park safely" },
          { label: "Isolate", text: "the power — key out, gas off or battery off" },
          { label: "Tag", text: "it OUT OF SERVICE" },
          { label: "Report", text: "it and write it down" },
        ],
      },
      say: [
        "If you find a fault, the forklift can't be used until it's fixed. This is called lock out, tag out.",
        "Stop, and park safely.",
        "Isolate the power. Take the key out, turn the gas off, or disconnect the battery.",
        "Tag it out of service.",
        "Report the fault to your supervisor, and write it down.",
      ],
    },
    {
      visual: { kind: "diagram", name: "lotoTag" },
      say: [
        "The tag tells everyone the forklift must not be used. Only an authorised person can take it off, once the repair has been done and checked.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "If something fails while driving",
        items: [
          { icon: "🛑", text: "Brakes fail — horn, steer clear, use the park brake" },
          { icon: "🔄", text: "Steering fails — stop safely, warn others" },
          { icon: "💧", text: "Hydraulics fail — keep everyone clear of the load" },
        ],
      },
      say: [
        "Sometimes things fail while you're driving.",
        "If the brakes fail, take your foot off the accelerator, use the horn to warn people, steer away from people and obstacles, and use the park brake to stop.",
        "If the steering fails, stop as safely as you can and warn people.",
        "If the hydraulics fail and the load drops, keep everyone clear of it. In every case, tag out and report.",
      ],
    },
    {
      visual: { kind: "diagram", name: "tipOver" },
      say: [
        "If the forklift starts to tip over, do not jump. People who jump are often crushed by the overhead guard.",
        "Stay in the seat with your seatbelt on. Hold the steering wheel tight, brace your feet, and lean away from the direction it's falling.",
      ],
    },
    {
      visual: {
        kind: "points",
        title: "Common problems",
        items: [
          { icon: "⛽", text: "Gas forklift stutters — bottle is running empty" },
          { icon: "🔋", text: "Battery low — go and charge it" },
          { icon: "🌡️", text: "Overheating — stop, cool down, never open a hot radiator" },
          { icon: "💡", text: "Light or horn not working — report it" },
        ],
      },
      say: [
        "Here are some common problems.",
        "If a gas forklift starts to stutter, the bottle is probably running empty. Park safely and change it.",
        "If the battery is low, go back to the charging area.",
        "If it's overheating, stop, turn it off and let it cool. Never open a hot radiator cap.",
        "If a light, horn or alarm isn't working, report it. Only fix things you're trained and allowed to fix.",
      ],
    },
    {
      visual: { kind: "title", title: "Module 3 complete", subtitle: "Check it. Tag it. Report it." },
      say: ["That's Module 3. Check it every shift, tag it if it's faulty, and report it. Now read the lessons and try the quiz."],
    },
  ],
};
