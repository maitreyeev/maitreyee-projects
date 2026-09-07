import type { Topic } from "./types";

// A single, shared syllabus spine (ages 3–13). CBSE, ICSE, IGCSE (Cambridge
// Pathway) and IB genuinely converge on very similar core content at these
// ages — what differs is grade naming, pacing and framing, not whether a
// 7-year-old learns addition. Board selection changes labels (see
// boards.ts) and framing copy, not this topic list.
export const TOPICS: Topic[] = [
  // ---- Age 3 ----
  { id: "a3-language-letter-sounds", age: 3, subject: "language", title: "Letter Sounds A–Z", blurb: "Fun with the sounds letters make, through songs and play." },
  { id: "a3-language-rhymes-storytime", age: 3, subject: "language", title: "Rhymes & Storytime", blurb: "Listening to rhymes and stories to build a love for language." },
  { id: "a3-math-counting-1-10", age: 3, subject: "math", title: "Counting 1 to 10", blurb: "Counting real objects to build number sense." },
  { id: "a3-math-shapes-colours", age: 3, subject: "math", title: "Shapes & Colours", blurb: "Spotting circles, squares and colours in everyday things." },
  { id: "a3-world-my-family", age: 3, subject: "world", title: "My Family", blurb: "Talking about who's in my family and what we do together." },
  { id: "a3-world-my-body-senses", age: 3, subject: "world", title: "My Body & Senses", blurb: "Exploring what my eyes, ears, nose, hands and tongue can do." },
  { id: "a3-arts-free-drawing", age: 3, subject: "arts", title: "Free Drawing & Colouring", blurb: "Open-ended drawing to build fine motor skills and confidence." },
  { id: "a3-arts-paper-craft", age: 3, subject: "arts", title: "Simple Paper Craft", blurb: "Tearing, crumpling and sticking paper to make simple shapes." },

  // ---- Age 4 ----
  { id: "a4-language-letter-blending", age: 4, subject: "language", title: "Letter Sounds & Blending", blurb: "Joining sounds together to make simple words." },
  { id: "a4-language-sight-words", age: 4, subject: "language", title: "First Sight Words", blurb: "Recognising common little words like 'the', 'is', 'a'." },
  { id: "a4-math-counting-20", age: 4, subject: "math", title: "Counting to 20", blurb: "Extending number sense with games and songs." },
  { id: "a4-math-patterns", age: 4, subject: "math", title: "Simple Patterns", blurb: "Spotting and continuing colour and shape patterns." },
  { id: "a4-world-seasons-weather", age: 4, subject: "world", title: "Seasons & Weather", blurb: "Noticing how the sky, clothes and trees change through the year." },
  { id: "a4-world-community-helpers", age: 4, subject: "world", title: "Community Helpers", blurb: "Meeting the people who help us — doctor, postman, farmer." },
  { id: "a4-arts-collage", age: 4, subject: "arts", title: "Collage Making", blurb: "Sticking paper, leaves and fabric scraps into a picture." },
  { id: "a4-arts-clay-modelling", age: 4, subject: "arts", title: "Clay Modelling", blurb: "Squishing and shaping clay or dough into simple forms." },

  // ---- Age 5 ----
  { id: "a5-language-3-letter-words", age: 5, subject: "language", title: "Reading Simple 3-Letter Words", blurb: "Blending sounds to read words like cat, sun and pig." },
  { id: "a5-language-writing-name", age: 5, subject: "language", title: "Writing My Name & Simple Words", blurb: "First proper pencil-grip writing practice." },
  { id: "a5-math-numbers-50", age: 5, subject: "math", title: "Numbers to 50", blurb: "Reading, writing and ordering bigger numbers." },
  { id: "a5-math-addition-objects", age: 5, subject: "math", title: "Addition with Objects", blurb: "Adding by physically combining groups of things." },
  { id: "a5-world-five-senses", age: 5, subject: "world", title: "My Five Senses", blurb: "A closer look at how we see, hear, smell, taste and touch." },
  { id: "a5-world-living-non-living", age: 5, subject: "world", title: "Living vs Non-Living Things", blurb: "Sorting the world into things that grow and things that don't." },
  { id: "a5-arts-paper-folding", age: 5, subject: "arts", title: "Paper Folding Basics", blurb: "Simple origami shapes like a boat or a hat." },
  { id: "a5-arts-natural-painting", age: 5, subject: "arts", title: "Painting with Natural Materials", blurb: "Using leaves, flowers and twigs to paint and print." },

  // ---- Age 6 ----
  { id: "a6-language-short-sentences", age: 6, subject: "language", title: "Reading Short Sentences", blurb: "Putting words together into first full sentences." },
  { id: "a6-language-naming-words", age: 6, subject: "language", title: "Nouns & Naming Words", blurb: "Spotting the names of people, places and things." },
  { id: "a6-math-add-sub-20", age: 6, subject: "math", title: "Addition & Subtraction to 20", blurb: "Confident, fluent number work within 20." },
  { id: "a6-math-measurement", age: 6, subject: "math", title: "Measurement — Long/Short, Heavy/Light", blurb: "Comparing objects using non-standard units like hand-spans." },
  { id: "a6-world-parts-of-plant", age: 6, subject: "world", title: "Parts of a Plant", blurb: "Naming the root, stem, leaf, flower and fruit — and what each does." },
  { id: "a6-world-helpers-tools", age: 6, subject: "world", title: "Our Helpers & Their Tools", blurb: "Matching each helper in our community to the tools they use." },
  { id: "a6-arts-nature-collage", age: 6, subject: "arts", title: "Nature Collage", blurb: "Making art from leaves, twigs and things found outdoors." },
  { id: "a6-arts-musical-instruments", age: 6, subject: "arts", title: "Simple Musical Instruments", blurb: "Building shakers and drums from things at home." },

  // ---- Age 7 ----
  { id: "a7-language-comprehension-basics", age: 7, subject: "language", title: "Reading Comprehension Basics", blurb: "Answering simple questions about a short passage." },
  { id: "a7-language-action-words", age: 7, subject: "language", title: "Verbs & Action Words", blurb: "Spotting the 'doing' words in a sentence." },
  { id: "a7-math-add-sub-100", age: 7, subject: "math", title: "Addition & Subtraction to 100", blurb: "Carrying and borrowing with two-digit numbers." },
  { id: "a7-math-intro-multiplication", age: 7, subject: "math", title: "Introduction to Multiplication", blurb: "Understanding multiplication as repeated addition." },
  { id: "a7-world-germination", age: 7, subject: "world", title: "Germination — How Plants Grow", blurb: "Watching a seed sprout, step by step, from the inside out." },
  { id: "a7-world-animal-homes", age: 7, subject: "world", title: "Animals and Their Homes", blurb: "Matching animals to the nests, burrows and hives they live in." },
  { id: "a7-arts-recycled-craft", age: 7, subject: "arts", title: "Recycled Craft", blurb: "Turning bottles, boxes and scraps into something new." },
  { id: "a7-arts-rangoli-patterns", age: 7, subject: "arts", title: "Simple Rangoli & Pattern Art", blurb: "Making symmetric patterns with chalk, rice or flower petals." },

  // ---- Age 8 ----
  { id: "a8-language-adjectives", age: 8, subject: "language", title: "Adjectives & Describing Words", blurb: "Making sentences richer with describing words." },
  { id: "a8-language-letter-writing", age: 8, subject: "language", title: "Letter Writing Basics", blurb: "Writing a simple letter to a friend or relative." },
  { id: "a8-math-multiplication-tables", age: 8, subject: "math", title: "Multiplication Tables", blurb: "Building speed and confidence with times tables." },
  { id: "a8-math-fractions-halves-quarters", age: 8, subject: "math", title: "Fractions — Halves & Quarters", blurb: "Splitting whole things fairly into equal parts." },
  { id: "a8-science-germination-deep", age: 8, subject: "science", title: "Germination & Parts of a Plant", blurb: "A deeper look at what a seed needs to become a plant." },
  { id: "a8-science-states-of-matter", age: 8, subject: "science", title: "States of Matter", blurb: "Solids, liquids and gases — and how they change into each other." },
  { id: "a8-social-maps-directions", age: 8, subject: "social", title: "Maps & Directions", blurb: "Reading a simple map and using North, South, East, West." },
  { id: "a8-social-neighbourhood-helpers", age: 8, subject: "social", title: "My Neighbourhood & Community Helpers", blurb: "Understanding the different helpers who keep our area running." },
  { id: "a8-arts-clay-models", age: 8, subject: "arts", title: "Model Making with Clay", blurb: "Sculpting simple 3D models from clay or air-dry dough." },
  { id: "a8-arts-colour-mixing", age: 8, subject: "arts", title: "Colour Mixing & Shading", blurb: "Discovering new colours and shading a drawing for depth." },

  // ---- Age 9 ----
  { id: "a9-language-tenses", age: 9, subject: "language", title: "Tenses — Past, Present & Future", blurb: "Telling when something happened using the right verb form." },
  { id: "a9-language-creative-writing", age: 9, subject: "language", title: "Creative Writing — Short Stories", blurb: "Building a simple story with a beginning, middle and end." },
  { id: "a9-math-long-division", age: 9, subject: "math", title: "Long Division", blurb: "Breaking a big number into equal groups, step by step." },
  { id: "a9-math-fractions-decimals", age: 9, subject: "math", title: "Fractions & Decimals", blurb: "Seeing how fractions and decimals describe the same amount." },
  { id: "a9-science-life-cycles", age: 9, subject: "science", title: "Life Cycles — Butterfly & Frog", blurb: "Following an animal's journey from egg to adult." },
  { id: "a9-science-water-cycle", age: 9, subject: "science", title: "The Water Cycle", blurb: "Evaporation, condensation and rain — water's endless journey." },
  { id: "a9-social-states-capitals", age: 9, subject: "social", title: "States & Capitals of India", blurb: "Learning India's map through its states and capital cities." },
  { id: "a9-social-natural-resources", age: 9, subject: "social", title: "Natural Resources", blurb: "Understanding water, soil, air and forests — and using them wisely." },
  { id: "a9-arts-diorama", age: 9, subject: "arts", title: "Diorama Building", blurb: "Building a tiny 3D scene inside a shoebox." },
  { id: "a9-arts-watercolour", age: 9, subject: "arts", title: "Watercolour Techniques", blurb: "Wet-on-wet and wet-on-dry painting techniques." },

  // ---- Age 10 ----
  { id: "a10-language-clauses", age: 10, subject: "language", title: "Grammar — Clauses & Conjunctions", blurb: "Joining ideas together into longer, connected sentences." },
  { id: "a10-language-essay-writing", age: 10, subject: "language", title: "Essay & Letter Writing", blurb: "Structuring ideas clearly across a few paragraphs." },
  { id: "a10-math-percentages", age: 10, subject: "math", title: "Fractions, Decimals & Percentages", blurb: "Seeing the same value three different ways." },
  { id: "a10-math-angles-geometry", age: 10, subject: "math", title: "Angles & Basic Geometry", blurb: "Measuring and naming angles with a protractor." },
  { id: "a10-science-solar-system", age: 10, subject: "science", title: "The Solar System", blurb: "Meeting the Sun, the planets, and their neighbourhood in space." },
  { id: "a10-science-photosynthesis", age: 10, subject: "science", title: "Photosynthesis", blurb: "How a leaf turns sunlight into food." },
  { id: "a10-social-freedom-struggle-intro", age: 10, subject: "social", title: "India's Freedom Struggle — An Introduction", blurb: "Meeting the people and events that shaped India's independence." },
  { id: "a10-social-climate-vegetation", age: 10, subject: "social", title: "Climate & Vegetation of India", blurb: "Why different parts of India look and feel so different." },
  { id: "a10-arts-solar-system-model", age: 10, subject: "arts", title: "Model of the Solar System", blurb: "Building a hanging model of the Sun and planets to scale." },
  { id: "a10-arts-mixed-media", age: 10, subject: "arts", title: "Mixed-Media Art", blurb: "Combining paint, paper and found objects in one artwork." },

  // ---- Age 11 ----
  { id: "a11-language-parts-of-speech", age: 11, subject: "language", title: "Parts of Speech in Depth", blurb: "Nouns, verbs, adjectives and more, working together." },
  { id: "a11-language-poetry-appreciation", age: 11, subject: "language", title: "Poetry Appreciation", blurb: "Reading a poem for rhythm, rhyme and meaning." },
  { id: "a11-math-integers", age: 11, subject: "math", title: "Integers & the Number Line", blurb: "Working confidently with positive and negative numbers." },
  { id: "a11-math-ratio-proportion", age: 11, subject: "math", title: "Ratio & Proportion", blurb: "Comparing quantities and scaling recipes or maps fairly." },
  { id: "a11-science-nutrition-food", age: 11, subject: "science", title: "Components of Food & Nutrition", blurb: "What's really in our food, and why our body needs each part." },
  { id: "a11-science-separation-substances", age: 11, subject: "science", title: "Separation of Substances", blurb: "Sieving, filtering and using magnets to separate mixtures." },
  { id: "a11-social-early-civilisations", age: 11, subject: "social", title: "Early Civilisations", blurb: "How the first cities and farming communities began." },
  { id: "a11-social-maps-latitude-longitude", age: 11, subject: "social", title: "Maps, Latitude & Longitude", blurb: "Pinpointing any place on Earth using an invisible grid." },

  // ---- Age 12 ----
  { id: "a12-language-reported-speech", age: 12, subject: "language", title: "Reported Speech", blurb: "Retelling what someone said, in your own words." },
  { id: "a12-language-report-writing", age: 12, subject: "language", title: "Report & Article Writing", blurb: "Writing clearly and objectively about an event or issue." },
  { id: "a12-math-rational-numbers", age: 12, subject: "math", title: "Rational Numbers", blurb: "Extending number sense to fractions of positives and negatives." },
  { id: "a12-math-simple-compound-interest", age: 12, subject: "math", title: "Simple & Compound Interest — Basics", blurb: "How money grows differently depending on how interest is calculated." },
  { id: "a12-science-nutrition-plants-animals", age: 12, subject: "science", title: "Nutrition in Plants & Animals", blurb: "Comparing how plants make food and animals find it." },
  { id: "a12-science-acids-bases-salts", age: 12, subject: "science", title: "Acids, Bases & Salts", blurb: "Testing everyday substances to see how they behave." },
  { id: "a12-social-medieval-india", age: 12, subject: "social", title: "Medieval India", blurb: "Kingdoms, trade and culture between the ancient and modern eras." },
  { id: "a12-social-environment-vegetation", age: 12, subject: "social", title: "Environment & Natural Vegetation", blurb: "How climate, soil and rainfall shape the plants of a region." },

  // ---- Age 13 ----
  { id: "a13-language-active-passive", age: 13, subject: "language", title: "Active & Passive Voice", blurb: "Saying the same thing two different ways, on purpose." },
  { id: "a13-language-persuasive-writing", age: 13, subject: "language", title: "Persuasive & Argumentative Writing", blurb: "Building a convincing case with reasons and evidence." },
  { id: "a13-math-linear-equations", age: 13, subject: "math", title: "Linear Equations in One Variable", blurb: "Solving for an unknown, step by step." },
  { id: "a13-math-mensuration", age: 13, subject: "math", title: "Mensuration — Surface Area & Volume", blurb: "Measuring the 'skin' and the 'inside space' of 3D shapes." },
  { id: "a13-science-crop-production", age: 13, subject: "science", title: "Crop Production & Management", blurb: "What it really takes to grow the food we eat." },
  { id: "a13-science-cell-structure", age: 13, subject: "science", title: "Cell Structure & Microorganisms", blurb: "Meeting the building blocks of life, up close." },
  { id: "a13-science-force-friction-pressure", age: 13, subject: "science", title: "Force, Friction & Pressure", blurb: "Why things slide, stick or push back." },
  { id: "a13-social-constitution-basics", age: 13, subject: "social", title: "The Indian Constitution — Basics", blurb: "The rulebook that defines rights, duties and how India is governed." },
];

export function topicsForAge(age: number): Topic[] {
  return TOPICS.filter((t) => t.age === age);
}

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}
