"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LandingPage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">

            {/* Navbar */}
            <header className="px-6 h-16 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <Logo className="h-6 w-6 text-primary animate-pulse" />
                    <span>Acu</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/tool" className="text-muted-foreground hover:text-foreground">
                        Tool
                    </Link>
                    <Link href="/documentation" className="text-muted-foreground hover:text-foreground">
                        Documentation
                    </Link>
                    <Link href="https://github.com/SiningChen7/Acu-app" className="text-muted-foreground hover:text-foreground hidden sm:block">
                        GitHub
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <main className="flex-1 flex flex-col justify-center">
                <div className="container px-4 md:px-6 mx-auto py-24 md:py-32">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col items-center text-center space-y-8"
                    >
                        <motion.div variants={item} className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary/10 text-secondary-foreground border-secondary/20">
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            <span>v2.0 Now Available with OpenRouter</span>
                        </motion.div>

                        <div className="relative inline-block my-12">
                            <motion.h1 variants={item} className="relative z-20 text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-indigo-600 pb-2">
                                Acu
                            </motion.h1>

                            {/* Photo 1: Cat (Top Left) */}
                            <motion.div
                                className="absolute -top-16 -left-24 md:-left-32 h-24 w-24 md:h-32 md:w-32 rotate-[-12deg] border-4 border-white shadow-xl rounded-sm overflow-hidden bg-muted z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Image src="/images/cat1.jpg" alt="Decoration" fill className="object-cover" />
                            </motion.div>

                            {/* Photo 2: Me (Bottom Right) */}
                            <motion.div
                                className="absolute -bottom-8 -right-24 md:-right-32 h-24 w-24 md:h-32 md:w-32 rotate-[12deg] border-4 border-white shadow-xl rounded-sm overflow-hidden bg-muted z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Image src="/images/me.jpg" alt="Decoration" fill className="object-cover" />
                            </motion.div>
                        </div>

                        <motion.p variants={item} className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Optimizations for Claude, GPT-4, Gemini, and more.
                        </motion.p>



                        {/* CTA Removed */}
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="grid gap-8 sm:grid-cols-3 mt-24"
                    >
                        <div className="flex flex-col items-center space-y-2 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-3 bg-primary/10 rounded-full text-primary mb-2">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Privacy First</h3>
                            <p className="text-muted-foreground text-center text-sm">Your keys are stored locally. We never track your personal API usage.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-3 bg-secondary/10 text-secondary-foreground rounded-full mb-2">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Free & Fast</h3>
                            <p className="text-muted-foreground text-center text-sm">Use OpenRouter's free tier or your own keys. Optimized for speed and quality.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-full mb-2">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Model Agnostic</h3>
                            <p className="text-muted-foreground text-center text-sm">Optimizations for Claude, GPT-4, Gemini, and more.</p>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer is handled in layout.tsx */}
        </div>
    );
}
