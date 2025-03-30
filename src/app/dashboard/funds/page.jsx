// Update the fetchFundraisers function
"use client"
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token") || ""
  }
  return ""
}

const fetchFundraisers = async () => {
  try {
    setLoading(true);
    const token = getAuthToken();

    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    const response = await fetch(
      "https://api-7fy6reml3q-uc.a.run.app/api/admin/fundraisers",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    // Extract the fundraisers array from the response
    const fundraisersList = data.fundraisers || [];
    setFundraisers(fundraisersList);
    setError(null);
  } catch (err) {
    setError(
      `Failed to fetch fundraisers: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  } finally {
    setLoading(false);
  }
};
export default function FundraiserManagement() {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: 0,
    startDate: "",
    endDate: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();
  // Update the fetchFundraisers function
  const fetchFundraisers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://api-7fy6reml3q-uc.a.run.app/api/admin/fundraisers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // Extract the fundraisers array from the response
      const fundraisersList = data.fundraisers || [];
      setFundraisers(fundraisersList);
      setError(null);
    } catch (err) {
      setError(
        `Failed to fetch fundraisers: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundraisers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "targetAmount" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormSubmitting(true);
      const token = getAuthToken();

      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Authentication token not found. Please log in.",
        });
        return;
      }

      const response = await fetch(
        "https://api-7fy6reml3q-uc.a.run.app/api/admin/fundraisers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      toast({
        title: "Fundraiser Created",
        description: "Your fundraiser has been created successfully.",
      });

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        targetAmount: 0,
        startDate: "",
        endDate: "",
      });
      setOpen(false);

      // Refresh the fundraisers list
      fetchFundraisers();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error Creating Fundraiser",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(amount);
  // };

  return (
    <Card className="w-full px-20 py-20 mt-20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Fundraisers</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-300">
              <Plus className="mr-2 h-4 w-4" />
              Create Fundraiser
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Fundraiser</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new fundraiser campaign.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Forest Conservation 2023"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Help us plant 10,000 trees"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                  <Input
                    id="targetAmount"
                    name="targetAmount"
                    type="number"
                    value={formData.targetAmount || ""}
                    onChange={handleInputChange}
                    placeholder="50000"
                    min="1"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} >
                  Cancel
                </Button>
                <Button type="submit" disabled={formSubmitting} className="bg-green-500 hover:bg-green-300">
                  {formSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Create Fundraiser
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading fundraisers...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : fundraisers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No fundraisers found. Create your first fundraiser by clicking the button above.
          </div>
        ) : (
          <Table>
            <TableCaption>A list of all fundraisers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Target Amount</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundraisers.map((fundraiser) => (
                <TableRow key={fundraiser.id}>
                  <TableCell className="font-medium">{fundraiser.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{fundraiser.description}</TableCell>
                  <TableCell>₹ {(fundraiser.targetAmount)}</TableCell>
                  <TableCell>{formatDate(fundraiser.startDate)}</TableCell>
                  <TableCell>{formatDate(fundraiser.endDate)}</TableCell>
                  <TableCell>
                    {fundraiser.status && (
                      <Badge variant={fundraiser.status === "active" ? "default" : "secondary"} className="bg-green-500 hover:bg-green-300">
                        {fundraiser.status}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}