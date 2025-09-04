import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Search, Mail, GitCommit, AlertTriangle, Trophy } from 'lucide-react';

interface Collaborator {
  id: number;
  name: string;
  email: string;
  commits: number;
  issuesReported: number;
  department: string;
  joinDate: string;
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

// Mock data for collaborators
const collaborators: Collaborator[] = [
  {
    id: 1,
    name: "María González",
    email: "maria.gonzalez@company.com",
    commits: 145,
    issuesReported: 23,
    department: "Frontend",
    joinDate: "2023-01-15",
    severity: { critical: 5, high: 8, medium: 7, low: 3 }
  },
  {
    id: 2,
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@company.com", 
    commits: 167,
    issuesReported: 19,
    department: "Backend",
    joinDate: "2022-08-20",
    severity: { critical: 3, high: 6, medium: 8, low: 2 }
  },
  {
    id: 3,
    name: "Ana Martínez",
    email: "ana.martinez@company.com",
    commits: 98,
    issuesReported: 15,
    department: "DevOps",
    joinDate: "2023-03-10",
    severity: { critical: 2, high: 4, medium: 7, low: 2 }
  },
  {
    id: 4,
    name: "Luis Chen",
    email: "luis.chen@company.com",
    commits: 89,
    issuesReported: 12,
    department: "Mobile",
    joinDate: "2023-06-01",
    severity: { critical: 1, high: 3, medium: 6, low: 2 }
  },
  {
    id: 5,
    name: "Sandra López",
    email: "sandra.lopez@company.com",
    commits: 124,
    issuesReported: 18,
    department: "QA",
    joinDate: "2022-11-15",
    severity: { critical: 4, high: 5, medium: 6, low: 3 }
  },
  {
    id: 6,
    name: "Roberto Silva",
    email: "roberto.silva@company.com",
    commits: 76,
    issuesReported: 8,
    department: "Backend",
    joinDate: "2023-09-05",
    severity: { critical: 1, high: 2, medium: 4, low: 1 }
  }
];

type SortField = 'name' | 'commits' | 'issuesReported' | 'department';
type SortDirection = 'asc' | 'desc';

export const CollaboratorTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('issuesReported');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const departments = Array.from(new Set(collaborators.map(c => c.department)));

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSeverityColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-accent/10 text-accent border-accent/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredAndSortedCollaborators = useMemo(() => {
    let filtered = collaborators.filter(collaborator => {
      const matchesSearch = collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           collaborator.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || collaborator.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, departmentFilter, sortField, sortDirection]);

  const topPerformer = filteredAndSortedCollaborators[0];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Top Performer Banner */}
      {topPerformer && (
        <div className="bg-gradient-primary text-primary-foreground rounded-lg p-4 flex items-center gap-3">
          <Trophy className="h-6 w-6" />
          <div>
            <div className="font-semibold">🏆 Colaborador Destacado</div>
            <div className="text-sm opacity-90">
              {topPerformer.name} lidera con {topPerformer.issuesReported} issues reportadas
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Colaborador
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('department')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Departamento
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('commits')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Commits
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('issuesReported')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Issues Reportadas
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Severidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCollaborators.map((collaborator, index) => (
              <TableRow 
                key={collaborator.id}
                className={`hover:bg-muted/30 transition-colors ${
                  index === 0 ? 'bg-primary/5 border-primary/20' : ''
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className={`font-medium ${index === 0 ? 'font-bold text-primary' : ''}`}>
                        {collaborator.name}
                        {index === 0 && (
                          <Trophy className="inline ml-2 h-4 w-4 text-warning" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Desde {new Date(collaborator.joinDate).toLocaleDateString('es-ES', { 
                          year: 'numeric', month: 'short' 
                        })}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {collaborator.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{collaborator.department}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <GitCommit className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{collaborator.commits}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold text-lg">{collaborator.issuesReported}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {collaborator.severity.critical > 0 && (
                      <Badge variant="outline" className={getSeverityColor('critical')}>
                        C: {collaborator.severity.critical}
                      </Badge>
                    )}
                    {collaborator.severity.high > 0 && (
                      <Badge variant="outline" className={getSeverityColor('high')}>
                        H: {collaborator.severity.high}
                      </Badge>
                    )}
                    {collaborator.severity.medium > 0 && (
                      <Badge variant="outline" className={getSeverityColor('medium')}>
                        M: {collaborator.severity.medium}
                      </Badge>
                    )}
                    {collaborator.severity.low > 0 && (
                      <Badge variant="outline" className={getSeverityColor('low')}>
                        L: {collaborator.severity.low}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredAndSortedCollaborators.length} de {collaborators.length} colaboradores
      </div>
    </div>
  );
};