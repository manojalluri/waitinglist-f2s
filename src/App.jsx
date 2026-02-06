import React, { useEffect, useRef, useState } from 'react';
import './index.css';

const FloatingParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.fillStyle = `rgba(233, 184, 36, ${p.opacity})`; // Turmeric color
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="particles-canvas" />;
};

function App() {
    const [email, setEmail] = useState('');
    const [isJoined, setIsJoined] = useState(false);

    // New Suggestion Form States
    const [suggestion, setSuggestion] = useState('');
    const [expectation, setExpectation] = useState('');
    const [interest, setInterest] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductFading, setIsProductFading] = useState(false);

    const revealRefs = useRef([]);
    revealRefs.current = [];

    useEffect(() => {
        const joined = sessionStorage.getItem('f2s_joined');
        if (joined) setIsJoined(true);
    }, []);

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!email) return;

        // Send to Formspree
        try {
            const response = await fetch("https://formspree.io/f/mpqjapgv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    source: "Waitlist Registration"
                })
            });

            if (response.ok) {
                setIsJoined(true);
                sessionStorage.setItem('f2s_joined', 'true');
            }
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    const handleSuggestionSubmit = async (e) => {
        e.preventDefault();

        // Send to Formspree
        try {
            const response = await fetch("https://formspree.io/f/mpqjapgv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email, // Include email if they've already joined
                    interest: interest,
                    expectation: expectation,
                    suggestion: suggestion,
                    source: "Visitor Insights"
                })
            });

            if (response.ok) {
                setFormSubmitted(true);
            }
        } catch (error) {
            console.error("Insights submission failed", error);
        }
    };

    const addToRefs = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            },
            { threshold: 0.1 }
        );

        revealRefs.current.forEach((ref) => observer.observe(ref));
        return () => observer.disconnect();
    }, []);

    const products = [
        {
            id: 'abc', name: 'ABC Mix Powder', subtitle: 'Apple • Beetroot • Carrot',
            tag: 'Batch #01: Limited Harvest',
            benefits: ['Supports natural detoxification', 'Improves digestion & gut health', 'Boosts immunity and energy', 'Rich in antioxidants & fiber', 'Supports skin health'],
            color: '#F4E7D3',
            exclusivity: 'Only 500 units available in Batch 01',
            usage: [
                { title: 'Vedic Morning Cleanse', desc: 'Mix 5g (1 spoon) into warm water with a dash of lemon on an empty stomach to ignite your digestive agni.' },
                { title: 'The Power Bowl', desc: 'Stir into Greek yogurt or oatmeal. The natural fiber in the apple and beets supports sustained energy release.' },
                { title: 'Revitalizing Juice', desc: 'Add to fresh orange or pomegranate juice for an iron-rich infusion that beats mid-day fatigue.' }
            ]
        },
        {
            id: 'carrot', name: 'Carrot Powder', subtitle: 'Pure Vitality',
            tag: 'Member Favorite',
            benefits: ['Rich in beta-carotene & Vitamin A', 'Supports eye health', 'Promotes glowing skin', 'Strengthens immunity', 'Natural source of antioxidants'],
            color: '#FDF2E9',
            exclusivity: 'Exclusive early access for waitlist',
            usage: [
                { title: 'Skin Glow Elixir', desc: 'Add to your daily green smoothie. The high beta-carotene content works from within for radiant skin.' },
                { title: 'Golden Milk Alternative', desc: 'Whisk into warm almond milk with a pinch of cinnamon for a soothing, eye-health-boosting nightcap.' },
                { title: 'Natural Sweetener', desc: 'Use in baking muffins or pancakes. It adds a subtle natural sweetness and a boost of Vitamin A.' }
            ]
        },
        {
            id: 'beetroot', name: 'Beetroot Powder', subtitle: 'Heart & Strength',
            tag: 'Peak Purity',
            benefits: ['Improves blood circulation', 'Supports heart health', 'Enhances stamina & endurance', 'Natural nitric oxide booster', 'Supports detoxification'],
            color: '#F9EBEB',
            exclusivity: 'Farm-fresh collection',
            usage: [
                { title: 'Pre-Workout Shot', desc: 'Mix with water 30 mins before exercise. Natural nitrates boost nitric oxide levels for better endurance.' },
                { title: 'Hummus & Dips', desc: 'Whisk into classic hummus for a vibrant pink color and a heart-healthy nutrient kick.' },
                { title: 'The Stamina Smoothie', desc: 'Blend with dates, walnuts, and milk for a traditional strength-building drink (Ojas booster).' }
            ]
        },
        {
            id: 'moringa', name: 'Moringa Powder', subtitle: 'Green Superfood',
            tag: 'Nutrient Dense',
            benefits: ['High in plant-based protein', 'Rich in iron, calcium & antioxidants', 'Supports energy and metabolism', 'Helps regulate blood sugar levels', 'Strengthens immunity'],
            color: '#EEF5ED',
            exclusivity: 'Limited harvest reserve',
            usage: [
                { title: 'Universal Green Tea', desc: 'Whisk into hot (not boiling) water for a powerful green tea alternative with 10x the nutrients.' },
                { title: 'Purity Soup Topping', desc: 'Sprinkle over soups or dal just before serving to preserve the heat-sensitive Vitamin C and iron.' },
                { title: 'Energy Bars', desc: 'Mix into homemade energy balls with oats and honey for a portable, nutrient-dense snack.' }
            ]
        },
        {
            id: 'banana', name: 'Banana Powder', subtitle: 'Pure Energy',
            tag: 'Nutrient Powerhouse',
            benefits: ['Natural source of Potassium', 'Supports muscle recovery', 'Good for heart health', 'Easy for digestion', 'Rich in natural electrolytes'],
            color: '#FFFBE6',
            exclusivity: 'Sustainably harvested selection',
            usage: [
                { title: 'Vedic Energy Drink', desc: 'Whisk into milk or plant-based yogurt. Potassium keeps you energized and supports natural muscle function.' },
                { title: 'Gut-Friendly Fuel', desc: 'Blend with dates and nuts for a pre-workout boost that is incredibly gentle on the digestive fire.' },
                { title: 'Wellness Cereal', desc: 'Stir into child-safe or adult cereals for natural sweetness and a hidden mineral infusion.' }
            ]
        }
    ];

    const openProduct = (product) => {
        setSelectedProduct(product);
        document.body.style.overflow = 'hidden';
    };

    const closeProduct = () => {
        setIsProductFading(true);
        setTimeout(() => {
            setSelectedProduct(null);
            setIsProductFading(false);
            document.body.style.overflow = 'auto';
        }, 600);
    };

    return (
        <div className="app">
            <div className="noise-overlay"></div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg-anim"></div>
                <FloatingParticles />
                <div className="hero-content container">
                    <div className="exclusive-badge fade-in" ref={addToRefs}>Launching Soon</div>
                    <h1 className="brand-name fade-in reveal-delay-1" ref={addToRefs}>Farm 2 Spoon</h1>
                    <p className="tagline fade-in reveal-delay-2" ref={addToRefs}>Capture the Soul of Bharatiya Mitti.</p>
                    <p className="subtext fade-in reveal-delay-3" ref={addToRefs}>
                        We honor the ancient wisdom of Indian farming. Our powders aren't just food; they are 'Prana' from the soil, captured perfectly for your modern kitchen.
                    </p>
                    <div className="cta-wrapper fade-in reveal-delay-4" ref={addToRefs}>
                        <a href="#waitlist" className="cta-button primary">Secure Early Access</a>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-brand">
                <div className="container small-container text-center">
                    <p className="brand-story fade-in" ref={addToRefs}>
                        At Farm 2 Spoon, we transform farm fresh produce into nutrient dense powders using gentle dehydration techniques. Delivering purity, convenience, and wellness in every spoon.
                    </p>
                </div>
            </section>

            {/* Why Section */}
            <section className="why">
                <div className="container">
                    <div className="section-header fade-in" ref={addToRefs}>
                        <span className="section-label">Our Philosophy</span>
                        <h2 className="section-title">Why Farm 2 Spoon</h2>
                    </div>
                    <div className="why-grid">
                        <div className="why-card fade-in" ref={addToRefs}>
                            <h4>Farm-fresh sourcing</h4>
                            <p>We select only the highest quality produce at the peak of ripeness.</p>
                        </div>
                        <div className="why-card fade-in reveal-delay-1" ref={addToRefs}>
                            <h4>Slow dehydration process</h4>
                            <p>A meticulous low-temperature technique that respects cellular structure.</p>
                        </div>
                        <div className="why-card fade-in reveal-delay-2" ref={addToRefs}>
                            <h4>No preservatives or additives</h4>
                            <p>100% clean-label nutrition with nothing hidden.</p>
                        </div>
                        <div className="why-card fade-in reveal-delay-3" ref={addToRefs}>
                            <h4>Sustainably sourced</h4>
                            <p>Ethical partnerships with local farms for planet-friendly wellness.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section">
                <div className="container">
                    <div className="section-header fade-in" ref={addToRefs}>
                        <span className="section-label">Launch Collection</span>
                        <h2 className="section-title">Our First Products</h2>
                    </div>

                    <div className="products-grid">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className={`product-card fade-in reveal-delay-${(index % 3) + 1}`}
                                ref={addToRefs}
                                style={{ backgroundColor: product.color }}
                                onClick={() => openProduct(product)}
                            >
                                <div className="product-info">
                                    <span className="product-tag">{product.tag}</span>
                                    <h3 className="product-name">{product.name}</h3>
                                    <span className="product-subtitle">{product.subtitle}</span>
                                    <ul className="benefits-list">
                                        {product.benefits.map((benefit, bIndex) => <li key={bIndex}>{benefit}</li>)}
                                    </ul>
                                    <p className="product-exclusivity">{product.exclusivity}</p>
                                </div>
                                <div className="explore-hint">Discover Sacred Uses ✦</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Detail Overlay */}
            {selectedProduct && (
                <div className={`product-overlay ${isProductFading ? 'overlay-fade-out' : ''}`} onClick={closeProduct}>
                    <div className="product-modal" onClick={e => e.stopPropagation()} style={{ backgroundColor: selectedProduct.color }}>
                        <button className="close-modal" onClick={closeProduct}>✕</button>
                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="product-tag">{selectedProduct.tag}</span>
                                <h2 className="modal-title">{selectedProduct.name}</h2>
                                <p className="modal-subtitle">{selectedProduct.subtitle}</p>
                            </div>

                            <div className="modal-grid">
                                <div className="modal-left">
                                    <h3>Sacred Benefits</h3>
                                    <ul className="modal-benefits">
                                        {selectedProduct.benefits.map((b, i) => <li key={i}>{b}</li>)}
                                    </ul>
                                </div>
                                <div className="modal-right">
                                    <h3>Ways to Experience</h3>
                                    <div className="usage-stack">
                                        {selectedProduct.usage.map((u, i) => (
                                            <div key={i} className="usage-item">
                                                <h4>{u.title}</h4>
                                                <p>{u.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <p className="exclusivity-note">{selectedProduct.exclusivity}</p>
                                <a href="#waitlist" className="cta-button primary" onClick={closeProduct}>Reserve Your Batch</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Suggestion Section */}
            <section className="suggestion-space">
                <div className="container small-container">
                    <div className="section-header fade-in" ref={addToRefs}>
                        <span className="section-label">Tell Us More</span>
                        <h2 className="section-title">Your Voice Matters</h2>
                    </div>

                    <div className="suggestion-card fade-in" ref={addToRefs}>
                        {!formSubmitted ? (
                            <form onSubmit={handleSuggestionSubmit} className="insights-form">
                                <div className="form-group">
                                    <label>Which product are you most interested in?</label>
                                    <select
                                        value={interest}
                                        onChange={(e) => setInterest(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select a product</option>
                                        <option value="ABC Mix">ABC Mix Powder</option>
                                        <option value="Carrot">Carrot Powder</option>
                                        <option value="Beetroot">Beetroot Powder</option>
                                        <option value="Moringa">Moringa Powder</option>
                                        <option value="Banana">Banana Powder</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>What are you expecting from Farm 2 Spoon?</label>
                                    <textarea
                                        placeholder="E.g. Better health, convenience, pure ingredients..."
                                        value={expectation}
                                        onChange={(e) => setExpectation(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Any other suggestions for us?</label>
                                    <textarea
                                        placeholder="We'd love to hear your thoughts."
                                        value={suggestion}
                                        onChange={(e) => setSuggestion(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="cta-button">Send Insights</button>
                            </form>
                        ) : (
                            <div className="success-message text-center">
                                <div className="success-icon">✦</div>
                                <h3>Growth through your feedback</h3>
                                <p>Thank you for sharing your thoughts. We're crafting Farm 2 Spoon around your expectations.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Waitlist Section */}
            <section id="waitlist" className="waitlist-luxury">
                <div className="waitlist-card container fade-in" ref={addToRefs}>
                    {!isJoined ? (
                        <>
                            <h2 className="fade-in reveal-delay-1" ref={addToRefs}>Reserve Your Batch</h2>
                            <p className="fade-in reveal-delay-2" ref={addToRefs}>
                                Members on the list receive <strong>24-hour early access</strong> to our launch collection and a <strong>complimentary wooden spoon</strong> with their first order.
                            </p>
                            <form className="email-form luxury-form fade-in reveal-delay-3" ref={addToRefs} onSubmit={handleJoin}>
                                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <button type="submit">Get Early Access</button>
                            </form>
                        </>
                    ) : (
                        <div className="success-message fade-in visible">
                            <div className="success-icon">✦</div>
                            <h2>You're on the list!</h2>
                            <p>Welcome to Farm 2 Spoon. Your journey to pure wellness starts now.</p>
                            <p className="success-sub">We'll notify you as soon as our collection is ready for launch.</p>
                        </div>
                    )}
                    <p className="trust-note fade-in reveal-delay-3" ref={addToRefs}>No spam. Only meaningful updates.</p>
                </div>
            </section>

            {/* Brand Values */}
            <section className="values-typography">
                <div className="container">
                    <div className="values-stack fade-in" ref={addToRefs}>
                        <span className="value-word fade-in reveal-delay-1" ref={addToRefs}>Clean Nutrition</span>
                        <span className="value-word fade-in reveal-delay-2" ref={addToRefs}>Transparency</span>
                        <span className="value-word fade-in reveal-delay-3" ref={addToRefs}>Sustainability</span>
                        <span className="value-word fade-in reveal-delay-4" ref={addToRefs}>Farm-First Philosophy</span>
                        <span className="value-word fade-in reveal-delay-5" ref={addToRefs}>Thoughtful Wellness</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-content border-top">
                    <div className="footer-left">
                        <p className="fade-in" ref={addToRefs}>Farm 2 Spoon © 2026</p>
                        <p className="footer-tagline fade-in reveal-delay-1" ref={addToRefs}>“Made with care from farm to spoon”</p>
                    </div>
                    <div className="footer-right">
                        <p className="coming-soon fade-in" ref={addToRefs}>Coming Soon</p>
                        <div className="socials fade-in reveal-delay-1" ref={addToRefs}><a href="https://www.instagram.com/farm2spoon.in?igsh=c3RtaTV0ZTQ4Z2lk" target="_blank" rel="noopener noreferrer">Instagram</a></div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
