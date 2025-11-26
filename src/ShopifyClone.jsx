import React, { useState } from 'react';
import {
    ChevronDown,
    ArrowRight,
    Menu,
    X,
    Globe,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube
} from 'lucide-react';

// --- SVG Logo Component ---
// A simple SVG for the Shopify bag logo
const ShopifyLogo = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 81 100"
        className={className}
        fill="currentColor"
    >
        <path d="M80.4 20.3c-1.3-3.8-5.3-6.2-9.6-6.2H61.8c-2.2 0-4 1.8-4 4s1.8 4 4 4h9c1.4 0 2.7.9 3.2 2.2l-3.2 12.3c-.3 1.1-1.3 1.8-2.4 1.8H50.2c-3.7 0-6.9 2.5-7.8 6l-1.1 4-2.8 10.3c-.2.8-1 1.3-1.8 1.3H19.6c-1.1 0-2.1-.7-2.4-1.8l-3.2-12.2c-.5-1.9-2.3-3.2-4.2-3.2H4c-2.2 0-4-1.8-4-4s1.8-4 4-4h6c3.4 0 6.3 2.1 7.4 5.3l3.2 12.2c.3 1.1 1.3 1.8 2.4 1.8h13.9c.2 0 .4-.1.6-.2l2.8-10.3c.5-1.8 2.3-3 4.2-3h18.1c3.7 0 6.9-2.5 7.8-6l3.2-12.2c.5-2 2.3-3.3 4.2-3.3h9.1c2.2 0 4-1.8 4-4s-1.8-4-4-4h-9.1c-1.4 0-2.7.9-3.2 2.2l-3.2 12.2c-.3 1.1-1.3 1.8-2.4 1.8H50.2c-.2 0-.4.1-.6.2l-2.8 10.3c-.5 1.8-2.3 3-4.2 3H19.6c-3.7 0-6.9-2.5-7.8-6L8.6 27.5c-.5-1.9-2.3-3.2-4.2-3.2H.1c-.1 0-.1 0 0 0 -2.2 0-4-1.8-4-4s1.8-4 4-4h4.4c1.4 0 2.7.9 3.2 2.2l3.2 12.2c.3 1.1 1.3 1.8 2.4 1.8h13.9c3.7 0 6.9 2.5 7.8 6l2.8 10.3c.2.8 1 1.3 1.8 1.3h24.2c1.1 0 2.1-.7 2.4-1.8l3.2-12.2c.5-1.9 2.3-3.2 4.2-3.2h9.1c2.2 0 4-1.8 4-4s-1.8-4-4-4z"></path>
        <path d="M40.6 62.3c-1.1 0-2.1.7-2.4 1.8l-3.2 12.2c-.5 1.9-2.3 3.2-4.2 3.2H20.1c-2.2 0-4 1.8-4 4s1.8 4 4 4h10.7c3.4 0 6.3-2.1 7.4-5.3l3.2-12.2c.3-1.1 1.3-1.8 2.4-1.8h13.9c3.7 0 6.9-2.5 7.8-6l2.8-10.3c.2-.8 1-1.3 1.8-1.3h4.6c2.2 0 4-1.8 4-4s-1.8-4-4-4h-4.6c-1.4 0-2.7.9-3.2 2.2l-2.8 10.3c-.5 1.8-2.3 3-4.2 3H40.6z"></path>
    </svg>
);

// --- Header Component ---
const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Why Shopify', dropdown: true },
        { name: 'Products', dropdown: true },
        { name: 'Pricing', dropdown: false },
        { name: 'Enterprise', dropdown: false },
    ];

    return (
        <header className="sticky top-0 z-50 bg-black text-white border-b border-gray-800">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Side: Logo and Nav */}
                    <div className="flex items-center space-x-8">
                        <ShopifyLogo className="h-8 w-auto" />
                        <nav className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href="#"
                                    className="text-sm font-medium text-gray-300 hover:text-white flex items-center"
                                >
                                    {link.name}
                                    {link.dropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Right Side: Auth and Start */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-sm font-medium text-gray-300 hover:text-white">
                            Log in
                        </a>
                        <a
                            href="#"
                            className="px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200"
                        >
                            Start for free
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-white"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-black">
                    <nav className="px-2 pt-2 pb-4 space-y-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href="#"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                    <div className="px-4 pb-4 space-y-3">
                        <a
                            href="#"
                            className="block w-full text-center px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200"
                        >
                            Start for free
                        </a>
                        <a
                            href="#"
                            className="block w-full text-center px-4 py-2 text-gray-300 text-sm font-medium rounded-full border border-gray-700 hover:bg-gray-900"
                        >
                            Log in
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

// --- Hero Component ---
const Hero = () => (
    <div
        className="relative min-h-screen flex items-center justify-center text-center p-8 bg-black text-white overflow-hidden"
        // Using a placeholder for the background video/image
        style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://placehold.co/1920x1080/000000/333333?text=Hero+Video+Placeholder')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        <div className="relative z-10 max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                Be the next
                <br />
                household name
            </h1>
            <p className="mt-6 text-xl md:text-2xl max-w-2xl mx-auto">
                Dream big, build fast, and grow far on Shopify.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <a
                    href="#"
                    className="px-8 py-4 bg-white text-black text-base font-medium rounded-full shadow-lg hover:bg-gray-200"
                >
                    Start for free
                </a>
                <a
                    href="#"
                    className="px-8 py-4 text-white text-base font-medium rounded-full flex items-center justify-center gap-2"
                >
                    Why we build Shopify <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </div>
    </div>
);

// --- Platform Intro Component ---
const PlatformIntro = () => (
    <section className="bg-white text-black py-24 px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
            <div className="text-center max-w-5xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    The one commerce platform behind it all
                </h2>
                <p className="mt-8 text-2xl md:text-3xl font-medium">
                    Sell online and in person. Sell locally and globally. Sell direct and wholesale.
                    <span className="font-bold"> Sell on desktop and mobile.</span>
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <img
                    src="https://placehold.co/800x600/f3f4f6/9ca3af?text=Product+Display+1"
                    alt="Product display"
                    className="rounded-2xl shadow-lg"
                />
                <img
                    src="https://placehold.co/800x600/f3f4f6/9ca3af?text=Mobile+App+UI"
                    alt="Mobile app UI"
                    className="rounded-2xl shadow-lg"
                />
                <div className="bg-gray-100 rounded-2xl p-8 flex flex-col justify-center shadow-lg">
                    <h3 className="text-3xl font-bold">Meet Brooklinen for Business</h3>
                    <p className="mt-4 text-gray-700">
                        Shopify lets Brooklinen create tailored B2B experiences for their design partners, with special pricing and tools.
                    </p>
                    <a href="#" className="mt-6 px-6 py-3 bg-black text-white text-sm font-medium rounded-full w-fit">
                        Explore now
                    </a>
                </div>
            </div>
        </div>
    </section>
);

// --- Info Card (for Enterprise section) ---
const InfoCard = ({ imgSrc, title, description, linkText }) => (
    <div className="flex flex-col">
        <img src={imgSrc} alt={title} className="rounded-2xl shadow-lg w-full aspect-square object-cover" />
        <h3 className="mt-6 text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
        <a href="#" className="mt-4 font-semibold text-white flex items-center gap-2 hover:underline">
            {linkText} <ArrowRight className="h-4 w-4" />
        </a>
    </div>
);

// --- Entrepreneurs to Enterprise Component ---
const Enterprise = () => (
    <section className="bg-neutral-900 text-white py-24 px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
            <div className="max-w-3xl">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    For everyone from entrepreneurs to enterprise
                </h2>
                <p className="mt-6 text-xl">
                    Millions of merchants of every size have collectively made over $1,000,000,000,000 in sales on Shopify.
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <InfoCard
                    imgSrc="https://placehold.co/600x600/111111/555555?text=Founder"
                    title="Get started fast"
                    description="Solo seller Megan Bre Camp started Summer Solace Tallow to sell her organic candles and skincare online and at local farmers markets."
                    linkText="Get started"
                />
                <InfoCard
                    imgSrc="https://placehold.co/600x600/111111/555555?text=GYMSHARK+Team"
                    title="Grow as big as you want"
                    description="Athleisure brand Gymshark grew from working out of a garage to the global juggernaut it is today, with $500M+ sales annually."
                    linkText="Explore plans"
                />
                <InfoCard
                    imgSrc="https://placehold.co/600x600/111111/555555?text=MATTEL+Products"
                    title="Raise the bar"
                    description="With the help of Shopify for enterprise, Mattel sells their iconic toys direct to customers around the world."
                    linkText="See enterprise solutions"
                />
            </div>
            <div className="mt-20 text-center">
                <a
                    href="#"
                    className="px-8 py-4 bg-white text-black text-base font-medium rounded-full shadow-lg hover:bg-gray-200"
                >
                    Pick a plan that fits
                </a>
            </div>
        </div>
    </section>
);

// --- Store Builder Component ---
const StoreBuilder = () => (
    <section className="bg-white text-black py-24 px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
            <div className="max-w-3xl">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Sell here, there, and everywhere
                </h2>
                <p className="mt-6 text-xl">
                    Get a stunning store that's made to sell. Design fast with AI, choose a stylish theme, or build completely custom for full control.
                </p>
            </div>
            <div className="mt-12 relative bg-gray-100 rounded-2xl min-h-[600px] overflow-hidden p-8">
                <img
                    src="https://placehold.co/1400x800/f3f4f6/9ca3af?text=Store+Builder+Visuals"
                    className="w-full h-full object-cover rounded-lg"
                    alt="Store builder interface"
                />
                {/* Simplified representation of the complex UI mockups */}
                <div className="absolute top-1/4 left-12 w-1/3 bg-white p-4 rounded-lg shadow-2xl">
                    <h4 className="font-bold">Home page</h4>
                    <div className="mt-2 h-2 bg-blue-200 rounded-full"></div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full w-3/4"></div>
                </div>
                <div className="absolute top-1/3 right-12 w-1/4 bg-white p-4 rounded-lg shadow-2xl">
                    <h4 className="font-bold">Order summary</h4>
                    <p className="text-sm mt-2">Forest Knit Sweater ... $10.00</p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">Pay now</button>
                </div>
                <div className="absolute bottom-1/4 left-1/3 w-1/5 bg-white p-3 rounded-lg shadow-2xl">
                    <img src="https://placehold.co/100x100/eeeeee/aaaaaa?text=Product" className="rounded-md" />
                    <p className="text-sm font-bold mt-2">Forest Knit Sweater</p>
                </div>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <h3 className="text-2xl font-bold">In-person point of sale</h3>
                    <p className="mt-2 text-gray-700">Sell in person to face and keep offline and online sales in sync with Shopify POS.</p>
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Publish across channels</h3>
                    <p className="mt-2 text-gray-700">Show up where shoppers scroll, search, and shop with multichannel integrations.</p>
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Powered by the world's best checkout</h3>
                    <p className="mt-2 text-gray-700">Shopify Checkout is fast, fully customizable, and optimized to close more sales.</p>
                </div>
            </div>
        </div>
    </section>
);

// --- Two Column Section (for various features) ---
const TwoColumnSection = ({
    title,
    col1Title,
    col1Description,
    col1ImgSrc,
    col2Title,
    col2Description,
    col2ImgSrc
}) => (
    <section className="bg-black text-white py-24 px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-center">
                {title}
            </h2>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="bg-neutral-900 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold">{col1Title}</h3>
                    <p className="mt-4 text-gray-300">{col1Description}</p>
                    <img
                        src={col1ImgSrc}
                        alt={col1Title}
                        className="mt-6 rounded-lg shadow-lg w-full"
                    />
                </div>
                <div className="bg-neutral-900 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold">{col2Title}</h3>
                    <p className="mt-4 text-gray-300">{col2Description}</p>
                    <img
                        src={col2ImgSrc}
                        alt={col2Title}
                        className="mt-6 rounded-lg shadow-lg w-full"
                    />
                </div>
            </div>
        </div>
    </section>
);

// --- App Store Component ---
const AppStore = () => {
    // Dummy array for app icons
    const appIcons = Array.from({ length: 48 });

    return (
        <section className="bg-neutral-900 text-white py-24 px-6 lg:px-8 overflow-hidden">
            <div className="max-w-screen-2xl mx-auto text-center">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Apps for anything else
                </h2>
                <p className="mt-6 text-xl max-w-3xl mx-auto">
                    Shopify offers all the essentials out of the box, but if your business calls for something extra you have the Shopify App Store — with 13,000+ commerce apps for whatever specialized features you might need.
                </p>
                <div className="mt-16 grid grid-cols-8 md:grid-cols-12 gap-4">
                    {appIcons.map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-800 rounded-2xl flex items-center justify-center">
                            <img
                                src={`https://placehold.co/64x64/71717a/eeeeee?text=App`}
                                alt="App Icon"
                                className="w-10 h-10 rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Checkout Component ---
const Checkout = () => (
    <section className="bg-white text-black py-24 px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    The world's best-converting checkout
                </h2>
                <div className="mt-12 flex gap-8">
                    <div>
                        <p className="text-5xl font-bold text-green-600">15%</p>
                        <p className="mt-2 font-medium">Higher Conversions</p>
                    </div>
                    <div>
                        <p className="text-5xl font-bold text-green-600">150M+</p>
                        <p className="mt-2 font-medium">Intent Datapoints</p>
                    </div>
                </div>
                <p className="mt-8 text-lg">
                    Shopify Checkout converts 15% higher on average than other commerce platforms and exposes your brand to 150 million buy-ready shoppers.
                </p>
                <p className="mt-4 text-sm text-gray-600">
                    Based on external study with a Big Three global consulting firm in April, 2023.
                </p>
            </div>
            <div>
                <img
                    src="https://placehold.co/800x700/f3f4f6/9ca3af?text=Checkout+UI"
                    alt="Checkout UI"
                    className="rounded-2xl shadow-xl"
                />
            </div>
        </div>
    </section>
);

// --- Performance Component ---
const Performance = () => (
    <section className="bg-black text-white py-24 px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Rock steady and blazing fast
                </h2>
                <p className="mt-8 text-xl">
                    Shopify puts your store within 50 milliseconds of every shopper on the planet, with the capacity to handle even the most epic product drops.
                </p>
            </div>
            <div>
                {/* Placeholder for the 3D Globe */}
                <div className="w-full aspect-square bg-neutral-900 rounded-full flex items-center justify-center">
                    <Globe className="w-1/2 h-1/2 text-blue-500" />
                </div>
            </div>
        </div>
    </section>
);

// --- Getting Started Component ---
const GettingStarted = () => (
    <section className="bg-white text-black py-24 px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <img
                    src="https://placehold.co/800x600/f3f4f6/9ca3af?text=Laptop+and+POS"
                    alt="Laptop and POS"
                    className="rounded-2xl shadow-xl"
                />
            </div>
            <div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                    It's easy to start selling
                </h2>
                <ol className="mt-12 space-y-8">
                    <li className="flex items-start">
                        <span className="text-5xl font-bold text-gray-300 mr-6">01</span>
                        <span className="text-3xl font-medium pt-2">Add your first product</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-5xl font-bold text-gray-300 mr-6">02</span>
                        <span className="text-3xl font-medium pt-2">Customize your store</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-5xl font-bold text-gray-300 mr-6">03</span>
                        <span className="text-3xl font-medium pt-2">Set up payments</span>
                    </li>
                </ol>
                <a
                    href="#"
                    className="mt-12 inline-block px-8 py-4 bg-black text-white text-base font-medium rounded-full shadow-lg hover:bg-neutral-800"
                >
                    Take your shot
                </a>
            </div>
        </div>
    </section>
);

// --- Footer Component ---
const Footer = () => {
    const footerLinks = {
        Shopify: ['About', 'Careers', 'Investors', 'Press and Media', 'Shopify Editions', 'Sustainability'],
        Ecosystem: ['Developer docs', 'App Store', 'Theme Store', 'Partners', 'Affiliates'],
        Resources: ['Blog', 'Compare Shopify', 'Guides', 'Free tools', 'Changelog'],
        Support: ['Shopify Help Center', 'Community Forum', 'Hire a partner', 'Service status'],
    };

    const socialIcons = [
        { icon: Facebook, href: '#' },
        { icon: Twitter, href: '#' },
        { icon: Linkedin, href: '#' },
        { icon: Instagram, href: '#' },
        { icon: Youtube, href: '#' },
    ];

    return (
        <footer className="bg-neutral-900 text-gray-400 py-16 px-6 lg:px-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <ShopifyLogo className="h-8 w-auto text-white" />
                    </div>
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-white mb-4">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm hover:text-white">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-4">
                        <a href="#" className="text-sm font-medium text-white flex items-center gap-2">
                            <Globe className="h-4 w-4" /> India | English <ChevronDown className="h-4 w-4" />
                        </a>
                    </div>
                    <div className="flex space-x-6 mt-6 md:mt-0">
                        {socialIcons.map((social, index) => (
                            <a key={index} href={social.href} className="text-gray-400 hover:text-white">
                                <social.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                    <div className="mt-6 md:mt-0 text-xs text-gray-500 space-x-4">
                        <span>© {new Date().getFullYear()} Shopify Inc.</span>
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};


// --- Main App Component ---
export default function ShopifyClone() {
    return (
        <div className="bg-white font-['Inter',_sans-serif]">
            <Header />
            <main>
                <Hero />
                <PlatformIntro />
                <Enterprise />
                <StoreBuilder />
                <TwoColumnSection
                    title="Find your forever customers"
                    col1Title="Reach the new customers and keep them coming back"
                    col1Description="Acquire new customers for less with integrated marketing tools and insightful analytics. Don't leave it behind."
                    col1ImgSrc="https://placehold.co/600x500/111111/555555?text=Marketing+Tools+UI"
                    col2Title="Unlock new growth with B2B"
                    col2Description="Create custom experiences for wholesale buyers with flexible pricing, discounts, and payment terms."
                    col2ImgSrc="https://placehold.co/600x500/111111/555555?text=B2B+UI"
                />
                <TwoColumnSection
                    title="Grow around the world"
                    col1Title="Local and global"
                    col1Description="Shopify takes the complexity out of international selling, from delivering products faster and more affordably to localising your experience with Shopify Markets."
                    col1ImgSrc="https://placehold.co/600x500/111111/555555?text=Global+Ordering+UI"
                    col2Title="Desktop and mobile"
                    col2Description="Manage everything in one place. Run your store from anywhere with the fully-featured Shopify mobile app."
                    col2ImgSrc="https://placehold.co/600x500/111111/555555?text=Admin+and+Mobile+UI"
                />
                <AppStore />
                <TwoColumnSection
                    title="By developers, for developers"
                    col1Title="Create custom storefronts"
                    col1Description="APIs, primitives, and tools empower devs and partners to build the apps, themes, and custom storefronts businesses are looking for."
                    col1ImgSrc="https://placehold.co/600x500/111111/555555?text=Terminal+UI"
                    col2Title="Shopify never stops innovating"
                    col2Description="Our fleet of 4000+ world-class developers never stops leveraging the latest tech to make your business stronger, faster, and more successful."
                    col2ImgSrc="https://placehold.co/600x500/111111/555555?text=AI+and+Horizons"
                />
                <Checkout />
                <Performance />
                <GettingStarted />
            </main>
            <Footer />
        </div>
    );
}
