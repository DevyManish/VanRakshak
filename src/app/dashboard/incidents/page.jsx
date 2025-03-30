"use client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Eye, MapPin, ImageIcon } from "lucide-react"
import Image from "next/image"

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token") || ""
  }
  return ""
}

export default function IncidentReports() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = getAuthToken()
        const response = await fetch('https://api-7fy6reml3q-uc.a.run.app/api/admin/reports', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setReports(data.reports || [])
      } catch (err) {
        setError(err.message)
        console.error('Error fetching reports:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Helper function to format timestamp
  const formatTimestamp = timestamp => {
    if (!timestamp || !timestamp._seconds) return "N/A"
    const date = new Date(timestamp._seconds * 1000)
    return date.toLocaleString()
  }

  // Helper function to get severity badge color
  const getSeverityColor = severity => {
    switch (severity) {
      case "HIGH":
        return "bg-red-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Helper function to format incident type for display
  const formatIncidentType = type => {
    if (!type) return "Unknown"
    return type.replace(/_/g, " ")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-20 items-center justify-center mt-20">
        <Card>
          <CardHeader>
            <CardTitle>Incident Reports</CardTitle>
            <CardDescription>
              Loading reports...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 px-20 items-center justify-center mt-20">
        <Card>
          <CardHeader>
            <CardTitle>Incident Reports</CardTitle>
            <CardDescription>
              Error loading reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-20 px-20 items-center justify-center mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Incident Reports</CardTitle>
          <CardDescription>
            A list of all reported incidents in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Reported On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length > 0 ? (
                  reports.map(report => (
                    <TableRow key={report.reportId}>
                      <TableCell className="font-medium">
                        {formatIncidentType(report.incidentType)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {report.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity || "UNKNOWN"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {report.location && report.location.latitude !== 0 &&
                          report.location.longitude !== 0 ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="text-xs">
                              {report.location.latitude.toFixed(4)},{" "}
                              {report.location.longitude.toFixed(4)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No location data
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {report.mediaAttachments && report.mediaAttachments.length > 0 ? (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <ImageIcon className="h-3 w-3" />
                            {report.mediaAttachments.length}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            None
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatTimestamp(report.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            {selectedReport && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>
                                    Incident Report Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Report ID: {selectedReport.reportId}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-semibold mb-2">
                                        Basic Information
                                      </h3>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-muted-foreground">
                                          Incident Type:
                                        </div>
                                        <div>
                                          {formatIncidentType(
                                            selectedReport.incidentType
                                          )}
                                        </div>
                                        <div className="text-muted-foreground">
                                          Status:
                                        </div>
                                        <div>{selectedReport.status || "N/A"}</div>
                                        <div className="text-muted-foreground">
                                          Severity:
                                        </div>
                                        <div>
                                          <Badge
                                            className={getSeverityColor(
                                              selectedReport.severity
                                            )}
                                          >
                                            {selectedReport.severity || "UNKNOWN"}
                                          </Badge>
                                        </div>
                                        <div className="text-muted-foreground">
                                          Reporter ID:
                                        </div>
                                        <div>{selectedReport.reporterUserId || "N/A"}</div>
                                        <div className="text-muted-foreground">
                                          Created:
                                        </div>
                                        <div>
                                          {formatTimestamp(
                                            selectedReport.createdAt
                                          )}
                                        </div>
                                        <div className="text-muted-foreground">
                                          Updated:
                                        </div>
                                        <div>
                                          {formatTimestamp(
                                            selectedReport.updatedAt
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold mb-2">
                                        Location Information
                                      </h3>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-muted-foreground">
                                          Latitude:
                                        </div>
                                        <div>
                                          {selectedReport.location?.latitude || "N/A"}
                                        </div>
                                        <div className="text-muted-foreground">
                                          Longitude:
                                        </div>
                                        <div>
                                          {selectedReport.location?.longitude || "N/A"}
                                        </div>
                                        <div className="text-muted-foreground">
                                          Accuracy:
                                        </div>
                                        <div>
                                          {selectedReport.location?.accuracy || "N/A"} meters
                                        </div>
                                        <div className="text-muted-foreground">
                                          Timestamp:
                                        </div>
                                        <div>
                                          {selectedReport.location?.timestamp || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-2">
                                      Description
                                    </h3>
                                    <p className="text-sm">
                                      {selectedReport.description || "No description provided"}
                                    </p>
                                  </div>
                                  {selectedReport.mediaAttachments && selectedReport.mediaAttachments.length > 0 && (
                                    <div>
                                      <h3 className="font-semibold mb-2">
                                        Media Attachments
                                      </h3>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {selectedReport.mediaAttachments.map(
                                          (media, index) => (
                                            <div
                                              key={index}
                                              className="relative aspect-square rounded-md overflow-hidden border"
                                            >
                                              <Image
                                                src={
                                                  media.thumbnailUrl ||
                                                  media.fileUrl
                                                }
                                                alt={`Attachment ${index + 1}`}
                                                fill
                                                className="object-cover"
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}