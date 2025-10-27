import { Car, Home, Briefcase, Smartphone, Zap, Wrench, Users } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const categories = [
	{
		id: 1,
		title: 'Auto',
		desc: 'Anunțuri pentru mașini noi și second-hand.',
		icon: Car,
		size: 'flex-1',
	},
	{
		id: 2,
		title: 'Imobiliare',
		desc: 'Oferte imobiliare: apartamente, case, terenuri.',
		icon: Home,
		size: 'flex-1.5',
	},
	{
		id: 3,
		title: 'Job-uri',
		desc: 'Oportunități de angajare și locuri de muncă.',
		icon: Briefcase,
		size: 'flex-2',
	},
	{
		id: 4,
		title: 'Electronice',
		desc: 'Produse electronice la prețuri competitive.',
		icon: Smartphone,
		size: 'flex-3',
	},
	{
		id: 5,
		title: 'Electrocasnice',
		desc: 'Produse electrocasnice la prețuri competitive.',
		icon: Zap,
		size: 'flex-5',
	},
	{
		id: 6,
		title: 'Piese Auto',
		desc: 'Piese de schimb pentru automobile.',
		icon: Wrench,
		size: 'flex-8',
	},
	{
		id: 7,
		title: 'Servicii',
		desc: 'Servicii profesionale pentru diverse nevoi.',
		icon: Users,
		size: 'flex-13',
	},
];

export default function GoldenCategories() {
	return (
		<section className='py-8'>
			<h2 className='text-2xl font-bold text-center mb-4 text-secondary'>Categorii Populare</h2>
			<div className='flex flex-wrap gap-4 justify-center'>
				{categories.map((category) => {
					const Icon = category.icon;
					return (
						<Card key={category.id} style={{ flexGrow: parseFloat(category.size.split('-')[1]), flexBasis: '200px' }}>
							<CardHeader>
								<CardTitle>{category.title}</CardTitle>
								<CardDescription>{category.desc}</CardDescription>
							</CardHeader>
							<CardContent>
								<Icon className='w-16 h-16 mx-auto text-primary' />
							</CardContent>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
