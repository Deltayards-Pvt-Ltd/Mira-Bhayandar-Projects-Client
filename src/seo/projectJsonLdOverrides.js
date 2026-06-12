const SITE_URL = "https://www.mirabhayandarproperty.com";

function amenity(name, value = true) {
  return { "@type": "LocationFeatureSpecification", name, value };
}

function agent(areaNames) {
  return {
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#organization`,
    name: "Mira Bhayandar Property",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    areaServed: areaNames.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
  };
}

function listing(slug, listing, mainEntity, areaNames) {
  const projectUrl = `${SITE_URL}/projects/${slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        "@id": projectUrl,
        url: projectUrl,
        ...listing,
        mainEntity: {
          ...mainEntity,
          "@id": `${projectUrl}#project`,
        },
      },
      agent(areaNames),
    ],
  };
}

export const PROJECT_JSON_LD_OVERRIDES = {
  "kasturi-van": listing(
    "kasturi-van",
    {
      name: "Kasturi Van by Gujarat Group - Premium 1, 2 & 3 BHK Apartments in Bhayandar East",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Kasturi Van",
      description:
        "Premium under-construction mixed-use residential and commercial development by Gujarat Group in Bhayandar East. Offering modern 1 BHK, 2 BHK, 3 BHK, and custom Jodi layouts integrated with a lifestyle ecosystem.",
      identifier: "P51700025276",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kasturi Van, Bhayandar East",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401105",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2925",
        longitude: "72.8572",
      },
      amenityFeature: [
        amenity("Gymnasium, Yoga and Meditation Area"),
        amenity("Multi Purpose Turf, Indoor Play Lounge & Game Zone"),
        amenity("Terrace Landscaped Garden & Terrace Lounge"),
        amenity("Mini Theatre & Amphitheatre"),
        amenity("Banquet Hall"),
        amenity("Executive Workspace & Library"),
        amenity("Creche"),
        amenity("Kids Play Area & Senior Citizen Area"),
        amenity("Grand Entrance Lobby & High Speed Elevators"),
        amenity("Biometric Access & EV Charging Point"),
        amenity("Serene Garden & Gazebo Seating"),
        amenity("Table Tennis, Chess & Pool Table Corner"),
      ],
    },
    ["Bhayandar East", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  mukundam: listing(
    "mukundam",
    {
      name: "Mukundam by KKG Group - Premium Residential Project on 150 Ft. Road",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Mukundam",
      description:
        "Premium residential development by KKG Group located on 150 Ft. Road, Bhayandar West. Featuring a structurally optimized layout with one wing ready-to-move-in, fully equipped health features, and a tranquil community ecosystem.",
      identifier: "P51700017888",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Mukundam, Near Raghuleela Building, 150 Ft. Road, Bhayandar West",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401101",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2974",
        longitude: "72.8441",
      },
      amenityFeature: [
        amenity("One Wing Ready to Move"),
        amenity("Swimming Pool"),
        amenity("Clubhouse"),
        amenity("Gymnasium"),
        amenity("Jogging Track & Meditation Area"),
        amenity("Serene Garden, Pergola With Seating & Gazebo"),
        amenity("Kids Play Area"),
        amenity("Senior Citizen Area"),
        amenity("Indoor Games (Table Tennis, Carrom, Chess Corner)"),
        amenity("24x7 Security & CCTV Surveillance"),
        amenity("Seating Area In Premises"),
        amenity("Near Raghuleela Building"),
      ],
    },
    ["Bhayandar West", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  opulence: listing(
    "opulence",
    {
      name: "Ultra Premium 2, 3, 4 & 5 BHK Apartments by Sonam Group - Bhayandar East",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Sonam Group Ultra Premium Project",
      description:
        "Ultra-premium under-construction mixed-use residential and commercial landmark by Sonam Group in Bhayandar East. Offering high-end 2 BHK, 3 BHK, 4 BHK, 5 BHK, and custom Jodi layouts integrated with an elite resort-tier lifestyle ecosystem.",
      identifier: "P51700031137",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bhayandar East",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401105",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2918",
        longitude: "72.8592",
      },
      amenityFeature: [
        amenity("Swimming Pool"),
        amenity("Gym, CrossFit Area & Spinning Class"),
        amenity("Yoga Area & Walking Track"),
        amenity("Football & Cricket Turf"),
        amenity("Movie Theatre & Viewing Deck On Terrace"),
        amenity("Multi Purpose Banquet Hall & Pantry"),
        amenity("Business Cafe, Juice Bar & Salon"),
        amenity("Steam & Spa Room"),
        amenity("Game Zone (Snooker, Table Tennis, Cards, Chess, Carrom)"),
        amenity("Indoor & Outdoor Kids Play Area, Sand Pit"),
        amenity("Cabana, Gazebo & Chit Chat Corner"),
        amenity("Library & Reflexology Path"),
        amenity("Valet Parking Service & EV Charging Point"),
        amenity("Moon Walk Feature"),
        amenity("Near Jain Temple"),
        amenity("Near Meditya Nagar Metro Station"),
        amenity("Near N.L. Dalmia Institute of Management Studies"),
        amenity("Near ISKCON Temple"),
        amenity("Near Kanakia International School"),
      ],
    },
    ["Bhayandar East", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  windsor: listing(
    "windsor",
    {
      name: "Windsor by Ashish & Annapurna Group - 1 & 2 BHK Apartments in Bhayandar West",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Windsor",
      description:
        "Premium under-construction residential development by Ashish & Annapurna Group near Maheshwari Bhavan, Bhayandar West. Featuring highly optimized 1 BHK and 2 BHK configurations with lifestyle amenities, podium play areas, and multi-phase RERA certification.",
      identifier: ["P51700081037", "P51700081067", "P51700081077"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Windsor, Maheshwari Bhavan, Near Fillo, Bhayandar West",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401101",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.3002",
        longitude: "72.8451",
      },
      amenityFeature: [
        amenity("Swimming Pool"),
        amenity("Podium Garden"),
        amenity("Rooftop Seating Area"),
        amenity("Children's Play Area"),
        amenity("Amphitheater"),
        amenity("Podium Garden With Play Courts"),
        amenity("Near Bhayander Police Station"),
        amenity("Near Maxus Mall"),
        amenity("Near Tembha Hospital"),
        amenity("Near Narayana eTechno CBSE School"),
        amenity("Near Maheshwari Bhavan"),
      ],
    },
    ["Bhayandar West", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  windermere: listing(
    "windermere",
    {
      name: "Windermere by Ashish & Span Group - 1, 2, 3 & 3.5 BHK Apartments in Bhayandar West",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Windermere",
      description:
        "Premium under-construction mixed-use residential and commercial development featuring 3 towers by Ashish & Span Group in Bhayandar West. Offering luxury 1 BHK, 2 BHK, 3 BHK, 3.5 BHK (1392 Sq.Ft), and custom Jodi layout configurations with elite lifestyle amenities.",
      identifier: ["P51700052078", "P51700050737", "P51700050981"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Windermere, Bhayandar West",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401101",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.3012",
        longitude: "72.8439",
      },
      amenityFeature: [
        amenity("Residential Towers", "3 Towers"),
        amenity("Swimming Pool"),
        amenity("Garden Area"),
        amenity("Gymnasium"),
        amenity("Games Room"),
        amenity("Library"),
        amenity("Banquet Hall"),
        amenity("Business Lounge"),
        amenity("Cafe"),
        amenity("Creche"),
        amenity("Mini Theatre"),
        amenity("Senior Citizen Lounge"),
        amenity("Guest Room"),
        amenity("Spa"),
        amenity("Near Maxus Mall"),
        amenity("Near Wockhardt Hospital"),
        amenity("Near Shri Radhagiridhari Temple by ISKCON (< 20 mins drive)"),
      ],
      accommodation: [
        {
          "@type": "Apartment",
          name: "3.5 BHK Luxury Layout",
          description:
            "Ultra-spacious 3.5 BHK premium configuration designed for upscale luxury family living.",
          floorSize: {
            "@type": "QuantitativeValue",
            value: 1392,
            unitCode: "FTK",
            unitText: "Sq.Ft Carpet Area",
          },
        },
      ],
    },
    ["Bhayandar West", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  "sai-plaza": listing(
    "sai-plaza",
    {
      name: "Sai Plaza by Sai Shakti Creations - Commercial Spaces & Offices in Bhayandar East",
      datePosted: "2026-06-08",
    },
    {
      "@type": "CommercialProperty",
      name: "Sai Plaza",
      description:
        "Ready-to-move-in commercial development by Sai Shakti Creations on New Golden Nest Road, Bhayandar East. Offering versatile multi-configuration commercial units, corporate office structures, and premier rooftop business amenities.",
      identifier: "P51700009309",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Sai Plaza, New Golden Nest Road, Opp. Golden Nest Phase 1, Bhayandar East",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401105",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2901",
        longitude: "72.8553",
      },
      amenityFeature: [
        amenity("Commercial Properties & Flexible Configurations"),
        amenity("Rooftop Lounge & Refreshment Area"),
        amenity("Open Air Meeting Space & Gazebo Seating"),
        amenity("Rooftop Garden & Cabana Seating"),
        amenity("Multi Purpose Turf"),
        amenity("Earthquake Resistant Structure"),
        amenity("24x7 Security & CCTV Surveillance System"),
        amenity("Copper Wiring & Modular Switches"),
        amenity("Anti Skid Flooring"),
        amenity("Near New Metro Line"),
        amenity("Near Golden Nest Circle"),
        amenity("Opposite Golden Nest Phase 1"),
      ],
    },
    ["Bhayandar East", "Golden Nest", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  skyline: listing(
    "skyline",
    {
      name: "Skyline by Bhutra & Balaji Group - 1, 2 & 3 BHK Apartments in Bhayandar West",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Skyline",
      description:
        "Premium under-construction residential landmark by Bhutra & Balaji Group. Located near the Fire Brigade in Bhayandar West, offering luxury 1 BHK, 2 BHK, 3 BHK, and custom Jodi configurations paired with an elite ecosystem of over 35 premium lifestyle amenities.",
      identifier: ["P51700050604", "P51700050558", "P51700051005"],
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Skyline, Shri Maheshwari Bhawan Road, Near Fire Brigade, Bhayandar West",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401101",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.3005",
        longitude: "72.8465",
      },
      amenityFeature: [
        amenity("Multipurpose Court (Football/Basketball/Cricket)"),
        amenity("Swimming Pool"),
        amenity("Fully Equipped Gym, Zumba & Yoga Deck"),
        amenity("Jain Mandir"),
        amenity("Theatre Room & Music Arena"),
        amenity("Rooftop Party Deck & Recreational Area"),
        amenity("Stargazing Area & Rooftop Seating"),
        amenity("Zen Garden, Centre Garden & Aroma Deck"),
        amenity("Skating Rink & Rock Climbing Corner"),
        amenity("Multipurpose Banquet Hall"),
        amenity("Steam & Spa Room"),
        amenity("Game Zone (Pool, Table Tennis, Chess, Cards, Carrom)"),
        amenity("Kids Play Area & Toddler Area"),
        amenity("Library & Study Space"),
        amenity("24x7 Security & CCTV Surveillance"),
        amenity("Ample Parking & Rainwater Harvesting"),
        amenity("Near Wockhardt Hospital"),
        amenity("Near D-Mart"),
        amenity("Near Maxus Mall"),
        amenity("Near Fire Brigade Station"),
      ],
    },
    ["Bhayandar West", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  "anjani-one": listing(
    "anjani-one",
    {
      name: "Anjani One by Bhutra Group - 1 & 2 BHK Apartments in Indralok Phase 6",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Anjani One",
      description:
        "Premium under-construction mixed-use residential and commercial project by Bhutra Group. Located in the elite Indralok Phase 6 neighborhood of Mira Road East, offering masterfully planned 1 BHK (435 Sq.ft) and 2 BHK (605 Sq.ft) carpet area configurations.",
      identifier: "P51700050620",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Anjani One, RG Patil Road, Near Tirupati Vatika, Indralok Phase 6, Panchamratna Park, Mira Road East",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401105",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2933",
        longitude: "72.8647",
      },
      amenityFeature: [
        amenity("Well Equipped Gymnasium"),
        amenity("Yoga Room & Meditation Area"),
        amenity("Multipurpose Banquet Hall"),
        amenity("Zen Garden"),
        amenity("Kids Play Area"),
        amenity("Table Tennis & Billiards Corner"),
        amenity("Indoor Games Area"),
        amenity("Grand Entrance Lobby"),
        amenity("Stack Car Parking System"),
        amenity("High Tech Security & CCTV System"),
        amenity("Rain Water Harvesting"),
        amenity("Modern Fire Fighting System"),
        amenity("Earthquake Resistant Modern Planned Structure"),
        amenity("Near Kanakia International School"),
        amenity("Near Indralok Multispeciality Hospital"),
        amenity("Near Tirupati Vatika"),
      ],
      accommodation: [
        {
          "@type": "Apartment",
          name: "1 BHK Premium Layout",
          description: "Optimized 1 BHK layout with premium spatial architecture.",
          floorSize: {
            "@type": "QuantitativeValue",
            value: 435,
            unitCode: "FTK",
            unitText: "Sq.ft Carpet Area",
          },
        },
        {
          "@type": "Apartment",
          name: "2 BHK Premium Layout",
          description: "Spacious 2 BHK layout designed for upscale family living.",
          floorSize: {
            "@type": "QuantitativeValue",
            value: 605,
            unitCode: "FTK",
            unitText: "Sq.ft Carpet Area",
          },
        },
      ],
    },
    ["Indralok Phase 6", "Mira Road East", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  "the-pentagon": listing(
    "the-pentagon",
    {
      name: "The Pentagon by Bhutra Group - Premium Commercial Offices & Shops in Bhayandar East",
      datePosted: "2026-06-08",
    },
    {
      "@type": "CommercialProperty",
      name: "The Pentagon",
      description:
        "Premium under-construction commercial-only landmark development by Bhutra Group in Bhayandar East. Designed for premium retail shopping layouts and modern corporate offices, featuring a multi-modal transit-friendly business ecosystem.",
      identifier: "P51700047942",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Kasturi Estate, Panchal Road, beside Canara Bank, Hanuman Nagar, Bhayandar East",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401105",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2928",
        longitude: "72.8584",
      },
      amenityFeature: [
        amenity("Commercial Only (Shopping & Offices)"),
        amenity("Common Conference Room"),
        amenity("Mechanised Valet Parking System"),
        amenity("Rooftop Lounge"),
        amenity("Cafeteria"),
        amenity("Gymnasium"),
        amenity("Air Conditioned Grand Lobby"),
        amenity("Recreational Area"),
        amenity("4 High Speed Elevators"),
        amenity("24/7 Surveillance System"),
        amenity("Modern Fire Fighting System"),
        amenity("Beside Canara Bank"),
        amenity("Near Bhayandar Railway Station"),
        amenity("Near Metro Station"),
        amenity("Multi-Modal Connectivity (Bus, Train, Taxi, Auto-Rickshaw)"),
      ],
    },
    ["Bhayandar East", "Hanuman Nagar", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  ayodhya: listing(
    "ayodhya",
    {
      name: "Ayodhya by 711 Group - Premium 1 & 2 BHK Apartments in JP North Road",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Ayodhya",
      description:
        "Premium under-construction residential and commercial development by 711 Group on JP North Road, Mira Road East. Set in a high-class locality near Podar International School, featuring modern 1 BHK, 2 BHK, and Jodi configurations with high-end indoor/outdoor lifestyle amenities.",
      identifier: "P51700080391",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Ayodhya, JP North Road, Near Podar International School, Mira Road East",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401107",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2902",
        longitude: "72.8711",
      },
      amenityFeature: [
        amenity("Landscaped Garden"),
        amenity("Kids' Play Area"),
        amenity("Senior Citizen Sit-Out"),
        amenity("Jogging Track"),
        amenity("Multipurpose Hall"),
        amenity("Indoor Games Zone"),
        amenity("Fully Equipped Fitness Center"),
        amenity("Rooftop Yoga & Meditation Deck"),
        amenity("Ram Mandir"),
        amenity("CCTV Security & Intercom"),
        amenity("24x7 Security Surveillance"),
        amenity("High-speed Elevators"),
        amenity("Ample Parking Space"),
        amenity("Near Podar International School"),
        amenity("Near Western Express Highway"),
        amenity("Near Mira Road Railway Station"),
        amenity("Near Proposed Metro Station"),
      ],
    },
    ["JP North Road", "Mira Road East", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  "sky-avenue": listing(
    "sky-avenue",
    {
      name: "Sky Avenue by Bhutra & Balaji Group - 1 & 2 BHK Apartments near Golden Nest",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Sky Avenue",
      description:
        "Premium under-construction residential and commercial project by Bhutra & Balaji Group. Strategically located near Mira Bhayander Road, Queens Park, offering modern 1 BHK, 2 BHK, and custom Jodi layouts with over 15 luxury lifestyle amenities.",
      identifier: "P51700079168",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Near Deepak Hospital, Queens Park, Mira Bhayander Road, Mira Road East",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401107",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2905",
        longitude: "72.8548",
      },
      amenityFeature: [
        amenity("Jogging Track"),
        amenity("Senior Citizen Area"),
        amenity("Seating Area"),
        amenity("Grand Lobby"),
        amenity("Billiards Corner"),
        amenity("Jumping Tile Game Corner"),
        amenity("Indoor Kids Play Area"),
        amenity("Outdoor Kids Play Area"),
        amenity("Table Tennis Corner"),
        amenity("Carrom Board Corner"),
        amenity("Fully Equipped Gymnasium"),
        amenity("Yoga Area"),
        amenity("Meditation Area"),
        amenity("Party Lawn"),
        amenity("Common Lawn"),
        amenity("Rooftop Garden & Sit-Out"),
        amenity("Game Zone"),
        amenity("Near Thunga Hospital"),
        amenity("Near Golden Nest Circle"),
        amenity("Near Upcoming Metro Station (< 1 KM)"),
        amenity("Near Movie Max Cinema"),
        amenity("Near Vardhaman Fantasy Amusement Park"),
        amenity("Near Bhayandar Railway Station (< 15 Mins)"),
        amenity("Near Deepak Hospital"),
      ],
    },
    ["Golden Nest", "Mira Road East", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  anandam: listing(
    "anandam",
    {
      name: "Anandam by KKG & Bhutra Group - 2 BHK Apartments in Bhayandar West",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Anandam",
      description:
        "Ready-to-move-in residential development by KKG & Bhutra Group in Bhayandar West. Offering premium 2 BHK configurations with luxury lifestyle amenities and dual-phase RERA certification.",
      identifier: ["P51700017515", "P51700017941"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bhayandar West",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2989",
        longitude: "72.8422",
      },
      amenityFeature: [
        amenity("Fully Equipped Gymnasium"),
        amenity("Swimming Pool"),
        amenity("Club House"),
        amenity("Kids Play Area"),
        amenity("Meditation Room"),
        amenity("Steam Room"),
        amenity("Senior Citizen Corner"),
        amenity("24x7 Security & CCTV Surveillance"),
        amenity("Fire Fighting System"),
        amenity("Modern Adequate Parking Spaces"),
        amenity("Spacious Lawn"),
        amenity("Grand Lobby"),
        amenity("Seating Area"),
        amenity("Indoor Games"),
      ],
    },
    ["Bhayandar West", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),

  "sky-heights": listing(
    "sky-heights",
    {
      name: "Sky Heights by Bhutra, Balaji & Harsshil Shah Group - Mira Road",
      datePosted: "2026-06-08",
    },
    {
      "@type": "ApartmentComplex",
      name: "Sky Heights",
      description:
        "Premium residential and commercial development featuring luxury 1 BHK, 2 BHK, and Jodi flat configurations on Kanakia Road, Mira Road. RERA Certified property with modern lifestyle amenities.",
      identifier: "P51700055003",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kanakia Road, Unique Gardens, Mira Road East",
        addressLocality: "Mira Bhayandar",
        addressRegion: "Maharashtra",
        postalCode: "401107",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2882",
        longitude: "72.8643",
      },
      amenityFeature: [
        amenity("Gymnasium"),
        amenity("Swimming Pool"),
        amenity("Kids Play Area"),
      ],
      numberOfAccommodation: {
        "@type": "QuantitativeValue",
        value: 154,
        unitText: "Units",
      },
    },
    ["Mira Road", "Mira Bhayandar", "Mumbai Metropolitan Region"]
  ),
};
