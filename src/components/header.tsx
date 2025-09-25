import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-auto text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              Symtech Ascension Engine
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
