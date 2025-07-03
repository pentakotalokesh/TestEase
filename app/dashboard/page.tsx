"use client"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import {
  LogOut,
  User,
  CalendarIcon,
  Settings,
  Bell,
  Heart,
  Star,
  Download,
  Edit,
  Trash2,
  ChevronDown,
  Info,
  AlertCircle,
  CheckCircle,
  Eye,
  Plus,
  Search,
} from "lucide-react"
import { useState } from "react"

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
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-gray-900">UI Components Dashboard</h1>
                  <Badge variant="secondary">Testing Environment</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
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
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="forms">Forms</TabsTrigger>
                <TabsTrigger value="data">Data Tables</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                      <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{products.reduce((sum, p) => sum + p.stock, 0)}</div>
                      <p className="text-xs text-muted-foreground">Items in stock</p>
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
                      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
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
                    <CardTitle>Button Variants</CardTitle>
                    <CardDescription>Different button styles and states</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                      <Button size="sm">Small</Button>
                      <Button size="lg">Large</Button>
                      <Button disabled>Disabled</Button>
                      <Button size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
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
                                        onClick={() => {
                                          handleDeleteUser(user.id)
                                        }}
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
                                        onClick={() => {
                                          handleDeleteProduct(product.id)
                                        }}
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
                      <CardDescription>Different alert types and styles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>This is an informational alert with some details.</AlertDescription>
                      </Alert>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>Something went wrong. Please try again.</AlertDescription>
                      </Alert>
                      <Alert className="border-green-200 bg-green-50 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Your action was completed successfully!</AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Badges</CardTitle>
                      <CardDescription>Various badge styles and variants</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Success</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Warning</Badge>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Info</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Loading States</CardTitle>
                    <CardDescription>Skeleton loaders and loading indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[160px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Navigation Tab */}
              <TabsContent value="navigation" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Accordion</CardTitle>
                      <CardDescription>Collapsible content sections</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Is it accessible?</AccordionTrigger>
                          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Is it styled?</AccordionTrigger>
                          <AccordionContent>
                            Yes. It comes with default styles that matches the other components' aesthetic.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>Is it animated?</AccordionTrigger>
                          <AccordionContent>
                            Yes. It's animated by default, but you can disable it if you prefer.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Hover Card</CardTitle>
                      <CardDescription>Hover to reveal additional content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="link">@nextjs</Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <Avatar>
                              <AvatarImage src="https://github.com/vercel.png" />
                              <AvatarFallback>VC</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">@nextjs</h4>
                              <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
                              <div className="flex items-center pt-2">
                                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                <span className="text-xs text-muted-foreground">Joined December 2021</span>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Dialog & Sheet Examples</CardTitle>
                    <CardDescription>Modal dialogs and slide-out sheets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove your
                              data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive">Delete</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline">Open Sheet</Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>
                              Make changes to your profile here. Click save when you're done.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input id="name" value="Pedro Duarte" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Username
                              </Label>
                              <Input id="username" value="@peduarte" className="col-span-3" />
                            </div>
                          </div>
                          <Button>Save changes</Button>
                        </SheetContent>
                      </Sheet>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">Open Popover</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Dimensions</h4>
                              <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Width</Label>
                                <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="height">Height</Label>
                                <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Aspect Ratio</CardTitle>
                    <CardDescription>Maintain consistent aspect ratios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">16:9 Aspect Ratio</p>
                        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
                          <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-muted-foreground">16:9 Content</p>
                          </div>
                        </AspectRatio>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">1:1 Aspect Ratio</p>
                        <AspectRatio ratio={1} className="bg-muted rounded-md">
                          <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-muted-foreground">1:1 Content</p>
                          </div>
                        </AspectRatio>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Scroll Area</CardTitle>
                    <CardDescription>Scrollable content areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-72 w-full rounded-md border p-4">
                      <div className="space-y-4">
                        {Array.from({ length: 50 }, (_, i) => (
                          <div key={i} className="text-sm">
                            <strong>Item {i + 1}</strong>
                            <p className="text-muted-foreground">
                              This is a scrollable item with some content that demonstrates the scroll area component.
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Separators</CardTitle>
                    <CardDescription>Visual dividers for content sections</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p>Content above separator</p>
                      <Separator className="my-4" />
                      <p>Content below separator</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>Left content</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Right content</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>

        {/* User Edit/Add Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "Update user information" : "Create a new user account"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="user-name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-role" className="text-right">
                  Role
                </Label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-status" className="text-right">
                  Status
                </Label>
                <Select value={userForm.status} onValueChange={(value) => setUserForm({ ...userForm, status: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>{editingUser ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Product Edit/Add Dialog */}
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product information" : "Create a new product"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="product-name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Wearables">Wearables</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="product-price"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="$0.00"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="product-stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: Number.parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-rating" className="text-right">
                  Rating
                </Label>
                <Input
                  id="product-rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={productForm.rating}
                  onChange={(e) => setProductForm({ ...productForm, rating: Number.parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>{editingProduct ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </AuthGuard>
  )
}
