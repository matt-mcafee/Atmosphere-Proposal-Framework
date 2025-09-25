'use client';

import { useState } from 'react';
import type { GenerateBillOfMaterialsFromDrawingOutput } from '@/ai/flows/generate-bill-of-materials-from-drawing';
import { generateBillOfMaterialsFromDrawing } from '@/ai/flows/generate-bill-of-materials-from-drawing';
import type { EstimateTravelCostsOutput } from '@/ai/flows/estimate-travel-costs';
import { estimateTravelCosts } from '@/ai/flows/estimate-travel-costs';
import type { AiPoweredRecommendationOutput } from '@/ai/flows/ai-powered-recommendation';
import { aiPoweredRecommendation } from '@/ai/flows/ai-powered-recommendation';
import { challengeRecommendation } from '@/ai/flows/challenge-recommendation-flow';
import type { ChallengeRecommendationInput, ConversationTurn } from '@/ai/schemas/challenge-recommendation-schema';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ModuleCard } from '@/components/module-card';
import { HardHat, Lightbulb, Loader2, LocateFixed, Printer, ShipWheel, Sheet, FileText, Bot, User, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SherpaModule } from '@/components/sherpa-module';
import { SherpaOutput } from '@/ai/schemas/sherpa-schema';

type ProjectInfo = { name: string; client: string; date: string; projectId: string; contact: string; version: string; };
type CostConfig = { onSiteLabor: number; technicianRate: number; livingExpenses: number; pmOverhead: number; };
type StrategyAnalysis = { a: string; b: string; };

export function ProposalFramework() {
  const { toast } = useToast();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({ 
    name: 'Walmart National Hands and Feet Support', 
    client: 'Kyndryl Canada', 
    date: new Date().toISOString().split('T')[0],
    projectId: 'KD-WM-2025',
    contact: 'Cameron Dailey',
    version: '1.0'
  });
  const [bom, setBom] = useState<GenerateBillOfMaterialsFromDrawingOutput | null>(null);
  const [travelCosts, setTravelCosts] = useState<EstimateTravelCostsOutput | null>(null);
  const [recommendation, setRecommendation] = useState<AiPoweredRecommendationOutput | null>(null);
  const [costConfig, setCostConfig] = useState<CostConfig>({ onSiteLabor: 3, technicianRate: 75, livingExpenses: 330, pmOverhead: 12.5 });
  const [strategyAnalysis, setStrategyAnalysis] = useState<StrategyAnalysis>({ a: 'This strategy prioritizes project completion speed by deploying multiple technician teams simultaneously. The final cost is dependent on the number of teams deployed, presenting scenarios for Accelerated (10 techs), Balanced (6 techs), and Sequential (4 techs) deployments.', b: 'This strategy adheres to the key operational constraint of one technician per province. All sites are grouped into logical driving routes ("clusters"). The project is executed in parallel across provinces, with the total duration dictated by the province requiring the longest time to complete all its clusters sequentially.' });
  const [isRecommending, setIsRecommending] = useState(false);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [isConversing, setIsConversing] = useState(false);

  const handleProjectInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => setProjectInfo({ ...projectInfo, [e.target.name]: e.target.value });
  const handleCostConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => setCostConfig({ ...costConfig, [e.target.name]: parseFloat(e.target.value) || 0 });
  const handleStrategyAnalysisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setStrategyAnalysis({ ...strategyAnalysis, [e.target.name]: e.target.value });

  const getContextForAI = () => {
    const clientData = `Client: ${projectInfo.client}, Standard pricing agreements apply.`;
    const vendorQuotes = "Primary vendor offers a 5% discount on bulk orders over $50,000.";
    const logisticalConfigurations = travelCosts?.optimalRouteSummary || "Standard logistics to be applied based on location density.";
    const costModelConfigurations = `On-site Labor: ${costConfig.onSiteLabor} hours/site @ $${costConfig.technicianRate}/hr. Living Expenses: $${costConfig.livingExpenses}/night. PM Overhead: ${costConfig.pmOverhead}%.`;
    const bomData = bom?.billOfMaterials || "No Bill of Materials provided.";

    return {
      clientData,
      vendorQuotes,
      logisticalConfigurations,
      costModelConfigurations,
      strategyAAnalysis: strategyAnalysis.a,
      strategyBAnalysis: strategyAnalysis.b,
      billOfMaterials: bomData,
      initialRecommendation: recommendation?.recommendation || "No initial recommendation available.",
    };
  };

  const handleGetRecommendation = async () => {
    setIsRecommending(true);
    setConversation([]);
    const context = getContextForAI();

    try {
      const result = await aiPoweredRecommendation(context);
      setRecommendation(result);
      toast({ title: 'Success', description: 'AI recommendation has been generated.' });
    } catch (error) {
      console.error("Failed to get recommendation:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate AI recommendation.' });
    } finally {
      setIsRecommending(false);
    }
  };
  
  const handleChallenge = async () => {
    if (!userQuery.trim() || !recommendation) return;

    const currentTurn: ConversationTurn = { role: 'user', content: userQuery };
    const newConversation = [...conversation, currentTurn];
    setConversation(newConversation);
    setUserQuery('');
    setIsConversing(true);

    const input: ChallengeRecommendationInput = {
      ...getContextForAI(),
      conversationHistory: newConversation
    };

    try {
      const result = await challengeRecommendation(input);
      const aiTurn: ConversationTurn = { role: 'model', content: result.response };
      setConversation([...newConversation, aiTurn]);
    } catch (error) {
      console.error("Failed to get challenge response:", error);
      const errorTurn: ConversationTurn = { role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
      setConversation([...newConversation, errorTurn]);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not get a response.' });
    } finally {
      setIsConversing(false);
    }
  };


  const handleSherpaSuccess = (data: SherpaOutput) => {
    const newProjectInfo = { ...projectInfo };
    if (data.projectName) newProjectInfo.name = data.projectName;
    if (data.clientName) newProjectInfo.client = data.clientName;
    setProjectInfo(newProjectInfo);
    toast({ title: 'Sherpa has updated the project details.' });
  };

  const generateBoMAction = (pdfDataUri: string) => generateBillOfMaterialsFromDrawing({ pdfDataUri });
  const estimateTravelCostsAction = (locationsDataUri: string) => estimateTravelCosts({ locationsDataUri, livingExpensePerNight: costConfig.livingExpenses, techniciansPerLocation: 1 });

  return (
    <div className="canvas-container max-w-7xl mx-auto my-8 bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
        <div className="canvas-header bg-primary text-primary-foreground p-4 px-6 text-2xl font-bold">
            ███ Estimating Framework Canvas ███
        </div>
        <div className="toolbar bg-muted p-2 px-6 border-b flex gap-2">
            <Button variant="secondary" onClick={() => window.print()}><Printer className="mr-2"/>Export to PDF</Button>
            <Button variant="secondary" onClick={() => toast({ title: 'Coming Soon!', description: 'Automatic export to Google Docs is under development.'})}><FileText className="mr-2"/>Export to Docs</Button>
            <Button variant="secondary" onClick={() => toast({ title: 'Coming Soon!', description: 'Automatic export to Google Sheets is under development.'})}><Sheet className="mr-2"/>Export to Sheets</Button>
        </div>

        <div className="content p-6 space-y-6">
            <Accordion type="multiple" defaultValue={['item-1']} className="w-full space-y-4">
                <AccordionItem value="item-sherpa">
                    <AccordionTrigger className="text-xl font-headline">✨ Sherpa Assistant</AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <SherpaModule onSuccess={handleSherpaSuccess} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl font-headline">1. Project Setup & Document Ingestion</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                        <Card className='bg-secondary/30'>
                            <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1"><Label htmlFor="name">Project Name</Label><Input id="name" name="name" value={projectInfo.name} onChange={handleProjectInfoChange} /></div>
                                <div className="space-y-1"><Label htmlFor="projectId">Project ID</Label><Input id="projectId" name="projectId" value={projectInfo.projectId} onChange={handleProjectInfoChange} /></div>
                                <div className="space-y-1"><Label htmlFor="client">Client Name</Label><Input id="client" name="client" value={projectInfo.client} onChange={handleProjectInfoChange} /></div>
                                <div className="space-y-1"><Label htmlFor="contact">Contact</Label><Input id="contact" name="contact" value={projectInfo.contact} onChange={handleProjectInfoChange} /></div>
                                <div className="space-y-1"><Label htmlFor="version">Estimate Version</Label><Input id="version" name="version" value={projectInfo.version} onChange={handleProjectInfoChange} /></div>
                                <div className="space-y-1"><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" value={projectInfo.date} onChange={handleProjectInfoChange} /></div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Core Configuration</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1"><Label htmlFor="onSiteLabor">On-Site Labor (hours/site)</Label><Input id="onSiteLabor" name="onSiteLabor" type="number" value={costConfig.onSiteLabor} onChange={handleCostConfigChange} /></div>
                                <div className="space-y-1"><Label htmlFor="technicianRate">Technician Rate ($/hour)</Label><Input id="technicianRate" name="technicianRate" type="number" value={costConfig.technicianRate} onChange={handleCostConfigChange} /></div>
                                <div className="space-y-1"><Label htmlFor="livingExpenses">Living Expenses ($/night)</Label><Input id="livingExpenses" name="livingExpenses" type="number" value={costConfig.livingExpenses} onChange={handleCostConfigChange} /></div>
                                <div className="space-y-1"><Label htmlFor="pmOverhead">PM Overhead (%)</Label><Input id="pmOverhead" name="pmOverhead" type="number" value={costConfig.pmOverhead} onChange={handleCostConfigChange} /></div>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <ModuleCard id="bom-upload" title="Bill of Materials" description="Upload a PDF drawing to generate a BOM." cta="Generate BOM" onUpload={generateBoMAction} onSuccess={(result) => { setBom(result); toast({ title: 'BOM Generated' }); }} acceptedTypes="application/pdf" />
                            <ModuleCard id="travel-upload" title="Travel Logistics" description="Upload a location list (CSV/XLS) for cost estimation." cta="Estimate Travel" onUpload={estimateTravelCostsAction} onSuccess={(result) => { setTravelCosts(result); toast({ title: 'Travel Costs Estimated' }); }} acceptedTypes=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                            <ModuleCard id="vendor-upload" title="Vendor Quotes" description="Import vendor quotes for cost calculations." cta="Import Quotes" onUpload={async () => {}} onSuccess={() => toast({ title: 'Note', description: 'Vendor quote parsing coming soon.' })} acceptedTypes="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                            <ModuleCard id="client-upload" title="Client Agreements" description="Import price files for resale values." cta="Import Agreement" onUpload={async () => {}} onSuccess={() => toast({ title: 'Note', description: 'Client agreement parsing coming soon.' })} acceptedTypes="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                        </div>
                        <ModuleCard id="project-docs-upload" title="Project Documents" description="Upload drawings, specs, floor plans, etc. Files will be saved to a project folder in Google Drive." cta="Upload Project Files" onUpload={async (file) => { toast({title: "File Uploaded (Simulated)", description: "Integration with Google Drive for storage is coming soon."})}} onSuccess={() => {}} acceptedTypes=".pdf,.doc,.docx,.xls,.xlsx,image/*" />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-xl font-headline">2. Strategy &amp; AI Recommendation</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Label htmlFor="strategy-a" className="text-lg font-semibold">Strategy A: Speed-Based Deployment</Label><Textarea id="strategy-a" name="a" value={strategyAnalysis.a} onChange={handleStrategyAnalysisChange} rows={8} /></div>
                            <div className="space-y-2"><Label htmlFor="strategy-b" className="text-lg font-semibold">Strategy B: Optimized Logistical Deployment</Label><Textarea id="strategy-b" name="b" value={strategyAnalysis.b} onChange={handleStrategyAnalysisChange} rows={8} /></div>
                        </div>
                        <div className="text-center"><Button onClick={handleGetRecommendation} disabled={isRecommending} size="lg">{isRecommending ? <Loader2 className="mr-2 animate-spin" /> : <Lightbulb className="mr-2" />}Generate AI Recommendation</Button></div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-xl font-headline">3. Final Proposal Summary</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                        {recommendation ? (
                            <>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2">EXECUTIVE SUMMARY</h2>
                                    <div className="p-4 rounded-md bg-secondary/30 border-l-4 border-accent">
                                        <p>{recommendation.recommendation}</p>
                                    </div>
                                    <div className="p-4 rounded-md bg-amber-100 dark:bg-yellow-800/20 text-yellow-900 dark:text-yellow-200 border-l-4 border-amber-400 dark:border-yellow-500">
                                        <strong className="font-bold">Overall Recommendation:</strong> For the lowest total cost, <strong>{recommendation.recommendedStrategy}</strong> is recommended. Key factors include: {recommendation.keyFactors}.
                                    </div>
                                </div>
                                <Card>
                                    <CardHeader><CardTitle>Challenge the Recommendation</CardTitle><CardDescription>Ask follow-up questions to validate the proposal.</CardDescription></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                                            {conversation.map((turn, index) => (
                                                <div key={index} className={`flex items-start gap-3 ${turn.role === 'user' ? 'justify-end' : ''}`}>
                                                    {turn.role === 'model' && <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot /></div>}
                                                    <div className={`rounded-lg p-3 max-w-[80%] ${turn.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                        <p className="text-sm whitespace-pre-wrap">{turn.content}</p>
                                                    </div>
                                                    {turn.role === 'user' && <div className="p-2 rounded-full bg-muted text-foreground"><User /></div>}
                                                </div>
                                            ))}
                                            {isConversing && (
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot /></div>
                                                    <div className="rounded-lg p-3 bg-muted flex items-center space-x-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span className="text-sm">Thinking...</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 pt-4">
                                            <Textarea placeholder="e.g., Why is Strategy B cheaper if it takes longer?" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChallenge(); }}} rows={1} disabled={isConversing} />
                                            <Button onClick={handleChallenge} disabled={!userQuery.trim() || isConversing}><Send /><span className="sr-only">Send</span></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">Generate an AI Recommendation to see the proposal summary.</div>
                        )}
                        {bom && <Card><CardHeader><CardTitle className="flex items-center gap-2"><HardHat /> Bill of Materials</CardTitle></CardHeader><CardContent><pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap font-mono">{bom.billOfMaterials}</pre></CardContent></Card>}
                        {travelCosts && <Card><CardHeader><CardTitle className="flex items-center gap-2"><LocateFixed /> Travel Cost Estimation</CardTitle></CardHeader><CardContent><p className="font-medium text-muted-foreground">Optimal Route Summary</p><p>{travelCosts.optimalRouteSummary}</p></CardContent></Card>}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  );
}
