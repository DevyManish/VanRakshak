"use client"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    Heart,
    MessageSquare,
    User,
    AlertTriangle,
    Send,
    MapPin,
    Calendar,
    Target,
    Phone,
    Mail,
    BadgeIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

export default function IncidentsPage() {
    const [activeTab, setActiveTab] = useState("incidents")
    const [posts, setPosts] = useState([])
    const [fundraisers, setFundraisers] = useState([])
    const [rangers, setRangers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [commentTexts, setCommentTexts] = useState({})

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`)
                if (!response.ok) {
                    throw new Error("Failed to fetch posts")
                }
                const data = await response.json()
                setPosts(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        const fetchFundraisers = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/fundraisers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch fundraisers")
                }
                const data = await response.json()
                setFundraisers(data.fundraisers)
            } catch (err) {
                console.error("Error fetching fundraisers:", err)
            }
        }

        const fetchRangers = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rangers/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch rangers")
                }
                const data = await response.json()
                setRangers(data.rangers)
            } catch (err) {
                console.error("Error fetching rangers:", err)
            }
        }

        fetchPosts()
        fetchFundraisers()
        fetchRangers()
    }, [])

    const handleLike = async (postId) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${postId}/like`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.postId === postId ? { ...post, likes: [...post.likes, { userId: "current-user" }] } : post,
                    ),
                )
            }
        } catch (err) {
            console.error("Error liking post:", err)
        }
    }

    const handleComment = async (postId) => {
        const commentText = commentTexts[postId]
        if (!commentText?.trim()) return

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: commentText,
                }),
            })

            if (response.ok) {
                // Update the posts state to reflect the new comment
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.postId === postId
                            ? { ...post, comments: [...post.comments, { text: commentText, userId: "current-user" }] }
                            : post,
                    ),
                )
                // Clear the comment input
                setCommentTexts((prev) => ({ ...prev, [postId]: "" }))
            }
        } catch (err) {
            console.error("Error commenting on post:", err)
        }
    }

    const handleCommentChange = (postId, text) => {
        setCommentTexts((prev) => ({ ...prev, [postId]: text }))
    }

    if (loading && activeTab === "incidents") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div>Loading posts...</div>
            </div>
        )
    }

    if (error && activeTab === "incidents") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-500">Error: {error}</div>
            </div>
        )
    }

    const renderIncidents = () => (
        <div className="container mx-auto p-4 max-w-2xl">
            {posts.map((post) => {
                const postDate = new Date(post.createdAt._seconds * 1000)
                const timeAgo = formatDistanceToNow(postDate, { addSuffix: true })
                const initials = post.authorName
                    ? post.authorName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                    : ""

                return (
                    <Card key={post.postId} className="mb-6">
                        <CardHeader className="pb-2">
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{post.authorName}</h3>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <span className="mr-1">📍</span> Location not specified
                                    </p>
                                </div>
                                <Badge variant="destructive" className="ml-auto">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Urgent
                                </Badge>
                            </div>
                        </CardHeader>

                        {post.imageUrl && (
                            <CardContent className="p-0">
                                <Image
                                    src={post.imageUrl || "/placeholder.svg"}
                                    alt={post.content}
                                    width={600}
                                    height={400}
                                    className="w-full h-64 md:h-80 object-cover"
                                />
                            </CardContent>
                        )}

                        <CardFooter className="flex flex-col space-y-4">
                            <div className="w-full">
                                <p className="text-gray-800 mb-2">{post.content}</p>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handleLike(post.postId)}
                                            className="flex items-center space-x-1 text-red-500 hover:text-red-600"
                                        >
                                            <Heart className="w-5 h-5" />
                                            <span>{post.likes.length}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 text-gray-600">
                                            <MessageSquare className="w-5 h-5" />
                                            <span>{post.comments.length}</span>
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">{timeAgo}</span>
                                </div>

                                {/* Comment Input */}
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Add a comment..."
                                        value={commentTexts[post.postId] || ""}
                                        onChange={(e) => handleCommentChange(post.postId, e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={() => handleComment(post.postId)}
                                        size="sm"
                                        disabled={!commentTexts[post.postId]?.trim()}
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )

    const renderFundraisers = () => (
        <div className="container mx-auto p-4 max-w-2xl">
            {fundraisers.map((fundraiser) => {
                const startDate = new Date(fundraiser.startDate)
                const endDate = new Date(fundraiser.endDate)
                const progress = Number.parseFloat(fundraiser.progress)

                return (
                    <Card key={fundraiser.fundraiserId} className="mb-6">
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{fundraiser.title}</h3>
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        Ends: {endDate.toLocaleDateString()}
                                    </p>
                                </div>
                                <Badge variant={fundraiser.status === "active" ? "default" : "secondary"} className="capitalize">
                                    {fundraiser.status}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-gray-800">{fundraiser.description}</p>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Progress</span>
                                    <span className="font-medium">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-3" />
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>₹{fundraiser.currentAmount.toLocaleString()} raised</span>
                                    <span>₹{fundraiser.targetAmount.toLocaleString()} goal</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Target className="w-4 h-4 mr-2" />
                                    <span>Target: ₹{fundraiser.targetAmount.toLocaleString()}</span>
                                </div>
                                <Button className="bg-green-600 hover:bg-green-700">Donate Now</Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )

    const renderCommunity = () => (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">Community Features</h2>
                <p className="text-gray-600">Community features coming soon...</p>
            </div>
        </div>
    )

    const renderNearby = () => (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold mb-2">Nearby Forest Rangers</h2>
                <p className="text-gray-600">Connect with forest rangers in your area</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
                {rangers.map((ranger) => (
                    <Card key={ranger.userId} className="overflow-hidden w-full max-w-xs mx-auto">
                        <CardHeader className="pb-2">
                            <div className="flex items-center space-x-3">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={ranger.displayProfile || "/placeholder.svg"} />
                                    <AvatarFallback>
                                        {ranger.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{ranger.name}</h3>
                                    <p className="text-sm text-gray-600">{ranger.role}</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                                <BadgeIcon className="w-4 h-4 mr-2" />
                                <span>{ranger.badgeNumber}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{ranger.assignedArea}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                <span>{ranger.phone}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>{ranger.email}</span>
                            </div>

                            <div className="text-xs text-gray-500">
                                Location: {ranger.location.latitude.toFixed(4)}, {ranger.location.longitude.toFixed(4)}
                            </div>
                        </CardContent>

                        <CardFooter className="space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                                <Phone className="w-4 h-4 mr-1" />
                                Call
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                                <Mail className="w-4 h-4 mr-1" />
                                Email
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-green-600 text-white p-4">
                <div className="container mx-auto flex items-center">
                    <Link href="/">
                        <ArrowLeft className="w-6 h-6 mr-4 cursor-pointer" />
                    </Link>
                    <h1 className="text-xl md:text-2xl font-semibold">VanaRaksha</h1>
                    <div className="ml-auto">
                        <Link href="/profile">
                            <User className="w-6 h-6 cursor-pointer" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="container mx-auto">
                    <div className="flex space-x-8 px-4">
                        <button
                            onClick={() => setActiveTab("incidents")}
                            className={`py-4 px-2 border-b-2 font-medium ${activeTab === "incidents"
                                ? "border-green-600 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Incidents
                        </button>
                        <button
                            onClick={() => setActiveTab("fundraiser")}
                            className={`py-4 px-2 border-b-2 font-medium ${activeTab === "fundraiser"
                                ? "border-green-600 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Fundraiser
                        </button>
                        <button
                            onClick={() => setActiveTab("community")}
                            className={`py-4 px-2 border-b-2 font-medium ${activeTab === "community"
                                ? "border-green-600 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Community
                        </button>
                        <button
                            onClick={() => setActiveTab("nearby")}
                            className={`py-4 px-2 border-b-2 font-medium ${activeTab === "nearby"
                                ? "border-green-600 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Nearby
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === "incidents" && renderIncidents()}
            {activeTab === "fundraiser" && renderFundraisers()}
            {activeTab === "community" && renderCommunity()}
            {activeTab === "nearby" && renderNearby()}

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
                <Link href="/create-report">
                    <Button size="icon" className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
                        <AlertTriangle className="w-6 h-6" />
                    </Button>
                </Link>
                <Button size="icon" className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
                    <Send className="w-6 h-6" />
                </Button>
            </div>
        </div>
    )
}
