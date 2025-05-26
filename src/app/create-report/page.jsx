"use client"

import Link from "next/link"
import { ArrowLeft, Camera, MapPin, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CreateReportPage() {
    const router = useRouter()
    const [incidentType, setIncidentType] = useState("")
    const [severity, setSeverity] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState(null)
    const [locationLoading, setLocationLoading] = useState(true)
    const [uploadedImage, setUploadedImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [token, setToken] = useState(null)

    // Get token from localStorage on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
            setToken(storedToken)
        }
    }, [])

    // Get user location on component mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords

                    // Reverse geocoding to get address
                    try {
                        const response = await fetch(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        )
                        const data = await response.json()
                        setLocation({
                            lat: latitude,
                            lng: longitude,
                            address: data.locality || data.city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                        })
                    } catch (error) {
                        setLocation({
                            lat: latitude,
                            lng: longitude,
                            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                        })
                    }
                    setLocationLoading(false)
                },
                (error) => {
                    console.error("Error getting location:", error)
                    setLocation({
                        lat: 0,
                        lng: 0,
                        address: "Location unavailable"
                    })
                    setLocationLoading(false)
                }
            )
        } else {
            setLocation({
                lat: 0,
                lng: 0,
                address: "Geolocation not supported"
            })
            setLocationLoading(false)
        }
    }, [])

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("http://localhost:8000/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const data = await response.json()
            setUploadedImage({ url: data.url, file })
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Failed to upload image. Please try again.")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async () => {
        if (!incidentType || !severity || !description) {
            alert("Please fill in all required fields")
            return
        }

        if (!token) {
            alert("You need to be logged in to submit a report")
            router.push("/login")
            return
        }

        setSubmitting(true)
        try {
            const reportData = {
                content: description,
                imageUrl: uploadedImage?.url || "",
                incidentType,
                severity,
                location: location
                    ? {
                        latitude: location.lat,
                        longitude: location.lng,
                        address: location.address
                    }
                    : null
            }

            const response = await fetch("http://localhost:8000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(reportData)
            })

            if (!response.ok) {
                throw new Error("Failed to submit report")
            }

            alert("Report submitted successfully!")
            router.push("app/incidents")
        } catch (error) {
            console.error("Error submitting report:", error)
            alert("Failed to submit report. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const removeImage = () => {
        setUploadedImage(null)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-green-600 text-white p-4">
                <div className="container mx-auto flex items-center">
                    <Link href="/incidents">
                        <ArrowLeft className="w-6 h-6 mr-4 cursor-pointer" />
                    </Link>
                    <h1 className="text-xl md:text-2xl font-semibold">Create Report</h1>
                </div>
            </div>

            <div className="container mx-auto p-4 max-w-2xl">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        {/* Incident Type */}
                        <div className="space-y-2">
                            <Label htmlFor="incident-type">Incident Type *</Label>
                            <Select value={incidentType} onValueChange={setIncidentType}>
                                <SelectTrigger id="incident-type">
                                    <SelectValue placeholder="Incident Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wildlife-sighting">Wildlife Sighting</SelectItem>
                                    <SelectItem value="human-wildlife-conflict">Human-Wildlife Conflict</SelectItem>
                                    <SelectItem value="poaching">Poaching Activity</SelectItem>
                                    <SelectItem value="forest-fire">Forest Fire</SelectItem>
                                    <SelectItem value="illegal-logging">Illegal Logging</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Severity */}
                        <div className="space-y-2">
                            <Label htmlFor="severity">Severity *</Label>
                            <Select value={severity} onValueChange={setSeverity}>
                                <SelectTrigger id="severity">
                                    <SelectValue placeholder="Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the incident in detail..."
                                className="min-h-32 resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
                                <MapPin className="w-4 h-4" />
                                {locationLoading ? (
                                    <span className="flex items-center">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Getting location...
                                    </span>
                                ) : (
                                    <span>{location?.address || "Location unavailable"}</span>
                                )}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Photo</Label>
                            {uploadedImage ? (
                                <div className="relative">
                                    <Image
                                        src={uploadedImage.url || "/placeholder.svg"}
                                        alt="Uploaded image"
                                        width={400}
                                        height={300}
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="absolute top-2 right-2 w-8 h-8"
                                        onClick={removeImage}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                        disabled={uploading || !token}
                                    />
                                    <label htmlFor="image-upload">
                                        <Button
                                            type="button"
                                            className="w-full bg-green-600 hover:bg-green-700 h-12"
                                            disabled={uploading || !token}
                                            asChild
                                        >
                                            <span>
                                                {uploading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : !token ? (
                                                    "Please login to upload images"
                                                ) : (
                                                    <>
                                                        <Camera className="w-5 h-5 mr-2" />
                                                        Add Photo
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 h-12"
                            onClick={handleSubmit}
                            disabled={submitting || !incidentType || !severity || !description || !token}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Submitting Report...
                                </>
                            ) : !token ? (
                                "Please login to submit reports"
                            ) : (
                                "Submit Report"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}