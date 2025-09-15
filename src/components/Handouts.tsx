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
import { Plus, Search, Filter, ArrowRightLeft, ArrowRight, ArrowLeft, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HandoutRecord {
  id: string;
  laptopId: string;
  laptopModel: string;
  user: string;
  department: string;
  action: 'handout' | 'return';
  purpose: string;
  date: string;
  returnDate?: string;
  status: 'active' | 'returned';
}

const Handouts = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [isHandoutDialogOpen, setIsHandoutDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  
  // Mock data
  const [handouts, setHandouts] = useState<HandoutRecord[]>([
    {
      id: "HO-001",
      laptopId: "LP-002",
      laptopModel: "Lenovo ThinkPad X1 Carbon",
      user: "Alice Johnson",
      department: "Marketing",
      action: "handout",
      purpose: "Quarterly presentation preparation",
      date: "2024-01-15",
      status: "active"
    },
    {
      id: "HO-002",
      laptopId: "LP-007",
      laptopModel: "Dell Latitude 7420",
      user: "Bob Smith",
      department: "IT",
      action: "handout",
      purpose: "Remote work setup",
      date: "2024-01-10",
      returnDate: "2024-01-18",
      status: "returned"
    },
    {
      id: "HO-003",
      laptopId: "LP-012",
      laptopModel: "HP EliteBook 840",
      user: "Carol Davis",
      department: "Finance",
      action: "handout",
      purpose: "Monthly reporting and analysis",
      date: "2024-01-08",
      status: "active"
    }
  ]);

  const [newHandout, setNewHandout] = useState({
    laptopId: "",
    user: "",
    department: "",
    purpose: ""
  });

  const [returnData, setReturnData] = useState({
    handoutId: ""
  });

  const filteredHandouts = handouts.filter(handout => {
    const matchesSearch = 
      handout.laptopId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handout.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handout.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handout.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === "all" || 
      (actionFilter === "active" && handout.status === "active") ||
      (actionFilter === "returned" && handout.status === "returned");
    
    return matchesSearch && matchesAction;
  });

  const handleHandout = () => {
    if (!newHandout.laptopId || !newHandout.user || !newHandout.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const id = `HO-${String(handouts.length + 1).padStart(3, '0')}`;
    const handout: HandoutRecord = {
      ...newHandout,
      id,
      laptopModel: "Dell Latitude 7420", // Would be fetched from laptop ID in real app
      action: "handout",
      date: new Date().toISOString().split('T')[0],
      status: "active"
    };
    
    setHandouts([...handouts, handout]);
    setNewHandout({
      laptopId: "",
      user: "",
      department: "",
      purpose: ""
    });
    setIsHandoutDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Laptop ${newHandout.laptopId} handed out successfully`,
    });
  };

  const handleReturn = () => {
    if (!returnData.handoutId) {
      toast({
        title: "Validation Error",
        description: "Please select a handout record",
        variant: "destructive"
      });
      return;
    }

    const updatedHandouts = handouts.map(handout =>
      handout.id === returnData.handoutId
        ? {
            ...handout,
            status: "returned" as const,
            returnDate: new Date().toISOString().split('T')[0]
          }
        : handout
    );
    
    setHandouts(updatedHandouts);
    setReturnData({ handoutId: "" });
    setIsReturnDialogOpen(false);
    
    const returnedHandout = handouts.find(h => h.id === returnData.handoutId);
    toast({
      title: "Success",
      description: `Laptop ${returnedHandout?.laptopId} returned successfully`,
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="status-handed-out">Active</Badge>
    ) : (
      <Badge className="status-available">Returned</Badge>
    );
  };

  const ActionIcon = ({ action, status }: { action: string; status: string }) => {
    if (status === 'returned') {
      return <ArrowLeft className="h-4 w-4 text-success" />;
    }
    return <ArrowRight className="h-4 w-4 text-info" />;
  };

  const activeHandouts = handouts.filter(h => h.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Handout Management</h2>
          <p className="text-muted-foreground">
            Track laptop handouts and returns to users and departments
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Process Return
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Process Laptop Return</DialogTitle>
                <DialogDescription>
                  Select the handout record to process the return
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="handoutId">Active Handout *</Label>
                  <Select value={returnData.handoutId} onValueChange={(value) => setReturnData({handoutId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select handout to return" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeHandouts.map((handout) => (
                        <SelectItem key={handout.id} value={handout.id}>
                          {handout.laptopId} - {handout.user} ({handout.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReturn}>Process Return</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isHandoutDialogOpen} onOpenChange={setIsHandoutDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Hand Out Laptop
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Hand Out Laptop</DialogTitle>
                <DialogDescription>
                  Record a laptop handout to a user or department
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="laptopId">Laptop ID *</Label>
                  <Input
                    id="laptopId"
                    value={newHandout.laptopId}
                    onChange={(e) => setNewHandout({...newHandout, laptopId: e.target.value})}
                    placeholder="e.g., LP-001"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">User Name *</Label>
                    <Input
                      id="user"
                      value={newHandout.user}
                      onChange={(e) => setNewHandout({...newHandout, user: e.target.value})}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={newHandout.department} onValueChange={(value) => setNewHandout({...newHandout, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT Department</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">Human Resources</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    value={newHandout.purpose}
                    onChange={(e) => setNewHandout({...newHandout, purpose: e.target.value})}
                    placeholder="Describe the purpose for this handout..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsHandoutDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleHandout}>Hand Out Laptop</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Handouts</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{handouts.length}</div>
            <p className="text-xs text-muted-foreground">All time records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Out</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeHandouts.length}</div>
            <p className="text-xs text-muted-foreground">Active handouts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returned</CardTitle>
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {handouts.filter(h => h.status === 'returned').length}
            </div>
            <p className="text-xs text-muted-foreground">Completed returns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(handouts.map(h => h.department)).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique departments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Handout Records</CardTitle>
              <CardDescription>
                {filteredHandouts.length} of {handouts.length} records
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search handouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Laptop</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Handout Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHandouts.map((handout) => (
                <TableRow key={handout.id}>
                  <TableCell className="font-medium">{handout.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{handout.laptopId}</div>
                      <div className="text-sm text-muted-foreground">{handout.laptopModel}</div>
                    </div>
                  </TableCell>
                  <TableCell>{handout.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{handout.department}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{handout.purpose}</TableCell>
                  <TableCell>{handout.date}</TableCell>
                  <TableCell>{handout.returnDate || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <ActionIcon action={handout.action} status={handout.status} />
                      {getStatusBadge(handout.status)}
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

export default Handouts;