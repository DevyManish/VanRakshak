"use client"
import Link from "next/link"
import { ArrowLeft, Bell, Settings, HelpCircle, LogOut, Camera, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"

export default function ProfilePage() {
    const { user, logout } = useAuth();


    const getName = (name) => {
        const namePart = name.split(" ");
        console.log(namePart);
        const firstName = namePart[0];
        const lastName = namePart[1];
        return firstName + " " + lastName;
    };

    const userName = user?.name ? getName(user.name) : "User Name";

    const nameShorter = (name) => {
        const namePart = name.split(" ");
        const firstChar = namePart[0]?.charAt(0).toUpperCase() || "";
        const lastChar = namePart[1]?.charAt(0).toUpperCase() || "";
        return firstChar + lastChar;
    };

    const shortName = user?.name ? nameShorter(user.name) : "";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-green-600 text-white p-4">
                <div className="container mx-auto flex items-center">
                    <Link href="/">
                        <ArrowLeft className="w-6 h-6 mr-4 cursor-pointer" />
                    </Link>
                    <h1 className="text-xl md:text-2xl font-semibold">My Profile</h1>
                </div>
            </div>

            <div className="container mx-auto p-4 max-w-2xl">
                <Card>
                    <CardContent className="p-6">
                        {/* Profile Header */}
                        <div className="text-center mb-8">
                            <div className="relative inline-block mb-4">
                                <Avatar className="w-32 h-32 mx-auto">
                                    <AvatarImage src="/images/tiger.png" alt="Profile" />
                                    <AvatarFallback>{shortName}</AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-600 hover:bg-green-700"
                                >
                                    <Camera className="w-4 h-4" />
                                </Button>
                            </div>

                            <h2 className="text-2xl font-bold mb-2">{userName}</h2>
                            <p className="text-gray-600 mb-6">Forest Guardian</p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-green-600">23</div>
                                    <div className="text-sm text-gray-600">Reports</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-600">15</div>
                                    <div className="text-sm text-gray-600">Trees Planted</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-600">450</div>
                                    <div className="text-sm text-gray-600">Points</div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                            <button className="w-full flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-green-600 mr-4" />
                                <span className="flex-1 text-left">Notifications</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>

                            <button className="w-full flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <Settings className="w-5 h-5 text-green-600 mr-4" />
                                <span className="flex-1 text-left">Settings</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>

                            <button className="w-full flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <HelpCircle className="w-5 h-5 text-green-600 mr-4" />
                                <span className="flex-1 text-left">Help & Support</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>

                            <button className="w-full flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <LogOut className="w-5 h-5 text-red-500 mr-4" />
                                <span className="flex-1 text-left text-red-500">Logout</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
