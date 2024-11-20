import CustomerOnboarding from '@/components/CustomerOnboarding';
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute right-0 top-0">
          <Button asChild>
            <Link href="/customers" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              View Customers
            </Link>
          </Button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Customer Onboarding Portal
          </h1>
          <p className="text-lg text-gray-600">
            Complete the form below to begin your security journey with us
          </p>
        </div>
        <CustomerOnboarding />
      </div>
    </main>
  );
}