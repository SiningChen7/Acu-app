import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-auto px-6">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Copyright © 2026 Sining Chen and Acu. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <Link href="https://github.com/SiningChen7/Acu-app" target="_blank" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
