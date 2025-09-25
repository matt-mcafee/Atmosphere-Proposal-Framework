'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { sherpa } from '@/ai/flows/sherpa-flow';
import { SherpaOutput } from '@/ai/schemas/sherpa-schema';
import { useToast } from '@/hooks/use-toast';

type SherpaModuleProps = {
  onSuccess: (data: SherpaOutput) => void;
};

export function SherpaModule({ onSuccess }: SherpaModuleProps) {
  const { toast } = useToast();
  const [request, setRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequest(e.target.value);
  };

  const handleSubmit = async () => {
    if (!request.trim()) {
      toast({
        variant: 'destructive',
        title: 'Request is empty',
        description: 'Please enter a request for Sherpa.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sherpa({ request });
      onSuccess(result);
    } catch (error) {
      console.error('Sherpa request failed:', error);
      toast({
        variant: 'destructive',
        title: 'Sherpa Error',
        description: 'Could not process your request.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask Sherpa</CardTitle>
        <CardDescription>
          Make a request in natural language and Sherpa will populate the framework for you.
          For example: "Start a proposal for a tech refresh project for Globex Corp."
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Tell Sherpa what you need..."
          value={request}
          onChange={handleRequestChange}
          rows={3}
          disabled={isLoading}
        />
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Submit to Sherpa
        </Button>
      </CardContent>
    </Card>
  );
}
