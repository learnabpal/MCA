import { DDTimeline, Events, Guides, HostProfile, SERVICE_FEATURES, ServiceFeatures, Services } from "@/core/Models";
import { LocalDateTime } from "@js-joda/core";




const imgFill = [
	  "https://picsum.photos/seed/1/800",
	  "https://picsum.photos/seed/2/800",
	  "https://picsum.photos/seed/3/800",
	  "https://picsum.photos/seed/4/800",
	  "https://picsum.photos/seed/5/800",
	  "https://picsum.photos/seed/6/800",
	  "https://picsum.photos/seed/7/800"
];

const timeline: DDTimeline = { fua: Date.now().toString(), lua: Date.now().toString() };

export const DUMMY_HOST: HostProfile = {
	  id: "sonam-tamang",
	  title: "Sonam Tamang",
	  details: "Local host from Darjeeling helping travellers discover the hills.",
	  cover: imgFill[1],
	  ...timeline,
	  photos: [ ...imgFill ],
	  phone: "9876543210",
	  email: "sonam@example.com",
	  location: "Darjeeling, West Bengal",
	  role: "pioneer"
} as const;

export const DUMMY_SERVICES = {
	  "abcd": {
			 id: "abcd",
			 handle: "evergreenhomestay",
			 ownership: {} as any,
			 priceTier: 2, ...timeline,
			 title: "Evergreen Homestay",
			 details: "Quiet homestay overlooking the tea gardens.",
			 cover: imgFill[1],
			 photos: [ ...imgFill ],
			 phone: "9876543210",
			 email: "",
			 location: "Upper Lebong Road, Darjeeling",
			 category: "Lodging",
			 features: [ ...SERVICE_FEATURES.Lodging.filter(() => Math.random() > 0.75) ] as ServiceFeatures<"Lodging">,
			 highlights: [ "Awesome hospitality", "Warmth", "Goes entra mile" ],
			 coverage: [ "Darjeeling", "Kalimpong" ],
			 mapLink: "",
			 webLink: "",
			 tags: [ "darjeeling" ],
			 serviceItems: {
					"pine-room": { id: "pine-room", ...timeline, title: "Pine Room", details: "Balcony room", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Room", price: "1800", priceBasis: "night" },
					"valley-room": { id: "valley-room", ...timeline, title: "Valley Room", details: "Attic valley view", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Room", price: "1500", priceBasis: "night" },
					"pork-momo": { id: "pork-momo", ...timeline, title: "Pork Momos", details: "Steamed dumplings", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Dish", price: "120", priceBasis: "item" },
					"thukpa": { id: "thukpa", ...timeline, title: "Thukpa", details: "Hot noodle soup", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Dish", price: "180", priceBasis: "item" },
					"darj-tea": { id: "darj-tea", ...timeline, title: "Darjeeling Tea Pack", details: "250g first flush", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Product", price: "450", priceBasis: "item" },
					"yak-scarf": { id: "yak-scarf", ...timeline, title: "Yak Wool Scarf", details: "Hand woven scarf", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Product", price: "600", priceBasis: "item" },
					"bolero": { id: "bolero", ...timeline, title: "Mahindra Bolero", details: "7 seater vehicle", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Vehicle", price: "3000", priceBasis: "trip" },
					"wagonr": { id: "wagonr", ...timeline, title: "Maruti WagonR", details: "Local town rides", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Vehicle", price: "800", priceBasis: "trip" },
					"heritage-walk": { id: "heritage-walk", ...timeline, title: "Heritage Walk", details: "Town heritage walk", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Experience", price: "500", priceBasis: "person" }
			 }
	  },
	  "efgh": {
			 id: "efgh",
			 handle: "teaandtoast",
			 ownership: {} as any,
			 priceTier: 0, ...timeline,
			 title: "Tea and Toast Cafe",
			 details: "Simple breakfast cafe.",
			 cover: imgFill[1],
			 photos: [ ...imgFill ],
			 phone: "9090909090",
			 email: "",
			 location: "Nehru Road, Darjeeling",
			 category: "Eatery",
			 features: [ ...SERVICE_FEATURES.Eatery.filter(() => Math.random() > 0.75) ] as ServiceFeatures<"Eatery">,
			 highlights: [],
			 coverage: [ "Darjeeling", "Kalimpong" ],
			 mapLink: "",
			 webLink: "",
			 tags: [ "kalimpong" ],
			 serviceItems: {
					"english-breakfast": { id: "english-breakfast", ...timeline, title: "English Breakfast", details: "Eggs toast beans", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Dish", price: "250", priceBasis: "item" }
			 }
	  },
	  "ijkl": {
			 id: "ijkl",
			 handle: "handloomcorner",
			 ownership: {} as any,
			 priceTier: 0, ...timeline,
			 title: "Handloom Corner",
			 details: "Local wool garments.",
			 cover: imgFill[1],
			 photos: [ ...imgFill ],
			 phone: "9887766554",
			 email: "",
			 location: "Kalimpong Bazaar",
			 category: "Shop",
			 features: [ ...SERVICE_FEATURES.Shop.filter(() => Math.random() > 0.75) ] as ServiceFeatures<"Shop">,
			 highlights: [],
			 coverage: [ "Darjeeling", "Kalimpong" ],
			 mapLink: "",
			 webLink: "",
			 tags: [ "darjeeling" ],
			 serviceItems: {
					"wool-cap": { id: "wool-cap", ...timeline, title: "Wool Cap", details: "Knitted cap", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Product", price: "300", priceBasis: "item" }
			 }
	  },
	  "mnop": {
			 id: "mnop",
			 handle: "taxikalimpong",
			 ownership: {} as any,
			 priceTier: 0, ...timeline,
			 title: "Kalimpong Taxi Service",
			 details: "Hill transport service.",
			 cover: imgFill[1],
			 photos: [ ...imgFill ],
			 phone: "9776655443",
			 email: "",
			 location: "Kalimpong Taxi Stand",
			 category: "Driver",
			 features: [ ...SERVICE_FEATURES.Driver.filter(() => Math.random() > 0.75) ] as ServiceFeatures<"Driver">,
			 highlights: [],
			 coverage: [ "Darjeeling", "Kalimpong" ],
			 mapLink: "",
			 webLink: "",
			 tags: [ "kalimpong" ],
			 serviceItems: {
					"innova": { id: "innova", ...timeline, title: "Toyota Innova", details: "8 seater", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Vehicle", price: "3500", priceBasis: "trip" }
			 }
	  },
	  "qrst": {
			 id: "qrst",
			 handle: "sunsetpointguide",
			 ownership: {} as any,
			 priceTier: 0, ...timeline,
			 title: "Sunset Point Guide",
			 details: "Local sightseeing guide.",
			 cover: imgFill[1],
			 photos: [ ...imgFill ],
			 phone: "9665544332",
			 email: "",
			 location: "Kalimpong",
			 category: "Local",
			 features: [ ...SERVICE_FEATURES.Local.filter(() => Math.random() > 0.75) ] as ServiceFeatures<"Local">,
			 highlights: [],
			 coverage: [ "Darjeeling", "Kalimpong" ],
			 mapLink: "",
			 webLink: "",
			 tags: [ "darjeeling" ],
			 serviceItems: {
					"sunset-tour": { id: "sunset-tour", ...timeline, title: "Sunset Tour", details: "Evening viewpoint tour", cover: imgFill[1], photos: [ ...imgFill ], serviceType: "Experience", price: "600", priceBasis: "person" }
			 }
	  }
} as Services as const;


export const DUMMY_EVENTS: Events = {
	  "evt1": {
			 id: "evt1",
			 name: "AdminX1",
			 title: "Darjeeling Tea Festival",
			 details: "### Pure Darjeeling Bliss\nExperience the finest first flush teas and local culture at the heart of the Hills. Join us for a week of aromatic tastings, traditional folk music, and scenic tea garden tours.\n\n*   **Highlights**: Rare First Flush Tastings, Gourmet Food Stalls, Photography Workshops.\n*   **Attire**: Casual & Comfortable.",
			 portrait: imgFill[0],
			 landscape: imgFill[0],
			 photos: [ ...imgFill ],
			 ...timeline,
			 date: LocalDateTime.now().plusDays(1).toString(),
			 venue: "Chowrasta, Darjeeling",
			 link: "https://darjeeling.gov.in",
			 premium: false, phone: "9876543210", email: "xxx@xxx.com"
	  },
	  "evt2": {
			 id: "evt2",
			 name: "AdminX2",
			 title: "Kalimpong Flower Show",
			 details: "### A Floral Paradise in the Clouds\nAn annual display of the most beautiful exotic orchids and seasonal blooms. Wander through majestic floral tunnels and witness the creativity of our local horticuralists.\n\n#### The Orchid Sanctuary\nKalimpong is world-renowned for its nurseries. This year, we feature over **50 unique species** of orchids, some rarely seen outside of private collections. Our experts will lead guided tours through the main pavilion every hour.\n\n#### Interactive Workshops\n*   **Orchid Care 101**: Learn the secrets to keeping these delicate beauties alive at home.\n*   **Floral Arrangement**: A hands-on session with award-winning designers.\n*   **Sustainability in Gardening**: How to garden in harmony with the Himalayan ecosystem.\n\n#### Evening Gala\nAs the sun sets over the Kanchenjunga, the pavilion transforms. With soft ambient lighting and live acoustic performances, it’s an experience you won't forget.\n\n> \"To see a world in a grain of sand and a heaven in a wild flower, hold infinity in the palm of your hand and eternity in an hour.\" — William Blake\n\n#### Practical Information\n*   **Tickets**: Available at the gate or through our local partners.\n*   **Photography**: Strictly allowed for non-commercial purposes only.\n*   **Pets**: Not allowed inside the main pavilions for the safety of the flora.",
			 portrait: imgFill[2],
			 landscape: imgFill[2],
			 photos: [ ...imgFill ],
			 ...timeline,
			 date: LocalDateTime.now().plusMonths(2).toString(),
			 venue: "Town Hall, Kalimpong",
			 link: "",
			 premium: true, phone: "9876543210", email: "xxx@xxx.com"
	  }
};


export const DUMMY_GUIDES: Guides = {
	  "gui1": {
			 id: "gui1",
			 premium: true,
			 title: "The Ultimate Guide to Darjeeling Tea Gardens",
			 details: "Darjeeling is world-famous for its tea, and for good reason. This guide walks you through the best tea gardens to visit, the history of the region, and what to look for in a perfect cup of first-flush tea.\n\n### Why it matters\nTea is not just a drink here; it's the rhythm of the Hills.",
			 photos: [ imgFill[0], imgFill[1], imgFill[2] ],
			 name: "AdminX1",
			 ...timeline,
			 link: ""
	  },
	  "gui2": {
			 id: "gui2",
			 premium: false,
			 title: "Budget Travel: Kalimpong in 48 Hours",
			 details: "How to see the best of Kalimpong without breaking the bank. From local eateries to the best view points that don't cost a penny.",
			 photos: [ imgFill[3], imgFill[4] ],
			 name: "AdminX1",
			 ...timeline,
			 link: ""
	  }
};
