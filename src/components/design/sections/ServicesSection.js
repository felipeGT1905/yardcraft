import { ServicesSection as LandingServicesSection } from "@/components/landing/sections/ServicesSection";
import { landingContent } from "@/content/landing";

/** Design page — same services block as the main landing page */
export function ServicesSection() {
  const { id, label, title, items } = landingContent.sections.services;
  return (
    <LandingServicesSection
      id={id}
      label={label}
      title={title}
      items={items}
    />
  );
}
