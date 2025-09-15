import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Edit, Trash2, Laptop } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LaptopItem {
  id: string;
  brand: string;
  model: string;
  serial: string;
  specs: string;
  condition: string;
  status: 'available' | 'handed-out' | 'under-repair' | 'out-of-order';
  assignedTo?: string;
}

const Inventory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Mock data - in real app, this would come from API
  const [laptops, setLaptops] = useState<LaptopItem[]>([
    {
      id: "LP-001",
      brand: "Dell",
      model: "Latitude 7420",
      serial: "DL7420001",
      specs: "Intel i7, 16GB RAM, 512GB SSD",
      condition: "Excellent",
      status: "available"
    },
    {
      id: "LP-002",
      brand: "Lenovo",
      model: "ThinkPad X1 Carbon",
      serial: "LV1XC002",
      specs: "Intel i5, 8GB RAM, 256GB SSD",
      condition: "Good",
      status: "handed-out",
      assignedTo: "Marketing Dept."
    },
    {
      id: "LP-003",
      brand: "HP",
      model: "EliteBook 840",
      serial: "HP840003",
      specs: "Intel i7, 32GB RAM, 1TB SSD",
      condition: "Excellent",
      status: "under-repair"
    },
    {
      id: "LP-004",
      brand: "Apple",
      model: "MacBook Pro 14",
      serial: "MBP14004",
      specs: "M2 Pro, 16GB RAM, 512GB SSD",
      condition: "Like New",
      status: "available"
    }
  ]);

  const [newLaptop, setNewLaptop] = useState({
    brand: "",
    model: "",
    serial: "",
    specs: "",
    condition: "",
    status: "available" as const
  });

  const filteredLaptops = laptops.filter(laptop => {
    const matchesSearch = 
      laptop.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || laptop.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddLaptop = () => {
    if (!newLaptop.brand || !newLaptop.model || !newLaptop.serial) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const id = `LP-${String(laptops.length + 1).padStart(3, '0')}`;
    setLaptops([...laptops, { ...newLaptop, id }]);
    setNewLaptop({
      brand: "",
      model: "",
      serial: "",
      specs: "",
      condition: "",
      status: "available"
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Laptop ${id} added to inventory`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'available': 'status-available',
      'handed-out': 'status-handed-out',
      'under-repair': 'status-under-repair',
      'out-of-order': 'status-out-of-order'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Manage your laptop inventory and track device status
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Laptop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Laptop</DialogTitle>
              <DialogDescription>
                Enter the details for the new laptop to add to inventory
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={newLaptop.brand}
                    onChange={(e) => setNewLaptop({...newLaptop, brand: e.target.value})}
                    placeholder="e.g., Dell, HP, Lenovo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={newLaptop.model}
                    onChange={(e) => setNewLaptop({...newLaptop, model: e.target.value})}
                    placeholder="e.g., Latitude 7420"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial">Serial Number *</Label>
                <Input
                  id="serial"
                  value={newLaptop.serial}
                  onChange={(e) => setNewLaptop({...newLaptop, serial: e.target.value})}
                  placeholder="Enter serial number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specs">Specifications</Label>
                <Input
                  id="specs"
                  value={newLaptop.specs}
                  onChange={(e) => setNewLaptop({...newLaptop, specs: e.target.value})}
                  placeholder="e.g., Intel i7, 16GB RAM, 512GB SSD"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={newLaptop.condition} onValueChange={(value) => setNewLaptop({...newLaptop, condition: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Like New">Like New</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newLaptop.status} onValueChange={(value: any) => setNewLaptop({...newLaptop, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="under-repair">Under Repair</SelectItem>
                      <SelectItem value="out-of-order">Out of Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLaptop}>Add Laptop</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Laptop Inventory</CardTitle>
              <CardDescription>
                {filteredLaptops.length} of {laptops.length} laptops
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search laptops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="handed-out">Handed Out</SelectItem>
                  <SelectItem value="under-repair">Under Repair</SelectItem>
                  <SelectItem value="out-of-order">Out of Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Brand & Model</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Specifications</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLaptops.map((laptop) => (
                <TableRow key={laptop.id}>
                  <TableCell className="font-medium">{laptop.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Laptop className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{laptop.brand}</div>
                        <div className="text-sm text-muted-foreground">{laptop.model}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{laptop.serial}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{laptop.specs}</TableCell>
                  <TableCell>{laptop.condition}</TableCell>
                  <TableCell>{getStatusBadge(laptop.status)}</TableCell>
                  <TableCell>{laptop.assignedTo || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;