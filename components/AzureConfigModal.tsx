"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  resourceGroupName: z.string().min(1, "Resource Group Name is required"),
});

type AzureConfigModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
};

export default function AzureConfigModal({
  isOpen,
  onClose,
  customerId,
}: AzureConfigModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: "",
      clientId: "",
      clientSecret: "",
      subscriptionId: "",
      resourceGroupName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      
      const { error } = await supabase
        .from('azure_configurations')
        .upsert({
          customer_id: customerId,
          tenant_id: values.tenantId,
          client_id: values.clientId,
          client_secret: values.clientSecret,
          subscription_id: values.subscriptionId,
          resource_group_name: values.resourceGroupName,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Azure configuration has been saved.",
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save Azure configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Azure Configuration</DialogTitle>
          <DialogDescription>
            Enter your Azure credentials and configuration details
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Azure Tenant ID" />
                  </FormControl>
                  <FormDescription>
                    Found in Azure Active Directory → Properties
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Azure Client ID" />
                  </FormControl>
                  <FormDescription>
                    App Registration application (client) ID
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Secret</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter Client Secret"
                    />
                  </FormControl>
                  <FormDescription>
                    App Registration client secret value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscriptionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Subscription ID" />
                  </FormControl>
                  <FormDescription>
                    Found in Subscriptions → Overview
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resourceGroupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Group Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Resource Group Name" />
                  </FormControl>
                  <FormDescription>
                    The resource group where resources will be deployed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}