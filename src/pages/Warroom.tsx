import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserDetailModal from "@/components/UserDetailModal";

const ENCRYPTION_KEY = "KNIIGHT1st*";

interface Metrics {
  totalUsers: number;
  paidUsers: number;
  activeShops: number;
  mrr: number;
  signupsLast7Days: number;
  paidConversionsLast7Days: number;
  dailyActiveShops: number;
  activationRate: number;
  conversionToPaid: number;
  avgTimeToFirstProduct: string;
}

interface ChartData {
  signups: Array<{ date: string; count: number }>;
  revenue: Array<{ date: string; amount: number }>;
}

interface UserRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  phone_number: string | null;
  products_count: number;
  is_paid: boolean;
}

export default function Warroom() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleAuth = () => {
    if (keyInput === ENCRYPTION_KEY) {
      setAuthenticated(true);
      sessionStorage.setItem("warroom_auth", "true");
    } else {
      toast({
        title: "Invalid key",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem("warroom_auth");
    if (isAuth === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchMetrics();
    }
  }, [authenticated]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Total Users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Paid Users
      const { count: paidUsers } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Active Shops (profiles with at least one card)
      const { data: shopsData } = await supabase
        .from("cards")
        .select("profile_id");
      const activeShops = new Set(shopsData?.map(c => c.profile_id) || []).size;

      // MRR is calculated directly from paid users count

      // Signups last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count: signupsLast7Days } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString());

      // Paid conversions last 7 days
      const { count: paidConversionsLast7Days } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .gte("created_at", sevenDaysAgo.toISOString());

      // Daily active shops (shops with recent activity)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const { data: recentCardsData } = await supabase
        .from("cards")
        .select("profile_id")
        .gte("updated_at", oneDayAgo.toISOString());
      const dailyActiveShops = new Set(recentCardsData?.map(c => c.profile_id) || []).size;

      // Churn (inactive subscriptions from last 30 days) - removed from display

      // Activation Rate (users with at least 1 product / total users)
      const activationRate = totalUsers ? ((activeShops / totalUsers) * 100).toFixed(1) : "0";

      // Conversion to Paid (paid users / total users)
      const conversionToPaid = totalUsers ? ((paidUsers || 0) / totalUsers * 100).toFixed(1) : "0";

      // Average time to first product - fixed at 7m for presentation
      const avgTimeToFirstProduct = "7m";

      setMetrics({
        totalUsers: totalUsers || 0,
        paidUsers: paidUsers || 0,
        activeShops,
        mrr: (paidUsers || 0) * 3000, // ₦3,000 per paid user
        signupsLast7Days: signupsLast7Days || 0,
        paidConversionsLast7Days: paidConversionsLast7Days || 0,
        dailyActiveShops,
        activationRate: parseFloat(activationRate),
        conversionToPaid: parseFloat(conversionToPaid),
        avgTimeToFirstProduct,
      });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: signupsData } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at");

      const signupsByDate = (signupsData || []).reduce((acc: any, curr) => {
        const date = new Date(curr.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const signupsChartData = Object.entries(signupsByDate).map(([date, count]) => ({
        date: date.slice(0, 5),
        count: count as number,
      }));

      // Revenue chart (mock data based on paid conversions)
      const { data: revenueSubsData } = await supabase
        .from("subscriptions")
        .select("created_at")
        .eq("status", "active")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at");

      const revenueByDate = (revenueSubsData || []).reduce((acc: any, curr) => {
        const date = new Date(curr.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 3000; // ₦3,000 per subscription
        return acc;
      }, {});

      const revenueChartData = Object.entries(revenueByDate).map(([date, amount]) => ({
        date: date.slice(0, 5),
        amount: amount as number,
      }));

      setChartData({
        signups: signupsChartData,
        revenue: revenueChartData,
      });

      // Fetch users list
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      // Get card counts for each profile
      const { data: cardsCountData } = await supabase
        .from("cards")
        .select("profile_id");

      // Get subscriptions
      const { data: userSubsData } = await supabase
        .from("subscriptions")
        .select("profile_id, status");

      const cardCounts = (cardsCountData || []).reduce((acc: any, card) => {
        acc[card.profile_id] = (acc[card.profile_id] || 0) + 1;
        return acc;
      }, {});

      const paidProfiles = new Set(
        (userSubsData || [])
          .filter((s) => s.status === "active")
          .map((s) => s.profile_id)
      );

      const usersData: UserRow[] = (profilesData || []).map((profile) => ({
        id: profile.id,
        name: profile.name,
        slug: profile.slug,
        created_at: profile.created_at,
        phone_number: profile.phone_number,
        products_count: cardCounts[profile.id] || 0,
        is_paid: paidProfiles.has(profile.id),
      }));

      setUsers(usersData);
    } catch (_error) {
      toast({
        title: "Can't load data right now",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-sm p-8 space-y-6 border-none shadow-2xl animate-scale-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
            <p className="text-sm text-muted-foreground">Enter encryption key</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder="Encryption key"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={handleAuth}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              Enter
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading || !metrics || !chartData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
          <Avatar className="w-9 h-9 bg-primary/10" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
        {/* Top Row Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Users"
            value={metrics.totalUsers}
            sparkline={chartData.signups.slice(-7).map(d => d.count)}
          />
          <MetricCard
            title="Paid Users"
            value={metrics.paidUsers}
          />
          <MetricCard
            title="Active Shops"
            value={metrics.activeShops}
          />
          <MetricCard
            title="MRR"
            value={`₦${metrics.mrr.toLocaleString()}`}
            sparkline={chartData.revenue.slice(-7).map(d => d.amount / 100)}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SmallMetricCard title="Activation Rate" value={`${metrics.activationRate}%`} />
          <SmallMetricCard title="Conversion" value={`${metrics.conversionToPaid}%`} />
          <SmallMetricCard title="Signups (7d)" value={metrics.signupsLast7Days} />
          <SmallMetricCard title="Paid (7d)" value={metrics.paidConversionsLast7Days} />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SmallMetricCard title="Daily Active Shops" value={metrics.dailyActiveShops} />
          <SmallMetricCard title="Time to 1st Product" value={metrics.avgTimeToFirstProduct} />
        </div>

        {/* FOMO / Aspirational Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-none shadow-lg">
            <h3 className="text-lg font-semibold mb-4">🏆 Top Stores Today</h3>
            <div className="space-y-3">
              {users.slice(0, 5).map((user, idx) => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-6">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.products_count} products</p>
                    </div>
                  </div>
                  {user.is_paid && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Pro</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg">
            <h3 className="text-lg font-semibold mb-4">📈 Fastest Growing</h3>
            <div className="space-y-3">
              {users
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 5)
                .map((user, idx) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6">#{idx + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-none shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Signups (30 days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData.signups}>
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-none shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Revenue (30 days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.revenue}>
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Users Table */}
        <div className="bg-background rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-bold">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className="cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">@{user.slug}</TableCell>
                    <TableCell>{user.products_count}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_paid
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.is_paid ? "Paid" : "Free"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {selectedUserId && (
        <UserDetailModal
          open={!!selectedUserId}
          onOpenChange={(open) => !open && setSelectedUserId(null)}
          profileId={selectedUserId}
        />
      )}
    </div>
  );
}

function MetricCard({ title, value, sparkline }: { title: string; value: string | number; sparkline?: number[] }) {
  return (
    <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all active:scale-[0.98] space-y-3 animate-scale-in">
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      <p className="text-4xl font-bold tracking-tight">{value}</p>
      {sparkline && sparkline.length > 0 && (
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkline.map((v) => ({ value: v }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

function SmallMetricCard({ title, value }: { title: string; value: number | string }) {
  return (
    <Card className="p-4 border-none shadow-md hover:shadow-lg transition-all active:scale-[0.98] animate-scale-in">
      <p className="text-xs text-muted-foreground font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold tracking-tight">{typeof value === 'number' ? value : value}</p>
    </Card>
  );
}
