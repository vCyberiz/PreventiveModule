"use client";

import { useEffect, useState } from 'react';
import { Shield, Loader2, ArrowLeft, Cloud, Cog } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import AzureConfigModal from '@/components/AzureConfigModal';

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

export default function CustomerPortal({ params }: { params: { customerId: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchCustomerDetails();
  }, [params.customerId]);

  async function fetchCustomerDetails() {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('customer_onboarding')
        .select('*')
        .eq('id', params.customerId)
        .single();

      if (error) throw error;
      if (!data) {
        toast({
          title: "Error",
          description: "Customer not found.",
          variant: "destructive",
        });
        router.push('/customers');
        return;
      }

      setCustomer(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load customer details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAzureConnect = () => {
    toast({
      title: "Azure Connection",
      description: "Initiating Azure connection process...",
    });
    // Azure connection logic will be implemented here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/customers')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">{customer.customer_name}</CardTitle>
                <CardDescription>
                  Connected on {new Date(customer.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">License Details</h3>
                <p className="text-gray-600">{getLicenseLabel(customer.defender_license_details)}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Active Products</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {customer.selected_products.map((product) => (
                    <span
                      key={product}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      {product.charAt(0).toUpperCase() + product.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>Current security posture and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-green-700">Protected</p>
                <p className="text-sm text-gray-500">All systems operational</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  className="w-full justify-start"
                  onClick={handleAzureConnect}
                >
                  <Cloud className="mr-2 h-4 w-4" />
                  Connect to Azure
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  View Security Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Manage Licenses
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setIsConfigModalOpen(true)}
                >
                  <Cog className="mr-2 h-4 w-4" />
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <AzureConfigModal 
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          customerId={customer.id}
        />
      </div>
    </main>
  );
}