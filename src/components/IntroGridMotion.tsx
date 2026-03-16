import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, Flip } from 'gsap/all';
import { motion, AnimatePresence } from 'framer-motion';
import './IntroGridMotion.css';

gsap.registerPlugin(Flip);

const images = [
  "/assets/intro/lost_wallet.webp",
  "/assets/intro/lost_phone.webp",
  "/assets/intro/lost_keys.webp",
  "/assets/intro/lost_bag.webp",
  "/assets/intro/lost_watch.webp",
  "/assets/intro/lost_glasses.webp",
  "https://images.unsplash.com/photo-1523050335456-adaba8345aef?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=600&auto=format&fit=crop",
  "/assets/intro/lost_wallet.webp",
  "/assets/intro/lost_phone.webp",
  "/assets/intro/lost_keys.webp",
  "/assets/intro/lost_bag.webp",
  "/assets/intro/lost_watch.webp",
  "/assets/intro/lost_glasses.webp",
  "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498243639359-2cee506b74b7?q=80&w=600&auto=format&fit=crop",
  "/assets/intro/lost_wallet.webp",
  "/assets/intro/lost_phone.webp",
  "/assets/intro/lost_keys.webp",
  "/assets/intro/lost_bag.webp",
  "/assets/intro/lost_watch.webp",
  "/assets/intro/lost_glasses.webp",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop",
  "/assets/intro/lost_wallet.webp",
  "/assets/intro/lost_phone.webp",
  "/assets/intro/lost_keys.webp",
  "/assets/intro/lost_bag.webp",
  "/assets/intro/lost_watch.webp",
  "/assets/intro/lost_glasses.webp",
  "https://images.unsplash.com/photo-1523050335456-adaba8345aef?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=600&auto=format&fit=crop",
  "/assets/intro/lost_wallet.webp",
  "/assets/intro/lost_phone.webp",
  "/assets/intro/lost_keys.webp",
];

const IntroGridMotion = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const middleItemRef = useRef<HTMLDivElement>(null);
    const [isExplored, setIsExplored] = useState(false);
    const navigate = useNavigate();

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
                
                const rotateX = (mouse.y - 0.5) * 5;
                const rotateY = (mouse.x - 0.5) * 5;
                
                gsap.set(row, {
                    x: state.x,
                    y: state.y,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    overwrite: 'auto'
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
            navigate('/dashboard');
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
                <div className="content-inner w-full h-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex flex-col justify-center text-center">
                    <div className="flex justify-center gap-2 mb-6 md:mb-8 shrink-0 mt-4">
                        {steps.map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-12 h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'bg-foreground' : 'bg-foreground/20'}`}
                            />
                        ))}
                    </div>

                    <div className="relative overflow-hidden flex-1 w-full max-w-md mx-auto flex flex-col justify-center min-h-0 pb-4 md:pb-8">
                        <AnimatePresence mode="wait">
                                <motion.div 
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="step-content bg-white/60 dark:bg-black/60 backdrop-blur-lg border border-white/50 dark:border-white/10 rounded-[2rem] p-5 sm:p-6 md:p-10 shadow-sm relative flex flex-col w-full h-fit max-h-full overflow-y-auto no-scrollbar"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 pointer-events-none" />
                                
                                <div className="relative z-10 shrink-0 mb-4 md:mb-6">
                                    <motion.h2 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.05 }}
                                        className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-2 md:mb-4 tracking-tight"
                                    >
                                        {steps[currentStep].title}
                                    </motion.h2>
                                    
                                    <motion.p 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-sm sm:text-base md:text-xl text-muted-foreground leading-snug md:leading-relaxed max-w-2xl mx-auto"
                                    >
                                        {steps[currentStep].description}
                                    </motion.p>
                                </div>
                                
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                    className="grid grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-8 relative z-10 shrink-0"
                                >
                                    {steps[currentStep].stats.map((stat, i) => (
                                        <div key={i} className="stat bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl p-3 md:p-6 shadow-[var(--gentle-shadow)] flex flex-col items-center justify-center text-center">
                                            <span className="block text-xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 leading-none mb-1">{stat.value}</span>
                                            <span className="text-[9px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest block">{stat.label}</span>
                                        </div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative z-10 mt-auto shrink-0 pt-2"
                                >
                                    <button 
                                        className="w-full bg-primary text-primary-foreground py-3.5 md:py-4 rounded-full font-bold shadow-xl shadow-primary/20 text-sm md:text-base tracking-widest uppercase transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                                        onClick={nextStep}
                                    >
                                        {steps[currentStep].button}
                                    </button>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroGridMotion;
