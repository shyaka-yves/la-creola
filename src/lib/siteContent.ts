import { getSupabase } from "@/lib/supabaseServer";

export type HeroContent = {
  brand: string;
  tagline: string;
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  overlay: string;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  imageSrc: string;
  ctaLabel: string;
  ctaHref: string;
};

export type ExcellenceContent = {
  eyebrow: string;
  title: string;
  description: string;
  stats: Array<{ value: string; label: string }>;
  imageSrc: string;
};

export type EventsContent = {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{
    date: string;
    title: string;
    description: string;
    imageSrc: string;
  }>;
};

export type GalleryContent = {
  eyebrow: string;
  title: string;
  items: Array<{ imageSrc: string; alt: string }>;
};

export type TestimonialsContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Array<{ quote: string; name: string; rating: number }>;
};

export type BlogContent = {
  eyebrow: string;
  title: string;
  items: Array<{
    category: string;
    title: string;
    excerpt: string;
    imageSrc: string;
  }>;
};

export type ContactContent = {
  title: string;
  addressLines: string[];
  addressNote: string;
  hoursLines: string[];
  email: string;
  phone: string;
  mapEmbedSrc: string;
};

export type MenuIntroContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type MenuContent = {
  pdfUrl: string;
};

export type SpecialtyContent = {
  title: string;
  content: string;
};

export type SpecialOffersContent = {
  title: string;
  content: string;
};

export type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  excellence: ExcellenceContent;
  menuIntro: MenuIntroContent;
  events: EventsContent;
  gallery: GalleryContent;
  testimonials: TestimonialsContent;
  blog: BlogContent;
  contact: ContactContent;
  menu: MenuContent;
  specialty: SpecialtyContent;
  specialOffers: SpecialOffersContent;
};

export type ReservationRecord = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  date?: string;
  guests?: number;
  notes?: string;
  status: "new" | "contacted" | "closed";
};

const CONTENT_ROW_ID = "default";

function getDefaultContent(): SiteContent {
  return {
    hero: {
      brand: "La Creola",
      tagline: "The finest Rwandan dining experience",
      headline: "La Creola",
      subheadline: "",
      primaryCtaLabel: "Book a Table",
      primaryCtaHref: "/book",
      secondaryCtaLabel: "Our Menu",
      secondaryCtaHref: "/menu",
      mediaType: "image",
      mediaSrc: "",
      overlay: "",
    },
    about: {
      eyebrow: "About La Creola",
      title: "For a truly unique culinary experience",
      paragraphs: [
        "La Creola brings together bold African spirit and refined Asian influence in a way that feels both familiar and refreshingly new. Our vibrant atmosphere and attentive service create unforgettable memories.",
      ],
      imageSrc: "/interior.jpg",
      ctaLabel: "Book a Table",
      ctaHref: "/book",
    },
    excellence: {
      eyebrow: "The Standard",
      title: "La Creola Excellence",
      description: "",
      stats: [],
      imageSrc: "",
    },
    menuIntro: {
      eyebrow: "Tasting Notes",
      title: "A fusion of African soul & Asian finesse",
      description: "Our menu changes with the markets and the moods of the city.",
    },
    events: {
      eyebrow: "Upcoming Events",
      title: "Upcoming Party Events",
      description: "Experience exotic flavors and vibrant culture.",
      items: [],
    },
    gallery: {
      eyebrow: "Inside La Creola",
      title: "Our Gallery",
      items: [],
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What Our Clients Say",
      subtitle: "",
      items: [],
    },
    blog: {
      eyebrow: "From Our Blog",
      title: "Latest News & Updates",
      items: [],
    },
    contact: {
      title: "Visit Us",
      addressLines: ["Kigali / Kimihurura", "KG 28 Avenue, Kigali closer Adventist Church"],
      addressNote: "Located in the heart of Kimihurura with breathtaking views of the hills of Kigali.",
      hoursLines: [
        "Monday - Sunday: 10:00 AM - 1:00 AM",
      ],
      email: "reservations@lacreola.com",
      phone: "+250 793 084 995",
      mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d390.110208989431!2d30.085970473208192!3d-1.9614453068728352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca777ef43544b%3A0xb1c95bbfefb7ff00!2sLa%20Creola!5e0!3m2!1sen!2srw!4v1771455504152!5m2!1sen!2srw",
    },
    menu: {
      pdfUrl: "",
    },
    specialty: {
      title: "Speciality",
      content: "",
    },
    specialOffers: {
      title: "Special offers",
      content: "",
    },
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const defaults = getDefaultContent();
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("content").select("data").eq("id", CONTENT_ROW_ID).maybeSingle();
    if (error || !data?.data || typeof data.data !== "object") return defaults;
    const parsed = data.data as Partial<SiteContent>;
    return {
    hero: { ...defaults.hero, ...parsed.hero },
    about: { ...defaults.about, ...parsed.about },
    excellence: { ...defaults.excellence, ...parsed.excellence },
    menuIntro: { ...defaults.menuIntro, ...parsed.menuIntro },
    events: { ...defaults.events, ...parsed.events },
    gallery: { ...defaults.gallery, ...parsed.gallery },
    testimonials: { ...defaults.testimonials, ...parsed.testimonials },
    blog: { ...defaults.blog, ...parsed.blog },
    contact: { ...defaults.contact, ...parsed.contact },
    menu: { ...defaults.menu, ...parsed.menu },
    specialty: { ...defaults.specialty, ...parsed.specialty },
    specialOffers: { ...defaults.specialOffers, ...parsed.specialOffers },
  };
  } catch {
    return defaults;
  }
}

export async function saveSiteContent(next: SiteContent): Promise<void> {
  const supabase = getSupabase();
  await supabase.from("content").upsert({ id: CONTENT_ROW_ID, data: next, updated_at: new Date().toISOString() }, { onConflict: "id" });
}

