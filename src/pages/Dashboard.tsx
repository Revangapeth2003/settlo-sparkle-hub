import { TrendingUp, Users, DollarSign, Target, Sparkles, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLeads } from "@/contexts/LeadsContext";

const portfolios = [
  { 
    name: "Settlo Academy", 
    icon: Sparkles,
    gradient: "from-primary to-secondary",
  },
  { 
    name: "Settlo Tech Solutions", 
    icon: Rocket,
    gradient: "from-secondary to-accent",
  },
  { 
    name: "Settlo HR Solutions", 
    icon: Target,
    gradient: "from-accent to-primary",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { leads, loading } = useLeads();

  const totalRevenue = leads.reduce((sum, lead) => {
    const revenue = parseFloat(lead.expectedRevenue.replace(/[^0-9.-]+/g, "")) || 0;
    return sum + revenue;
  }, 0);

  const wonLeads = leads.filter(lead => lead.status === "won").length;
  const conversionRate = leads.length > 0 ? ((wonLeads / leads.length) * 100).toFixed(1) : "0.0";

  const stats = [
    { 
      label: "Total Leads", 
      value: leads.length.toString(), 
      icon: Users,
      color: "text-primary",
      glow: "glow-primary"
    },
    { 
      label: "Conversion Rate", 
      value: `${conversionRate}%`, 
      icon: TrendingUp,
      color: "text-secondary",
      glow: "glow-secondary"
    },
    { 
      label: "Expected Revenue", 
      value: `₹${(totalRevenue / 1000).toFixed(0)}K`, 
      icon: DollarSign,
      color: "text-accent",
      glow: "glow-accent"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 md:px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse-glow">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg">Track your leads and performance across all portfolios</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label}
              className={`p-4 md:p-6 border-2 hover:scale-105 transition-transform bg-card/50 backdrop-blur ${stat.glow} animate-slide-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <stat.icon className={`w-8 h-8 md:w-12 md:h-12 ${stat.color} animate-float`} style={{ animationDelay: `${index * 0.2}s` }} />
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Portfolios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {portfolios.map((portfolio, index) => {
              const portfolioLeads = leads.filter(lead => lead.portfolio === portfolio.name);
              const portfolioRevenue = portfolioLeads.reduce((sum, lead) => {
                const revenue = parseFloat(lead.expectedRevenue.replace(/[^0-9.-]+/g, "")) || 0;
                return sum + revenue;
              }, 0);

              return (
                <Card 
                  key={portfolio.name}
                  className="p-4 md:p-6 border-2 border-border hover:border-primary transition-all group bg-card/50 backdrop-blur animate-slide-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="mb-4">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${portfolio.gradient} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform glow-primary`}>
                      <portfolio.icon className="w-6 h-6 md:w-8 md:h-8 text-white animate-float" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">{portfolio.name}</h3>
                    <div className="flex gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                      <span>{portfolioLeads.length} Leads</span>
                      <span>₹{portfolioRevenue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/leads')}
                    className="w-full gradient-primary hover:opacity-90 transition-opacity font-semibold text-sm md:text-base"
                  >
                    View Leads
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
