export const trips = [
  {
    id: 1,
    name: "Tokyo & Kyoto",
    destination: "Japan",
    emoji: "🗾",
    dates: "Mar 12 – Mar 26, 2026",
    people: 4,
    daysPlanned: 11,
    totalDays: 14,
    budget: 6000,
    budgetUsed: 4320,
    coverColor: "#e8d5b7",
  },
  {
    id: 2,
    name: "Amalfi Coast",
    destination: "Italy",
    emoji: "🇮🇹",
    dates: "Jul 4 – Jul 11, 2026",
    people: 2,
    daysPlanned: 5,
    totalDays: 7,
    budget: 3500,
    budgetUsed: 1200,
    coverColor: "#d4c5b0",
  },
];

export const pals = [
  { id: 1, name: "Marina", role: "Owner", avatar: "M", color: "#c9a96e" },
  { id: 2, name: "Sofia", role: "Editor", avatar: "S", color: "#a0856a" },
  { id: 3, name: "Jake", role: "Viewer", avatar: "J", color: "#7a9e9f" },
  { id: 4, name: "Priya", role: "Editor", avatar: "P", color: "#b07d62" },
];

export const itinerary = [
  {
    day: 1,
    date: "Wed, Mar 12",
    items: [
      {
        id: 1,
        time: "08:00",
        title: "Flight to Tokyo",
        type: "flight",
        cost: 820,
        booked: true,
        note: "JL 047 — SFO → NRT",
        assignedTo: "Marina",
      },
      {
        id: 2,
        time: "18:30",
        title: "Check-in: Trunk Hotel",
        type: "hotel",
        cost: 210,
        booked: true,
        note: "Shibuya, 3 nights",
        assignedTo: "Marina",
      },
      {
        id: 3,
        time: "20:00",
        title: "Dinner at Ichiran Ramen",
        type: "food",
        cost: 18,
        booked: false,
        note: "Solo-booth ramen experience",
        assignedTo: null,
      },
    ],
  },
  {
    day: 2,
    date: "Thu, Mar 13",
    items: [
      {
        id: 4,
        time: "09:00",
        title: "TeamLab Planets",
        type: "activity",
        cost: 32,
        booked: true,
        note: "Tickets pre-booked",
        assignedTo: "Sofia",
      },
      {
        id: 5,
        time: "13:00",
        title: "Lunch — Tsukiji Market",
        type: "food",
        cost: 25,
        booked: false,
        note: "Fresh sushi + tamagoyaki",
        assignedTo: null,
      },
      {
        id: 6,
        time: "19:00",
        title: "Shibuya Crossing & Rooftop Bar",
        type: "activity",
        cost: 15,
        booked: false,
        note: "No reservation needed",
        assignedTo: null,
      },
    ],
  },
  {
    day: 3,
    date: "Fri, Mar 14",
    items: [
      {
        id: 7,
        time: "07:30",
        title: "Meiji Shrine",
        type: "activity",
        cost: 0,
        booked: false,
        note: "Free entry — arrive early",
        assignedTo: "Jake",
      },
      {
        id: 8,
        time: "12:00",
        title: "Harajuku & Takeshita St",
        type: "activity",
        cost: 40,
        booked: false,
        note: "Shopping budget",
        assignedTo: null,
      },
      {
        id: 9,
        time: "19:30",
        title: "Omakase at Sushi Yoshitake",
        type: "food",
        cost: 250,
        booked: true,
        note: "3-star Michelin — prepaid",
        assignedTo: "Marina",
      },
    ],
  },
];

export const budget = {
  total: 6000,
  spent: 4320,
  categories: [
    { name: "Flights", spent: 1640, budget: 1800, color: "#c9a96e" },
    { name: "Hotels", spent: 1260, budget: 1500, color: "#a0856a" },
    { name: "Food", spent: 680, budget: 800, color: "#7a9e9f" },
    { name: "Activities", spent: 480, budget: 600, color: "#b07d62" },
    { name: "Transport", spent: 160, budget: 200, color: "#8b9e8b" },
    { name: "Shopping", spent: 100, budget: 1100, color: "#c4a882" },
  ],
  splits: [
    { name: "Marina", paid: 2800, owes: 0, color: "#c9a96e" },
    { name: "Sofia", paid: 900, owes: 180, color: "#a0856a" },
    { name: "Jake", paid: 420, owes: 660, color: "#7a9e9f" },
    { name: "Priya", paid: 200, owes: 880, color: "#b07d62" },
  ],
};

export const packingList = [
  {
    category: "Documents",
    emoji: "📄",
    items: [
      { id: 1, label: "Passport", assignedTo: "Marina", checked: true },
      { id: 2, label: "Travel insurance", assignedTo: "Marina", checked: true },
      { id: 3, label: "Hotel confirmations", assignedTo: "Sofia", checked: false },
      { id: 4, label: "Japan Rail Pass", assignedTo: "Jake", checked: false },
    ],
  },
  {
    category: "Tech",
    emoji: "🔌",
    items: [
      { id: 5, label: "Universal adapter (Japan Type A)", assignedTo: "Marina", checked: true },
      { id: 6, label: "Portable charger", assignedTo: "Sofia", checked: true },
      { id: 7, label: "Camera + spare battery", assignedTo: "Jake", checked: false },
      { id: 8, label: "Noise-cancelling headphones", assignedTo: "Priya", checked: false },
    ],
  },
  {
    category: "Clothing",
    emoji: "👗",
    items: [
      { id: 9, label: "Light rain jacket", assignedTo: null, checked: false },
      { id: 10, label: "Comfortable walking shoes", assignedTo: null, checked: false },
      { id: 11, label: "Layers for cold temples", assignedTo: null, checked: false },
    ],
  },
  {
    category: "Health",
    emoji: "💊",
    items: [
      { id: 12, label: "Medications (2-week supply)", assignedTo: "Marina", checked: true },
      { id: 13, label: "Blister plasters", assignedTo: null, checked: false },
      { id: 14, label: "Sunscreen SPF50", assignedTo: "Priya", checked: false },
    ],
  },
];

export const activityFeed = [
  { id: 1, person: "Sofia", action: "added Sushi Yoshitake to Day 3", time: "2m ago", avatar: "S", color: "#a0856a" },
  { id: 2, person: "Jake", action: "checked off Japan Rail Pass in Packing", time: "1h ago", avatar: "J", color: "#7a9e9f" },
  { id: 3, person: "Marina", action: "updated the budget to $6,000", time: "3h ago", avatar: "M", color: "#c9a96e" },
  { id: 4, person: "Priya", action: "joined the trip", time: "1d ago", avatar: "P", color: "#b07d62" },
  { id: 5, person: "Sofia", action: "booked TeamLab Planets tickets", time: "2d ago", avatar: "S", color: "#a0856a" },
];
