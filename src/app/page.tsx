"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BellRing, Pill } from "lucide-react";

export default function Home() {
  const [medicationName, setMedicationName] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [message, setMessage] = useState<{
    type: "confirmation" | "error";
    text: string;
  } | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup the timeout when the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!medicationName || !reminderTime) {
      setMessage({ type: "error", text: "Please fill out both fields." });
      return;
    }

    const [hours, minutes] = reminderTime.split(":").map(Number);
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    if (reminderDate <= now) {
      setMessage({
        type: "error",
        text: "Please select a time in the future.",
      });
      return;
    }

    const delay = reminderDate.getTime() - now.getTime();

    timeoutRef.current = setTimeout(() => {
      alert(`Time to take your ${medicationName}!`);
    }, delay);

    const formattedTime = reminderDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setMessage({
      type: "confirmation",
      text: `Reminder set for ${medicationName} at ${formattedTime}.`,
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Pill className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">PillAlert Now</CardTitle>
          <CardDescription>
            A simple, session-only pill reminder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="medication-name" className="text-base">
                Medication Name
              </Label>
              <Input
                id="medication-name"
                placeholder="e.g., Ibuprofen"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                required
                aria-label="Medication Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-time" className="text-base">
                Time
              </Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                required
                aria-label="Reminder Time"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg">
              <BellRing className="mr-2 h-5 w-5" /> Set Reminder
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center h-8 items-center">
          {message && (
            <p
              key={message.text}
              className={`text-sm animate-in fade-in-50 duration-500 ${
                message.type === "error"
                  ? "text-destructive font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {message.text}
            </p>
          )}
        </CardFooter>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p>
          Your privacy is important. All entered data is cleared when you
          refresh or close this page.
        </p>
      </footer>
    </main>
  );
}
