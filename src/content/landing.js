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
          name: "Anne farrell",
          meta: "4 photos",
          stars: 5,
          timeAgo: "9 hours ago",
          badge: "New",
          body:
            "I have been using Javier's business for my yard clean up and maintenance for several years. I have always had a great experience. My yard always looks fantastic when they are finished. They have always been easy to work with and responsive to any questions or concerns. I highly recommend them!",
          avatarUrl:
            "https://lh3.googleusercontent.com/a-/ALV-UjVSPrvfubXpMSaVTENZFmzxiG6FhZ3vP9rigI2hbDc0yqA5Pz4=w45-h45-p-rp-mo-br100",
          photos: [
            "https://lh3.googleusercontent.com/grass-cs/ANxoTn3vXQK84kvo5YWtdotHeXeYRvV21pBur4sMIjCnAc84zdeDmqNE0qviyFny7Kbaw2r0tgOEEh6qHU7RsVMHuqeQbn4RMIhY8HhmzbuJdlI2a0RSUBnt9djbZYj8_hCZWgijb7K1svX-srsa=w375-h281-p-k-no",
            "https://lh3.googleusercontent.com/grass-cs/ANxoTn0Qc4IarfEzhBZ5Ft8qIJEb3ul-7YqS-J9EYs8gt1E2J7EVJQz9gGU0E3ZYA1gp_LC4Yv9sXhZCjvZUL-K35RyKj0939cmCSDiRQXL9RYKJGmekbyGsv7FMpMDImHf5KVatj053HmYESKY=w375-h281-p-k-no",
          ],
        },
        {
          name: "Will Cullin",
          meta: "8 reviews · 1 photo",
          stars: 5,
          timeAgo: "5 days ago",
          badge: "New",
          body:
            "We have trusted Javier and his crew for many years now. They do excellent work from routine trimming to full landscaping projects. They have planted and removed trees and shrubs for us, laid down a new path, and fully redid our front bed with retaining wall and plants. 10/10 work!",
          avatarUrl:
            "https://lh3.googleusercontent.com/a/ACg8ocIA6HLD9-WfJUkt6s-KAo5zx3ngG2K-eRLIURfl9Svj8ad6xQ=w45-h45-p-rp-mo-br100",
          photos: [
            "https://lh3.googleusercontent.com/grass-cs/ANxoTn0t9vF-04vMwPBb3EOhrs1bSFef25vpYD-zdg-8WvnDCETMnxXCVdG6XqDAqLgSLZnHVqktPHKYeo4yxcGLLEYTA1n1QeTIQinwBFH6XPaRGIQdnkgoqIEqJdaYxvJkpIO0BGlNJW1sM2oz=w750-h563-p-k-no",
          ],
        },
        {
          name: "Dianna Rodriguez",
          meta: "7 reviews · 1 photo",
          stars: 5,
          timeAgo: "6 days ago",
          badge: "New",
          body:
            "Javier and his crew have done many projects for us including new sod, irrigation, stone patios, and regular maintenance of our flower beds. They make sure to always tell me exactly what in need to do to keep it looking great based on the season and weather. I highly recommend them!",
          avatarUrl:
            "https://lh3.googleusercontent.com/a/ACg8ocLHvXwVjOCVVE5_qnctc6y6LaDQe-mjKOz4hAmyaFw2nx7yfA=w45-h45-p-rp-mo-br100",
          photos: [
            "https://lh3.googleusercontent.com/grass-cs/ANxoTn3fn8S8LXhEODDy97kOBq9FVWh13CcapJ0pbmdTlse_MHTc5r62al_jKAwEHZz8vK-JinnRCaFIHZnUHIrDAg-uYaCMd1bfPJUp3kYaeDJvKUo9rvJ-PkUEOzcNvoBUwFqz12xYHdkM1GaI=w750-h563-p-k-no",
          ],
        },
        {
          name: "Doris Benavides",
          meta: "Northern Virginia",
          stars: 5,
          body: "",
        },
      ],
    },
  },
};
