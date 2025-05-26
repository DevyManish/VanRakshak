"use client"
import Link from "next/link"
import { ArrowLeft, Calculator, TreePine, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function CarbonFootprintPage() {
    const [country, setCountry] = useState("")
    const [distance, setDistance] = useState("")
    const [electricity, setElectricity] = useState("")
    const [meals, setMeals] = useState("")
    const [waste, setWaste] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const calculateFootprint = async () => {
        if (!country || !distance || !electricity || !meals || !waste) {
            alert("Please fill in all fields")
            return
        }

        setLoading(true)
        try {
            const response = await fetch(
                "http://localhost:8000/api/carbon-footprint",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        country,
                        distance: Number.parseFloat(distance),
                        electricity: Number.parseFloat(electricity),
                        meals: Number.parseInt(meals),
                        waste: Number.parseFloat(waste)
                    })
                }
            )

            if (!response.ok) {
                throw new Error("Failed to calculate carbon footprint")
            }

            const data = await response.json()
            setResult(data)
        } catch (error) {
            console.error("Error calculating carbon footprint:", error)
            alert("Failed to calculate carbon footprint. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const resetCalculator = () => {
        setResult(null)
        setCountry("")
        setDistance("")
        setElectricity("")
        setMeals("")
        setWaste("")
    }

    const treesToPlant = result ? Math.ceil(result.total_emissions) : 0

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-green-600 text-white p-4">
                <div className="container mx-auto flex items-center">
                    <Link href="/">
                        <ArrowLeft className="w-6 h-6 mr-4 cursor-pointer" />
                    </Link>
                    <h1 className="text-xl md:text-2xl font-semibold">
                        Carbon Footprint Calculator
                    </h1>
                </div>
            </div>

            <div className="container mx-auto p-4 max-w-4xl">
                {!result ? (
                    /* Calculator Form */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Transportation */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-green-700">
                                    <span className="mr-2">🚗</span>
                                    Transportation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Select value={country} onValueChange={setCountry}>
                                        <SelectTrigger id="country">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="India">India</SelectItem>
                                            <SelectItem value="USA">United States</SelectItem>
                                            <SelectItem value="UK">United Kingdom</SelectItem>
                                            <SelectItem value="Canada">Canada</SelectItem>
                                            <SelectItem value="Australia">Australia</SelectItem>
                                            <SelectItem value="Germany">Germany</SelectItem>
                                            <SelectItem value="France">France</SelectItem>
                                            <SelectItem value="Japan">Japan</SelectItem>
                                            <SelectItem value="China">China</SelectItem>
                                            <SelectItem value="Brazil">Brazil</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="distance">
                                        Weekly Distance Traveled (km)
                                    </Label>
                                    <Input
                                        id="distance"
                                        placeholder="e.g., 25"
                                        type="number"
                                        value={distance}
                                        onChange={e => setDistance(e.target.value)}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Include car, bus, train, and other transport
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Energy */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-green-700">
                                    <span className="mr-2">⚡</span>
                                    Home Energy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="electricity">
                                        Monthly Electricity Usage (kWh)
                                    </Label>
                                    <Input
                                        id="electricity"
                                        placeholder="e.g., 150"
                                        type="number"
                                        value={electricity}
                                        onChange={e => setElectricity(e.target.value)}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Check your electricity bill for kWh usage
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Diet */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-green-700">
                                    <span className="mr-2">🍽️</span>
                                    Diet & Food
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meals">Daily Meals</Label>
                                    <Select value={meals} onValueChange={setMeals}>
                                        <SelectTrigger id="meals">
                                            <SelectValue placeholder="Number of meals per day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 meal</SelectItem>
                                            <SelectItem value="2">2 meals</SelectItem>
                                            <SelectItem value="3">3 meals</SelectItem>
                                            <SelectItem value="4">4 meals</SelectItem>
                                            <SelectItem value="5">5+ meals</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-gray-500">
                                        Include snacks and beverages
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Waste */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-green-700">
                                    <span className="mr-2">🗑️</span>
                                    Waste Generation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="waste">Weekly Waste (kg)</Label>
                                    <Input
                                        id="waste"
                                        placeholder="e.g., 4"
                                        type="number"
                                        value={waste}
                                        onChange={e => setWaste(e.target.value)}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Estimate your household waste production
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    /* Results Display */
                    <div className="space-y-6">
                        {/* Total Emissions Card */}
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl text-green-700">
                                    Your Carbon Footprint
                                </CardTitle>
                                <div className="text-5xl font-bold text-green-600 mt-4">
                                    {result.total_emissions.toFixed(2)}{" "}
                                    <span className="text-2xl">kg CO₂</span>
                                </div>
                                <p className="text-gray-600 mt-2">Total weekly emissions</p>
                            </CardHeader>
                        </Card>

                        {/* Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="text-2xl mb-2">🚗</div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {result.transportation_emissions.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600">Transportation</div>
                                    <div className="text-xs text-gray-500">kg CO₂</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="text-2xl mb-2">⚡</div>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {result.energy_emissions.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600">Energy</div>
                                    <div className="text-xs text-gray-500">kg CO₂</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="text-2xl mb-2">🍽️</div>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {result.food_emissions.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600">Food</div>
                                    <div className="text-xs text-gray-500">kg CO₂</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="text-2xl mb-2">🗑️</div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {result.waste_emissions.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600">Waste</div>
                                    <div className="text-xs text-gray-500">kg CO₂</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tree Planting Recommendation */}
                        <Card className="border-green-300 bg-gradient-to-r from-green-100 to-green-200">
                            <CardContent className="p-8 text-center">
                                <TreePine className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-green-800 mb-2">
                                    Become Carbon Neutral!
                                </h3>
                                <p className="text-lg text-green-700 mb-4">
                                    You need to plant{" "}
                                    <span className="font-bold text-2xl">{treesToPlant}</span> big
                                    trees to offset your weekly carbon footprint
                                </p>
                                <p className="text-sm text-green-600">
                                    Each mature tree absorbs approximately 1 kg of CO₂ per week
                                </p>
                                <div className="flex justify-center mt-6 space-x-4">
                                    <Button className="bg-green-600 hover:bg-green-700">
                                        Plant Trees Now
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-green-600 text-green-600 hover:bg-green-50"
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    {!result ? (
                        <Button
                            onClick={calculateFootprint}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 h-12 px-8"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Calculating...
                                </>
                            ) : (
                                <>
                                    <Calculator className="w-5 h-5 mr-2" />
                                    Calculate Carbon Footprint
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={resetCalculator}
                            className="bg-green-600 hover:bg-green-700 h-12 px-8"
                        >
                            Calculate Again
                        </Button>
                    )}
                </div>

                {/* Tips Section */}
                {!result && (
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="text-green-700">
                                💡 Tips for Accurate Calculation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>
                                    • Include all forms of transportation: car, bus, train,
                                    flights
                                </li>
                                <li>• Check your electricity bill for accurate kWh usage</li>
                                <li>
                                    • Consider your diet type: vegetarian diets typically have
                                    lower emissions
                                </li>
                                <li>
                                    • Estimate waste including food waste, packaging, and
                                    recyclables
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
