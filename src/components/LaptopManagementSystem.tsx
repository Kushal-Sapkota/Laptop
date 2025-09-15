import { useState, createContext, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Laptop, Users, Wrench, ArrowRightLeft, BarChart3, Plus, Search, Filter, LogOut, Settings } from "lucide-react";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Repairs from "./Repairs";
import Handouts from "./Handouts";
import AdminPanel from "./AdminPanel";
import LoginForm from "./LoginForm";

// Context for authentication and user role
interface AuthContext {
  user: { username: string; role: 'admin' | 'user' } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const LaptopManagementSystem = () => {
  const [user, setUser] = useState<{ username: string; role: 'admin' | 'user' } | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === "admin" && password === "admin") {
      setUser({ username: "admin", role: "admin" });
      return true;
    } else if (username === "user" && password === "user") {
      setUser({ username: "user", role: "user" });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
          <LoginForm />
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Laptop className="h-8 w-8 text-primary" />
                  <h1 className="text-2xl font-bold text-foreground">LaptopMS</h1>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center space-x-2">
                <Laptop className="h-4 w-4" />
                <span>Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="repairs" className="flex items-center space-x-2">
                <Wrench className="h-4 w-4" />
                <span>Repairs</span>
              </TabsTrigger>
              <TabsTrigger value="handouts" className="flex items-center space-x-2">
                <ArrowRightLeft className="h-4 w-4" />
                <span>Handouts</span>
              </TabsTrigger>
              {user.role === 'admin' && (
                <TabsTrigger value="admin" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Admin</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="dashboard" className="animate-fade-in">
              <Dashboard />
            </TabsContent>

            <TabsContent value="inventory" className="animate-fade-in">
              <Inventory />
            </TabsContent>

            <TabsContent value="repairs" className="animate-fade-in">
              <Repairs />
            </TabsContent>

            <TabsContent value="handouts" className="animate-fade-in">
              <Handouts />
            </TabsContent>

            {user.role === 'admin' && (
              <TabsContent value="admin" className="animate-fade-in">
                <AdminPanel />
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
    </AuthContext.Provider>
  );
};

export default LaptopManagementSystem;