"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

type Customer = {
  id: string;
  customer_name: string;
  defender_license_details: string;
  selected_products: string[];
  created_at: string;
};

const getLicenseLabel = (value: string) => {
  const licenses = {
    e5: "Microsoft 365 E5/A5/G5",
    e3_security: "Microsoft 365 E3 with Security Add-on",
    ems_e5: "Enterprise Mobility + Security (EMS) E5/A5",
    defender_endpoint_p1: "Defender for Endpoint Plan 1",
    defender_endpoint_p2: "Defender for Endpoint Plan 2",
    defender_identity: "Defender for Identity",
    defender_office_p1: "Defender for Office 365 Plan 1",
    defender_office_p2: "Defender for Office 365 Plan 2",
    defender_cloud_apps: "Microsoft Defender for Cloud Apps",
  };
  return licenses[value as keyof typeof licenses] || value;
};

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('customer_onboarding')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleConnect = (customerId: string) => {
    router.push(`/customer-portal/${customerId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {customers.map((customer) => (
        <Card key={customer.id} className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{customer.customer_name}</CardTitle>
                <CardDescription>
                  License: {getLicenseLabel(customer.defender_license_details)}
                </CardDescription>
              </div>
              <Button onClick={() => handleConnect(customer.id)}>Connect</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Products: {customer.selected_products.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Onboarded: {new Date(customer.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
      {customers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">No customers found</p>
            <p className="text-gray-500">Start by onboarding your first customer</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}