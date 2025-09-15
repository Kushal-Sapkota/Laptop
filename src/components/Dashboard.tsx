import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, CheckCircle, AlertTriangle, Wrench, ArrowRightLeft } from "lucide-react";

const Dashboard = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    totalLaptops: 150,
    available: 85,
    handedOut: 42,
    underRepair: 18,
    outOfOrder: 5,
  };

  const recentActivity = [
    {
      id: 1,
      type: "handout",
      message: "Laptop LP-001 handed out to Marketing Department",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "repair",
      message: "Repair completed for laptop LP-045",
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      type: "return",
      message: "Laptop LP-023 returned by IT Department",
      timestamp: "6 hours ago",
    },
    {
      id: 4,
      type: "inventory",
      message: "New laptop LP-156 added to inventory",
      timestamp: "1 day ago",
    },
  ];

  const StatCard = ({ title, value, description, icon: Icon, variant }: any) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {variant && (
          <Badge variant="secondary" className={`mt-2 ${variant}`}>
            {title}
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  const ActivityIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "handout":
        return <ArrowRightLeft className="h-4 w-4 text-info" />;
      case "repair":
        return <Wrench className="h-4 w-4 text-warning" />;
      case "return":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "inventory":
        return <Laptop className="h-4 w-4 text-primary" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your laptop inventory and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Laptops"
          value={stats.totalLaptops}
          description="Total devices in system"
          icon={Laptop}
        />
        <StatCard
          title="Available"
          value={stats.available}
          description="Ready for deployment"
          icon={CheckCircle}
          variant="status-available"
        />
        <StatCard
          title="Handed Out"
          value={stats.handedOut}
          description="Currently in use"
          icon={ArrowRightLeft}
          variant="status-handed-out"
        />
        <StatCard
          title="Under Repair"
          value={stats.underRepair}
          description="Being serviced"
          icon={Wrench}
          variant="status-under-repair"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your laptop management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <ActivityIcon type={activity.type} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>
              Current status breakdown of all laptops
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm">Available</span>
                </div>
                <span className="text-sm font-medium">{stats.available}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-info rounded-full"></div>
                  <span className="text-sm">Handed Out</span>
                </div>
                <span className="text-sm font-medium">{stats.handedOut}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-sm">Under Repair</span>
                </div>
                <span className="text-sm font-medium">{stats.underRepair}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <span className="text-sm">Out of Order</span>
                </div>
                <span className="text-sm font-medium">{stats.outOfOrder}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;