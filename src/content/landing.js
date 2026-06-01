import { BRAND } from "@/lib/brand";

function sms(body) {
  return `sms:${BRAND.phoneTel}?body=${encodeURIComponent(body)}`;
}

const SMS_GENERAL = sms("Hi YardCraft, I'd love to learn more about your outdoor services for my property.");

export const landingContent = {
  nav: [
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#reviews", label: "Reviews" },
  ],
  hero: {
    eyebrow: "Elevated Outdoor Living",
    title: "Premium Outdoor\nTransformations",
    subtitle:
      "Landscaping, pavers, lighting, and outdoor living designed to make coming home feel exceptional.",
    primaryCta: { href: "#quote", label: "Request Your Custom Plan" },
    secondaryCta: { href: SMS_GENERAL, label: "Text Us" },
  },
  sections: {
    services: {
      id: "services",
      label: "OUR SERVICES",
      title: "Complete outdoor care. Crafted to perfection.",
      items: [
        {
          title: "Premium Yard Refresh",
          description: "Seasonal cleanouts, trimming, edging, and curb appeal upgrades.",
          image: "/images/Premium Yard Refresh.png",
          href: sms("Hi YardCraft, I'm interested in a Premium Yard Refresh for my property."),
        },
        {
          title: "Mulch & Planting",
          description: "Fresh mulch, seasonal planting, and clean landscape beds.",
          image: "/images/Mulch _ Planting.png",
          href: sms("Hi YardCraft, I'm interested in Mulch & Planting services for my property."),
        },
        {
          title: "Garage & Basement Cleanouts",
          description: "Cleanouts, hauling, junk removal, and organized finishes.",
          image: "/images/Garage _ Basement Cleanouts.png",
          href: sms("Hi YardCraft, I'm interested in a Garage & Basement Cleanout."),
        },
        {
          title: "Lawn Care & Maintenance",
          description: "Mowing, trimming, blowing, and recurring property care.",
          image: "/images/Lawn Care _ Maintenance.png",
          href: sms("Hi YardCraft, I'm interested in Lawn Care & Maintenance for my property."),
        },
        {
          title: "Paver Patios & Walkways",
          description: "Custom pavers, concrete walkways, and retaining walls.",
          image: "/images/Paver Patios _ Walkways.png",
          href: sms("Hi YardCraft, I'm interested in Paver Patios & Walkways for my property."),
        },
        {
          title: "Outdoor Upgrades",
          description: "Decks, pergolas, lighting, drainage, irrigation, and more.",
          image: "/images/Outdoor Upgrades.png",
          href: sms("Hi YardCraft, I'm interested in Outdoor Upgrades for my property."),
        },
      ],
    },
    process: {
      id: "process",
      label: "OUR PROCESS",
      title: "A straightforward process.\nExceptional results.",
      items: [
        {
          title: "Quick Consult",
          description:
            "Tell us about your goals, your space, and what you want to improve.",
        },
        {
          title: "Clear Scope",
          description:
            "You'll receive a detailed plan, transparent pricing, and a clear project timeline.",
        },
        {
          title: "Clean Install",
          description:
            "Our team builds with precision, respect, and premium attention to detail.",
        },
      ],
    },
    reviews: {
      id: "reviews",
      label: "REVIEWS",
      title: "Trusted by homeowners\nacross Northern Virginia.",
      googleMapsUrl:
        "https://www.google.com/maps/place/YardCraft/@38.9210323,-77.5133646,11z/data=!4m18!1m9!3m8!1s0x89b7b7245ae0c827:0x1cf8fa7c6cd458b!2sYardCraft!8m2!3d38.921447!4d-77.201547!9m1!1b1!16s%2Fg%2F11rt_x51sq!3m7!1s0x89b7b7245ae0c827:0x1cf8fa7c6cd458b!8m2!3d38.921447!4d-77.201547!9m1!1b1!16s%2Fg%2F11rt_x51sq?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D",
      items: [
        {
          name: "Doris Benavides",
          location: "Northern Virginia",
          stars: 5,
          body: "",
        },
      ],
    },
  },
};
