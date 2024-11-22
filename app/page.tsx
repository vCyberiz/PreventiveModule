"use client";

import CustomerOnboarding from '@/components/CustomerOnboarding';
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/test-login");
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute right-0 top-0 flex gap-2">
          <Button asChild>
            <Link href="/customers" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              View Customers
            </Link>
          </Button>
          <Button 
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/test-login" })}
          >
            Sign Out
          </Button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Customer Onboarding Portal
          </h1>
          <p className="text-lg text-gray-600">
            Complete the form below to begin your security journey with us
          </p>
          {session?.user?.email && (
            <p className="text-sm text-gray-500 mt-2">
              Logged in as: {session.user.email}
            </p>
          )}
        </div>
        <CustomerOnboarding />
      </div>
    </main>
  );
}