"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import {
  LogOut,
  User,
  Settings,
  Bell,
  Star,
  Edit,
  Trash2,
  ChevronDown,
  Info,
  CheckCircle,
  Eye,
  Plus,
  Search,
  ExternalLink,
  Monitor,
  AlertTriangle,
  XCircle,
  Send,
} from "lucide-react"
import { useState, useRef } from "react"

// Types for our data
interface UserData {
  id: number
  name: string
  email: string
  role: string
  status: string
}

interface ProductData {
  id: number
  name: string
  category: string
  price: string
  stock: number
  rating: number
}

// Initial sample data
const initialUsers: UserData[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Moderator", status: "Active" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "User", status: "Pending" },
]

const initialProducts: ProductData[] = [
  { id: 1, name: "Laptop Pro", category: "Electronics", price: "$1,299", stock: 45, rating: 4.8 },
  { id: 2, name: "Wireless Headphones", category: "Audio", price: "$199", stock: 120, rating: 4.5 },
  { id: 3, name: "Smart Watch", category: "Wearables", price: "$399", stock: 78, rating: 4.3 },
  { id: 4, name: "Gaming Mouse", category: "Accessories", price: "$79", stock: 200, rating: 4.7 },
  { id: 5, name: "Mechanical Keyboard", category: "Accessories", price: "$149", stock: 89, rating: 4.6 },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [sliderValue, setSliderValue] = useState([50])
  const [progressValue, setProgressValue] = useState(75)
  const [switchChecked, setSwitchChecked] = useState(false)

  // State for users table
  const [users, setUsers] = useState<UserData[]>(initialUsers)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState("")

  // State for products table
  const [products, setProducts] = useState<ProductData[]>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [productSearchTerm, setProductSearchTerm] = useState("")

  // State for external content
  const [isIframeDialogOpen, setIsIframeDialogOpen] = useState(false)
  const [currentIframeUrl, setCurrentIframeUrl] = useState("")

  // State for drag and drop
  const [draggedFiles, setDraggedFiles] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states for new/edit user
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  })

  // Form states for new/edit product
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: 0,
    rating: 0,
  })

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleLogout = () => {
    logout()
  }

  // User CRUD operations
  const handleAddUser = () => {
    setEditingUser(null)
    setUserForm({ name: "", email: "", role: "User", status: "Active" })
    setIsUserDialogOpen(true)
  }

  const handleEditUser = (user: UserData) => {
    setEditingUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setIsUserDialogOpen(true)
  }

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (editingUser) {
      // Update existing user
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...userForm } : user)))
      toast({
        title: "Success",
        description: "User updated successfully.",
      })
    } else {
      // Add new user
      const newUser: UserData = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        ...userForm,
      }
      setUsers([...users, newUser])
      toast({
        title: "Success",
        description: "User added successfully.",
      })
    }
    setIsUserDialogOpen(false)
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
    toast({
      title: "Success",
      description: "User deleted successfully.",
    })
  }

  // Product CRUD operations
  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({ name: "", category: "", price: "", stock: 0, rating: 0 })
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: ProductData) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      rating: product.rating,
    })
    setIsProductDialogOpen(true)
  }

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.category || !productForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((product) => (product.id === editingProduct.id ? { ...product, ...productForm } : product)),
      )
      toast({
        title: "Success",
        description: "Product updated successfully.",
      })
    } else {
      // Add new product
      const newProduct: ProductData = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...productForm,
      }
      setProducts([...products, newProduct])
      toast({
        title: "Success",
        description: "Product added successfully.",
      })
    }
    setIsProductDialogOpen(false)
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter((product) => product.id !== productId))
    toast({
      title: "Success",
      description: "Product deleted successfully.",
    })
  }

  // External content functions
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const openInIframe = (url: string) => {
    setCurrentIframeUrl(url)
    setIsIframeDialogOpen(true)
  }

  // Contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Your message has been submitted successfully. We'll get back to you soon!",
      })
      setContactForm({ name: "", email: "", subject: "", message: "" })
    }, 1000)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const fileNames = files.map((file) => file.name)
    setDraggedFiles((prev) => [...prev, ...fileNames])

    toast({
      title: "Files Dropped",
      description: `${files.length} file(s) added to the drop zone.`,
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const fileNames = files.map((file) => file.name)
    setDraggedFiles((prev) => [...prev, ...fileNames])

    toast({
      title: "Files Selected",
      description: `${files.length} file(s) added to the drop zone.`,
    })
  }

  const clearFiles = () => {
    setDraggedFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Alert dialog handlers
  const showInfoAlert = () => {
    toast({
      title: "Information",
      description: "This is an informational message.",
    })
  }

  const showSuccessAlert = () => {
    toast({
      title: "Success!",
      description: "Operation completed successfully.",
    })
  }

  const showWarningAlert = () => {
    toast({
      title: "Warning",
      description: "Please review your action before proceeding.",
      variant: "destructive",
    })
  }

  const showErrorAlert = () => {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    })
  }

  // Filter functions
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearchTerm.toLowerCase()),
  )

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(productSearchTerm.toLowerCase()),
  )

  return (
    <AuthGuard requireAuth={true}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-background">
          {/* Header */}
          <header className="bg-white dark:bg-card shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">UI Components Dashboard</h1>
                  <Badge variant="secondary">Testing Environment</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInNewTab("https://example.com")}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    New Tab
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInIframe("https://example.com")}
                    className="gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    Iframe
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" alt={user?.name} />
                          <AvatarFallback>
                            {user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block">{user?.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="forms">Forms</TabsTrigger>
                <TabsTrigger value="data">Data Tables</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="external">External</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{users.length}</div>
                      <p className="text-xs text-muted-foreground">Active users in system</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{products.length}</div>
                      <p className="text-xs text-muted-foreground">Products in inventory</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground">Average product rating</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Progress Indicators</CardTitle>
                      <CardDescription>Various progress components</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Progress Bar ({progressValue}%)</Label>
                        <Progress value={progressValue} className="mt-2" />
                      </div>
                      <div>
                        <Label>Slider Value: {sliderValue[0]}</Label>
                        <Slider
                          value={sliderValue}
                          onValueChange={setSliderValue}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="demo-switch" checked={switchChecked} onCheckedChange={setSwitchChecked} />
                        <Label htmlFor="demo-switch">Enable notifications</Label>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Calendar Component</CardTitle>
                      <CardDescription>Interactive date picker</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border w-full" />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Forms Tab */}
              <TabsContent value="forms" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Form Controls</CardTitle>
                      <CardDescription>Various input components</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Enter password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Type your message here..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Select Option</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                            <SelectItem value="option2">Option 2</SelectItem>
                            <SelectItem value="option3">Option 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Selection Controls</CardTitle>
                      <CardDescription>Checkboxes and radio buttons</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <Label>Checkboxes</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" />
                          <Label htmlFor="terms">Accept terms and conditions</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="marketing" />
                          <Label htmlFor="marketing">Receive marketing emails</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="newsletter" />
                          <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <Label>Radio Group</Label>
                        <RadioGroup defaultValue="comfortable">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="default" id="r1" />
                            <Label htmlFor="r1">Default</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="comfortable" id="r2" />
                            <Label htmlFor="r2">Comfortable</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="compact" id="r3" />
                            <Label htmlFor="r3">Compact</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Form</CardTitle>
                    <CardDescription>Complete form with submission handling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Name *</Label>
                          <Input
                            id="contact-name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Email *</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-subject">Subject</Label>
                        <Input
                          id="contact-subject"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          placeholder="What is this about?"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-message">Message *</Label>
                        <Textarea
                          id="contact-message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Your message here..."
                          rows={4}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full gap-2">
                        <Send className="h-4 w-4" />
                        Submit Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Tables Tab */}
              <TabsContent value="data" className="space-y-6">
                {/* Users Table */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Users Management</CardTitle>
                        <CardDescription>Manage users with full CRUD operations</CardDescription>
                      </div>
                      <Button onClick={handleAddUser}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    <Table>
                      <TableCaption>A list of users ({filteredUsers.length} total).</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.status === "Active"
                                    ? "default"
                                    : user.status === "Inactive"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit user</TooltipContent>
                                </Tooltip>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user "{user.name}
                                        ".
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleDeleteUser(user.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Products Table */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Products Management</CardTitle>
                        <CardDescription>Manage products with full CRUD operations</CardDescription>
                      </div>
                      <Button onClick={handleAddProduct}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    <Table>
                      <TableCaption>A list of products ({filteredProducts.length} total).</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">{product.price}</TableCell>
                            <TableCell>
                              <span className={product.stock < 50 ? "text-red-600" : "text-green-600"}>
                                {product.stock}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{product.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit product</TooltipContent>
                                </Tooltip>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the product "
                                        {product.name}".
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleDeleteProduct(product.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Feedback Tab */}
              <TabsContent value="feedback" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Alerts</CardTitle>
                      <CardDescription>Various alert components</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Button onClick={showInfoAlert} className="gap-2">
                          <Info className="h-4 w-4" />
                          Show Info Alert
                        </Button>
                      </div>
                      <div>
                        <Button onClick={showSuccessAlert} className="gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Show Success Alert
                        </Button>
                      </div>
                      <div>
                        <Button onClick={showWarningAlert} className="gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Show Warning Alert
                        </Button>
                      </div>
                      <div>
                        <Button onClick={showErrorAlert} className="gap-2">
                          <XCircle className="h-4 w-4" />
                          Show Error Alert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Hover Card</CardTitle>
                      <CardDescription>Interactive hover card</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <HoverCard>
                        <HoverCardTrigger className="text-blue-500 underline">Hover me</HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          This is a hover card. It appears when you hover over the trigger.
                        </HoverCardContent>
                      </HoverCard>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Navigation Tab */}
              <TabsContent value="navigation" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dropdown Menu</CardTitle>
                      <CardDescription>Interactive dropdown menu</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Dropdown</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem className="cursor-pointer">Option 1</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Option 2</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Option 3</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sheet</CardTitle>
                      <CardDescription>Interactive sheet component</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline">Open Sheet</Button>
                        </SheetTrigger>
                        <SheetContent className="w-full max-w-2xl">
                          <SheetHeader>
                            <SheetTitle>Sheet Title</SheetTitle>
                          </SheetHeader>
                          <SheetDescription>
                            This is a sheet component. It can be used for modals or side panels.
                          </SheetDescription>
                        </SheetContent>
                      </Sheet>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Aspect Ratio</CardTitle>
                      <CardDescription>Responsive aspect ratio component</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AspectRatio ratio={16 / 9}>
                        <div className="bg-primary/5 flex items-center justify-center">16:9 Aspect Ratio</div>
                      </AspectRatio>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Scroll Area</CardTitle>
                      <CardDescription>Scrollable content area</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        <div className="p-4">
                          Scrollable content goes here. You can add more text or elements to see the scroll effect.
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* External Tab */}
              <TabsContent value="external" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Iframe Dialog</CardTitle>
                      <CardDescription>Open external content in an iframe</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Dialog open={isIframeDialogOpen} onOpenChange={setIsIframeDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Open Iframe</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>External Content</DialogTitle>
                          </DialogHeader>
                          <iframe src={currentIframeUrl} className="w-full h-full border" />
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Drag and Drop</CardTitle>
                      <CardDescription>Drag and drop files</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`border-dashed border-2 p-4 rounded ${
                          isDragOver ? "border-primary" : "border-muted-foreground"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <p className="text-center mb-4">Drag and drop files here</p>
                        <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                          Select Files
                        </Button>
                      </div>
                      <div className="mt-4">
                        {draggedFiles.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-medium">Dragged Files</h3>
                            <ul className="list-disc pl-6">
                              {draggedFiles.map((fileName, index) => (
                                <li key={index}>{fileName}</li>
                              ))}
                            </ul>
                            <Button variant="destructive" onClick={clearFiles}>
                              Clear Files
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </TooltipProvider>
    </AuthGuard>
  )
}
