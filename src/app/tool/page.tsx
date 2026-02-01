"use client";

import { useSettings, ApiKeys } from "@/hooks/use-settings";
import { useHistory } from "@/hooks/use-history";
import { SettingsModal } from "@/components/settings-modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Copy, History, Loader2, Save, Trash2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
// import ReactMarkdown from 'react-markdown'; 
// I'll assume users want rendered markdown. I will implement a basic renderer or just whitespace-pre-wrap for now.
// Actually, simple whitespace-pre-wrap is safer if I don't want to add more deps.
// But the prompt says "explanation referencing best practices", Markdown is best.
// I'll install react-markdown later or just use a simple display.
// For now, I'll display result as raw text in a textarea and explanation as whitespace-preserved text.

export default function ToolPage() {
    const { apiKeys, hasAnyKey } = useSettings();
    const { history, addToHistory, clearHistory, removeItem } = useHistory();

    const [targetModel, setTargetModel] = useState("Claude 3.5 Sonnet");
    const [originalPrompt, setOriginalPrompt] = useState("");
    const [details, setDetails] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ optimizedPrompt: string, explanation: string } | null>(null);
    const [rawOutput, setRawOutput] = useState("");

    const handleOptimize = async () => {
        if (!hasAnyKey) {
            toast.error("Please add an API Key in settings first!");
            return;
        }
        if (!originalPrompt.trim()) {
            toast.error("Please enter a prompt to optimize.");
            return;
        }

        setIsLoading(true);
        setResult(null);
        setRawOutput("");

        try {
            const res = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-anthropic-key': apiKeys.anthropic,
                    'x-openai-key': apiKeys.openai,
                    'x-google-key': apiKeys.google,
                    'x-openrouter-key': apiKeys.openrouter,
                    'x-free-model-preference': apiKeys.freeModelPreference || 'auto',
                },
                body: JSON.stringify({
                    originalPrompt,
                    targetModel,
                    additionalDetails: details,
                    optimizerPreference: apiKeys.optimizerModel
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to optimize");

            setRawOutput(data.result);

            // Simple parsing of the Markdown output logic:
            // Expected format:
            // # Optimized Prompt
            // [content]
            // # Explanation
            // [content]

            const parts = data.result.split("# Strategic Analysis");
            let opt = parts[0]?.replace("# Optimized Prompt", "").trim() || data.result;
            // Clean up markdown block markers if present
            if (opt.startsWith("\`\`\`markdown")) opt = opt.replace("\`\`\`markdown", "");
            if (opt.startsWith("\`\`\`")) opt = opt.replace("\`\`\`", "");
            if (opt.endsWith("\`\`\`")) opt = opt.slice(0, -3);

            const exp = parts[1]?.trim() || "See prompt above.";

            setResult({
                optimizedPrompt: opt.trim(),
                explanation: exp
            });

            addToHistory({
                originalPrompt,
                targetModel,
                optimizedPrompt: data.result,
            });

            toast.success("Prompt Optimized!");

        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="px-6 h-16 flex items-center justify-between border-b bg-card">
                <Link href="/" className="flex items-center font-bold text-lg gap-2">
                    <Logo className="h-6 w-6 text-primary" />
                    <span>Acu</span>
                </Link>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/tool" className="text-foreground font-semibold">Tool</Link>
                        <Link href="/documentation" className="text-muted-foreground hover:text-foreground">Documentation</Link>
                        <Link href="https://github.com/SiningChen7/Acu-app" className="text-muted-foreground hover:text-foreground">GitHub</Link>
                    </nav>
                    <SettingsModal />
                </div>
            </header>

            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 w-full">
                {/* Left Column: Input */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input</CardTitle>
                            <CardDescription>Tell us what you want to ask the AI.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Target Model</Label>
                                <Select value={targetModel} onValueChange={setTargetModel}>
                                    <SelectTrigger className="bg-white dark:bg-neutral-900 border-input">
                                        <SelectValue placeholder="Select Model" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-neutral-900 border-border shadow-xl z-[100]">
                                        <SelectItem value="Claude 3.5 Sonnet">Claude</SelectItem>
                                        <SelectItem value="GPT-4o">GPT-4</SelectItem>
                                        <SelectItem value="o1-preview">OpenAI o1</SelectItem>
                                        <SelectItem value="Gemini 2.5 Pro">Gemini</SelectItem>
                                        <SelectItem value="Grok Beta">Grok</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Your Rough Prompt</Label>
                                <Textarea
                                    placeholder="e.g. Write an email to my boss asking for a raise..."
                                    className="h-40 resize-none font-mono text-sm"
                                    value={originalPrompt}
                                    onChange={(e) => setOriginalPrompt(e.target.value)}
                                />
                            </div>

                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Additional Details (Optional)</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2 pt-2">
                                            <Label>Tone, Format, specific requirements?</Label>
                                            <Textarea
                                                placeholder="e.g. Professional tone, output as JSON..."
                                                value={details}
                                                onChange={(e) => setDetails(e.target.value)}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                        <CardFooter>
                            <Button
                                size="lg"
                                className="w-full font-semibold"
                                onClick={handleOptimize}
                                disabled={isLoading}
                            >
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sharpening...</> : <><Sparkles className="mr-2 h-4 w-4" /> Optimize Prompt</>}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* History Sidebar (Mobile: Below, Desktop: Sticky?) - Integrated as a list here for MVP simplicity */}
                    {history.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Recent Optimizations</CardTitle>
                            </CardHeader>
                            <CardContent className="max-h-[300px] overflow-y-auto space-y-3">
                                {history.length > 0 && (
                                    <div className="flex justify-between items-center pb-2">
                                        <span className="text-xs text-muted-foreground">Recent</span>
                                        <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive hover:text-destructive h-6 px-2 text-xs">
                                            Clear All
                                        </Button>
                                    </div>
                                )}
                                {history.map((item) => (
                                    <div key={item.id} className="group flex items-center gap-2">
                                        <div className="flex-1 p-3 rounded-md border text-sm hover:bg-muted cursor-pointer" onClick={() => {
                                            setOriginalPrompt(item.originalPrompt);
                                            setTargetModel(item.targetModel);
                                            const parts = item.optimizedPrompt.split("# Strategic Analysis");
                                            let opt = parts[0]?.replace("# Optimized Prompt", "").trim() || item.optimizedPrompt;
                                            // Fallback for old history items
                                            if (item.optimizedPrompt.includes("# Explanation")) {
                                                const oldParts = item.optimizedPrompt.split("# Explanation");
                                                opt = oldParts[0]?.replace("# Optimized Prompt", "").trim();
                                            }

                                            if (opt.startsWith("\`\`\`markdown")) opt = opt.replace("\`\`\`markdown", "");
                                            if (opt.startsWith("\`\`\`")) opt = opt.replace("\`\`\`", "");
                                            if (opt.endsWith("\`\`\`")) opt = opt.slice(0, -3);

                                            const exp = parts[1]?.trim() || "";
                                            setResult({ optimizedPrompt: opt.trim(), explanation: exp });
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}>
                                            <div className="font-semibold truncate">{item.targetModel.replace(" 3.5 Sonnet", "").replace(" 2.5 Pro", "")}</div>
                                            <div className="text-muted-foreground truncate">{item.originalPrompt}</div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeItem(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Output */}
                <div className="space-y-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Optimized Result</CardTitle>
                            <CardDescription>Ready to paste into {targetModel}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            {!result ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md min-h-[400px]">
                                    <p>Optimized prompt will appear here</p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative">
                                        <Label>Prompt</Label>
                                        <div className="absolute right-0 top-0">
                                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.optimizedPrompt)}>
                                                <Copy className="h-4 w-4 mr-1" /> Copy
                                            </Button>
                                        </div>
                                        <div className="mt-2 p-4 bg-muted/50 rounded-md font-mono text-sm whitespace-pre-wrap border max-h-[400px] overflow-y-auto">
                                            {result.optimizedPrompt}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Strategic Analysis</Label>
                                        <div className="text-sm text-muted-foreground bg-secondary/20 p-4 rounded-md whitespace-pre-wrap">
                                            {result.explanation}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
