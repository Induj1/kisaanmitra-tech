
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface LoanApplicationListProps {
  userId: string | undefined;
  limit?: number;
}

const LoanApplicationList: React.FC<LoanApplicationListProps> = ({ userId, limit }) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = limit || 10;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Get count for pagination
        const { count, error: countError } = await supabase
          .from('loan_applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        if (countError) throw countError;
        
        if (count !== null) {
          setTotalPages(Math.ceil(count / pageSize));
        }
        
        // Get actual data
        const { data, error } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);
          
        if (error) throw error;
        
        setApplications(data || []);
      } catch (error: any) {
        console.error('Error fetching loan applications:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load loan applications. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [userId, page, pageSize]);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!userId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please sign in to view your loan applications.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading && applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No loan applications found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{formatDate(app.created_at)}</TableCell>
                <TableCell>₹{app.amount.toLocaleString()}</TableCell>
                <TableCell className="max-w-xs truncate">{app.purpose}</TableCell>
                <TableCell>{renderStatus(app.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!limit && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink 
                  isActive={page === p} 
                  onClick={() => setPage(p)}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default LoanApplicationList;
