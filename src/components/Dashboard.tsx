import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, Shield } from 'lucide-react';
import { CollaboratorTable } from "./CollaboratorTable";

const COLORS = {
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted-foreground))'
};

// Mock data for Aikido Security
const monthlyData = {
  totalIssues: 247,
  openIssues: 89,
  closedIssues: 158,
  newThisMonth: 67,
  resolvedThisMonth: 92,
  criticalIssues: 12,
  highIssues: 23,
  mediumIssues: 45,
  lowIssues: 9
};

const issuesByType = [
  { name: 'Vulnerabilidades de Código', value: 89, color: COLORS.destructive },
  { name: 'Problemas de Dependencias', value: 67, color: COLORS.warning },
  { name: 'Configuración de Seguridad', value: 45, color: COLORS.primary },
  { name: 'Secrets Expuestos', value: 32, color: COLORS.accent },
  { name: 'Compliance', value: 14, color: COLORS.muted }
];

const issueStatusData = [
  { name: 'Abiertas', value: 89, percentage: 36 },
  { name: 'Cerradas', value: 158, percentage: 64 }
];

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon: Icon, 
  variant = "default" 
}: {
  title: string;
  value: string | number;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: any;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-gradient-to-br from-success/5 to-success/10';
      case 'warning':
        return 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10';
      case 'destructive':
        return 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10';
      default:
        return 'border-primary/20 bg-gradient-card';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'destructive': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  return (
    <Card className={`shadow-card hover:shadow-elevated transition-all duration-300 ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${getIconColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {trend && trendValue && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend === 'up' ? (
              <TrendingUp className="mr-1 h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
            )}
            <span className={trend === 'up' ? 'text-success' : 'text-destructive'}>
              {trendValue}
            </span>
            <span className="ml-1">vs mes anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-primary font-semibold">
          {payload[0].value} issues ({((payload[0].value / monthlyData.totalIssues) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Dashboard Aikido Security
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Reporte Ejecutivo - Octubre 2024
            </p>
          </div>
          <Badge variant="outline" className="text-sm px-4 py-2 bg-primary/5 border-primary/20 text-primary">
            Última actualización: Hace 2 horas
          </Badge>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Issues"
            value={monthlyData.totalIssues}
            trend="down"
            trendValue="12%"
            icon={AlertTriangle}
            variant="default"
          />
          <MetricCard
            title="Issues Abiertas"
            value={monthlyData.openIssues}
            trend="up"
            trendValue="8%"
            icon={TrendingUp}
            variant="destructive"
          />
          <MetricCard
            title="Issues Resueltas"
            value={monthlyData.closedIssues}
            trend="up"
            trendValue="15%"
            icon={CheckCircle}
            variant="success"
          />
          <MetricCard
            title="Issues Críticas"
            value={monthlyData.criticalIssues}
            trend="down"
            trendValue="3%"
            icon={Shield}
            variant="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issue Status Pie Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Estado de Issues del Mes</CardTitle>
              <CardDescription>Distribución de issues abiertas vs cerradas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={issueStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill={COLORS.destructive} />
                    <Cell fill={COLORS.success} />
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value} issues (${issueStatusData.find(d => d.name === name)?.percentage}%)`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Issues by Type Bar Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Issues por Tipo</CardTitle>
              <CardDescription>Distribución de vulnerabilidades detectadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={issuesByType} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={160} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Collaborator Performance Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Reporte de Colaboradores
            </CardTitle>
            <CardDescription>
              Issues reportadas por colaborador con métricas de rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CollaboratorTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};