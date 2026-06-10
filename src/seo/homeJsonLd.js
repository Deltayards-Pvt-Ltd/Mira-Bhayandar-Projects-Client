/** Homepage JSON-LD — from SEO homepage script block */
export const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": "https://www.mirabhayandarproperty.com/#organization",
      url: "https://www.mirabhayandarproperty.com/",
      name: "Mira Bhayandar Property",
      logo: "https://www.mirabhayandarproperty.com/logo.png",
      description:
        "The premier real estate platform for Mira Bhayandar, specializing in premium localities, budget-friendly homes, and ultra-luxury flats. Discover residential townships with abundant green spaces, thriving community culture, and elite multi-modal connectivity.",
      telephone: "+91 93727 69619",
      award: "First Rank Nationwide in Swachh Survekshan 2024-25",
      knowsAbout: [
        "Real Estate Development",
        "Property Investment",
        "Luxury Residential Townships",
        "Affordable Housing",
        "Commercial Real Estate",
        "100% RERA Compliant Properties Only",
        "End-to-end Legal, Property Registration & Documentation Support",
      ],
      areaServed: [
        { "@type": "AdministrativeArea", name: "Mira Bhayandar" },
        { "@type": "AdministrativeArea", name: "Mira Road East" },
        { "@type": "AdministrativeArea", name: "Bhayandar East" },
        { "@type": "AdministrativeArea", name: "Bhayandar West" },
        { "@type": "AdministrativeArea", name: "Mumbai Metropolitan Region" },
      ],
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "RERA Verification",
          value:
            "100% RERA Verified - Every project we recommend is RERA registered and verified.",
        },
        {
          "@type": "PropertyValue",
          name: "Developer Network",
          value:
            "100+ Developer Partners - Direct partnerships with every major developer in the region.",
        },
        {
          "@type": "PropertyValue",
          name: "Pricing Integrity",
          value:
            "Best Price Guarantee - We ensure you get the best deal with no middleman markups.",
        },
        {
          "@type": "PropertyValue",
          name: "Service Scope",
          value:
            "End-to-End Support - From site visits to registration paperwork, we're with you at every step.",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.mirabhayandarproperty.com/#website",
      url: "https://www.mirabhayandarproperty.com/",
      name: "Mira Bhayandar Property",
      description:
        "Find Premium Townships, Ultra Luxury Flats, and Budget Friendly Properties in Mira Bhayandar.",
      publisher: { "@id": "https://www.mirabhayandarproperty.com/#organization" },
    },
    {
      "@type": "WebPage",
      "@id": "https://www.mirabhayandarproperty.com/#webpage",
      url: "https://www.mirabhayandarproperty.com/",
      name: "Properties in Mira Bhayandar - Luxury Flats, Premium Townships & Budget Homes",
      isPartOf: { "@id": "https://www.mirabhayandarproperty.com/#website" },
      about: { "@id": "https://www.mirabhayandarproperty.com/#organization" },
      description:
        "Explore properties in India's top-ranked clean city, Mira Bhayandar. Featuring 100% RERA-verified ultra-luxury flats and budget-friendly apartments with direct developer partnerships and best price guarantees.",
      specialty: "RealEstate",
      mainEntity: {
        "@type": "Place",
        name: "Mira Bhayandar Region",
        description:
          "A booming, thriving community and culturally rich micro-market in the Mumbai Metropolitan Region, recognized nationwide for its superior civic infrastructure, clean environment, and lifestyle connectivity.",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Civic Excellence",
            value: "Ranked 1st Nationally in Swachh Survekshan 2024-25",
          },
          {
            "@type": "PropertyValue",
            name: "Macro Connectivity Infrastructure",
            value:
              "Gujarat-Mumbai Highway, Upcoming Borivali-Thane Twin Tunnel, Advanced Metro Connectivity up to Andheri",
          },
          {
            "@type": "PropertyValue",
            name: "Nature & Leisure Proximity",
            value: "Sanjay Gandhi National Park (SGNP), Gorai Beach, Global Vipassana Pagoda",
          },
          {
            "@type": "PropertyValue",
            name: "Premium Lifestyle Infrastructure",
            value: "Maxus Mall, Premium Townships with Abundant Green Spaces",
          },
          {
            "@type": "PropertyValue",
            name: "Healthcare Facilities",
            value:
              "Wockhardt Hospital and an extensive list of highly advanced multispeciality hospitals",
          },
          {
            "@type": "PropertyValue",
            name: "Elite Educational Institutions",
            value:
              "N.L. Dalmia Institute of Management Studies, Singapore International School, Kanakia International School, Podar International School, Ryan International School, Holy Angels High School",
          },
          {
            "@type": "PropertyValue",
            name: "Civic Utilities",
            value: "Ample Petrol Pumps and clean energy CNG Stations",
          },
          {
            "@type": "PropertyValue",
            name: "Inventory Segments",
            value: "Budget Friendly Properties, Ultra Luxury Flats, Premium Townships",
          },
        ],
      },
    },
  ],
};

export const HOME_SEO = {
  title: "Properties in Mira Bhayandar - Luxury Flats, Premium Townships & Budget Homes",
  description:
    "Explore properties in India's top-ranked clean city, Mira Bhayandar. Featuring 100% RERA-verified ultra-luxury flats and budget-friendly apartments with direct developer partnerships and best price guarantees.",
};
