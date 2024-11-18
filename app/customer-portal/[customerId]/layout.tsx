import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Portal',
  description: 'Manage your customer security settings and configurations',
};

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}