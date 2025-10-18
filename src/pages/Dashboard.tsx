import { TrendingUp, Users, DollarSign, Target, Sparkles, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const portfolios = [
  { 
    name: "Settlo Academy", 
    icon: Sparkles,
    gradient: "from-primary to-secondary",
    stats: { leads: 45, revenue: "$125K" }
  },
  { 
    name: "Settlo Tech Solutions", 
    icon: Rocket,
    gradient: "from-secondary to-accent",
    stats: { leads: 32, revenue: "$89K" }
  },
  { 
    name: "Settlo HR Solutions", 
    icon: Target,
    gradient: "from-accent to-primary",
    stats: { leads: 28, revenue: "$67K" }
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      label: "Total Leads", 
      value: "105", 
      icon: Users,
      color: "text-primary",
      glow: "glow-primary"
    },
    { 
      label: "Conversion Rate", 
      value: "24.5%", 
      icon: TrendingUp,
      color: "text-secondary",
      glow: "glow-secondary"
    },
    { 
      label: "Expected Revenue", 
      value: "$281K", 
      icon: DollarSign,
      color: "text-accent",
      glow: "glow-accent"
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse-glow">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-lg">Track your leads and performance across all portfolios</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label}
              className={`p-6 border-2 hover:scale-105 transition-transform bg-card/50 backdrop-blur ${stat.glow} animate-slide-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-12 h-12 ${stat.color} animate-float`} style={{ animationDelay: `${index * 0.2}s` }} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Portfolios
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {portfolios.map((portfolio, index) => (
              <Card 
                key={portfolio.name}
                className="p-6 border-2 border-border hover:border-primary transition-all group bg-card/50 backdrop-blur animate-slide-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${portfolio.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform glow-primary`}>
                    <portfolio.icon className="w-8 h-8 text-white animate-float" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{portfolio.name}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span>{portfolio.stats.leads} Leads</span>
                    <span>{portfolio.stats.revenue}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/leads')}
                  className="w-full gradient-primary hover:opacity-90 transition-opacity font-semibold"
                >
                  View Leads
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
