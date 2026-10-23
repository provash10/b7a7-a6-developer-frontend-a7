"use client";

import {
  AlertTriangle,
  Check,
  Copy,
  KeyRound,
  Lock,
  RefreshCw,
  Save,
  Server,
  Settings,
  Shield,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export function SystemSettingsCard() {
  // console.log("system settings card component rendered");

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [antiCheatLevel, setAntiCheatLevel] = useState<
    "RELAXED" | "STANDARD" | "PARANOID"
  >("STANDARD");
  const [sandboxTimeout, setSandboxTimeout] = useState<number>(25);
  const [maxConcurrency, setMaxConcurrency] = useState<number>(64);
  const [webhookUrl, setWebhookUrl] = useState(
    "https://api.devassess.io/webhooks/security-audit",
  );
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const apiKeySample = "dva_live_9f81a7b8c2e44d3290f61208";

  const handleCopyApiKey = () => {
    // console.log("copying api key to clipboard");
    navigator.clipboard.writeText(apiKeySample);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    toast.add({
      title: "API Key Copied",
      description: "Secret system key copied to clipboard.",
      type: "info",
    });
  };

  const handleSaveSettings = () => {
    // console.log("saving system configuration settings");

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.add({
        title: "Settings Saved",
        description: "Global system configuration successfully updated.",
        type: "success",
      });
    }, 800);
  };

  const handleResetDefaults = () => {
    // console.log("resetting settings to default values");
    setMaintenanceMode(false);
    setAntiCheatLevel("STANDARD");
    setSandboxTimeout(20);
    setMaxConcurrency(50);
    setWebhookUrl("https://api.devassess.io/webhooks/security-audit");
    setEmailAlerts(true);
    toast.add({
      title: "Reset Applied",
      description: "Configuration restored to platform defaults.",
      type: "info",
    });
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Settings className="size-4 text-primary" />
              <span>platform system & execution configuration</span>
              <Badge variant="outline" className="text-[10px] font-mono">
                kernel v3.2
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              tune code evaluation sandbox limits, anti-cheat detection
              thresholds, and global infrastructure safeguards.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="h-8 gap-1.5 text-xs"
            >
              <RefreshCw className="size-3.5" />
              <span>defaults</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Save className="size-3.5" />
              <span>{isSaving ? "saving..." : "save changes"}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* maintenance mode alert toggle */}
        <div
          className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
            maintenanceMode
              ? "bg-amber-500/10 border-amber-500/40"
              : "bg-background/60 border-border/60"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
                maintenanceMode
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <AlertTriangle className="size-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-foreground">
                  emergency maintenance mode
                </h4>
                {maintenanceMode && (
                  <Badge
                    variant="destructive"
                    className="text-[9px] py-0 px-1 font-mono uppercase"
                  >
                    active
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                when enabled, public assessment submissions are paused and
                candidates see a scheduled maintenance notice.
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            variant={maintenanceMode ? "destructive" : "outline"}
            onClick={() => setMaintenanceMode((prev) => !prev)}
            className="h-8 text-xs shrink-0 self-start sm:self-center"
          >
            {maintenanceMode ? "disable maintenance" : "enable maintenance"}
          </Button>
        </div>

        {/* grid for sandbox and anti-cheat settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* anti-cheat enforcement */}
          <div className="p-4 rounded-xl border border-border/60 bg-background/60 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs border-b border-border/40 pb-2">
              <Shield className="size-4 text-primary" />
              <span>anti-cheat sensitivity level</span>
            </div>

            <p className="text-xs text-muted-foreground">
              defines algorithm thresholds for tab switches, dual-monitor
              heuristics, audio anomaly analysis, and clipboard inspections.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {(["RELAXED", "STANDARD", "PARANOID"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setAntiCheatLevel(lvl)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    antiCheatLevel === lvl
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-card hover:border-border text-muted-foreground"
                  }`}
                >
                  <div className="text-xs font-bold font-mono lowercase">
                    {lvl}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {lvl === "RELAXED"
                      ? "high tolerance"
                      : lvl === "STANDARD"
                        ? "balanced flags"
                        : "zero tolerance"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* sandbox execution quotas */}
          <div className="p-4 rounded-xl border border-border/60 bg-background/60 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs border-b border-border/40 pb-2">
              <Server className="size-4 text-emerald-500" />
              <span>sandbox limits & concurrency</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    per-test execution timeout
                  </span>
                  <span className="font-mono text-primary font-semibold">
                    {sandboxTimeout}s
                  </span>
                </div>
                <Input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={sandboxTimeout}
                  onChange={(e) => setSandboxTimeout(Number(e.target.value))}
                  className="h-2 cursor-pointer p-0 bg-muted"
                />
                <span className="text-[10px] text-muted-foreground block">
                  terminates runaway infinite loops or oom memory spikes.
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    max concurrent container pods
                  </span>
                  <span className="font-mono text-emerald-500 font-semibold">
                    {maxConcurrency} workers
                  </span>
                </div>
                <Input
                  type="range"
                  min="16"
                  max="128"
                  step="8"
                  value={maxConcurrency}
                  onChange={(e) => setMaxConcurrency(Number(e.target.value))}
                  className="h-2 cursor-pointer p-0 bg-muted"
                />
                <span className="text-[10px] text-muted-foreground block">
                  limits maximum isolated docker containers executing code
                  simultaneously.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* security webhook & system api keys */}
        <div className="p-4 rounded-xl border border-border/60 bg-background/60 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-xs border-b border-border/40 pb-2">
            <KeyRound className="size-4 text-purple-500" />
            <span>integrations & security dispatch</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* webhook endpoint */}
            <div className="space-y-1.5">
              <label
                htmlFor="webhook-input"
                className="text-xs font-medium text-foreground block"
              >
                audit log webhook url
              </label>
              <Input
                id="webhook-input"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-domain.com/webhook"
                className="h-8 text-xs font-mono"
              />
              <span className="text-[10px] text-muted-foreground block">
                all severity critical logs are instantaneously posted via json
                payload.
              </span>
            </div>

            {/* api secret key */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-foreground block">
                primary master api key
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-8 px-2.5 rounded-md border border-border bg-muted/50 font-mono text-xs flex items-center justify-between select-all text-muted-foreground">
                  <span>{apiKeySample.slice(0, 8)}••••••••••••••••</span>
                  <Lock className="size-3 text-muted-foreground/60" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyApiKey}
                  className="h-8 px-3 text-xs gap-1"
                >
                  {copiedKey ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  <span>{copiedKey ? "copied" : "copy"}</span>
                </Button>
              </div>
              <span className="text-[10px] text-muted-foreground block">
                used for system-to-system automated grading pipelines.
              </span>
            </div>
          </div>

          {/* notification preference toggle */}
          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              <span className="text-xs font-medium text-foreground">
                dispatch critical incident emails to platform administrators
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEmailAlerts((prev) => !prev)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                emailAlerts ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`size-3.5 bg-background rounded-full absolute top-0.75 transition-transform ${
                  emailAlerts ? "left-5.5" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
