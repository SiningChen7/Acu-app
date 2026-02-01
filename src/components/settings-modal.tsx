"use client";

import { useSettings } from "@/hooks/use-settings";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SettingsModal() {
    const { apiKeys, saveKeys } = useSettings();
    const [open, setOpen] = useState(false);
    const [localKeys, setLocalKeys] = useState(apiKeys);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        setLocalKeys(apiKeys);
    }, [apiKeys, open]);

    const handleSave = () => {
        saveKeys(localKeys);
        toast.success("Settings saved");
        setOpen(false);
    };

    const handleTestKeys = async () => {
        setTesting(true);
        try {
            const res = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-anthropic-key': localKeys.anthropic,
                    'x-openai-key': localKeys.openai,
                    'x-google-key': localKeys.google,
                    'x-openrouter-key': localKeys.openrouter,
                },
                body: JSON.stringify({
                    originalPrompt: "Hi",
                    targetModel: "Test",
                    optimizerPreference: localKeys.optimizerModel
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Connection Successful!", { description: `Optimizer valid. Response: ${data.result.substring(0, 50)}...` });
            } else {
                toast.error("Connection Failed", { description: data.error });
            }
        } catch (e) {
            toast.error("Test Request Failed");
        } finally {
            setTesting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Configuration</DialogTitle>
                    <DialogDescription>
                        Configure your AI providers. Keys stored locally.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                    <div className="space-y-2 bg-muted/30 p-3 rounded-md border">
                        <Label>Optimizer Logic</Label>
                        <Select
                            value={localKeys.optimizerModel || 'auto'}
                            onValueChange={(val) => setLocalKeys({ ...localKeys, optimizerModel: val })}
                        >
                            <SelectTrigger className="bg-white dark:bg-neutral-900 border-input">
                                <SelectValue placeholder="Select logic" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-neutral-900 border-border shadow-xl z-[100]">
                                <SelectItem value="auto">Auto (Best Paid &gt; Free)</SelectItem>
                                <SelectItem value="claude">Force Claude (Best Quality)</SelectItem>
                                <SelectItem value="openai">Force OpenAI</SelectItem>
                                <SelectItem value="gemini">Force Gemini</SelectItem>
                                <SelectItem value="openrouter">Force OpenRouter (Free Tier)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">"Auto" uses Anthropic/OpenAI/Gemini keys first. Falls back to OpenRouter free only if no paid keys.</p>
                    </div>

                    {localKeys.optimizerModel === 'openrouter' && (
                        <>
                            <div className="py-3 px-4 rounded-md bg-destructive/15 text-destructive border border-destructive/20 flex gap-2 items-start">
                                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                <div className="text-xs">
                                    <strong className="font-semibold block mb-0.5">Free Tier Warning</strong>
                                    Free models can be unstable or return "No endpoints found". We automatically retry alternatives, but paid keys are recommended for reliability.
                                </div>
                            </div>

                            <div className="space-y-2 bg-muted/30 p-3 rounded-md border">
                                <Label>Free Model Preference</Label>
                                <Select
                                    value={localKeys.freeModelPreference || 'auto'}
                                    onValueChange={(val) => setLocalKeys({ ...localKeys, freeModelPreference: val })}
                                >
                                    <SelectTrigger className="bg-white dark:bg-neutral-900 border-input">
                                        <SelectValue placeholder="Select free model" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-neutral-900 border-border shadow-xl z-[100]">
                                        <SelectItem value="auto">Auto (Try all in order)</SelectItem>
                                        <SelectItem value="arcee-ai/trinity-large-preview:free">Trinity Large Preview (Primary)</SelectItem>
                                        <SelectItem value="z.ai/glm-4.5-air:free">GLM 4.5 Air (Secondary)</SelectItem>
                                        <SelectItem value="tngtech/deepseek-r1t2-chimera:free">DeepSeek Chimera (Tertiary)</SelectItem>
                                        <SelectItem value="liquid/lfm-2.5-1.2b-instruct:free">Liquid LFM (Fast Fallback)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">"Auto" cycles through all models if one fails.</p>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            OpenRouter API Key <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Free Tier</span>
                        </Label>
                        <Input
                            type="password"
                            value={localKeys.openrouter}
                            onChange={(e) => setLocalKeys({ ...localKeys, openrouter: e.target.value })}
                            placeholder="sk-or-..."
                        />
                    </div>

                    <div className="space-y-2 border-t pt-2">
                        <Label>Anthropic API Key</Label>
                        <Input
                            type="password"
                            value={localKeys.anthropic}
                            onChange={(e) => setLocalKeys({ ...localKeys, anthropic: e.target.value })}
                            placeholder="sk-ant-..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>OpenAI API Key</Label>
                        <Input type="password" value={localKeys.openai} onChange={(e) => setLocalKeys({ ...localKeys, openai: e.target.value })} placeholder="sk-..." />
                    </div>

                    <div className="space-y-2">
                        <Label>Google Gemini API Key</Label>
                        <Input type="password" value={localKeys.google} onChange={(e) => setLocalKeys({ ...localKeys, google: e.target.value })} placeholder="AIza..." />
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <Button variant="secondary" onClick={handleTestKeys} disabled={testing}>
                        {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test Connection"}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
