"use client";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import {
    LogOut,
    CircleUserRound,
    LayoutDashboard
} from "lucide-react";
import Link from "next/link";

const UserAvatar = () => {
    const { user, logout } = useAuth();
    // const user = "Manish Gupta";
    // const logout = () => {
    //     console.log("logout");
    // }

    //console.log(user)

    const nameShorter = (name) => {
        const namePart = name.split(" ");
        const firstChar = namePart[0]?.charAt(0).toUpperCase() || "";
        const lastChar = namePart[1]?.charAt(0).toUpperCase() || "";
        return firstChar + lastChar;
    };

    const shortName = user?.name ? nameShorter(user.name) : "";
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {" "}
                    <Avatar className="h-9 w-9 border-2 ">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>{shortName}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        {" "}
                        <button>
                            <div className="flex items-center space-x-3">
                                <CircleUserRound size={18} className="mt-1" />
                                <div className="">Profile</div>
                            </div>
                        </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {" "}
                        <Link href="/dashboard">
                            <button>
                                <div className="flex items-center space-x-3">
                                    <LayoutDashboard size={18} className="mt-1" />
                                    <div className="">Dashboard</div>
                                </div>
                            </button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <button onClick={logout}>
                            <div className="flex items-center space-x-3">
                                <LogOut size={16} className="mt-1" />
                                <div className="">Logout</div>
                            </div>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default UserAvatar;