'use client';
import { Aperture, CheckCircle2, Flag, Map, MountainSnow, Rocket, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-headline">
      <header className="text-center my-12">
        <Aperture className="mx-auto h-20 w-20 accent-glow" />
        <h1 className="text-5xl md:text-7xl font-normal tracking-wider uppercase mt-4">
          Symtech <span className="accent-glow">Apex</span>
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary mt-4">
          Your Operating System for Peak Performance
        </p>
        <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto">
          An integrated ecosystem of tools and strategies designed to elevate
          client partnerships from simple transactions to strategic alliances.
        </p>
      </header>

      <section className="my-24">
        <h2 className="section-title">
          THE <span className="accent-glow">APEX TOOLBELT</span>
        </h2>
        <p className="text-center text-lg text-text-secondary -mt-8 mb-12 max-w-3xl mx-auto">
          The right gear for every stage of the climb. Each tool is designed to
          work in concert, providing a unified approach to client success.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6 flex flex-col">
            <div className="flex-shrink-0">
              <div className="flex items-center mb-3">
                <Map className="w-10 h-10 mr-4 accent-glow" />
                <h3 className="text-2xl font-medium">The Ascent Playbook</h3>
              </div>
              <p className="text-text-secondary text-lg mb-4">
                Your Guide to Strategic Account Engagement
              </p>
            </div>
            <div className="flex-grow">
              <p className="text-text-secondary text-sm mb-4">
                The core methodology defining the four-stage journey of client
                growth. Move from reactive to proactive guidance with a clear,
                repeatable framework for success.
              </p>
              <ul className="text-sm space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-accent-primary shrink-0" />
                  Provides a holistic account view.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-accent-primary shrink-0" />
                  Ensures strategic alignment across all teams.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-accent-primary shrink-0" />
                  Deepens client loyalty and increases predictability.
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col">
            <div className="flex-shrink-0">
              <div className="flex items-center mb-3">
                <Rocket className="w-10 h-10 mr-4 accent-glow" />
                <h3 className="text-2xl font-medium">The Ascension Engine</h3>
              </div>
              <p className="text-text-secondary text-lg mb-4">
                The Proposal & Estimating Powerhouse
              </p>
            </div>
            <div className="flex-grow">
              <p className="text-text-secondary text-sm mb-4">
                The dynamic tool that ignites the client journey. Build, refine,
                and launch compelling proposals that secure the resources needed
                for a successful expedition.
              </p>
              <ul className="text-sm space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-accent-primary shrink-0" />
                  Automates MSA and service proposal creation.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-accent-primary shrink-0" />
                  Models project scope and trajectory accurately.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-accent-primary shrink-0" />
                  Frames our value with powerful, data-driven narratives.
                </li>
              </ul>
            </div>
             <div className="mt-6 text-center">
                <Link href="/proposal" passHref>
                    <button className="bg-accent-primary/20 text-accent-primary border-2 border-accent-primary px-8 py-3 rounded-lg font-medium hover:bg-accent-primary hover:text-background-start transition-all duration-300">
                        Enter the Ascension Engine
                    </button>
                </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="my-24">
        <h2 className="section-title">
          THE <span className="accent-glow">ASCENT JOURNEY</span>
        </h2>
        <p className="text-center text-lg text-text-secondary -mt-8 mb-12 max-w-3xl mx-auto">
          The core four-stage methodology defined in{' '}
          <strong>The Ascent Playbook</strong>.
        </p>
        <div className="relative flex justify-center items-center py-10">
          <svg
            width="200"
            height="850"
            viewBox="0 0 200 850"
            className="absolute top-0 left-1/2 -translate-x-1/2 h-full"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  style={{
                    stopColor: 'var(--accent-primary)',
                    stopOpacity: 1,
                  }}
                />
                <stop
                  offset="100%"
                  style={{
                    stopColor: 'var(--accent-secondary)',
                    stopOpacity: 1,
                  }}
                />
              </linearGradient>
            </defs>
            <path
              id="ascent-path"
              d="M 100,50 C 150,150 50,250 100,350 C 150,450 50,550 100,650 C 150,750 100,800 100,800"
              stroke="url(#pathGradient)"
              fill="none"
              strokeWidth="3"
            />
          </svg>

          <div className="space-y-12 w-full max-w-xl relative z-10">
            <div className="flex items-center stage-marker">
              <div className="glass-card p-4 flex-1 mr-4">
                <h3 className="text-xl font-medium">
                  1. The Ridge{' '}
                  <span className="text-sm font-light text-text-secondary">
                    / Initial Project
                  </span>
                </h3>
                <p className="text-text-secondary mt-1 text-sm">
                  Establish a beachhead with flawless execution, proving our
                  immediate value.
                </p>
              </div>
              <div className="p-3 rounded-full bg-accent-primary/20 text-accent-primary border-2 border-accent-primary shadow-lg shadow-accent-primary/20">
                <Flag className="w-8 h-8" />
              </div>
            </div>
            <div className="flex items-center flex-row-reverse stage-marker">
              <div className="glass-card p-4 flex-1 ml-4">
                <h3 className="text-xl font-medium text-right">
                  2. The Slope{' '}
                  <span className="text-sm font-light text-text-secondary">
                    / Expanding Trust
                  </span>
                </h3>
                <p className="text-text-secondary mt-1 text-sm text-right">
                  Expand our influence, moving from provider to thought leader.
                </p>
              </div>
              <div className="p-3 rounded-full bg-accent-primary/20 text-accent-primary border-2 border-accent-primary shadow-lg shadow-accent-primary/20">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
            <div className="flex items-center stage-marker">
              <div className="glass-card p-4 flex-1 mr-4">
                <h3 className="text-xl font-medium">
                  3. The Summit{' '}
                  <span className="text-sm font-light text-text-secondary">
                    / Strategic Partner
                  </span>
                </h3>
                <p className="text-text-secondary mt-1 text-sm">
                  Become a co-creator of the client's future, essential to their
                  long-term success.
                </p>
              </div>
              <div className="p-3 rounded-full bg-accent-primary/20 text-accent-primary border-2 border-accent-primary shadow-lg shadow-accent-primary/20">
                <MountainSnow className="w-8 h-8" />
              </div>
            </div>
            <div className="flex items-center flex-row-reverse stage-marker">
              <div className="glass-card p-4 flex-1 ml-4">
                <h3 className="text-xl font-medium text-right">
                  4. The Atmosphere{' '}
                  <span className="text-sm font-light text-text-secondary">
                    / Fully Integrated
                  </span>
                </h3>
                <p className="text-text-secondary mt-1 text-sm text-right">
                  Client is fully integrated into our ecosystem, leveraging our
                  cloud and services.
                </p>
              </div>
              <div className="p-3 rounded-full bg-accent-primary/20 text-accent-primary border-2 border-accent-primary shadow-lg shadow-accent-primary/20">
                <Rocket className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center my-12 pt-8 border-t border-gray-200/10">
        <h3 className="text-2xl font-medium text-text-secondary">
          Reach the Peak.
        </h3>
        <p className="text-4xl font-normal accent-glow mt-1">
          Then Ascend Further.
        </p>
      </footer>
    </div>
  );
}
