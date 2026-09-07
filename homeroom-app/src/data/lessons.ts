import type { Lesson } from "./types";

// Hand-curated, activity-first lessons. Free forever, no API key, no
// generation cost — each one is written and reviewed, not templated.
// Topics without an entry here show a friendly "not written yet" state
// on the lesson page. Board-independent: the same good activity for
// germination works whether it's filed under CBSE Class 2 EVS or an
// IB PYP "How the World Works" unit.
export const LESSONS: Lesson[] = [
  {
    topicId: "a3-math-counting-1-10",
    hook: "Line up 10 of your child's favourite small toys or snacks (raisins, buttons, blocks) on the floor in a wiggly row.",
    teach: [
      "At this age, counting isn't about reciting '1, 2, 3...' — it's about matching one number word to one object, in order, every single time. That one-to-one link is the actual skill.",
      "Touch each object as you say its number out loud, slowly. Let your child do the touching while you say the numbers, then swap.",
      "Don't rush past mistakes — if they skip a number or touch two objects on one count, just repeat that bit together. It'll click with repetition, not correction.",
    ],
    activities: [
      {
        title: "The Counting Train",
        time: "10 minutes",
        materials: ["10 small toys, coins, or snacks", "A sheet of paper with numbers 1–10 written in a row"],
        steps: [
          "Line the objects up like train carriages.",
          "Walk your finger along the number sheet while your child moves one object per number.",
          "Once you reach 10, ask: 'How many carriages does our train have?' and count together one more time to answer.",
          "Mix up the objects and repeat — counting a jumbled pile is harder than a neat row, and that's a good next challenge.",
        ],
      },
      {
        title: "Snack Count & Eat",
        time: "5 minutes",
        materials: ["10 small pieces of a favourite snack"],
        steps: [
          "Count out loud as you place snacks one by one on a plate.",
          "Let your child eat one piece per number as you count backwards from 10 to 1 together.",
          "This sneaks in reverse counting, which is genuinely trickier than counting up.",
        ],
      },
    ],
    reflect: "Ask: 'Can you show me 5 fingers? What about 3?' Counting on fingers on request (without objects in front of them) is the sign this is really sinking in.",
    extension: "Hide the 10 objects around one room and go on a 'counting hunt' — find and count them as your child discovers each one.",
  },
  {
    topicId: "a3-language-letter-sounds",
    hook: "Say 'Mmm, mango is my favourite!' in an exaggerated way, stretching out the 'mmm' sound before naming the fruit.",
    teach: [
      "At this age we teach the sound a letter makes ('mmm' for M), not its name ('em'). Sounds are what let a child eventually blend letters into words.",
      "Pick one letter a day, tied to something real in your home — M for mango, B for ball, S for spoon — rather than working through the alphabet in strict order.",
      "Exaggerate the sound with your mouth and let your child watch and copy your lips and tongue — this is as much a physical skill as a listening one.",
    ],
    activities: [
      {
        title: "Sound Scavenger Hunt",
        time: "15 minutes",
        materials: ["Nothing — just your home"],
        steps: [
          "Pick today's letter sound, say ball → 'buh'.",
          "Walk around the house together hunting for anything starting with that sound.",
          "Collect small items (or point at big ones) and pile them up as your 'buh' collection.",
          "Say each found object's name together, stretching the first sound: 'buh-buh-ball', 'buh-buh-book'.",
        ],
      },
      {
        title: "Sound Box",
        time: "10 minutes",
        materials: ["A shoebox or bag", "3–4 small objects, only some starting with today's sound"],
        steps: [
          "Fill the box with a mix of objects — some starting with today's sound, some not.",
          "Take turns pulling one out, saying its name slowly, and deciding: does it start with our sound or not?",
          "Sort them into two piles as you go.",
        ],
      },
    ],
    reflect: "At the end of the day, ask: 'What was our sound today? Can you think of one more thing that starts with it?' without giving hints.",
    extension: "Keep a running 'Sound Wall' — stick a printed letter on the wall each day, with a small drawing of one object that starts with it, and glance back at old ones as you add new ones.",
  },
  {
    topicId: "a4-world-seasons-weather",
    hook: "Look out the window together and ask: 'If we walked outside right now, what would we need to wear?'",
    teach: [
      "Seasons are best taught through the senses, not definitions: what does it feel like, what do we wear, what do we see outside.",
      "Keep it local and real — talk about the weather your child is actually experiencing this week, not an abstract 'four seasons' most Indian regions don't cleanly have.",
      "Connect weather to clothes, food and activities: umbrellas and mangoes in monsoon, sweaters and hot soup in winter — cause and effect they can feel.",
    ],
    activities: [
      {
        title: "Today's Weather Diary",
        time: "5 minutes daily, for a week",
        materials: ["A notebook or sheet of paper", "Crayons"],
        steps: [
          "Each morning, look outside together and ask: sunny, rainy, cloudy or windy?",
          "Draw a simple picture for today's weather (a sun, a cloud with rain drops, etc.).",
          "Write the day's name next to it (you write, they dictate).",
          "At the end of the week, look back together: 'Which day had the most sunshine? Was any day rainy?'",
        ],
      },
      {
        title: "Dress the Weather",
        time: "10 minutes",
        materials: ["A pile of the child's own clothes — caps, sweaters, sandals, umbrella, sunglasses"],
        steps: [
          "Call out a weather type: 'It's very hot and sunny!'",
          "Have your child run and pick out clothes/items they'd actually wear.",
          "Ask them why they chose each item — the 'why' is where the real understanding shows up.",
        ],
      },
    ],
    reflect: "Ask: 'What's your favourite kind of weather, and what do you like to do on a day like that?'",
    extension: "Start a simple thermometer habit — even just noticing 'today feels hotter/colder than yesterday' builds comparison skills alongside the science.",
  },
  {
    topicId: "a4-world-community-helpers",
    hook: "Ask: 'If you got a bad cough, who would help you feel better?' and let the answers (doctor? mummy? both!) lead into who helps us and how.",
    teach: [
      "Community helpers is really a lesson in interdependence — no single person can do everything, and that's a comforting, not scary, idea for a 4-year-old.",
      "Ground each helper in something your child has actually seen: the sabziwala who comes to your street, the guard at the gate, the teacher, the doctor from a real visit.",
      "For each helper, talk through three things: what they do, what tools/uniform they use, and how they help our family specifically.",
    ],
    activities: [
      {
        title: "Dress-Up & Guess",
        time: "20 minutes",
        materials: ["Household props: a spoon (chef), a bag (postman), a toy stethoscope or tube (doctor), a cap"],
        steps: [
          "Pick a helper and gather 1–2 props for them.",
          "Act out what that helper does (stir a pot, deliver a 'letter', check a 'patient's' heartbeat) without saying who you are.",
          "Let your child guess the helper, then swap roles so they act one out for you.",
        ],
      },
      {
        title: "Helper Match-Up",
        time: "10 minutes",
        materials: ["Paper", "Crayons"],
        steps: [
          "Draw (or find pictures of) 4 helpers and 4 of their tools separately.",
          "Mix up the tool pictures and ask your child to match each tool to its helper.",
          "For each match, ask: 'How does this help our family?'",
        ],
      },
    ],
    reflect: "Ask: 'Which helper would you like to be when you grow up, and why?'",
    extension: "On your next real errand — market, clinic, post office — point out the helper in action and connect it back to the game you played.",
  },
  {
    topicId: "a5-world-five-senses",
    hook: "Blindfold yourself (not your child!) and ask them to describe an object using only touch, while you guess what it is.",
    teach: [
      "Each sense is a 'tool' the body uses to learn about the world — the goal is for your child to notice they're using a specific sense, not just experiencing something vaguely.",
      "Go one sense at a time rather than all five at once; depth beats breadth at this age.",
      "Use the words 'I see with my eyes', 'I hear with my ears' out loud often, so the vocabulary sticks alongside the experience.",
    ],
    activities: [
      {
        title: "Senses Scavenger Hunt",
        time: "20 minutes",
        materials: ["A small basket or bag"],
        steps: [
          "Go around the house or garden hunting for: something that feels soft, something that makes a sound, something that smells nice, something colourful to see, and (with a snack) something sweet to taste.",
          "For each item found, name the sense used out loud: 'I felt this with my hands — it's soft!'",
          "Lay all the found items out at the end and recall together which sense found each one.",
        ],
      },
      {
        title: "Mystery Sound Box",
        time: "10 minutes",
        materials: ["A box or bag", "3–4 objects that make different sounds when shaken or tapped (keys, rice in a container, a bell)"],
        steps: [
          "Hide the objects one at a time in the box and make a sound with each without showing it.",
          "Ask your child to guess what's making the sound using only their ears.",
          "Reveal and check — celebrate the guesses that used pure listening.",
        ],
      },
    ],
    reflect: "Ask: 'If you could only keep one sense for a whole day, which would you pick, and why?' (There's no wrong answer — it's about reasoning out loud.)",
    extension: "Try a 'silent breakfast' where you both eat one small item slowly and only describe it using taste and smell words.",
  },
  {
    topicId: "a5-world-living-non-living",
    hook: "Hold up a toy car and a real ant (or a picture of one) and ask: 'Which one is actually alive?'",
    teach: [
      "The real test at this age is simple and physical: does it grow, does it need food/water, can it move on its own, and will it eventually die. Anything with all four is living.",
      "Robots, dolls and cars can 'move' but only when a person or battery makes them — that's the key distinction to draw out, not a lecture.",
      "Plants are the trickiest category (they don't walk around) — spend extra time here since it sets up later topics like germination.",
    ],
    activities: [
      {
        title: "Living or Not? Sorting Walk",
        time: "20 minutes",
        materials: ["Two hoops, chalk circles, or sheets of paper labelled 'Living' and 'Not Living'"],
        steps: [
          "Walk around the house or garden collecting (or pointing at) 6–8 things: a stone, a leaf, an insect, a toy, a flower, a spoon, etc.",
          "For each one, ask the four questions together: does it grow? does it need food or water? can it move by itself? will it die one day?",
          "Sort it into the correct circle based on the answers.",
        ],
      },
      {
        title: "Living Things Need...",
        time: "10 minutes",
        materials: ["Paper", "Crayons"],
        steps: [
          "Draw a simple picture of a plant, an animal, and your child themself.",
          "Next to each, draw or write what it needs to stay alive (water, food, air, sunlight, love!).",
          "Notice out loud what's the same across all three — that's the real 'aha'.",
        ],
      },
    ],
    reflect: "Ask: 'Is fire alive? It grows and needs air!' — a fun trick question that shows whether the four-question test is really understood (fire fails 'will it die on its own and can it reproduce' in the way living things do).",
    extension: "Start caring for one real living thing together — a small potted plant or a pet's food bowl — as an ongoing, hands-on reminder of what 'needs' means.",
  },
  {
    topicId: "a6-world-parts-of-plant",
    hook: "Pull up a weed from the garden (roots and all) or buy one spring onion with roots attached, and lay it flat on a table.",
    teach: [
      "Each part of a plant has one main job: roots drink water and hold the plant in place, the stem carries water up and holds the plant upright, leaves catch sunlight and 'breathe', flowers make seeds, and fruit protects those seeds.",
      "Teach it as a water's journey: in through the roots, up the stem, out to the leaves — this story sequence sticks better than five isolated labels.",
      "Real plants beat diagrams every time at this age — always have an actual plant in hand if you can.",
    ],
    activities: [
      {
        title: "Label the Plant",
        time: "20 minutes",
        materials: ["One whole plant with roots (a pulled weed or spring onion works well)", "Paper", "Tape", "A pen"],
        steps: [
          "Lay the plant flat and identify each part together: root, stem, leaf, flower/fruit if present.",
          "Write each part's name on a small paper flag and tape it to point at the right part.",
          "Ask your child to explain each part's 'job' in their own words as you point to it.",
        ],
      },
      {
        title: "Celery Water Journey",
        time: "5 minutes to set up, check daily for 3 days",
        materials: ["A stick of celery with leaves (or a white flower)", "A glass of water", "Food colouring"],
        steps: [
          "Add a few drops of food colouring to the water and stir.",
          "Stand the celery stalk (cut end down) in the coloured water.",
          "Check every day and watch the colour travel up the stem into the leaves — this is the roots-to-leaves journey, made visible.",
        ],
      },
    ],
    reflect: "Ask: 'If a plant's roots got damaged, which other part do you think would suffer, and why?'",
    extension: "Cut open a fruit together and find the seeds inside — connect it back to the flower's job of making the next generation of plants.",
  },
  {
    topicId: "a6-math-measurement",
    hook: "Ask: 'Who's taller — you or the dining table?' and let your child figure out how to check without a ruler.",
    teach: [
      "Before standard units (cm, kg) make sense, children need to genuinely understand comparison: longer/shorter, heavier/lighter, more/less — using their own body and household objects as measuring tools.",
      "Non-standard units (hand-spans, footsteps, spoons of water) are not a shortcut — they're the actual first stage of measurement, used by real mathematicians historically too.",
      "Always measure the same thing two different ways and compare the answers — that's what leads naturally, later, to 'we need one shared unit for everyone'.",
    ],
    activities: [
      {
        title: "Hand-Span Measuring Hunt",
        time: "20 minutes",
        materials: ["Just your hands"],
        steps: [
          "Show your child how to measure using hand-spans (thumb tip to little-finger tip, laid flat).",
          "Pick 4–5 things around the house — the sofa, a door, a table — and measure each in hand-spans.",
          "Write down each result, then compare: 'The sofa is 12 hand-spans, the table is 6 — the sofa is longer!'",
          "Now measure the same sofa using your child's hand-spans and yours — notice the numbers differ even though the sofa didn't change. Ask why.",
        ],
      },
      {
        title: "Heavy or Light? Balance Check",
        time: "15 minutes",
        materials: ["A coat hanger and two bags (or a simple homemade balance)", "5–6 small household objects"],
        steps: [
          "Hang a bag from each end of the hanger and hold it by the hook, or use any simple see-saw setup.",
          "Place one object in each bag and see which side dips down — that side is heavier.",
          "Try different pairs and predict before checking each time.",
        ],
      },
    ],
    reflect: "Ask: 'Why did the sofa measure differently in my hand-spans than in yours, even though the sofa is exactly the same size?'",
    extension: "Introduce one real ruler or measuring tape and re-measure one object from the hunt — this is the bridge to standard units.",
  },
  {
    topicId: "a6-arts-nature-collage",
    hook: "Go for a 5-minute walk with an empty bag and challenge your child to collect anything interesting they find on the ground.",
    teach: [
      "Nature collage isn't just craft time — it's a chance to slow down and really look at texture, colour and shape in ordinary things like leaves, twigs and petals.",
      "There's no 'correct' picture here — the goal is composition and observation, not accuracy.",
      "Talk about the materials as you glue: 'this leaf is rough, this petal is smooth' — building descriptive vocabulary alongside the art.",
    ],
    activities: [
      {
        title: "Found Treasure Collage",
        time: "30 minutes (15 collecting, 15 making)",
        materials: ["A bag for collecting", "A sheet of thick paper or cardboard", "Glue"],
        steps: [
          "Go outside and collect 8–10 natural items: leaves, small twigs, flower petals, seed pods.",
          "Lay them out on the paper first, moving them around to decide on a picture (a tree, a face, an animal, or just a pattern) before gluing anything down.",
          "Glue each piece in place once you're both happy with the layout.",
          "Let it dry and display it somewhere visible.",
        ],
      },
    ],
    reflect: "Ask: 'Which piece was your favourite to find, and why did you choose to put it there in your picture?'",
    extension: "Do a second collage a week later in a different season or after rain, and compare what's different to find this time.",
  },
  {
    topicId: "a7-world-germination",
    hook: "Ask: 'What do you think is hiding inside this tiny seed?' while holding up a dried bean or chana, and let your child guess before you start.",
    teach: [
      "Germination is the moment a seed 'wakes up' and starts growing into a plant — it needs just three things to begin: water, air and warmth (not soil at first, which is what makes this activity possible to watch with your own eyes).",
      "Inside the seed is a tiny, already-formed baby plant plus a packed lunch of food to get it started — water softens the seed coat and switches on that stored food.",
      "The sequence to watch for, in order: the seed swells and softens → the root (radicle) pokes out first, pointing down → the shoot pokes up, pointing toward light → the first leaves unfold.",
    ],
    activities: [
      {
        title: "The Seed-in-a-Jar Window",
        time: "10 minutes to set up, then 2 minutes daily for 5–7 days",
        materials: ["A clear glass jar or plastic cup", "Wet cotton wool or a damp paper towel", "3–4 large seeds — rajma (kidney beans), chana, or moong work best", "Water"],
        steps: [
          "Line the inside wall of the jar with damp cotton wool or a folded wet paper towel, pressed against the glass.",
          "Tuck the seeds between the cotton and the glass so you can see them from the outside.",
          "Keep the cotton damp (not soaking) every day, and place the jar somewhere warm.",
          "Each morning, look together and draw or photograph what's changed — most seeds show a root within 2–4 days.",
          "Keep a simple 'Germination Diary': one small drawing per day of what the seed looks like.",
        ],
      },
      {
        title: "Plant It Forward",
        time: "10 minutes, then ongoing care",
        materials: ["A small pot or reused cup with drainage holes", "Soil", "One sprouted seed from the jar"],
        steps: [
          "Once a seed from the jar has a visible root and shoot, gently move it into a small pot of soil, root-side down.",
          "Water lightly and place it near a sunny window.",
          "Check every few days and measure its height with a strip of paper, marking growth on a simple chart.",
        ],
      },
    ],
    reflect: "Ask: 'Which part of the seed came out first — the root or the shoot? Why do you think it happened in that order?' (The root anchors and finds water before the plant can safely grow upward.)",
    extension: "Try germinating two identical seeds side by side, but keep one jar dark (inside a cupboard) and one in light. After a week, compare — this sets up photosynthesis for later without naming it yet.",
  },
  {
    topicId: "a7-math-intro-multiplication",
    hook: "Lay out 3 plates with 4 biscuits on each and ask: 'How many biscuits are there in total, without counting one by one?'",
    teach: [
      "Multiplication is repeated addition of equal groups — '3 groups of 4' is exactly the same as '4 + 4 + 4'. Say both out loud every time until the connection is automatic.",
      "Always use the language 'groups of' before introducing the × symbol — the symbol should arrive after the idea, not before it.",
      "Arrays (neat rows and columns) are the single best visual for this — they make 3×4 and 4×3 visibly give the same total, which is a genuine 'aha' for most children.",
    ],
    activities: [
      {
        title: "Biscuit Plate Arrays",
        time: "15 minutes",
        materials: ["12–20 small identical objects — biscuits, coins, buttons", "Small plates or paper circles"],
        steps: [
          "Make 3 plates with 4 objects on each. Count them one by one first to get the total (12).",
          "Now say together: '3 plates, 4 on each — that's 3 groups of 4, or 3 × 4'.",
          "Rearrange into 4 plates of 3 instead, and count again — same total! This is the first real proof that 3×4 = 4×3.",
          "Try 2 different group sizes (like 5 plates of 2) and predict the total before counting to check.",
        ],
      },
      {
        title: "Multiplication Rangoli",
        time: "15 minutes",
        materials: ["Chalk, or dots drawn on paper", "A flat surface"],
        steps: [
          "Draw a grid of dots in neat rows and columns — say 4 rows of 5.",
          "Count the rows, count the columns, and multiply to predict the total before counting every single dot to check.",
          "Try a few different grid sizes, turning it into a small rangoli-style pattern as you go.",
        ],
      },
    ],
    reflect: "Ask: 'If I told you 6 × 3, could you show it to me two different ways — as groups, and as rows and columns?'",
    extension: "Go on a real 'multiplication hunt' around the house — egg trays, tile patterns on the floor, a window with a grid of panes — and describe each as '__ groups of __'.",
  },
  {
    topicId: "a8-science-states-of-matter",
    hook: "Put an ice cube on a plate on the table and ask: 'What do you think this will look like in an hour? Why?'",
    teach: [
      "Matter exists in three everyday states: solid (keeps its own shape), liquid (takes the shape of its container but keeps its volume), and gas (spreads out to fill whatever space it's in).",
      "The difference comes down to how tightly and how fast the tiny particles inside are moving — solids: packed tight, barely moving; liquids: close but sliding past each other; gases: far apart, moving freely. You don't need to say 'particles' explicitly at this age — the behaviour is what matters.",
      "Heating generally moves matter solid → liquid → gas; cooling reverses it. Water is the perfect everyday example because your child has already seen all three states of it (ice, water, steam).",
    ],
    activities: [
      {
        title: "Ice, Water, Steam Watch",
        time: "5 minutes to start, observe over 2–3 hours",
        materials: ["An ice cube on a plate", "A kettle or pot of water that an adult will boil (adult-supervised only)"],
        steps: [
          "Place the ice cube on a plate and predict together what will happen over the next hour.",
          "Check back every 15–20 minutes and note what's changed (still solid? partly melted? fully liquid?).",
          "With an adult only, boil a small pot of water and observe the steam rising from a safe distance — that steam is water as a gas.",
          "Draw all three states side by side and label: solid, liquid, gas.",
        ],
      },
      {
        title: "Squish, Pour, Squeeze Sort",
        time: "15 minutes",
        materials: ["A collection of household items: a stone, a toy, water in a cup, juice, an inflated balloon, cooking oil"],
        steps: [
          "Lay everything out and sort into three groups: solid, liquid, and 'has gas inside' (the balloon).",
          "For each item, ask: does it keep its own shape (solid), does it flow and take the shape of its container (liquid), or does it spread out to fill the space (gas)?",
          "Squeeze the balloon gently to feel the gas pushing back — that's air, a gas, taking up space.",
        ],
      },
    ],
    reflect: "Ask: 'If you left a glass of water outside in the hot sun for a whole day, what do you think would happen to it, and which state would it become?'",
    extension: "Try freezing a small cup of juice into an ice pop, then watch it melt back — the same substance, moving through all three states in one afternoon.",
  },
  {
    topicId: "a8-social-maps-directions",
    hook: "Stand in the middle of a room and ask: 'If the sun rises in the East, which wall do you think East is?'",
    teach: [
      "A map is simply a bird's-eye-view drawing of a real place, shrunk down and made flat — the skill is connecting what you see standing on the ground to what it would look like from directly above.",
      "The four main directions — North, South, East, West — are fixed and don't change with which way you're facing, which is exactly why they're useful. A compass or the sun's rise/set position anchors them.",
      "Start with a map of somewhere very familiar (your own home or street) before ever looking at a map of a city or country — the skill transfers, the scale doesn't need to.",
    ],
    activities: [
      {
        title: "Map My Room",
        time: "25 minutes",
        materials: ["Paper", "Pencil", "A room with furniture"],
        steps: [
          "Stand in a doorway and look at the room from one spot, then imagine floating above it like a bird.",
          "Draw the outline of the room as a simple rectangle, then add squares/circles for each big piece of furniture in roughly the right place.",
          "Label each item, and mark which wall is North using the sun or a compass app.",
          "Walk around holding the map and check: does it match what's really there?",
        ],
      },
      {
        title: "Treasure Direction Hunt",
        time: "15 minutes",
        materials: ["A small 'treasure' (a sticker or sweet)", "A hand-drawn simple map or verbal directions"],
        steps: [
          "Hide a small treasure somewhere in the house.",
          "Give directions using only N/S/E/W and steps: 'Take 5 steps North, then 3 steps East.'",
          "Let your child follow the directions to find the treasure, then swap — they hide it and give you directions.",
        ],
      },
    ],
    reflect: "Ask: 'If you were standing at our front door facing the road, and someone told you to walk West, which way would you turn?'",
    extension: "Look at a real map of your city or neighbourhood together and find your own home, a nearby park, and your school or a relative's house.",
  },
  {
    topicId: "a8-math-fractions-halves-quarters",
    hook: "Bring out one roti or one chapati and ask: 'If both of us want an equal share, how would you cut this?'",
    teach: [
      "A fraction describes equal parts of one whole — the word 'equal' is the entire idea; unequal pieces aren't fractions of the kind we mean here, they're just pieces.",
      "Half means splitting into 2 equal parts (1/2), quarter means splitting into 4 equal parts (1/4) — and two quarters put back together make exactly one half.",
      "Food is the best teaching material for fractions because 'fair sharing' is something children already care about deeply and understand intuitively before they know any notation.",
    ],
    activities: [
      {
        title: "Fair-Share Roti Cutting",
        time: "15 minutes (snack time!)",
        materials: ["1–2 rotis, parathas, or a round fruit like an orange", "A blunt knife (adult-assisted)"],
        steps: [
          "Ask your child to cut one roti into 2 pieces they believe are fair and equal.",
          "Check by placing the pieces on top of each other — do they match? If not, discuss why unequal pieces aren't really 'halves'.",
          "Cut a second roti into 4 equal pieces (a half, then each half in half again) and name each piece 'one quarter'.",
          "Put 2 quarters together and ask: 'What do 2 quarters make?' — reveal it equals 1 half.",
        ],
      },
      {
        title: "Fraction Paper Folding",
        time: "15 minutes",
        materials: ["4–5 identical square sheets of paper", "Crayons"],
        steps: [
          "Fold one square in half and colour one half a different colour — label it 1/2.",
          "Fold another square in half, then in half again, and colour one section — label it 1/4.",
          "Compare the coloured areas from both sheets by placing one on top of the other.",
          "Try folding a third sheet into quarters and colouring 2 of the 4 sections — ask: 'Is this more or less than a half?'",
        ],
      },
    ],
    reflect: "Ask: 'Would you rather have 1/2 of a small chocolate or 1/4 of a big chocolate?' — a genuinely open question that gets at comparing fractions of different wholes.",
    extension: "Try cutting something into 3 equal parts (thirds) — it's noticeably harder to make truly equal, which is a good honest challenge.",
  },
  {
    topicId: "a8-arts-clay-models",
    hook: "Give your child a fist-sized ball of clay or dough and simply say: 'Make something that could stand up on its own.'",
    teach: [
      "Clay modelling builds an understanding of 3D form that flat drawing can't — thinking about a base, balance and all-round shape rather than just an outline.",
      "Start with basic forms — ball, coil (rolled snake shape), and slab (flattened sheet) — almost everything else is built by combining these three.",
      "Let the first attempt be genuinely open-ended before moving to a specific model — confidence with the material matters more than the final object.",
    ],
    activities: [
      {
        title: "Three Basic Forms, One Animal",
        time: "30 minutes",
        materials: ["Air-dry clay or soft dough (atta dough works fine for practice)", "A flat work surface"],
        steps: [
          "Practice rolling a ball, rolling a coil (long snake), and flattening a slab — name each shape as you make it.",
          "Pick a simple animal (a snail, a snake, a turtle) and decide which basic forms it's built from.",
          "Build it together, joining pieces by pressing and smoothing the seams with wet fingers.",
          "Let it air-dry if using real clay, or admire and reshape if using dough.",
        ],
      },
    ],
    reflect: "Ask: 'Which basic shape did you use the most in your model, and why did that shape work well for this animal?'",
    extension: "Try building something that needs to balance on a narrow base (like a bird on one leg) — it's a fun, harder engineering challenge using the same three forms.",
  },
  {
    topicId: "a9-science-water-cycle",
    hook: "Ask: 'The ocean has been full of water forever, and rain falls almost every year — where do you think all that rain water actually comes from?'",
    teach: [
      "The water cycle has four main stages that repeat forever: evaporation (the sun heats water and turns it into invisible water vapour, a gas), condensation (that vapour cools high in the sky and forms tiny droplets — clouds), precipitation (the droplets join up and fall as rain), and collection (rain gathers in rivers, lakes and oceans, ready to evaporate again).",
      "It's genuinely a cycle with no start or end — pick evaporation as the entry point only because it's the easiest to demonstrate at home.",
      "The same water has been recycling around the Earth for millions of years — the water in today's rain could once have been in a dinosaur-era ocean. This detail tends to land well with this age group.",
    ],
    activities: [
      {
        title: "Water Cycle in a Bag",
        time: "10 minutes to set up, check over 2–3 days",
        materials: ["A clear ziplock bag", "Blue food colouring (optional)", "Water", "Tape", "A sunny window"],
        steps: [
          "Pour a small amount of water (with a drop of food colouring if using) into the ziplock bag and seal it tightly.",
          "Tape the bag flat against a sunny window, sealed side up.",
          "Check back every few hours — you'll see droplets forming on the inside of the bag (condensation) and eventually 'raining' down inside the bag.",
          "Draw the four stages of the cycle and label where each one is happening inside your bag.",
        ],
      },
      {
        title: "Steamy Mirror Evaporation",
        time: "10 minutes (adult-assisted)",
        materials: ["A cup of warm (not boiling) water", "A cold spoon or small mirror"],
        steps: [
          "Hold the cold spoon or mirror above the cup of warm water without touching the water, for about a minute.",
          "Look closely — tiny droplets form on the cold surface. That's evaporation turning into condensation, right in front of you.",
          "Connect it back: 'This is exactly what happens on a giant scale to make clouds.'",
        ],
      },
    ],
    reflect: "Ask: 'Why do you think clouds form high up in the cold sky instead of close to the warm ground?'",
    extension: "Track real rain for a week — note when it rains, then talk about where that water goes afterward (drains, rivers, soaking into ground, evaporating again).",
  },
  {
    topicId: "a9-science-life-cycles",
    hook: "Show a picture (or a real caterpillar, if you can find one) and ask: 'This is going to look completely different in a few weeks. What do you think it will become?'",
    teach: [
      "A life cycle is the full sequence of stages a living thing passes through from birth to being able to have babies of its own, and then it repeats with the next generation.",
      "A butterfly's cycle has four very distinct stages: egg → caterpillar (larva, whose whole job is eating and growing) → chrysalis (pupa, a resting stage where the body completely rebuilds itself) → butterfly (adult, whose job is to fly, find a mate, and lay new eggs).",
      "A frog's cycle also has four stages but looks different: egg → tadpole (lives in water, has a tail, breathes through gills like a fish) → tadpole growing legs (a gradual in-between stage) → frog (lives on land and in water, breathes air). Comparing the two side by side is more powerful than teaching either alone.",
    ],
    activities: [
      {
        title: "Life Cycle Wheel",
        time: "30 minutes",
        materials: ["A paper plate or circle of cardboard", "Crayons", "A brad/paper fastener or just a pin"],
        steps: [
          "Divide the circle into 4 equal sections like a pizza.",
          "Draw one stage of the butterfly (or frog) life cycle in each section, in the correct order going around the circle.",
          "Cut a small arrow from extra card and pin it to the centre so it can spin and point to each stage.",
          "Practice spinning the arrow and narrating the story: 'The egg hatches into a caterpillar, which eats and grows, then forms a chrysalis...'",
        ],
      },
      {
        title: "Two Cycles, Side by Side",
        time: "15 minutes",
        materials: ["Paper divided into two columns", "Crayons"],
        steps: [
          "Draw the 4 butterfly stages down one column and the 4 frog stages down the other, lined up by stage number.",
          "Circle what's similar between stage 1 (both start as eggs) and discuss what's different about the in-between stages.",
          "Ask: 'Which animal's baby stage looks the most different from its own grown-up self?'",
        ],
      },
    ],
    reflect: "Ask: 'Why do you think the caterpillar needs to eat so much before it becomes a chrysalis?' (It's building up all the energy and material it needs for the huge rebuild inside.)",
    extension: "If it's the right season, look for real frog eggs or tadpoles in a nearby pond, or caterpillars on leaves, and check on the same spot over a few weeks.",
  },
  {
    topicId: "a9-social-states-capitals",
    hook: "Point to a map of India and ask: 'If we wanted to visit the Taj Mahal, which state would we be travelling to, and do you know its capital city?'",
    teach: [
      "A state's capital is simply the city where that state's government sits and makes its main decisions — it isn't always the biggest or most famous city in the state (Maharashtra's capital is Mumbai, but Uttar Pradesh's capital is Lucknow, not the more famous Agra or Varanasi).",
      "Rather than memorising a long list, anchor each state-capital pair to something your child already knows about that state — a food, a festival, a relative who lives there, a place you've visited.",
      "Group nearby states together (all of South India, all of the North-East) rather than teaching all 28 states in one long alphabetical list — geography by neighbourhood sticks better than geography by alphabet.",
    ],
    activities: [
      {
        title: "Build-Your-Own India Map Puzzle",
        time: "30–40 minutes",
        materials: ["A large outline map of India (printed or hand-traced)", "Scissors", "Crayons"],
        steps: [
          "Colour and label 5–6 states you'll focus on this week, marking each capital city with a star.",
          "Cut the map into rough state-shaped pieces (a simplified version is fine).",
          "Mix up the pieces and put the puzzle back together, saying each state and its capital out loud as it's placed.",
          "Add one new state each day rather than all at once.",
        ],
      },
      {
        title: "Capital City Snap",
        time: "15 minutes",
        materials: ["Small cards — half with state names, half with matching capital names"],
        steps: [
          "Lay all cards face-down in two rows: states on one side, capitals on the other.",
          "Take turns flipping one card from each row, trying to make a correct state–capital match.",
          "Keep matched pairs; for a mismatch, say the correct pairing out loud before flipping back.",
        ],
      },
    ],
    reflect: "Ask: 'Why do you think a state needs its own capital city instead of everyone travelling all the way to Delhi for every decision?'",
    extension: "Pick one state's capital and 'visit' it virtually — look up one famous landmark, one local food, and one festival from that city together.",
  },
  {
    topicId: "a10-science-solar-system",
    hook: "Go outside after dark and ask: 'That bright dot isn't a star — it's actually a planet. Any idea how we can tell the difference?' (Planets don't twinkle the way stars do.)",
    teach: [
      "Our solar system has the Sun at the centre, with 8 planets orbiting it in this order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune — a simple sentence like 'My Very Educated Mother Just Served Us Noodles' helps the order stick.",
      "Planets are divided into two families: the four closest to the Sun (Mercury, Venus, Earth, Mars) are small and rocky; the four furthest out (Jupiter, Saturn, Uranus, Neptune) are much bigger and made mostly of gas.",
      "Everything orbits the Sun because of gravity — the Sun's huge mass pulls on every planet constantly, and each planet's sideways motion keeps it from falling in, so it loops around forever instead.",
    ],
    activities: [
      {
        title: "Hallway Scale Walk",
        time: "20 minutes",
        materials: ["A long hallway, corridor or garden path", "8 small labelled objects or paper cutouts for the planets", "One larger object for the Sun"],
        steps: [
          "Place the 'Sun' at one end of your longest available space.",
          "Walk out from the Sun, placing each planet in order — Mercury very close, then increasingly bigger gaps for each next planet (it doesn't need to be exactly to scale, just increasing).",
          "Walk the whole 'solar system' from the Sun to Neptune, saying each planet's name as you pass it.",
          "Ask: 'Which part of the walk was the biggest single gap?' (Between Mars and Jupiter, which is genuinely the largest real gap.)",
        ],
      },
      {
        title: "Hanging Solar System Model",
        time: "45 minutes",
        materials: ["8 balls of different sizes (or balled-up paper/clay)", "String or thread", "A coat hanger or stick", "Paint or markers"],
        steps: [
          "Paint or colour each ball to roughly match its planet (red for Mars, banded orange for Jupiter, etc.).",
          "Tie each planet to a length of string, in order of distance from the Sun.",
          "Hang all 8 strings from the coat hanger or stick so it can dangle and be admired from below.",
          "Practice naming all 8 in order from memory using it as a prompt.",
        ],
      },
    ],
    reflect: "Ask: 'If Earth suddenly stopped moving sideways around the Sun, what do you think would happen to it?' (Gravity would pull it straight into the Sun.)",
    extension: "Research one planet in more depth — its number of moons, its length of a 'year', and one interesting fact — and present it back to the family like a mini weather report.",
  },
  {
    topicId: "a10-science-photosynthesis",
    hook: "Ask: 'We eat food to get energy. Plants don't have mouths — so where do you think a plant's food actually comes from?'",
    teach: [
      "Photosynthesis is how a plant makes its own food using three ingredients: sunlight (energy), water (from the roots) and carbon dioxide (a gas from the air, taken in through tiny pores in the leaf) — combined inside the leaf to make sugar (food) and oxygen (released back into the air as a bonus for us).",
      "Chlorophyll — the green colouring in leaves — is what actually captures the sunlight's energy to power this process. That's why leaves are green, and why a plant kept in the dark eventually turns pale and weak.",
      "This single process is the reason almost all life on Earth can breathe and eat — plants are the original food and oxygen factory that every food chain ultimately depends on.",
    ],
    activities: [
      {
        title: "Light vs Dark Leaf Test",
        time: "5 minutes to set up, check after 4–5 days",
        materials: ["A potted plant with several leaves", "Aluminium foil or a small piece of dark cloth", "A paperclip or tape"],
        steps: [
          "Wrap a small piece of foil tightly around one leaf so no light can reach it, while leaving the rest of the plant in normal light.",
          "Wait 4–5 days, watering the plant normally throughout.",
          "Unwrap the covered leaf and compare it to an uncovered leaf — the covered one is usually paler or yellower, having made far less food without light.",
          "Discuss: this leaf couldn't photosynthesise properly without sunlight, even though it still had water and air.",
        ],
      },
      {
        title: "Build-a-Leaf Diagram",
        time: "15 minutes",
        materials: ["Paper", "Crayons (green, yellow, blue)"],
        steps: [
          "Draw a large simple leaf and draw three arrows pointing into it: a yellow arrow for sunlight, a blue arrow for water (coming from below, from roots), and a squiggly arrow for air/carbon dioxide.",
          "Draw two arrows leaving the leaf: one for oxygen going out (label 'for us to breathe!') and one for sugar/food staying inside the plant.",
          "Narrate the whole process out loud while pointing at each arrow, in your own words.",
        ],
      },
    ],
    reflect: "Ask: 'We just learned plants release oxygen as part of this process. Why do you think having lots of trees and plants around us is good for people?'",
    extension: "Revisit the light-vs-dark germination extension from the seed jar activity (if you did it at an earlier age) and connect the two: a seedling needs light for the exact reason explored here.",
  },
  {
    topicId: "a11-science-nutrition-food",
    hook: "Lay out today's lunch and ask: 'If you had to sort every item on this plate into just a few big groups based on what it does for your body, how would you group them?'",
    teach: [
      "Food contains nutrients that each do a specific job: carbohydrates (rice, roti, potatoes) give quick energy; proteins (dal, eggs, paneer, meat) build and repair the body; fats (ghee, oil, nuts) store longer-lasting energy; vitamins and minerals (fruits, vegetables) keep the body's systems running properly; and fibre (whole grains, vegetables) keeps digestion healthy. Water, while not a 'nutrient' in the same sense, is essential to carry everything else around the body.",
      "No single food group is 'bad' — the actual skill is recognising balance: a plate that's only carbohydrates (just rice) is missing what protein, fat and vitamins each uniquely provide.",
      "A deficiency disease is simply what happens when the body is missing enough of one nutrient for a long time — e.g. too little vitamin C over time can cause scurvy, too little protein can stunt growth. This cause-and-effect framing tends to land better than a list of vitamin names.",
    ],
    activities: [
      {
        title: "Sort Our Own Plate",
        time: "15 minutes at a mealtime",
        materials: ["An actual meal on the table", "Paper for a simple table with 5 columns: carbs, proteins, fats, vitamins/minerals, fibre"],
        steps: [
          "Before eating, look at everything on the plate and sort each item into the correct nutrient column together (some items may belong in more than one — that's fine, discuss why).",
          "Check: is any column empty? Discuss what could be added to balance the meal.",
          "Repeat this quick sort at a different meal later in the week and compare the two.",
        ],
      },
      {
        title: "Build a Balanced Thali",
        time: "20 minutes",
        materials: ["Paper plate template or a drawn circle", "Magazine cutouts or hand-drawn food items", "Glue"],
        steps: [
          "Cut or draw a wide variety of food items.",
          "Design an ideal, balanced thali by choosing at least one item from each nutrient group and gluing it onto the plate.",
          "Present the finished thali and explain out loud which nutrient each food item provides.",
        ],
      },
    ],
    reflect: "Ask: 'If you only ate one single food group for a whole week, which do you think would cause the biggest problem, and why?'",
    extension: "Read the nutrition label on one packaged snack at home together and identify which nutrient group(s) it mostly falls into — and how much sugar or fat it contains.",
  },
  {
    topicId: "a11-science-separation-substances",
    hook: "Mix a spoon of sand into a glass of water and ask: 'Now that they're mixed, can we get them apart again? How?'",
    teach: [
      "When substances are mixed but not chemically combined, they can be pulled apart again using a method that matches how they're physically different from each other — size, weight, magnetism, or whether they dissolve.",
      "Common methods: sieving (separates by particle size, like flour from stones), filtration (separates a solid from a liquid it doesn't dissolve in, like sand from water), using a magnet (pulls out anything magnetic, like iron filings from sand), and evaporation (leaves behind a dissolved solid, like salt, once the water evaporates away).",
      "The key thinking skill is choosing the right method for the right mixture — that choice, more than the technique itself, is what's really being tested and taught here.",
    ],
    activities: [
      {
        title: "Four Mixtures, Four Methods",
        time: "35 minutes",
        materials: ["Sand + water", "Salt + water", "Iron filings/paperclip bits + sand", "Rice + small pebbles", "A sieve, filter paper or cloth, a magnet, a shallow dish for evaporation"],
        steps: [
          "Mix each pair together in a separate container.",
          "For sand + water: pour through a filter (cloth or filter paper) and observe the sand caught behind while water passes through.",
          "For salt + water: pour a little into a shallow dish and leave in the sun for a day or two — the water evaporates, leaving salt crystals behind.",
          "For iron bits + sand: run a magnet over the mixture and watch the iron jump out, leaving sand behind.",
          "For rice + pebbles: shake through a sieve with holes sized between the two — rice passes, pebbles stay (or vice versa, depending on hole size).",
          "For each one, discuss beforehand which method you predict will work, then test it.",
        ],
      },
    ],
    reflect: "Ask: 'If I gave you a mixture of sugar and sand, which method from today would work, and why wouldn't a sieve be enough on its own?'",
    extension: "Try separating a trickier three-part mixture (like sand, salt and iron filings all together) using more than one method in sequence.",
  },
  {
    topicId: "a11-math-ratio-proportion",
    hook: "Show a recipe that serves 2 people and ask: 'If 6 of our relatives are coming for dinner, how much of each ingredient do we actually need?'",
    teach: [
      "A ratio compares two quantities — '2 cups of rice to 1 cup of dal' means for every 2 units of one thing, there's 1 unit of the other, and that relationship stays true no matter how much you scale it up or down.",
      "Proportion is using a known ratio to solve for an unknown amount — if you know the ratio holds, and you change one quantity, you can calculate exactly how the other one must change to match.",
      "Cooking, map scales, and mixing paint colours are the most intuitive real-world proportions — the food-scaling example works especially well because getting it wrong has an immediate, tastable consequence.",
    ],
    activities: [
      {
        title: "Scale the Recipe",
        time: "30 minutes (great as an actual cooking activity)",
        materials: ["A simple recipe with 3–4 ingredients and a stated serving size", "Measuring cups/spoons", "Paper for calculations"],
        steps: [
          "Write down the recipe's original ratio, e.g. 'serves 2: 1 cup rice, 2 cups water, 1 tsp salt'.",
          "Decide on a new number of people to serve (say 6) and work out the scaling factor (6 ÷ 2 = 3×).",
          "Multiply every single ingredient by that same factor — this is the core rule of proportion: whatever you do to one part, do to all parts equally.",
          "If possible, actually cook the scaled-up recipe together and taste the (hopefully correctly proportioned!) result.",
        ],
      },
      {
        title: "Paint Colour Ratios",
        time: "20 minutes",
        materials: ["Two colours of paint or food colouring", "Small cups", "Water", "A spoon for measuring"],
        steps: [
          "Mix a specific ratio, e.g. 1 spoon blue to 3 spoons white, and note the resulting shade.",
          "Now double the ratio (2 spoons blue to 6 spoons white) in a bigger cup and compare the colour to the first mix.",
          "Discuss why the shade stayed the same even though the total amount changed — that's proportion at work.",
          "Try changing the ratio itself (1:1 instead of 1:3) and see how differently the colour turns out.",
        ],
      },
    ],
    reflect: "Ask: 'If a map says 1 cm represents 1 km, and two towns are 4 cm apart on the map, how far apart are they really?'",
    extension: "Work out your own family's ratio of something fun to count — e.g. the ratio of red to blue Lego bricks in a box — and simplify it to its smallest whole-number form.",
  },
  {
    topicId: "a11-social-early-civilisations",
    hook: "Ask: 'If you and your friends had to start a brand-new town from nothing, what's the very first thing your group would need to figure out?'",
    teach: [
      "Early civilisations all arose near reliable water sources (rivers, in particular) because farming needs consistent water — the Indus Valley Civilisation grew up along the Indus river system for exactly this reason.",
      "A 'civilisation', as opposed to smaller wandering groups, generally needs: a steady food supply (usually farming), permanent settlements (real buildings, not just camps), some form of organised leadership or rules, and often a system of writing or record-keeping.",
      "The Indus Valley Civilisation (Harappa, Mohenjo-daro) is remarkable for its planned cities — straight streets, organised drainage systems, and standardised weights for trade — evidence of real forward planning, not accident.",
    ],
    activities: [
      {
        title: "Build a Mini Civilisation",
        time: "40 minutes",
        materials: ["A large tray, cardboard base, or patch of floor", "Clay, blocks, recycled boxes, or LEGO", "Small paper labels"],
        steps: [
          "Decide together, as 'founders' of a new settlement: where's the water source? Where are the farms? Where do people live?",
          "Build simple structures for homes, a marketplace, and a water/drainage system using your chosen materials.",
          "Label each area and explain out loud why you placed it there — e.g. 'we put the well in the centre so everyone can reach it equally'.",
          "Compare your layout's logic to what you know about real early cities like Mohenjo-daro.",
        ],
      },
    ],
    reflect: "Ask: 'What do you think would happen to an early civilisation if its river dried up or changed course?' (This is actually one leading theory for why some Indus Valley cities were abandoned.)",
    extension: "Design a simple 'seal' or symbol like the ones Indus Valley traders used to mark their goods, and explain what your symbol represents about your mini civilisation.",
  },
  {
    topicId: "a12-science-acids-bases-salts",
    hook: "Ask: 'Lemon juice tastes sour, and soap feels slippery — do you think that's just a coincidence, or is something chemical going on?'",
    teach: [
      "Acids taste sour and turn certain natural dyes a reddish/pink colour; common examples include lemon juice, vinegar, and curd. Bases feel slippery, often taste bitter, and turn the same dyes greenish/blue; common examples include soap, baking soda solution, and toothpaste. A salt is what you get when an acid and a base neutralise (cancel out) each other.",
      "An 'indicator' is any substance that changes colour depending on whether it touches an acid or a base — this is how we test unknown substances safely, without tasting them (tasting unknown chemicals is genuinely dangerous and should never be how this is tested in real life).",
      "Red cabbage juice is a natural indicator freely available in any kitchen — acids turn it pink/red, bases turn it green/blue, making the invisible chemistry visible with something completely safe.",
    ],
    activities: [
      {
        title: "Red Cabbage Indicator Lab",
        time: "40 minutes (adult-supervised for boiling water)",
        materials: ["A few red cabbage leaves", "Hot water (adult-poured)", "5–6 small clear cups", "Household test substances: lemon juice, vinegar, soap water, baking soda water, milk, a soft drink"],
        steps: [
          "Chop the red cabbage and let it sit in hot water for 10–15 minutes until the water turns deep purple — this purple liquid is your indicator.",
          "Pour a small amount of the purple indicator into each test cup.",
          "Add a small amount of each household substance to a separate cup and watch the colour change: pink/red = acid, green/blue = base, staying purple = roughly neutral.",
          "Record results in a simple table: substance name, colour observed, acid or base.",
        ],
      },
    ],
    reflect: "Ask: 'Our stomach uses acid to help digest food, and antacid medicine is a base that helps with acidity — why do you think a base is used to treat too much acid?' (Bases neutralise acids, calming the excess.)",
    extension: "Test a substance you predict will be neutral (like plain water) to confirm the indicator doesn't just always show a colour change — a genuine control test.",
  },
  {
    topicId: "a12-math-simple-compound-interest",
    hook: "Offer your child a choice: 'I'll give you ₹10 extra every week for 10 weeks, or I'll double whatever you have every week starting from ₹1. Which do you pick?'",
    teach: [
      "Simple interest is calculated only on the original amount (the principal) every time — the interest earned each period stays the same, since it's always based on the same starting number.",
      "Compound interest is calculated on the principal plus all interest already earned so far — so the amount it's calculated on keeps growing, which means the interest earned each period also keeps growing.",
      "This is exactly why the 'doubling' offer in the hook eventually beats a fixed ₹10/week by an enormous margin — that's the real power of compounding, and it's the same principle banks and investments use.",
    ],
    activities: [
      {
        title: "The Doubling Jar Challenge",
        time: "20 minutes",
        materials: ["Paper", "A calculator (optional, but encourage manual working first)"],
        steps: [
          "Actually run the hook's challenge on paper: Option A adds ₹10 flat each week for 10 weeks; Option B doubles the previous week's total each week, starting at ₹1.",
          "Build a table together, week by week, calculating both totals.",
          "Mark the week where Option B overtakes Option A — it happens later than most children expect, and then grows shockingly fast.",
          "Discuss: which would you truly want if this were real pocket money for 10 weeks vs. 20 weeks?",
        ],
      },
      {
        title: "Simple vs Compound, Side by Side",
        time: "20 minutes",
        materials: ["Paper", "A simple example: ₹1,000 at 10% interest per year, for 3 years"],
        steps: [
          "Calculate simple interest: 10% of ₹1,000 = ₹100, added every year for 3 years (₹100 + ₹100 + ₹100 = ₹300 total interest).",
          "Calculate compound interest: Year 1: 10% of ₹1,000 = ₹100 (total ₹1,100). Year 2: 10% of ₹1,100 = ₹110 (total ₹1,210). Year 3: 10% of ₹1,210 = ₹121 (total ₹1,331).",
          "Compare the final totals (₹1,300 vs ₹1,331) and discuss why the gap would keep widening over more years.",
        ],
      },
    ],
    reflect: "Ask: 'If you were saving money in a bank for many, many years, would you rather it earned simple or compound interest? Why?'",
    extension: "Look up (or ask a parent about) a real savings account or fixed deposit interest rate, and calculate what a real amount of pocket money would grow to over 5 years using that rate.",
  },
  {
    topicId: "a13-science-cell-structure",
    hook: "Ask: 'Your whole body — bones, skin, blood, brain — is made from just one basic kind of building block, repeated trillions of times. Any guess what it's called?'",
    teach: [
      "A cell is the smallest unit of life — every living thing is made of one cell (like most bacteria) or many trillions of cooperating cells (like a human).",
      "Key parts of a typical cell: the cell membrane (a protective outer boundary controlling what goes in and out), the nucleus (the 'control centre' holding genetic instructions), cytoplasm (the jelly-like fluid everything sits in), and mitochondria (which release energy from food — often nicknamed the cell's 'powerhouse').",
      "Plant cells have two extra features animal cells don't: a rigid cell wall (for structure and support) and chloroplasts (green structures that carry out photosynthesis) — this is a genuinely testable, memorable difference.",
    ],
    activities: [
      {
        title: "Onion Peel Under Magnification",
        time: "25 minutes",
        materials: ["A fresh onion", "A magnifying glass or a smartphone camera zoomed in (a microscope if available)", "A thin, clear inner layer peeled from between onion rings"],
        steps: [
          "Peel a very thin, translucent inner layer from between two onion rings.",
          "Lay it flat and examine it closely with a magnifying glass, or hold a smartphone camera very close and zoom in digitally.",
          "Look for the brick-like pattern of individual cells packed together — this is real, visible plant cell structure.",
          "Draw what you observe and label a few of the 'bricks' as individual cells.",
        ],
      },
      {
        title: "Build an Edible Cell Model",
        time: "30 minutes",
        materials: ["A clear ziplock bag or bowl (cell membrane)", "Clear jelly or gelatin (cytoplasm)", "A grape or lychee (nucleus)", "Raisins or small sweets (mitochondria and other structures)"],
        steps: [
          "Line the ziplock bag with a thin layer of clear jelly to represent cytoplasm.",
          "Place the grape in the centre to represent the nucleus.",
          "Scatter a few raisins around to represent mitochondria and other cell structures.",
          "Label each part with a small paper flag, and (if making a plant cell version) add a rigid outer box or straws around the bag to represent the cell wall.",
        ],
      },
    ],
    reflect: "Ask: 'If a plant cell has a rigid wall to help it stand upright without a skeleton, why do you think animal cells don't have the same rigid wall?' (Animals need to move and bend, which a rigid wall would prevent.)",
    extension: "Research one specialised human cell — a red blood cell, a nerve cell, a muscle cell — and discuss how its shape is specially suited to its one particular job.",
  },
  {
    topicId: "a13-science-force-friction-pressure",
    hook: "Ask your child to push a book across a smooth table, then across a rough towel, using the same amount of push each time, and predict which will travel further.",
    teach: [
      "A force is simply a push or a pull that can start, stop, speed up, slow down, or change the direction of an object's motion.",
      "Friction is a force that opposes motion between two surfaces in contact — rougher surfaces create more friction (slowing things down faster), smoother surfaces create less friction (things slide further). Friction is why nothing keeps moving forever once you stop pushing it.",
      "Pressure is force spread over an area — the same force concentrated on a smaller area creates more pressure (a sharp knife cuts more easily than a blunt one, and a drawing pin pushes into a wall more easily than a flat coin), because pressure = force ÷ area.",
    ],
    activities: [
      {
        title: "The Great Friction Race",
        time: "25 minutes",
        materials: ["A small toy car or a book", "3 different surfaces to test: a smooth table, a carpet or towel, sandpaper if available", "A ruler to measure distance"],
        steps: [
          "Give the object the exact same push (or release from the exact same height on a small ramp) on each surface.",
          "Measure how far it travels on each surface before stopping.",
          "Rank the surfaces from least to most friction based on the distances measured.",
          "Discuss: why does a rougher surface make the object stop sooner?",
        ],
      },
      {
        title: "Balloon Pressure Test",
        time: "15 minutes (careful supervision — sharp object involved)",
        materials: ["Two balloons, inflated to the same size", "A flat-headed pin", "A sharp needle"],
        steps: [
          "With an adult holding and controlling the process, press the flat, blunt end of a pin against one balloon with gentle, steady pressure — notice how much force it takes before anything happens.",
          "Then, very carefully, touch the sharp needle tip to another balloon with only the lightest touch.",
          "Discuss why the sharp point needed far less force to have an effect — the same force concentrated on a tiny area creates much higher pressure.",
        ],
      },
    ],
    reflect: "Ask: 'Why do you think ice skates have thin blades instead of flat, wide bottoms?' (Thin blades concentrate the skater's weight onto a tiny area, creating enough pressure to glide smoothly.)",
    extension: "Look for 3 more real-world examples each of friction being useful (shoe soles, bicycle brakes) and pressure being deliberately increased or decreased (a sharp knife, wide snowshoes) around your home.",
  },
  {
    topicId: "a13-social-constitution-basics",
    hook: "Ask: 'If our family didn't have any agreed rules at all, what do you think would go wrong on a normal day?'",
    teach: [
      "The Constitution of India is the country's supreme rulebook — every other law must follow what it says, and it defines how the government is organised, what powers it has, and what rights every citizen holds.",
      "Fundamental Rights guarantee every citizen basic freedoms — such as equality, freedom of speech, and freedom of religion — that the government cannot take away. Fundamental Duties are responsibilities every citizen is expected to uphold in return, such as respecting the Constitution and protecting the environment.",
      "The Preamble is the Constitution's opening statement of purpose, describing India as a Sovereign, Socialist, Secular, Democratic Republic committed to Justice, Liberty, Equality and Fraternity for all citizens — five words worth genuinely discussing one at a time.",
    ],
    activities: [
      {
        title: "Write Our Own Family Constitution",
        time: "30 minutes",
        materials: ["Paper", "Pens"],
        steps: [
          "As a family, list 5 'fundamental rights' every family member should have (e.g. the right to be heard, the right to privacy in your own room).",
          "List 5 'fundamental duties' every member owes the household in return (e.g. keeping shared spaces tidy, being honest).",
          "Write a short 'preamble' sentence describing what kind of family you want to be, echoing the structure of India's real preamble.",
          "Sign it together and put it up somewhere visible.",
        ],
      },
      {
        title: "Rights vs Duties Sorting Game",
        time: "15 minutes",
        materials: ["Small cards, each listing a real right or duty in simple language"],
        steps: [
          "Prepare 8–10 cards mixing rights (e.g. 'freedom to practise any religion') and duties (e.g. 'to protect public property').",
          "Sort them into two piles: Rights and Duties.",
          "For each card, discuss in your own words what it actually means in everyday life.",
        ],
      },
    ],
    reflect: "Ask: 'Why do you think rights and duties are meant to go together, instead of a country only having one and not the other?'",
    extension: "Pick one Fundamental Right and research a real, age-appropriate news example of it being exercised or protected in India recently, and discuss it together.",
  },
  {
    topicId: "a13-science-crop-production",
    hook: "Ask: 'Everything on our dinner plate started as a plant growing somewhere, or as an animal that ate plants. What do you think a farmer actually has to get right for that to happen successfully?'",
    teach: [
      "Crop production involves a sequence of deliberate steps: preparing the soil (ploughing, adding nutrients), sowing seeds at the right depth and spacing, providing water through irrigation, protecting crops from weeds and pests, and finally harvesting at the right time.",
      "Crops are broadly grouped by season in India: kharif crops (like rice, maize, cotton) are sown with the monsoon rains and harvested in autumn; rabi crops (like wheat, mustard, gram) are sown in winter and harvested in spring.",
      "Manure and fertilisers both add nutrients back to soil that crops use up, but manure is natural/organic (compost, animal waste) while fertilisers are manufactured chemical nutrients — both matter for keeping soil productive year after year.",
    ],
    activities: [
      {
        title: "Grow-Your-Own Mini Kitchen Garden",
        time: "15 minutes to set up, tend over several weeks",
        materials: ["A small pot or reused container with drainage holes", "Soil", "Fast-growing seeds — methi (fenugreek), coriander, or moong work well and sprout within days"],
        steps: [
          "Prepare the soil by loosening it and adding a small amount of compost or manure if available.",
          "Sow the seeds at the depth recommended on the packet (usually just below the surface for these fast growers).",
          "Water lightly every day and place near sunlight — assign your child as the daily 'farmer in charge'.",
          "Keep a simple growth log noting sprouting date, height each week, and any problems (drooping, yellow leaves) along with your fixes.",
          "Harvest and, if edible, actually cook with what you've grown — the full cycle from seed to plate.",
        ],
      },
      {
        title: "Kharif or Rabi? Sorting Game",
        time: "15 minutes",
        materials: ["Cards or drawings of common crops: rice, wheat, cotton, mustard, maize, gram"],
        steps: [
          "Sort each crop card into a 'Kharif (Monsoon)' pile or a 'Rabi (Winter)' pile based on what you've learned.",
          "For each, discuss why its growing season makes sense — e.g. rice needs a lot of water, matching the monsoon.",
        ],
      },
    ],
    reflect: "Ask: 'Our mini garden only needed daily watering and sunlight from us. What extra challenges do you think a real farmer faces, growing food across huge fields instead of one small pot?'",
    extension: "Find out what crop is most commonly grown in your own state or region, and research why the local climate and soil suit that particular crop.",
  },
];

export function getLesson(topicId: string): Lesson | undefined {
  return LESSONS.find((l) => l.topicId === topicId);
}
