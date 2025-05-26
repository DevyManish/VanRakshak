import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TreePine, FileText, User, Footprints, AlertTriangle } from "lucide-react"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
            <div className="container mx-auto px-4 py-20 mt-10 items-center">

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <Link href="app/incidents">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="text-center">
                                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                                <CardTitle className="text-green-700">Incidents</CardTitle>
                                <CardDescription>View and report wildlife incidents in your area</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-green-600 hover:bg-green-700">View Incidents</Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/create-report">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="text-center">
                                <FileText className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                <CardTitle className="text-green-700">Create Report</CardTitle>
                                <CardDescription>Report new incidents or wildlife sightings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-green-600 hover:bg-green-700">Create Report</Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="app/carbon-footprint">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="text-center">
                                <Footprints className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                                <CardTitle className="text-green-700">Carbon Footprint</CardTitle>
                                <CardDescription>Track and reduce your environmental impact</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-green-600 hover:bg-green-700">Track Footprint</Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="app/profile">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="text-center">
                                <User className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                                <CardTitle className="text-green-700">My Profile</CardTitle>
                                <CardDescription>View your stats and manage account settings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-green-600 hover:bg-green-700">View Profile</Button>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="mt-16 text-center">
                    <div className="max-w-4xl mx-auto">
                        <TreePine className="w-24 h-24 text-green-600 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">Join the Forest Guardian Community</h2>
                        <p className="text-lg text-gray-700 mb-8">
                            Together, we can protect our forests, monitor wildlife, and create a sustainable future for generations to
                            come.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                Get Started
                            </Button>
                            <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
