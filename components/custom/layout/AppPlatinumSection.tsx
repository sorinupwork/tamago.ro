import Image from 'next/image';

type ImageData = {
  src: string;
  alt: string;
  gridClasses: string;
};

type AppPlatinumSectionProps = {
  images: ImageData[];
  title?: string;
  description?: string;
};

export default function AppPlatinumSection({ images, title, description }: AppPlatinumSectionProps) {
  return (
    <section className='rounded-lg grow'>
      {(title || description) && (
        <div className='text-center mb-4'>
          {title && <h2 className='text-2xl font-bold mb-2'>{title}</h2>}
          {description && <p className='text-muted-foreground'>{description}</p>}
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-7 sm:grid-rows-2 gap-2 min-h-96'>
        {images.slice(0, 6).map((image, index) => (
          <div key={index} className={`bg-card p-2 rounded-lg shadow-md lift relative overflow-hidden ${image.gridClasses}`}>
            <Image src={image.src} alt={image.alt} fill className='object-cover' />
          </div>
        ))}
      </div>
    </section>
  );
}
