"use client";
import * as React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import Link from "next/link";

export function SearchBar() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <button
                className="ml-2 rounded p-2"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center">
                    <Search size={20} />
                    <div className="mt-1 ml-1">Search</div>
                </div>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <Link href="https://dakseva.vercel.app/services/chat"><CommandItem>Get App </CommandItem></Link>
                        <Link href="https://dakseva.vercel.app/services/info#POS"><CommandItem>Download Reports</CommandItem></Link>
                        <CommandItem>Carbon Footprint Calculator</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}