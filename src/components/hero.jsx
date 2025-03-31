"use client"
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero5 = () => {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["nature", "vital", "empowering", "sustainable", "transformative"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full ">
            <div className="container mx-auto">
                <div className="flex gap-8 py-30  md:py-20 lg:py-40 items-start justify-center flex-col">
                    <div>
                        <Button variant="secondary" size="sm" className="gap-4">
                            Get started <MoveRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-left font-regular">
                            <span className="text-spektr-cyan-50">This is something</span>
                            <span className="relative flex w-full justify-center overflow-hidden text-left md:pb-4 md:pt-1">
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-semibold text-green-500"
                                        initial={{ opacity: 0, y: "-100" }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? -150 : 150,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-balance leading-relaxed tracking-tight text-muted-foreground max-w-2xl ">
                            Protecting our forests shouldn't be complicated. Report threats, track wildlife, and support conservation efforts with just a few taps. Our mission is to empower communities to safeguard natural treasures for generations to come.
                        </p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <Link href="/VanaRaksha.apk">
                            <Button size="lg" className="gap-4 bg-green-500 hover:bg-green-400">
                                <div className="flex gap-2 space-x-3">
                                    Download
                                    <Image src="/android.svg"
                                        alt="android"
                                        width="20"
                                        height="20" />
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
