import { SettingsForm } from "@/components/settings/SettingsForm";
import { placeholderSettings } from "@/lib/placeholder-data";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl">
            <div className="space-y-2">
                <h1 className="text-3xl font-headline font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage global configurations for alerts, time zones, and API usage.
                </p>
            </div>
            <SettingsForm settings={placeholderSettings} />
        </div>
    );
}
