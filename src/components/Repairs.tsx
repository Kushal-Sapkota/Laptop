import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Wrench, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RepairTicket {
  id: string;
  laptopId: string;
  laptopModel: string;
  issue: string;
  technician: string;
  cost: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dateCreated: string;
  dateCompleted?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const Repairs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Mock data
  const [repairs, setRepairs] = useState<RepairTicket[]>([
    {
      id: "RPR-001",
      laptopId: "LP-003",
      laptopModel: "HP EliteBook 840",
      issue: "Screen flickering, possible LCD cable issue",
      technician: "John Smith",
      cost: 150.00,
      status: "in-progress",
      dateCreated: "2024-01-15",
      priority: "high"
    },
    {
      id: "RPR-002",
      laptopId: "LP-008",
      laptopModel: "Dell Latitude 7420",
      issue: "Keyboard keys not responding",
      technician: "Sarah Johnson",
      cost: 85.00,
      status: "completed",
      dateCreated: "2024-01-10",
      dateCompleted: "2024-01-12",
      priority: "medium"
    },
    {
      id: "RPR-003",
      laptopId: "LP-015",
      laptopModel: "Lenovo ThinkPad X1",
      issue: "Battery not charging, possible charger port damage",
      technician: "Mike Wilson",
      cost: 200.00,
      status: "pending",
      dateCreated: "2024-01-18",
      priority: "urgent"
    }
  ]);

  const [newRepair, setNewRepair] = useState({
    laptopId: "",
    laptopModel: "",
    issue: "",
    technician: "",
    cost: "",
    priority: "medium" as const
  });

  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = 
      repair.laptopId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.laptopModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.technician.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || repair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddRepair = () => {
    if (!newRepair.laptopId || !newRepair.issue || !newRepair.technician) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const id = `RPR-${String(repairs.length + 1).padStart(3, '0')}`;
    const repair: RepairTicket = {
      ...newRepair,
      id,
      cost: parseFloat(newRepair.cost) || 0,
      status: "pending",
      dateCreated: new Date().toISOString().split('T')[0]
    };
    
    setRepairs([...repairs, repair]);
    setNewRepair({
      laptopId: "",
      laptopModel: "",
      issue: "",
      technician: "",
      cost: "",
      priority: "medium"
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Repair ticket ${id} created successfully`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'bg-warning-light text-warning-foreground border-warning/30',
      'in-progress': 'bg-info-light text-info-foreground border-info/30',
      'completed': 'bg-success-light text-success-foreground border-success/30',
      'cancelled': 'bg-destructive-light text-destructive-foreground border-destructive/30'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'low': 'bg-muted text-muted-foreground',
      'medium': 'bg-info-light text-info-foreground',
      'high': 'bg-warning-light text-warning-foreground',
      'urgent': 'bg-destructive-light text-destructive-foreground'
    };
    
    return (
      <Badge variant="outline" className={variants[priority as keyof typeof variants]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'in-progress':
        return <Wrench className="h-4 w-4 text-info" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Repair Management</h2>
          <p className="text-muted-foreground">
            Track and manage laptop repair tickets and costs
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Repair Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Repair Ticket</DialogTitle>
              <DialogDescription>
                Enter the details for the laptop repair request
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="laptopId">Laptop ID *</Label>
                  <Input
                    id="laptopId"
                    value={newRepair.laptopId}
                    onChange={(e) => setNewRepair({...newRepair, laptopId: e.target.value})}
                    placeholder="e.g., LP-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="laptopModel">Laptop Model</Label>
                  <Input
                    id="laptopModel"
                    value={newRepair.laptopModel}
                    onChange={(e) => setNewRepair({...newRepair, laptopModel: e.target.value})}
                    placeholder="e.g., Dell Latitude 7420"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">Issue Description *</Label>
                <Textarea
                  id="issue"
                  value={newRepair.issue}
                  onChange={(e) => setNewRepair({...newRepair, issue: e.target.value})}
                  placeholder="Describe the problem in detail..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technician">Assigned Technician *</Label>
                  <Input
                    id="technician"
                    value={newRepair.technician}
                    onChange={(e) => setNewRepair({...newRepair, technician: e.target.value})}
                    placeholder="Enter technician name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newRepair.priority} onValueChange={(value: any) => setNewRepair({...newRepair, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Estimated Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={newRepair.cost}
                  onChange={(e) => setNewRepair({...newRepair, cost: e.target.value})}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRepair}>Create Ticket</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repairs.length}</div>
            <p className="text-xs text-muted-foreground">All time tickets</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {repairs.filter(r => r.status === 'in-progress').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently being repaired</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {repairs.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Waiting to start</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${repairs.reduce((sum, repair) => sum + repair.cost, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">All repair costs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Repair Tickets</CardTitle>
              <CardDescription>
                {filteredRepairs.length} of {repairs.length} tickets
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search repairs..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Laptop</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepairs.map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell className="font-medium">{repair.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{repair.laptopId}</div>
                      <div className="text-sm text-muted-foreground">{repair.laptopModel}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{repair.issue}</TableCell>
                  <TableCell>{repair.technician}</TableCell>
                  <TableCell>{getPriorityBadge(repair.priority)}</TableCell>
                  <TableCell className="font-medium">${repair.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <StatusIcon status={repair.status} />
                      {getStatusBadge(repair.status)}
                    </div>
                  </TableCell>
                  <TableCell>{repair.dateCreated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Repairs;