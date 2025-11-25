import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type ProgressBarsProps = {
  posts: number;
  friends: number;
  points: number;
};

const chartConfig = {
  posts: {
    label: 'Postări',
    color: 'var(--chart-1)',
  },
  friends: {
    label: 'Prieteni',
    color: 'var(--chart-2)',
  },
  points: {
    label: 'Puncte',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export default function ProgressBars({ posts, friends, points }: ProgressBarsProps) {
  const chartData = [
    {
      category: 'Postări',
      value: (posts / 20) * 100,
      label: `${posts}/20`,
    },
    {
      category: 'Prieteni',
      value: (friends / 10) * 100,
      label: `${friends}/10`,
    },
    {
      category: 'Puncte',
      value: (points / 200) * 100,
      label: `${points}/200`,
    },
  ];

  return (
    <Card className='rounded-xl hover:shadow-lg transition-all duration-300 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
      <CardHeader>
        <CardTitle className='flex items-center text-lg font-semibold'>
          <TrendingUp className='h-5 w-5 mr-2 text-primary animate-pulse' />
          Progres Vânzări & Social
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent labelKey="category" nameKey="label" />}
            />
            <Bar dataKey='value' fill='var(--color-posts)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
