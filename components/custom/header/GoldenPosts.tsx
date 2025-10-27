import { Car, Home, Briefcase, Smartphone, Zap, Wrench, Users } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const posts = [
	{
		id: 1,
		title: 'Mașină de vânzare - BMW X3',
		desc: 'Mașină second-hand verificată, preț negociabil.',
		icon: Car,
		size: 'flex-1',
	},
	{
		id: 2,
		title: 'Apartament în București',
		desc: 'Apartament 3 camere, verificat și promovat.',
		icon: Home,
		size: 'flex-1',
	},
	{
		id: 3,
		title: 'Job Freelance - Dezvoltator Web',
		desc: 'Oportunitate verificată pentru dezvoltatori.',
		icon: Briefcase,
		size: 'flex-2',
	},
	{
		id: 4,
		title: 'Telefon Samsung Galaxy',
		desc: 'Electronic nou, verificat și la preț bun.',
		icon: Smartphone,
		size: 'flex-3',
	},
	{
		id: 5,
		title: 'Frigider LG',
		desc: 'Electrocasnic verificat, promoție specială.',
		icon: Zap,
		size: 'flex-5',
	},
	{
		id: 6,
		title: 'Piese Auto pentru Dacia',
		desc: 'Piese originale, verificate.',
		icon: Wrench,
		size: 'flex-8',
	},
	{
		id: 7,
		title: 'Servicii de reparații',
		desc: 'Servicii profesionale verificate.',
		icon: Users,
		size: 'flex-13',
	},
];

export default function GoldenPosts() {
	return (
		<section className='py-8'>
			<h2 className='text-2xl font-bold text-center mb-6 text-secondary'>
				Anunțuri Promovate Verificate
			</h2>
			<div className='flex flex-wrap gap-4 justify-center'>
				{posts.map((post) => {
					const Icon = post.icon;
					return (
						<Card
							key={post.id}
							style={{
								flexGrow: parseFloat(post.size.split('-')[1]),
								flexBasis: '200px',
							}}
						>
							<CardHeader>
								<CardTitle>{post.title}</CardTitle>
								<CardDescription>{post.desc}</CardDescription>
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
