import React, { useEffect, useRef, useState } from 'react';
import { gsap, Flip } from 'gsap/all';
import { motion, AnimatePresence } from 'framer-motion';
import './IntroGridMotion.css';

gsap.registerPlugin(Flip);

const images = [
  "/assets/intro/lost_wallet.png",
  "/assets/intro/lost_phone.png",
  "/assets/intro/lost_keys.png",
  "/assets/intro/lost_bag.png",
  "/assets/intro/lost_watch.png",
  "/assets/intro/lost_glasses.png",
  "https://images.unsplash.com/photo-1523050335456-adaba8345aef?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop",
  "/assets/intro/lost_wallet.png",
  "/assets/intro/lost_phone.png",
  "/assets/intro/lost_keys.png",
  "/assets/intro/lost_bag.png",
  "/assets/intro/lost_watch.png",
  "/assets/intro/lost_glasses.png",
  "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498243639359-2cee506b74b7?q=80&w=2070&auto=format&fit=crop",
  "/assets/intro/lost_wallet.png",
  "/assets/intro/lost_phone.png",
  "/assets/intro/lost_keys.png",
  "/assets/intro/lost_bag.png",
  "/assets/intro/lost_watch.png",
  "/assets/intro/lost_glasses.png",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000&auto=format&fit=crop",
  "/assets/intro/lost_wallet.png",
  "/assets/intro/lost_phone.png",
  "/assets/intro/lost_keys.png",
  "/assets/intro/lost_bag.png",
  "/assets/intro/lost_watch.png",
  "/assets/intro/lost_glasses.png",
  "https://images.unsplash.com/photo-1523050335456-adaba8345aef?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop",
  "/assets/intro/lost_wallet.png",
  "/assets/intro/lost_phone.png",
  "/assets/intro/lost_keys.png",
];

const IntroGridMotion = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const middleItemRef = useRef<HTMLDivElement>(null);
    const [isExplored, setIsExplored] = useState(false);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const rows = grid.querySelectorAll('.grid__row');
        
        // Mouse motion settings
        let mouse = { x: 0.5, y: 0.5 };
        const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
        
        const motionState = Array.from(rows).map((_, i) => ({
            x: 0,
            y: 0,
            amt: 0.05 + (Math.abs(i - 2) * 0.02) // Center rows move faster
        }));

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX / window.innerWidth;
            mouse.y = e.clientY / window.innerHeight;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const updateMotion = () => {
            if (isExplored) return;

            rows.forEach((row, i) => {
                const state = motionState[i];
                const targetX = (mouse.x - 0.5) * 100;
                const targetY = (mouse.y - 0.5) * 100;
                
                state.x = lerp(state.x, targetX, state.amt);
                state.y = lerp(state.y, targetY, state.amt);
                
                gsap.set(row, {
                    x: state.x,
                    y: state.y,
                    skewX: state.x * 0.1,
                    filter: `brightness(${1 + Math.abs(state.x) * 0.005}) contrast(${1 + Math.abs(state.y) * 0.005})`
                });
            });

            requestAnimationFrame(updateMotion);
        };

        const animationId = requestAnimationFrame(updateMotion);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, [isExplored]);

    const handleExplore = () => {
        const grid = gridRef.current;
        const middleItem = middleItemRef.current;
        const content = contentRef.current;
        
        if (!grid || !middleItem || !content) return;

        setIsExplored(true);

        // Capture initial state
        const state = Flip.getState(middleItem);

        // Move to final position state (fullscreen-like)
        middleItem.classList.add('grid__item--fullview');
        
        // Animate transition
        Flip.from(state, {
            duration: 1.2,
            ease: 'expo.inOut',
            onStart: () => {
                gsap.to(grid.querySelectorAll('.grid__item:not(.grid__item--middle)'), {
                    duration: 0.8,
                    opacity: 0,
                    scale: 0.8,
                    stagger: {
                        amount: 0.3,
                        from: 'center'
                    }
                });
                gsap.to(grid, {
                    duration: 1.2,
                    rotate: 0,
                    ease: 'expo.inOut'
                });
            },
            onComplete: () => {
                gsap.to(content, {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    ease: 'power3.out'
                });
            }
        });
    };

    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Redefining Discovery",
            description: "In the heart of every lost object lies a story. Qivaro bridges the gap between loss and recovery through aesthetic precision and functional harmony.",
            stats: [
                { label: "Matched Items", value: "1.2k+" },
                { label: "Success Rate", value: "98%" }
            ],
            button: "Learn How It Works"
        },
        {
            title: "Precise Matching",
            description: "Our AI-driven system analyzes every report to find the perfect match. Whether it's a forgotten textbook in the library or keys in the cafeteria, we find them.",
            stats: [
                { label: "Avg. Match Time", value: "< 24h" },
                { label: "Secure Handover", value: "Verified" }
            ],
            button: "Join the Network"
        },
        {
            title: "Ready to Explore?",
            description: "Start your journey today. Report a lost item or help someone find theirs. Your campus, connected through safe discovery.",
            stats: [
                { label: "Active Users", value: "5k+" },
                { label: "Campus Support", value: "24/7" }
            ],
            button: "Enter Qivaro"
        }
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            window.location.href = '/dashboard';
        }
    };

    // Helper to chunk images into rows
    const rowsOfImages = [
        images.slice(0, 7),
        images.slice(7, 14),
        images.slice(14, 21),
        images.slice(21, 28),
        images.slice(28, 35),
    ];

    return (
        <div className={`intro-container ${isExplored ? 'intro-container--explored' : ''}`}>
            <div ref={gridRef} className="intro-grid-container">
                {rowsOfImages.map((rowImages, rowIndex) => (
                    <div key={rowIndex} className="grid__row">
                        {rowImages.map((src, colIndex) => {
                            const isMiddle = rowIndex === 2 && colIndex === 3;
                            return (
                                <div 
                                    key={colIndex} 
                                    ref={isMiddle ? middleItemRef : null}
                                    className={`grid__item ${isMiddle ? 'grid__item--middle' : ''}`}
                                >
                                    <div className="grid__item-inner">
                                        <div 
                                            className="grid__item-img" 
                                            style={{ backgroundImage: `url(${src})` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="intro-overlay">
                <img src="/qivaro-logo.webp" alt="Qivaro" className="w-24 h-24 md:w-32 md:h-32 rounded-3xl md:rounded-[2rem] shadow-2xl mb-8 animate-in fade-in zoom-in duration-1000" />
                <h1 className="intro-title font-display">Qivaro</h1>
                <p className="intro-subtitle font-body">Everything lost is waiting to be found.</p>
                <button className="explore-button" onClick={handleExplore}>
                   Explore the Cases
                </button>
            </div>

            <div ref={contentRef} className="intro-content">
                <div className="content-inner max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="flex justify-center gap-2 mb-8">
                        {steps.map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-12 h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'bg-foreground' : 'bg-foreground/20'}`}
                            />
                        ))}
                    </div>

                    <div className="relative overflow-hidden min-h-[450px]">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentStep}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="step-content bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-10 md:p-14 shadow-[var(--gentle-shadow)] relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 pointer-events-none" />
                                
                                <motion.h2 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight relative z-10"
                                >
                                    {steps[currentStep].title}
                                </motion.h2>
                                
                                <motion.p 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto relative z-10"
                                >
                                    {steps[currentStep].description}
                                </motion.p>
                                
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12 relative z-10"
                                >
                                    {steps[currentStep].stats.map((stat, i) => (
                                        <div key={i} className="stat bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl p-6 min-w-[160px] shadow-sm hover:-translate-y-1 transition-transform duration-300">
                                            <span className="block text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{stat.value}</span>
                                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-2 block">{stat.label}</span>
                                        </div>
                                    ))}
                                </motion.div>

                                <motion.button 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="explore-button bg-primary text-primary-foreground relative z-10"
                                    onClick={nextStep}
                                >
                                    {steps[currentStep].button}
                                </motion.button>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroGridMotion;
