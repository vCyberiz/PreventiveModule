import CustomerList from '@/components/CustomerList';

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Customer Directory
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your onboarded customers
          </p>
        </div>
        <CustomerList />
      </div>
    </main>
  );
}