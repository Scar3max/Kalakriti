import Link from "next/link";

/**
 * Footer component — links, about, and Indian color-bar accent.
 */
export default function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30">
            {/* Indian color bar accent */}
            <div className="h-1 w-full border-pattern" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center">
                                <span className="text-white font-bold">K</span>
                            </div>
                            <span className="text-lg font-bold">
                                <span className="text-gradient">Kala</span>-Kriti
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Empowering Indian artisans through AI-driven technology.
                            Bridging tradition with the digital marketplace.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">
                            Explore
                        </h4>
                        <ul className="space-y-2.5">
                            {["Marketplace", "Featured Crafts", "Artisan Stories", "Craft Map"].map(
                                (item) => (
                                    <li key={item}>
                                        <Link
                                            href="/marketplace"
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* For Artisans */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">
                            For Artisans
                        </h4>
                        <ul className="space-y-2.5">
                            {["Join as Artisan", "List a Product", "Dashboard", "AI Tools"].map(
                                (item) => (
                                    <li key={item}>
                                        <Link
                                            href="/artisan/dashboard"
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">
                            Support
                        </h4>
                        <ul className="space-y-2.5">
                            {["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"].map(
                                (item) => (
                                    <li key={item}>
                                        <Link
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2026 Kala-Kriti. Made with ❤️ for Indian artisans.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">
                            Powered by AI • Built with purpose
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
