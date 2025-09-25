'use client';

import { useState } from 'react';
import type { GenerateBillOfMaterialsFromDrawingOutput } from '@/ai/flows/generate-bill-of-materials-from-drawing';
import { generateBillOfMaterialsFromDrawing } from '@/ai/flows/generate-bill-of-materials-from-drawing';
import type { EstimateTravelCostsOutput } from '@/ai/flows/estimate-travel-costs';
import { estimateTravelCosts } from '@/ai/flows/estimate-travel-costs';
import type { AiPoweredRecommendationOutput } from '@/ai/flows/ai-powered-recommendation';
import { aiPoweredRecommendation } from '@/ai/flows/ai-powered-recommendation';
import { challengeRecommendation } from '@/ai/flows/challenge-recommendation-flow';
import type { ChallengeRecommendationInput, ConversationTurn, ChallengeRecommendationOutput } from '@/ai/schemas/challenge-recommendation-schema';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ModuleCard } from '@/components/module-card';
import { HardHat, Lightbulb, Loader2, LocateFixed, Printer, ShipWheel, Sheet, FileText, Bot, User, Send, Sparkles, Milestone, FileQuestion, ShieldAlert, ClipboardCheck, Link, FileCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SherpaModule } from '@/components/sherpa-module';
import { SherpaOutput } from '@/ai/schemas/sherpa-schema';
import { GeneralConditions } from './general-conditions';

type ProjectInfo = { name: string; client: string; date: string; projectId: string; contact: string; version: string; };
type CostConfig = { onSiteLabor: number; technicianRate: number; livingExpenses: number; pmOverhead: number; travelHoursMatrix: number, parking: number, mealsCost: number };
type StrategyAnalysis = { a: string; b: string; };
type CanvasInputs = { scope: string; assumptions: string; risks: string; knowns: string; dependencies: string; estimate: string; };

export function ProposalFramework() {
  const { toast } = useToast();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({ 
    name: 'Walmart National Hands and Feet Support', 
    client: 'Kyndryl Canada', 
    date: new Date().toISOString().split('T')[0],
    projectId: 'KD-WM-2025',
    contact: 'Cameron Dailey',
    version: '5.0 (FINAL - Multi-Strategy Analysis)'
  });
  const [bom, setBom] = useState<GenerateBillOfMaterialsFromDrawingOutput | null>(null);
  const [travelCosts, setTravelCosts] = useState<EstimateTravelCostsOutput | null>(null);
  const [recommendation, setRecommendation] = useState<AiPoweredRecommendationOutput | null>(null);
  const [costConfig, setCostConfig] = useState<CostConfig>({ onSiteLabor: 3, technicianRate: 75, livingExpenses: 330, pmOverhead: 12.5, travelHoursMatrix: 1, parking: 15, mealsCost: 80 });
  const [strategyAnalysis, setStrategyAnalysis] = useState<StrategyAnalysis>({ a: 'This strategy prioritizes project completion speed by deploying multiple technician teams simultaneously. The final cost is dependent on the number of teams deployed, presenting scenarios for Accelerated (10 techs), Balanced (6 techs), and Sequential (4 techs) deployments.', b: 'This strategy adheres to the key operational constraint of one technician per province. All sites are grouped into logical driving routes ("clusters"). The project is executed in parallel across provinces, with the total duration dictated by the province requiring the longest time to complete all its clusters sequentially.' });
  const [isRecommending, setIsRecommending] = useState(false);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [isConversing, setIsConversing] = useState(false);
  const [canvasInputs, setCanvasInputs] = useState<CanvasInputs>({
    scope: 'Deliverables: \n"Done" Criteria: \nIn Scope: \nOut of Scope: ',
    assumptions: 'Team Availability: \nTechnical Assumptions: \nEnvironmental Assumptions: ',
    risks: 'Technical Risks: \nPersonnel Risks: \nExternal Factors: \nOpen Questions: ',
    knowns: 'Historical Data: \nTeam Velocity: \nPerformance Metrics: \nConcrete Facts: ',
    dependencies: 'Internal Teams: \nExternal Parties: \nDecisions: \nSystem Access: ',
    estimate: 'The Range: \nConfidence Level: \nKey Factors: ',
  });
  const [useMSA, setUseMSA] = useState(false);

  const handleProjectInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectInfo(prev => {
        const newInfo = { ...prev, [name]: value };
        if (name === 'client') {
            if (value && value.toLowerCase().trim() === 'equinix') {
                setUseMSA(true);
            } else {
                setUseMSA(false);
            }
        }
        return newInfo;
    });
  };
  const handleCostConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => setCostConfig({ ...costConfig, [e.target.name]: parseFloat(e.target.value) || 0 });
  const handleStrategyAnalysisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setStrategyAnalysis({ ...strategyAnalysis, [e.target.name]: e.target.value });
  const handleCanvasInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setCanvasInputs({ ...canvasInputs, [e.target.name]: e.target.value });


  const getContextForAI = () => {
    const clientData = `Client: ${projectInfo.client}, Standard pricing agreements apply.`;
    const vendorQuotes = "Primary vendor offers a 5% discount on bulk orders over $50,000.";
    const logisticalConfigurations = travelCosts?.optimalRouteSummary || "Standard logistics to be applied based on location density.";
    const costModelConfigurations = `On-site Labor: ${costConfig.onSiteLabor} hours/site @ $${costConfig.technicianRate}/hr. Living Expenses: $${costConfig.livingExpenses}/night. PM Overhead: ${costConfig.pmOverhead}%. Travel Matrix: ${costConfig.travelHoursMatrix} hour per 100km. Parking: $${costConfig.parking}/day. Meals: $${costConfig.mealsCost}/day.`;
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
      ...canvasInputs,
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

    try {
      const input: ChallengeRecommendationInput = {
        ...getContextForAI(),
        conversationHistory: newConversation,
      };
      const result: ChallengeRecommendationOutput = await challengeRecommendation(input);
      const aiTurn: ConversationTurn = { role: 'model', content: result.response };
      setConversation([...newConversation, aiTurn]);

      if (result.updatedConfig) {
        setCostConfig(prev => ({ ...prev, ...result.updatedConfig }));
        toast({
          title: 'Configuration Updated',
          description: 'The project configuration has been updated based on your request.',
        });
      }
    } catch (error) {
      console.error('Failed to get challenge response:', error);
      const aiTurn: ConversationTurn = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setConversation([...newConversation, aiTurn]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get a response.',
      });
    } finally {
      setIsConversing(false);
    }
  };


  const handleSherpaSuccess = (data: SherpaOutput) => {
    const newProjectInfo = { ...projectInfo };
    if (data.projectName) newProjectInfo.name = data.projectName;
    if (data.clientName) {
      newProjectInfo.client = data.clientName;
       if (data.clientName.toLowerCase().trim() === 'equinix') {
        setUseMSA(true);
      } else {
        setUseMSA(false);
      }
    }
    setProjectInfo(newProjectInfo);
    toast({ title: 'Sherpa has updated the project details.' });
  };

  const generateBoMAction = (pdfDataUri: string) => generateBillOfMaterialsFromDrawing({ pdfDataUri });
  const estimateTravelCostsAction = (locationsDataUri: string) => estimateTravelCosts({ locationsDataUri, livingExpensePerNight: costConfig.livingExpenses, techniciansPerLocation: 1 });

  const numLocations = travelCosts?.numberOfLocations || 0;
  const onsiteLaborCost = costConfig.onSiteLabor * costConfig.technicianRate;
  const travelCost = travelCosts && numLocations > 0 ? (travelCosts.totalTravelCost / numLocations) : 0;
  const livingExpensesCost = travelCosts && numLocations > 0 ? (travelCosts.totalLivingExpenses / numLocations) : 0;
  const mealsCost = travelCosts && numLocations > 0 ? (travelCosts.totalOvernightStays / numLocations) * costConfig.mealsCost : 0;
  const parkingCost = travelCosts && numLocations > 0 ? (travelCosts.totalOvernightStays / numLocations) * costConfig.parking : 0;
  const perSiteSubtotal = onsiteLaborCost + travelCost + livingExpensesCost + mealsCost + parkingCost;
  const totalSubtotal = perSiteSubtotal * numLocations;
  const pmOverheadCost = totalSubtotal * (costConfig.pmOverhead / 100);
  const grandTotal = totalSubtotal + pmOverheadCost;


  return (
    <div className="canvas-container max-w-7xl mx-auto my-8 bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
        <div className="canvas-header p-4 px-6 text-2xl font-bold">
            Estimating Framework Canvas
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
                        <Card className='bg-background/50'>
                            <CardHeader>
                               <div className="project-info">
                                    <div><strong>Project Name:</strong> {projectInfo.name}</div>
                                    <div><strong>Project ID:</strong> {projectInfo.projectId}</div>
                                    <div><strong>Client:</strong> {projectInfo.client}</div>
                                    <div><strong>Contact:</strong> {projectInfo.contact}</div>
                                    <div><strong>Estimate Version:</strong> {projectInfo.version}</div>
                                    <div><strong>Status:</strong> {travelCosts ? '✅ Calculation Complete' : '⏳ Pending Inputs'}</div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1"><Label htmlFor="name">Project Name</Label><Input id="name" name="name" value={projectInfo.name} onChange={handleProjectInfoChange} /></div>
                                <div className="space-y-1"><Label htmlFor="projectId">Project ID</Label><Input id="projectId" name="projectId" value={projectInfo.projectId} onChange={handleProjectInfoChange} /></div>
                                <div className="flex flex-col space-y-1">
                                    <Label htmlFor="client">Client Name</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id="client" name="client" value={projectInfo.client} onChange={handleProjectInfoChange} />
                                        <Button variant={useMSA ? "secondary" : "outline"} size="sm" onClick={() => setUseMSA(!useMSA)} title="Toggle MSA Conditions">
                                            {useMSA ? 'Use Standard' : 'Use MSA'}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-1"><Label htmlFor="contact">Contact</Label><Input id="contact" name="contact" value={projectInfo.contact} onChange={handleProjectInfoChange} /></div>
                                <div className="space-y-1"><Label htmlFor="version">Estimate Version</Label><Input id="version" name="version" value={projectInfo.version} onChange={handleProjectInfoChange} /></div>
                                <div className="space-y-1"><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" value={projectInfo.date} onChange={handleProjectInfoChange} /></div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>⚙️ Core Configuration</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1"><Label htmlFor="onSiteLabor">On-Site Labor (hours/site)</Label><Input id="onSiteLabor" name="onSiteLabor" type="number" value={costConfig.onSiteLabor} onChange={handleCostConfigChange} /></div>
                                <div className="space-y-1"><Label htmlFor="technicianRate">Technician Rate ($/hour)</Label><Input id="technicianRate" name="technicianRate" type="number" value={costConfig.technicianRate} onChange={handleCostConfigChange} /></div>
                                <div className="space-y-1"><Label htmlFor="livingExpenses">Living Expenses ($/night)</Label><Input id="livingExpenses" name="livingExpenses" type="number" value={costConfig.livingExpenses} onChange={handleCostConfigChange} /></div>
                                <div className="space-y-1"><Label htmlFor="mealsCost">Meals & Incidentals ($/day)</Label><Input id="mealsCost" name="mealsCost" type="number" value={costConfig.mealsCost} onChange={handleCostConfigChange} /></div>
                                <div className="space-y-1"><Label htmlFor="travelHoursMatrix">Travel (hours/100km)</Label><Input id="travelHoursMatrix" name="travelHoursMatrix" type="number" value={costConfig.travelHoursMatrix} onChange={handleCostConfigChange} /></div>
                                <div className="space-y-1"><Label htmlFor="parking">Parking ($/day)</Label><Input id="parking" name="parking" type="number" value={costConfig.parking} onChange={handleCostConfigChange} /></div>
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

                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-xl font-headline">2. Estimating Canvas</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Milestone /> Scope & Boundaries</CardTitle><CardDescription>Define exactly what is included and excluded to prevent scope creep.</CardDescription></CardHeader>
                            <CardContent><Textarea name="scope" value={canvasInputs.scope} onChange={handleCanvasInputChange} rows={6} placeholder="Deliverables:\n\"Done\" Criteria:\nIn Scope:\nOut of Scope:" /></CardContent>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><FileQuestion /> Assumptions</CardTitle><CardDescription>List everything you are holding to be true for your estimate to be valid.</CardDescription></CardHeader>
                                <CardContent><Textarea name="assumptions" value={canvasInputs.assumptions} onChange={handleCanvasInputChange} rows={8} placeholder="Team Availability:\nTechnical Assumptions:\nEnvironmental Assumptions:"/></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert /> Risks & Uncertainties</CardTitle><CardDescription>Identify potential problems and unknowns to plan for them.</CardDescription></CardHeader>
                                <CardContent><Textarea name="risks" value={canvasInputs.risks} onChange={handleCanvasInputChange} rows={8} placeholder="Technical Risks:\nPersonnel Risks:\nExternal Factors:\nOpen Questions:"/></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck /> Knowns & Data</CardTitle><CardDescription>Capture the hard facts and concrete data you have available.</CardDescription></CardHeader>
                                <CardContent><Textarea name="knowns" value={canvasInputs.knowns} onChange={handleCanvasInputChange} rows={8} placeholder="Historical Data:\nTeam Velocity:\nPerformance Metrics:\nConcrete Facts:"/></CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><Link /> Dependencies</CardTitle><CardDescription>List everything this project needs from other teams, people, or systems.</CardDescription></CardHeader>
                                <CardContent><Textarea name="dependencies" value={canvasInputs.dependencies} onChange={handleCanvasInputChange} rows={8} placeholder="Internal Teams:\nExternal Parties:\nDecisions:\nSystem Access:"/></CardContent>
                            </Card>
                        </div>
                         <Card className="bg-green-900/20 border-green-700">
                            <CardHeader><CardTitle className="text-green-200 flex items-center gap-2">⭐ The Estimate</CardTitle><CardDescription className="text-green-300">After filling the surrounding blocks, formulate your estimate here. It should always be a range that reflects the built-in uncertainty.</CardDescription></CardHeader>
                            <CardContent><Textarea name="estimate" value={canvasInputs.estimate} onChange={handleCanvasInputChange} rows={6} className="bg-card" placeholder="The Range:\nConfidence Level:\nKey Factors:"/></CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-xl font-headline">3. Strategy &amp; AI Recommendation</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Label htmlFor="strategy-a" className="text-lg font-semibold">Strategy A: Speed-Based Deployment</Label><Textarea id="strategy-a" name="a" value={strategyAnalysis.a} onChange={handleStrategyAnalysisChange} rows={8} /></div>
                            <div className="space-y-2"><Label htmlFor="strategy-b" className="text-lg font-semibold">Strategy B: Optimized Logistical Deployment</Label><Textarea id="strategy-b" name="b" value={strategyAnalysis.b} onChange={handleStrategyAnalysisChange} rows={8} /></div>
                        </div>
                        <div className="text-center"><Button onClick={handleGetRecommendation} disabled={isRecommending} size="lg">{isRecommending ? <Loader2 className="mr-2 animate-spin" /> : <Lightbulb className="mr-2" />}Generate AI Recommendation</Button></div>
                    
                        {recommendation && (
                            <Card className="mt-6">
                                <CardHeader><CardTitle>Talk to Ascension Engine</CardTitle><CardDescription>Ask follow-up questions to validate the proposal or request changes.</CardDescription></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-4 info-box bg-muted">
                                        {conversation.length === 0 && <div className="text-center text-muted-foreground p-4">Ask a question to begin...</div>}
                                        {conversation.map((turn, index) => (
                                            <div key={index} className={`flex items-start gap-3 ${turn.role === 'user' ? 'justify-end' : ''}`}>
                                                {turn.role === 'model' && <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot /></div>}
                                                <div className={`rounded-lg p-3 max-w-[80%] ${turn.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
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
                                        <Textarea placeholder="e.g., Change PM overhead to 15%" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChallenge(); }}} rows={1} disabled={isConversing} />
                                        <Button onClick={handleChallenge} disabled={!userQuery.trim() || isConversing}><Send /><span className="sr-only">Send</span></Button>
                                    </div>
                                 </CardContent>
                            </Card>
                        )}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-xl font-headline">4. Final Proposal Summary</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                        {recommendation ? (
                            <>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2">EXECUTIVE SUMMARY</h2>
                                    <div className="info-box">
                                        <p>{recommendation.recommendation}</p>
                                    </div>
                                    <div className="info-box recommendation">
                                        <strong className="font-bold">Overall Recommendation:</strong> For the lowest total cost, <strong>{recommendation.recommendedStrategy}</strong> is recommended. Key factors include: {recommendation.keyFactors}.
                                    </div>
                                </div>
                                
                                {travelCosts && (
                                <Card>
                                  <CardHeader><CardTitle>Cost Breakdown</CardTitle></CardHeader>
                                  <CardContent>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Cost Component</TableHead>
                                          <TableHead className="text-right">Per Site Cost</TableHead>
                                          <TableHead className="text-right">Total Project Cost ({numLocations} sites)</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell>On-Site Labor</TableCell>
                                          <TableCell className="text-right">{onsiteLaborCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                          <TableCell className="text-right">{(onsiteLaborCost * numLocations).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Travel</TableCell>
                                          <TableCell className="text-right">{travelCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                          <TableCell className="text-right">{(travelCost * numLocations).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Living Expenses</TableCell>
                                          <TableCell className="text-right">{livingExpensesCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                          <TableCell className="text-right">{(livingExpensesCost * numLocations).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Meals & Incidentals</TableCell>
                                          <TableCell className="text-right">{mealsCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                          <TableCell className="text-right">{(mealsCost * numLocations).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Parking</TableCell>
                                          <TableCell className="text-right">{parkingCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                          <TableCell className="text-right">{(parkingCost * numLocations).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                        </TableRow>
                                        <TableRow className="font-bold bg-secondary/50">
                                          <TableCell>Subtotal</TableCell>
                                          <TableCell className="text-right">{perSiteSubtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                          <TableCell className="text-right">{totalSubtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Project Management Overhead ({costConfig.pmOverhead}%)</TableCell>
                                          <TableCell className="text-right"></TableCell>
                                          <TableCell className="text-right">{pmOverheadCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                        </TableRow>
                                        <TableRow className="font-extrabold text-lg bg-primary/10">
                                          <TableCell>Grand Total</TableCell>
                                          <TableCell className="text-right"></TableCell>
                                          <TableCell className="text-right">{grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
                                )}

                            </>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">Generate an AI Recommendation to see the proposal summary.</div>
                        )}
                        {bom && <Card><CardHeader><CardTitle className="flex items-center gap-2"><HardHat /> Bill of Materials</CardTitle></CardHeader><CardContent><pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap font-mono">{bom.billOfMaterials}</pre></CardContent></Card>}
                        {travelCosts && <Card><CardHeader><CardTitle className="flex items-center gap-2"><LocateFixed /> Travel Cost Estimation</CardTitle></CardHeader><CardContent><p className="font-medium text-muted-foreground">Optimal Route Summary</p><p>{travelCosts.optimalRouteSummary}</p></CardContent></Card>}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="text-xl font-headline">5. Assumptions &amp; General Conditions</AccordionTrigger>
                     <AccordionContent className="pt-4 space-y-6">
                       <Card>
                          <CardContent className="pt-6">
                            {useMSA ? (
                              <p>Assumptions and General Conditions are as per the MSA with {projectInfo.client}.</p>
                            ) : (
                              <GeneralConditions />
                            )}
                          </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  );
}
