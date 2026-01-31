"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowLeft, BookOpen, User, GitBranch } from "lucide-react";
import Image from "next/image";

export default function DocumentationPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Navbar - Consistent with Other Pages */}
            <header className="px-6 h-16 flex items-center justify-between border-b bg-card">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <Logo className="h-6 w-6 text-primary" />
                    <span>Acu</span>
                </Link>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/tool" className="text-muted-foreground hover:text-foreground transition-colors">
                        Tool
                    </Link>
                    <Link href="/documentation" className="text-primary font-semibold">
                        Documentation
                    </Link>
                    <Link href="https://github.com/SiningChen7/Acu-app" className="text-muted-foreground hover:text-foreground hidden sm:block">
                        GitHub
                    </Link>
                </div>
            </header>

            <main className="flex-1 container max-w-4xl mx-auto py-12 px-6">
                <div className="space-y-12">

                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight">Documentation & Progress</h1>
                        <p className="text-lg text-muted-foreground">
                            Development roadmap, changelog, and background story.
                        </p>
                    </div>

                    {/* Progress Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <GitBranch className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold">Progress Log</h2>
                        </div>
                        <div className="bg-card border rounded-lg p-6 space-y-6">
                            <div className="relative border-l-2 border-muted pl-6 space-y-8">
                                <div className="relative">
                                    <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                                    <h3 className="font-semibold text-lg">v2.0 - The "Sharpen" Update</h3>
                                    <p className="text-sm text-muted-foreground mb-2">January 2026</p>
                                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                                        <li><strong>OpenRouter Integration</strong>: Prioritized free/low-cost models (DeepSeek, GLM, etc.).</li>
                                        <li><strong>UI Overhaul</strong>: Implemented vibrant "Sharp Blue" & Gold theme.</li>
                                        <li><strong>Optimization Core</strong>: Refined system prompts for professional, strategic output.</li>
                                        <li><strong>History</strong>: Added persistence, delete capability, and improved recall.</li>
                                        <li><strong>Models</strong>: Support for Claude, GPT-4, and Gemini with specific strategies.</li>
                                    </ul>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-muted" />
                                    <h3 className="font-semibold text-lg">v1.0 - Initial Release</h3>
                                    <p className="text-sm text-muted-foreground mb-2">Late 2025</p>
                                    <p className="text-sm text-muted-foreground">
                                        Basic prompt rewriting engine using Vercel AI SDK.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <User className="h-5 w-5 text-secondary" />
                            <h2 className="text-2xl font-bold">Developer</h2>
                        </div>
                        <div className="bg-secondary/10 border-l-4 border-secondary p-6 rounded-r-lg flex items-center gap-6">
                            <div className="relative h-32 w-32 flex-shrink-0 rounded-full overflow-hidden border-4 border-background shadow-sm bg-muted">
                                <Image src="/images/me2.jpg" alt="Sining Chen" fill className="object-cover object-top" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Sining Chen</h3>
                                <div className="mt-1">
                                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-background rounded-full border">Lead Developer</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
