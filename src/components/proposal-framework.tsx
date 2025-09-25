'use client';

import { useState } from 'react';
import type { GenerateBillOfMaterialsFromDrawingOutput } from '@/ai/flows/generate-bill-of-materials-from-drawing';
import { generateBillOfMaterialsFromDrawing } from '@/ai/flows/generate-bill-of-materials-from-drawing';
import type { EstimateTravelCostsOutput } from '@/ai/flows/estimate-travel-costs';
import { estimateTravelCosts } from '@/ai/flows/estimate-travel-costs';
import type { AiPoweredRecommendationOutput } from '@/ai/flows/ai-powered-recommendation';
import { aiPoweredRecommendation } from '@/ai/flows/ai-powered-recommendation';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ModuleCard } from '@/components/module-card';
import { HardHat, Lightbulb, Loader2, LocateFixed, Printer, ShipWheel, Terminal, Sheet, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SherpaModule } from '@/components/sherpa-module';
import { SherpaOutput } from '@/ai/schemas/sherpa-schema';

type ProjectInfo = { name: string; client: string; date: string; };
type CostConfig = { onSiteLabor: number; livingExpenses: number; pmOverhead: number; };
type StrategyAnalysis = { a: string; b: string; };

export function ProposalFramework() {
  const { toast } = useToast();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({ name: '', client: '', date: new Date().toISOString().split('T')[0] });
  const [bom, setBom] = useState<GenerateBillOfMaterialsFromDrawingOutput | null>(null);
  const [travelCosts, setTravelCosts] = useState<EstimateTravelCostsOutput | null>(null);
  const [recommendation, setRecommendation] = useState<AiPoweredRecommendationOutput | null>(null);
  const [costConfig, setCostConfig] = useState<CostConfig>({ onSiteLabor: 3, livingExpenses: 330, pmOverhead: 12.5 });
  const [strategyAnalysis, setStrategyAnalysis] = useState<StrategyAnalysis>({ a: 'Strategy A involves an accelerated deployment model, prioritizing speed by deploying multiple technician teams simultaneously across different regions. This approach aims to reduce the overall project timeline but may incur higher logistical and travel costs due to less optimized routing.', b: 'Strategy B focuses on a logistical cluster deployment, where a single technician or team is assigned to a geographical province or cluster of locations. This strategy optimizes travel routes and minimizes overnight stays, aiming for maximum cost-efficiency, potentially at the expense of a longer project duration.' });
  const [isRecommending, setIsRecommending] = useState(false);

  const handleProjectInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => setProjectInfo({ ...projectInfo, [e.target.name]: e.target.value });
  const handleCostConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => setCostConfig({ ...costConfig, [e.target.name]: parseFloat(e.target.value) || 0 });
  const handleStrategyAnalysisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setStrategyAnalysis({ ...strategyAnalysis, [e.target.name]: e.target.value });

  const handleGetRecommendation = async () => {
    setIsRecommending(true);
    const clientData = "Client has a standard pricing agreement with tiered discounts.";
    const vendorQuotes = "Primary vendor offers a 5% discount on bulk orders over $50,000.";
    const logisticalConfigurations = travelCosts?.optimalRouteSummary || "Standard logistics to be applied based on location density.";
    const costModelConfigurations = `On-site Labor: ${costConfig.onSiteLabor} hours/site. Living Expenses: $${costConfig.livingExpenses}/night. PM Overhead: ${costConfig.pmOverhead}%.`;

    try {
      const result = await aiPoweredRecommendation({ clientData, vendorQuotes, logisticalConfigurations, costModelConfigurations, strategyAAnalysis: strategyAnalysis.a, strategyBAnalysis: strategyAnalysis.b });
      setRecommendation(result);
      toast({ title: 'Success', description: 'AI recommendation has been generated.' });
    } catch (error) {
      console.error("Failed to get recommendation:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate AI recommendation. Please check your API key and try again.' });
    } finally {
      setIsRecommending(false);
    }
  };

  const handleSherpaSuccess = (data: SherpaOutput) => {
    const newProjectInfo = { ...projectInfo };
    if (data.projectName) {
      newProjectInfo.name = data.projectName;
    }
    if (data.clientName) {
      newProjectInfo.client = data.clientName;
    }
    setProjectInfo(newProjectInfo);
    toast({ title: 'Sherpa has updated the project details.' });
  };

  const generateBoMAction = (pdfDataUri: string) => generateBillOfMaterialsFromDrawing({ pdfDataUri });
  const estimateTravelCostsAction = (locationsDataUri: string) => estimateTravelCosts({ locationsDataUri, livingExpensePerNight: costConfig.livingExpenses, techniciansPerLocation: 1 });
  
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">
          Ascension Engine Proposal Generation Environment
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground sm:mt-4">
          Build powerful, data-driven proposals with AI-assisted estimation.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['item-1', 'item-sherpa']} className="w-full space-y-4">
        <AccordionItem value="item-sherpa">
            <AccordionTrigger className="text-xl font-headline">✨ Sherpa Assistant</AccordionTrigger>
            <AccordionContent className="pt-4">
                <SherpaModule onSuccess={handleSherpaSuccess} />
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-headline">1. Project Setup & Document Ingestion</AccordionTrigger>
            <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Project Details</CardTitle><CardDescription>Provide basic information about the project.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-2"><Label htmlFor="name">Project Name</Label><Input id="name" name="name" value={projectInfo.name} onChange={handleProjectInfoChange} placeholder="e.g., Nationwide Retail Tech Refresh" /></div>
                           <div className="space-y-2"><Label htmlFor="client">Client Name</Label><Input id="client" name="client" value={projectInfo.client} onChange={handleProjectInfoChange} placeholder="e.g., Acme Corporation" /></div>
                           <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" value={projectInfo.date} onChange={handleProjectInfoChange} /></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Core Configuration</CardTitle><CardDescription>Set baseline parameters for calculations.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="onSiteLabor">On-Site Labor (hours/site)</Label><Input id="onSiteLabor" name="onSiteLabor" type="number" value={costConfig.onSiteLabor} onChange={handleCostConfigChange} /></div>
                            <div className="space-y-2"><Label htmlFor="livingExpenses">Living Expenses ($/night)</Label><Input id="livingExpenses" name="livingExpenses" type="number" value={costConfig.livingExpenses} onChange={handleCostConfigChange} /></div>
                             <div className="space-y-2"><Label htmlFor="pmOverhead">Project Management Overhead (%)</Label><Input id="pmOverhead" name="pmOverhead" type="number" value={costConfig.pmOverhead} onChange={handleCostConfigChange} /></div>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <ModuleCard id="bom-upload" title="Bill of Materials" description="Upload a PDF drawing to generate a BOM." cta="Generate BOM" onUpload={generateBoMAction} onSuccess={(result) => { setBom(result); toast({ title: 'BOM Generated' }); }} acceptedTypes="application/pdf" />
                    <ModuleCard id="travel-upload" title="Travel Logistics" description="Upload a location list (CSV/XLS) for cost estimation." cta="Estimate Travel" onUpload={estimateTravelCostsAction} onSuccess={(result) => { setTravelCosts(result); toast({ title: 'Travel Costs Estimated' }); }} acceptedTypes=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    <ModuleCard id="vendor-upload" title="Vendor Quotes" description="Import vendor quotes for cost calculations." cta="Import Quotes" onUpload={async () => {}} onSuccess={() => toast({ title: 'Note', description: 'Vendor quote parsing coming soon.' })} acceptedTypes="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    <ModuleCard id="client-upload" title="Client Agreements" description="Import price files for resale values." cta="Import Agreement" onUpload={async () => {}} onSuccess={() => toast({ title: 'Note', description: 'Client agreement parsing coming soon.' })} acceptedTypes="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                </div>
            </AccordionContent>
        </AccordionItem>
        
        {(bom || travelCosts) && (
        <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-headline">2. AI-Generated Insights</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
                {bom && <Card><CardHeader><CardTitle className="flex items-center gap-2"><HardHat /> Bill of Materials</CardTitle></CardHeader><CardContent><pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap font-code">{bom.billOfMaterials}</pre></CardContent></Card>}
                {travelCosts && <Card><CardHeader><CardTitle className="flex items-center gap-2"><LocateFixed /> Travel Cost Estimation</CardTitle></CardHeader><CardContent className="space-y-4"><div className="text-sm"><p className="font-medium text-muted-foreground">Optimal Route Summary</p><p>{travelCosts.optimalRouteSummary}</p></div><div className="grid grid-cols-2 gap-4"><div><p className="font-medium text-muted-foreground">Total Travel Cost</p><p className="text-2xl font-bold">${travelCosts.totalTravelCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p></div><div><p className="font-medium text-muted-foreground">Total Living Expenses</p><p className="text-2xl font-bold">${travelCosts.totalLivingExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p></div></div></CardContent></Card>}
            </AccordionContent>
        </AccordionItem>
        )}

        <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-headline">3. Strategy & AI Recommendation</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><Label htmlFor="strategy-a" className="text-lg font-semibold">Strategy A Analysis</Label><Textarea id="strategy-a" name="a" value={strategyAnalysis.a} onChange={handleStrategyAnalysisChange} rows={8} /></div><div className="space-y-2"><Label htmlFor="strategy-b" className="text-lg font-semibold">Strategy B Analysis</Label><Textarea id="strategy-b" name="b" value={strategyAnalysis.b} onChange={handleStrategyAnalysisChange} rows={8} /></div></div>
                 <div className="text-center"><Button onClick={handleGetRecommendation} disabled={isRecommending} size="lg">{isRecommending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}Generate AI Recommendation</Button></div>
                {recommendation && <Card className="bg-primary/5 border-primary/20"><CardHeader><CardTitle className="flex items-center gap-2 text-primary"><ShipWheel /> AI-Powered Recommendation</CardTitle></CardHeader><CardContent className="space-y-4"><blockquote className="border-l-4 border-accent pl-4 italic">"{recommendation.recommendation}"</blockquote><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"><div className="p-4 bg-muted rounded-lg"><p className="text-sm font-medium text-muted-foreground">Recommended Strategy</p><p className="text-xl font-bold font-headline">{recommendation.recommendedStrategy}</p></div><div className="p-4 bg-muted rounded-lg"><p className="text-sm font-medium text-muted-foreground">Estimated Cost</p><p className="text-xl font-bold font-headline">${recommendation.estimatedCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p></div><div className="p-4 bg-muted rounded-lg"><p className="text-sm font-medium text-muted-foreground">Key Deciding Factors</p><p className="text-base">{recommendation.keyFactors}</p></div></div></CardContent></Card>}
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl font-headline">4. Final Proposal Summary</AccordionTrigger>
            <AccordionContent className="pt-4">
                <Card className="overflow-hidden print:shadow-none print:border-none">
                    <CardHeader className="bg-primary text-primary-foreground print:bg-transparent print:text-foreground">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="font-headline text-2xl">Proposal: {projectInfo.name || "..."}</CardTitle>
                                <CardDescription className="text-primary-foreground/80 print:text-muted-foreground">Prepared for: {projectInfo.client || "..."} | Date: {projectInfo.date}</CardDescription>
                            </div>
                            <div className="flex space-x-2 print:hidden">
                                <Button variant="secondary" onClick={() => toast({ title: 'Coming Soon!', description: 'Export to Google Docs is under development.'})}><FileText className="mr-2 h-4 w-4" />Export to Docs</Button>
                                <Button variant="secondary" onClick={() => toast({ title: 'Coming Soon!', description: 'Export to Google Sheets is under development.'})}><Sheet className="mr-2 h-4 w-4" />Export to Sheets</Button>
                                <Button variant="secondary" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Export to PDF</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        {recommendation ? (<div className="p-4 rounded-lg bg-accent/10 border border-accent/20 print:border-gray-200"><h3 className="font-headline text-lg text-accent-foreground font-semibold flex items-center gap-2"><Lightbulb className="text-accent"/> Executive Summary</h3><p className="mt-2 text-muted-foreground">{recommendation.recommendation} The recommended approach is <strong>{recommendation.recommendedStrategy}</strong> with an estimated total cost of <strong>${recommendation.estimatedCost.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>.</p></div>) : (<div className="text-center py-8 text-muted-foreground">Generate an AI Recommendation to see the summary.</div>)}
                        <div className="space-y-4"><h3 className="font-headline text-lg font-semibold">Cost Breakdown</h3>
                            {travelCosts ? (<Table><TableHeader><TableRow><TableHead>Component</TableHead><TableHead className="text-right">Estimated Cost</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Total Travel Fees</TableCell><TableCell className="text-right">${(travelCosts.totalTravelCost).toLocaleString('en-US', {minimumFractionDigits: 2})}</TableCell></TableRow><TableRow><TableCell>Total Living Expenses</TableCell><TableCell className="text-right">${(travelCosts.totalLivingExpenses).toLocaleString('en-US', {minimumFractionDigits: 2})}</TableCell></TableRow><TableRow className="font-bold bg-muted"><TableCell>Total from AI Insights</TableCell><TableCell className="text-right">${(travelCosts.totalTravelCost + travelCosts.totalLivingExpenses).toLocaleString('en-US', {minimumFractionDigits: 2})}</TableCell></TableRow></TableBody></Table>) : (<div className="text-center py-4 text-muted-foreground text-sm">Upload location data to see travel cost breakdown.</div>)}
                        </div>
                         {bom && <div className="space-y-4 print:break-before-page"><h3 className="font-headline text-lg font-semibold">Bill of Materials</h3><pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap font-code">{bom.billOfMaterials}</pre></div>}
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
