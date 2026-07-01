import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, Copy, Check, ArrowRightLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const LANGUAGES = [
  "Auto-Detect",
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Portuguese (Brazil)",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Japanese",
  "Korean",
  "Indonesian",
  "Arabic",
  "Russian",
  "Dutch",
  "Turkish",
  "Polish",
  "Ukrainian",
  "Swedish",
  "Danish",
  "Norwegian",
  "Finnish",
  "Czech",
  "Greek",
  "Romanian",
  "Hungarian",
  "Bulgarian",
];

const Translator = () => {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [sourceLang, setSourceLang] = useState("Auto-Detect");
  const [targetLang, setTargetLang] = useState("English");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    if (!source.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: {
          text: source,
          sourceLang: sourceLang === "Auto-Detect" ? "auto" : sourceLang,
          targetLang,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setTarget((data as any).translation ?? "");
    } catch (e) {
      toast({
        title: "Translation failed",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    if (sourceLang === "Auto-Detect") return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSource(target);
    setTarget(source);
  };

  const copy = async () => {
    if (!target) return;
    await navigator.clipboard.writeText(target);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-hero shadow-soft">
          <Languages className="h-5 w-5 text-primary-foreground" />
        </span>
        <div>
          <h1 className="text-3xl font-bold">Translator</h1>
          <p className="text-muted-foreground">
            Powered by DeepL for high-quality translations.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter text to translate..."
              className="min-h-[260px] resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {source.length} chars
              </span>
              <Button onClick={translate} disabled={loading || !source.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Translating
                  </>
                ) : (
                  "Translate"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={swap}
                title="Swap languages"
                className="shrink-0"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
              <Select
                value={targetLang}
                onValueChange={setTargetLang}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.filter((l) => l !== "Auto-Detect").map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={target}
              readOnly
              placeholder="Translation will appear here..."
              className="min-h-[260px] resize-none bg-muted/40"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {target.length} chars
              </span>
              <Button variant="outline" onClick={copy} disabled={!target}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Translator;
