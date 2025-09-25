import { Header } from '@/components/header';
import { ProposalFramework } from '@/components/proposal-framework';

export default function ProposalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-inherit text-foreground">
      <Header />
      <main className="flex-1">
        <ProposalFramework />
      </main>
    </div>
  );
}
