import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Kala-Kriti Homepage
 * - Hero section with mission statement
 * - Featured crafts grid
 * - Explore by Region
 * - How it works (artisan workflow)
 * - Coming Soon placeholders
 */

/* --- Sample Data (will be replaced by API calls) --- */
const featuredCrafts = [
  {
    id: "1",
    title: "Hand-Painted Blue Pottery Vase",
    price: 2800,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=750&fit=crop",
    artisan: "Raju Kumar",
    category: "Pottery",
    location: "Jaipur",
  },
  {
    id: "2",
    title: "Banarasi Silk Saree — Gold Zari",
    price: 8500,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=750&fit=crop",
    artisan: "Meera Devi",
    category: "Textiles",
    location: "Varanasi",
  },
  {
    id: "3",
    title: "Dhokra Brass Dancing Figure",
    price: 3200,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=750&fit=crop",
    artisan: "Sunil Gond",
    category: "Metal Craft",
    location: "Chhattisgarh",
  },
  {
    id: "4",
    title: "Madhubani Art — Tree of Life",
    price: 4500,
    image: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=600&h=750&fit=crop",
    artisan: "Lakshmi Kumari",
    category: "Painting",
    location: "Bihar",
  },
  {
    id: "5",
    title: "Kashmiri Papier-Mâché Box",
    price: 1800,
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=750&fit=crop",
    artisan: "Abdul Rashid",
    category: "Paper Craft",
    location: "Kashmir",
  },
  {
    id: "6",
    title: "Chikankari Embroidered Kurta",
    price: 3600,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=750&fit=crop",
    artisan: "Noor Jahan",
    category: "Textiles",
    location: "Lucknow",
  },
];

const regions = [
  { name: "Rajasthan", crafts: "Blue Pottery, Block Print, Miniature Painting", color: "from-amber-500 to-orange-600" },
  { name: "West Bengal", crafts: "Terracotta, Kantha, Sholapith", color: "from-emerald-500 to-teal-600" },
  { name: "Kashmir", crafts: "Papier-Mâché, Pashmina, Wood Carving", color: "from-sky-500 to-indigo-600" },
  { name: "Tamil Nadu", crafts: "Bronze, Tanjore Painting, Chettinad Tiles", color: "from-rose-500 to-pink-600" },
  { name: "Gujarat", crafts: "Bandhani, Patola, Rogan Art", color: "from-violet-500 to-purple-600" },
  { name: "Madhya Pradesh", crafts: "Gond Art, Chanderi Silk, Bagh Print", color: "from-lime-500 to-green-600" },
];

export default function HomePage() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative gradient-hero text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-saffron rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-gold rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-40 right-40 w-48 h-48 bg-jade rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            {/* Tagline badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-saffron-light animate-pulse" />
              <span className="text-sm font-medium text-white/90">
                AI-Powered Artisan Marketplace
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Bridging{" "}
              <span className="text-gradient">Tradition</span>{" "}
              with the{" "}
              <span className="text-saffron-light">Digital World</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
              Empowering Indian artisans to showcase centuries-old craftsmanship
              to the world. Simply upload an image, speak about your craft, and
              our AI transforms it into a professional listing.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/marketplace">
                <Button
                  size="lg"
                  className="rounded-full gradient-saffron text-white border-0 px-8 text-base font-semibold hover:opacity-90 transition-opacity animate-pulse-glow"
                >
                  Explore Marketplace
                </Button>
              </Link>
              <Link href="/auth?mode=register">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 text-white hover:bg-white/10 px-8 text-base"
                >
                  Join as Artisan
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { number: "500+", label: "Artisans" },
                { number: "2,000+", label: "Products" },
                { number: "28", label: "States" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-bold text-saffron-light">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              How <span className="text-gradient">Kala-Kriti</span> Works
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Three simple steps for artisans to showcase their craft to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "📸",
                title: "Upload & Speak",
                desc: "Take a photo of your craft and record a voice description in your language. No typing needed.",
              },
              {
                step: "02",
                icon: "✨",
                title: "AI Magic",
                desc: "Our AI transcribes your voice, generates a beautiful listing with title, description, cultural story, and tags.",
              },
              {
                step: "03",
                icon: "🛒",
                title: "Go Live",
                desc: "Review the generated listing, make edits if needed, and publish. Buyers discover your craft instantly.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-hover relative p-8 rounded-2xl bg-card border border-border group"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="absolute top-6 right-6 text-5xl font-extrabold text-muted/50 group-hover:text-saffron/20 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED CRAFTS ===== */}
      <section className="py-20 gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <Badge variant="secondary" className="mb-3 text-xs font-medium px-3 py-1">
                Featured
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Discover Handmade <span className="text-gradient">Treasures</span>
              </h2>
            </div>
            <Link href="/marketplace">
              <Button variant="outline" className="rounded-full">
                View All →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredCrafts.map((craft) => (
              <Link key={craft.id} href={`/product/${craft.id}`} className="group block">
                <div className="card-hover rounded-xl overflow-hidden border border-border bg-card">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={craft.image}
                      alt={craft.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 backdrop-blur-sm text-xs font-medium"
                      >
                        {craft.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-semibold">
                        ₹{craft.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                      {craft.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full gradient-saffron flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">
                          {craft.artisan[0]}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {craft.artisan} · {craft.location}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPLORE BY REGION ===== */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
              By Region
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Explore India&apos;s <span className="text-gradient">Craft Heritage</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Each region of India carries centuries of unique artistic traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {regions.map((region) => (
              <Link
                key={region.name}
                href={`/marketplace?region=${region.name}`}
                className="group block"
              >
                <div className="card-hover rounded-xl overflow-hidden border border-border bg-card p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${region.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <span className="text-white text-xl">🏛</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{region.name}</h3>
                  <p className="text-sm text-muted-foreground">{region.crafts}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMING SOON PLACEHOLDERS ===== */}
      <section className="py-20 gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
              Coming Soon
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              More <span className="text-gradient">Features</span> on the Way
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "🗺️",
                title: "Craft Discovery Map",
                desc: "Interactive map of India showcasing artisan clusters and craft traditions.",
              },
              {
                icon: "📝",
                title: "AI Marketing Captions",
                desc: "Generate social media captions and promotional content for your crafts.",
              },
              {
                icon: "✅",
                title: "Authenticity Verification",
                desc: "AI-powered verification to ensure genuine handmade craftsmanship.",
              },
              {
                icon: "💰",
                title: "AI Pricing Suggestions",
                desc: "Smart pricing recommendations based on market analysis and craft value.",
              },
              {
                icon: "📦",
                title: "Custom Order Requests",
                desc: "Let buyers request customized versions of artisan products.",
              },
              {
                icon: "📖",
                title: "Artisan Story Profiles",
                desc: "Rich storytelling profiles highlighting each artisan's journey and craft heritage.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 rounded-xl border border-dashed border-border bg-card/50 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                <Badge className="absolute top-4 right-4 text-[10px]" variant="outline">
                  Soon
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-saffron rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
            Ready to Share Your <span className="text-saffron-light">Craft</span> with the World?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of artisans who are already showcasing their heritage
            to buyers across India and beyond.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth?mode=register">
              <Button
                size="lg"
                className="rounded-full gradient-saffron text-white border-0 px-10 text-base font-semibold hover:opacity-90 animate-pulse-glow"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10 px-10 text-base"
              >
                Browse Crafts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
