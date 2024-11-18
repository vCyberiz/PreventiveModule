"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  defenderLicense: z.string({
    required_error: "Please select a Defender license.",
  }),
  product: z.string({
    required_error: "Please select a product.",
  }),
});

const defenderLicenses = {
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

const products = {
  vshield: "VShield",
  vprotect: "VProtect",
  varmor: "VArmor",
};

export default function CustomerOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      
      // Check for duplicate customer name
      const { data: existingCustomer } = await supabase
        .from('customer_onboarding')
        .select('customer_name')
        .eq('customer_name', values.customerName)
        .single();

      if (existingCustomer) {
        toast({
          title: "Error",
          description: "A customer with this name already exists.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('customer_onboarding')
        .insert([
          {
            customer_name: values.customerName,
            defender_license_details: values.defenderLicense,
            selected_products: [values.product],
          },
        ]);

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Customer onboarding information has been saved.",
      });

      // Redirect to customers page
      router.push('/customers');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save customer information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
        <CardDescription>
          Enter the customer details and select appropriate licensing options.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defenderLicense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defender License</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a license type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(defenderLicenses).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(products).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Shield className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Complete Onboarding
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}