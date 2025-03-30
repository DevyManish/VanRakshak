"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be valid"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  assignedArea: z.string().min(2, "Assigned area is required"),
  badgeNumber: z.string().min(2, "Badge number is required"),
  displayProfile: z.string().url("Must be a valid URL").optional(),
})

// API Functions
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token") || ""
  }
  return ""
}
const token = getAuthToken();

async function getRangers() {


  if (!token) {
    throw new Error("Authentication token is missing")
  }

  const response = await fetch("https://api-7fy6reml3q-uc.a.run.app/api/rangers", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch rangers: ${response.statusText}`)
  }

  const data = await response.json()

  // Return the rangers array from the response
  return data.rangers || []
}

async function addRanger(data) {
  const response = await fetch("https://api-7fy6reml3q-uc.a.run.app/api/auth/rangers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(`Failed to add ranger: ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ""}`)
  }

  return response.json()
}

// Helper function to get initials from name
function getInitials(name) {
  if (!name) return "??"
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Rangers Table Component
function RangersTable({ rangers, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Badge Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Assigned Area</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[180px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Ensure rangers is always an array
  const safeRangers = Array.isArray(rangers) ? rangers : []

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Badge Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Assigned Area</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeRangers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No rangers found.
              </TableCell>
            </TableRow>
          ) : (
            safeRangers.map((ranger) => (
              <TableRow key={ranger.id || ranger.badgeNumber}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={ranger.displayProfile} alt={ranger.name} />
                    <AvatarFallback>{getInitials(ranger.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{ranger.name}</TableCell>
                <TableCell>{ranger.badgeNumber}</TableCell>
                <TableCell>{ranger.email}</TableCell>
                <TableCell>{ranger.phone}</TableCell>
                <TableCell>{ranger.assignedArea}</TableCell>
                <TableCell>
                  {ranger.location
                    ? `${ranger.location.latitude?.toFixed(4) || 0}, ${ranger.location.longitude?.toFixed(4) || 0}`
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Add Ranger Dialog Component
function AddRangerDialog({ open, onOpenChange, onRangerAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      latitude: 0,
      longitude: 0,
      assignedArea: "",
      badgeNumber: "",
      displayProfile: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)

      // Transform the data to match the API structure
      const rangerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        assignedArea: data.assignedArea,
        badgeNumber: data.badgeNumber,
        displayProfile: data.displayProfile || "https://storage.com/rangers/default.jpg",
      }

      await addRanger(rangerData)
      form.reset()
      onRangerAdded()
    } catch (error) {
      console.error("Failed to add ranger:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Ranger</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ranger Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="badgeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge Number</FormLabel>
                    <FormControl>
                      <Input placeholder="RNGR2023-XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ranger@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+919876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Area</FormLabel>
                  <FormControl>
                    <Input placeholder="Western Ghats Sector 4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" placeholder="12.9716" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" placeholder="77.5946" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="displayProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://storage.com/rangers/profile.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-500 hover:bg-green-300">
                {isSubmitting ? "Adding..." : "Add Ranger"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// Main Page Component
export default function RangersPage() {
  const [rangers, setRangers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchRangers()
  }, [])

  const fetchRangers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getRangers()
      setRangers(data || []) // Ensure we always set an array
    } catch (error) {
      console.error("Failed to fetch rangers:", error)
      setError(error.message)
      setRangers([]) // Reset to empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleRangerAdded = () => {
    fetchRangers()
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-20 px-20 items-center justify-center mt-10">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Forest Rangers</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-green-500 hover:bg-green-300">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Ranger
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500 p-4 border rounded">
              Error loading rangers: {error}
              <Button variant="outline" className="ml-4" onClick={fetchRangers}>
                Retry
              </Button>
            </div>
          ) : (
            <RangersTable rangers={rangers} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>

      <AddRangerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onRangerAdded={handleRangerAdded} />
    </div>
  )
}