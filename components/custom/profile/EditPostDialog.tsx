'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppInput from '@/components/custom/input/AppInput';
import AppTextarea from '@/components/custom/input/AppTextarea';
import AppSelectInput from '@/components/custom/input/AppSelectInput';
import AppMediaUploaderInput from '@/components/custom/input/AppMediaUploaderInput';
import AppLocationInput from '@/components/custom/input/AppLocationInput';
import { updatePost } from '@/actions/auto/actions';
import { colorOptions, carTypeOptions, transmissionOptions, tractionOptions } from '@/lib/mockData';
import type { Post } from '@/lib/types';

type EditPostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onSuccess?: () => void;
};

const FUEL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'Benzina', label: 'Benzina' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'LPG', label: 'LPG' },
  { value: 'Hibrida', label: 'Hibrida' },
  { value: 'Electric', label: 'Electric' },
];

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'nefolosit', label: 'Nefolosit' },
  { value: 'folosit', label: 'Folosit' },
  { value: 'perfect', label: 'Perfect' },
  { value: 'remanufactured', label: 'Remanufactured' },
];

const CURRENCY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'RON', label: 'RON' },
];

const PERIOD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'day', label: 'Zi' },
  { value: 'week', label: 'Săptămână' },
  { value: 'month', label: 'Lună' },
];

export default function EditPostDialog({ open, onOpenChange, post, onSuccess }: EditPostDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // Unified form state - dynamically populated based on category
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});

  // Log when formData changes
  useEffect(() => {
    console.log('\n=== EditPostDialog state changed ===');
    console.log('formData:', formData);
    console.log('filePreviews length:', filePreviews.length);
    console.log('filePreviews:', filePreviews);
  }, [formData, filePreviews]);

  const handleOpenChange = (isOpen: boolean) => {
    console.log('\n=== EditPostDialog.handleOpenChange called ===');
    console.log('isOpen:', isOpen);
    
    if (!isOpen) {
      console.log('User closed dialog - resetting form');
      setFormData({});
      setNewFiles([]);
      setFilePreviews([]);
      setUploaderKey((p) => p + 1);
      onOpenChange(false);
    }
  };

  // Prefill form when dialog opens with post data
  useEffect(() => {
    if (open && post) {
      console.log('\n=== EditPostDialog - Dialog opened, prefilling data ===');
      console.log('Full post object:', JSON.stringify(post, null, 2));
      
      const newFormData: Record<string, string | number | boolean> = {
        title: post.title || '',
        description: post.description || '',
        brand: post.brand || '',
        year: String(post.year) || '',
        mileage: String(post.mileage) || '',
        fuel: post.fuel || '',
        transmission: post.transmission || '',
        color: post.color || '',
        engineCapacity: String(post.engineCapacity || ''),
        carType: post.bodyType || '',
        horsePower: String(post.horsePower || ''),
        traction: post.traction || '',
        features: Array.isArray(post.features) ? post.features.join(', ') : (post.features || ''),
        status: post.status || '',
        currency: post.currency || 'EUR',
      };

      // Category-specific fields
      if (post.category === 'sell') {
        newFormData.price = post.price || '';
        newFormData.location = post.location || '';
      } else if (post.category === 'buy') {
        newFormData.minPrice = post.minPrice || '';
        newFormData.maxPrice = post.maxPrice || '';
        newFormData.minMileage = String(post.minMileage || '');
        newFormData.maxMileage = String(post.maxMileage || '');
        newFormData.minYear = String(post.minYear || '');
        newFormData.maxYear = String(post.maxYear || '');
        newFormData.minEngineCapacity = String(post.minEngineCapacity || '');
        newFormData.maxEngineCapacity = String(post.maxEngineCapacity || '');
        
        // Handle location for buy category
        const buyLoc = post.location as unknown;
        if (typeof buyLoc === 'object' && buyLoc) {
          const locObj = buyLoc as { lat?: number; lng?: number; address?: string };
          setLocation({
            lat: locObj.lat || post.lat || 0,
            lng: locObj.lng || post.lng || 0,
            address: locObj.address || '',
          });
        } else {
          setLocation({
            lat: post.lat || 0,
            lng: post.lng || 0,
            address: '',
          });
        }
      } else if (post.category === 'rent') {
        newFormData.price = post.price || '';
        newFormData.period = post.period || 'day';
        newFormData.startDate = post.startDate || '';
        newFormData.endDate = post.endDate || '';
        newFormData.withDriver = post.withDriver || false;
        newFormData.driverName = post.driverName || '';
        newFormData.driverContact = post.driverContact || '';
        newFormData.driverTelephone = post.driverTelephone || '';
        
        // Handle location for rent category
        const rentLoc = post.location as unknown;
        if (typeof rentLoc === 'object' && rentLoc) {
          const locObj = rentLoc as { lat?: number; lng?: number; address?: string };
          setLocation({
            lat: locObj.lat || post.lat || 0,
            lng: locObj.lng || post.lng || 0,
            address: locObj.address || '',
          });
        } else {
          setLocation({
            lat: post.lat || 0,
            lng: post.lng || 0,
            address: '',
          });
        }
      } else if (post.category === 'auction') {
        newFormData.price = post.price || '';
        newFormData.endDate = post.endDate || '';
        newFormData.location = post.location || '';
      }

      console.log('EditPostDialog - formData set:', newFormData);
      setFormData(newFormData);
      setFilePreviews(post.images || []);
      setNewFiles([]);
    }
  }, [open, post]);

  const handleFieldChange = (name: string, value: string | string[] | number | boolean) => {
    // Flatten array to first value if it's an array (for AppSelectInput with multiple values)
    const finalValue = Array.isArray(value) ? value[0] : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleFileChange = (files: File[]) => {
    setNewFiles(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setFilePreviews((prev) => {
      prev.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      return previews;
    });
  };

  const handleRemoveFile = (index: number) => {
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    const newFilesArray = newFiles.filter((_, i) => i !== index);
    setFilePreviews(newPreviews);
    setNewFiles(newFilesArray);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!post) return;

    if (!formData.title?.toString().trim() || !formData.description?.toString().trim()) {
      toast.error('Titlu și descriere sunt obligatorii');
      return;
    }

    const submitData: Record<string, unknown> = {
      title: formData.title,
      description: formData.description,
      brand: formData.brand,
      year: formData.year,
      mileage: formData.mileage,
      fuel: formData.fuel,
      transmission: formData.transmission,
      color: formData.color,
      engineCapacity: formData.engineCapacity,
      carType: formData.carType,
      horsePower: formData.horsePower,
      traction: formData.traction,
      features: formData.features,
      status: formData.status,
      currency: formData.currency,
      uploadedFiles: [...filePreviews.filter((p) => !p.startsWith('blob:')), ...newFiles.map((f) => f.name)],
    };

    // Add category-specific fields
    if (post.category === 'sell') {
      submitData.price = formData.price;
      submitData.location = formData.location;
    } else if (post.category === 'buy') {
      submitData.minPrice = formData.minPrice;
      submitData.maxPrice = formData.maxPrice;
      submitData.minMileage = formData.minMileage;
      submitData.maxMileage = formData.maxMileage;
      submitData.minYear = formData.minYear;
      submitData.maxYear = formData.maxYear;
      submitData.minEngineCapacity = formData.minEngineCapacity;
      submitData.maxEngineCapacity = formData.maxEngineCapacity;
      submitData.location = location || {
        lat: 0,
        lng: 0,
        address: '',
      };
    } else if (post.category === 'rent') {
      submitData.price = formData.price;
      submitData.period = formData.period;
      submitData.startDate = formData.startDate;
      submitData.endDate = formData.endDate;
      submitData.withDriver = formData.withDriver;
      submitData.driverName = formData.driverName;
      submitData.driverContact = formData.driverContact;
      submitData.driverTelephone = formData.driverTelephone;
      submitData.location = location || {
        lat: 0,
        lng: 0,
        address: '',
      };
    } else if (post.category === 'auction') {
      submitData.price = formData.price;
      submitData.endDate = formData.endDate;
      submitData.location = formData.location;
    }

    startTransition(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await updatePost(post.id, post.category, submitData as any);

        if (result.success) {
          toast.success(result.message);
          handleOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Eroare la actualizarea anunțului');
        console.error(error);
      }
    });
  };

  if (!post) return null;

  const isSell = post.category === 'sell';
  const isBuy = post.category === 'buy';
  const isRent = post.category === 'rent';
  const isAuction = post.category === 'auction';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className='max-w-4xl max-h-[90vh] overflow-y-auto'
        aria-describedby='edit-post-description'
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Editează Anunț - {post.category.toUpperCase()}</DialogTitle>
          <DialogDescription>Formularul pentru editarea anunțului auto din categoria {post.category}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Tabs defaultValue='basic' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='basic'>Informații Generale</TabsTrigger>
              <TabsTrigger value='category'>Detalii Specifice</TabsTrigger>
            </TabsList>

            <TabsContent value='basic' className='space-y-4'>
              <FieldGroup>
                <AppInput
                  label='Titlu'
                  placeholder='Titlul anunțului...'
                  name='title'
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  value={String(formData.title || '')}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <AppTextarea
                  label='Descriere'
                  placeholder='Descrierea detaliată...'
                  name='description'
                  onChange={(v) => handleFieldChange('description', v)}
                  value={String(formData.description || '')}
                />
              </FieldGroup>

              <div className='grid grid-cols-2 gap-4'>
                <FieldGroup>
                  <AppInput
                    label='Brand'
                    placeholder='Brand...'
                    name='brand'
                    onChange={(e) => handleFieldChange('brand', e.target.value)}
                    value={String(formData.brand || '')}
                  />
                </FieldGroup>
                <FieldGroup>
                  <AppInput
                    label='Anul Fabricației'
                    placeholder='YYYY'
                    name='year'
                    onChange={(e) => handleFieldChange('year', e.target.value)}
                    value={String(formData.year || '')}
                  />
                </FieldGroup>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FieldGroup>
                  <AppInput
                    label='Kilometraj'
                    placeholder='0'
                    name='mileage'
                    onChange={(e) => handleFieldChange('mileage', e.target.value)}
                    value={String(formData.mileage || '')}
                  />
                </FieldGroup>
                <FieldGroup>
                  <AppSelectInput
                    label='Combustibil'
                    options={FUEL_OPTIONS}
                    value={String(formData.fuel || '')}
                    onValueChange={(v) => handleFieldChange('fuel', v)}
                  />
                </FieldGroup>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FieldGroup>
                  <AppSelectInput
                    label='Transmisie'
                    options={transmissionOptions}
                    value={String(formData.transmission || '')}
                    onValueChange={(v) => handleFieldChange('transmission', v)}
                  />
                </FieldGroup>
                <FieldGroup>
                  <AppSelectInput
                    label='Culoare'
                    options={colorOptions}
                    value={String(formData.color || '')}
                    onValueChange={(v) => handleFieldChange('color', v)}
                  />
                </FieldGroup>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FieldGroup>
                  <AppInput
                    label='Capacitate Cilindrică'
                    placeholder='0.0'
                    name='engineCapacity'
                    onChange={(e) => handleFieldChange('engineCapacity', e.target.value)}
                    value={String(formData.engineCapacity || '')}
                  />
                </FieldGroup>
                <FieldGroup>
                  <AppSelectInput
                    label='Tip Caroserie'
                    options={carTypeOptions}
                    value={String(formData.carType || '')}
                    onValueChange={(v) => handleFieldChange('carType', v)}
                  />
                </FieldGroup>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FieldGroup>
                  <AppInput
                    label='Putere (CP)'
                    placeholder='0'
                    name='horsePower'
                    onChange={(e) => handleFieldChange('horsePower', e.target.value)}
                    value={String(formData.horsePower || '')}
                  />
                </FieldGroup>
                <FieldGroup>
                  <AppSelectInput
                    label='Tracțiune'
                    options={tractionOptions}
                    value={String(formData.traction || '')}
                    onValueChange={(v) => handleFieldChange('traction', v)}
                  />
                </FieldGroup>
              </div>

              <FieldGroup>
                <AppTextarea
                  label='Caracteristici'
                  placeholder='Enumeră caracteristicile...'
                  name='features'
                  onChange={(v) => handleFieldChange('features', v)}
                  value={String(formData.features || '')}
                />
              </FieldGroup>

              <div className='grid grid-cols-2 gap-4'>
                <FieldGroup>
                  <AppSelectInput
                    label='Status'
                    options={STATUS_OPTIONS}
                    value={String(formData.status || '')}
                    onValueChange={(v) => handleFieldChange('status', v)}
                  />
                </FieldGroup>
                <FieldGroup>
                  <AppSelectInput
                    label='Monedă'
                    options={CURRENCY_OPTIONS}
                    value={String(formData.currency || 'EUR')}
                    onValueChange={(v) => handleFieldChange('currency', v)}
                  />
                </FieldGroup>
              </div>

              <FieldGroup>
                <AppMediaUploaderInput
                  label='Imagini'
                  onFilesChange={handleFileChange}
                  maxFiles={10}
                  showPreview={true}
                  layout='col'
                  uploaderKey={uploaderKey}
                />
                {(filePreviews.length > 0 || (post?.images && post.images.length > 0)) && (
                  <div className='grid grid-cols-4 gap-2 mt-2'>
                    {filePreviews.map((url, idx) => (
                      <div key={idx} className='relative group w-24 h-24'>
                        <Image src={url} alt={`Preview ${idx}`} fill sizes='96px' className='object-cover rounded-md' />
                        <button
                          type='button'
                          onClick={() => handleRemoveFile(idx)}
                          className='absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </FieldGroup>
            </TabsContent>

            <TabsContent value='category' className='space-y-4'>
              {isSell && (
                <>
                  <FieldGroup>
                    <AppInput
                      label='Preț'
                      placeholder='0.00'
                      name='price'
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      value={String(formData.price || '')}
                      required
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <AppInput
                      label='Locație'
                      placeholder='Locația mașinii...'
                      name='location'
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      value={String(formData.location || '')}
                      required
                    />
                  </FieldGroup>
                </>
              )}

              {isBuy && (
                <>
                  <div className='grid grid-cols-2 gap-4'>
                    <FieldGroup>
                      <AppInput
                        label='Preț Minim'
                        placeholder='0.00'
                        name='minPrice'
                        onChange={(e) => handleFieldChange('minPrice', e.target.value)}
                        value={String(formData.minPrice || '')}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <AppInput
                        label='Preț Maxim'
                        placeholder='0.00'
                        name='maxPrice'
                        onChange={(e) => handleFieldChange('maxPrice', e.target.value)}
                        value={String(formData.maxPrice || '')}
                      />
                    </FieldGroup>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FieldGroup>
                      <AppInput
                        label='Kilometraj Minim'
                        placeholder='0'
                        name='minMileage'
                        onChange={(e) => handleFieldChange('minMileage', e.target.value)}
                        value={String(formData.minMileage || '')}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <AppInput
                        label='Kilometraj Maxim'
                        placeholder='0'
                        name='maxMileage'
                        onChange={(e) => handleFieldChange('maxMileage', e.target.value)}
                        value={String(formData.maxMileage || '')}
                      />
                    </FieldGroup>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FieldGroup>
                      <AppInput
                        label='Anul Minim'
                        placeholder='YYYY'
                        name='minYear'
                        onChange={(e) => handleFieldChange('minYear', e.target.value)}
                        value={String(formData.minYear || '')}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <AppInput
                        label='Anul Maxim'
                        placeholder='YYYY'
                        name='maxYear'
                        onChange={(e) => handleFieldChange('maxYear', e.target.value)}
                        value={String(formData.maxYear || '')}
                      />
                    </FieldGroup>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FieldGroup>
                      <AppInput
                        label='Capacitate Minimă'
                        placeholder='0.0'
                        name='minEngineCapacity'
                        onChange={(e) => handleFieldChange('minEngineCapacity', e.target.value)}
                        value={String(formData.minEngineCapacity || '')}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <AppInput
                        label='Capacitate Maximă'
                        placeholder='0.0'
                        name='maxEngineCapacity'
                        onChange={(e) => handleFieldChange('maxEngineCapacity', e.target.value)}
                        value={String(formData.maxEngineCapacity || '')}
                      />
                    </FieldGroup>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Locație</label>
                    <AppLocationInput
                      location={location}
                      onChange={(loc) => setLocation(loc)}
                      placeholder='Selectează sau caută o locație...'
                      label=''
                      showMap={true}
                    />
                  </div>
                </>
              )}

              {isRent && (
                <>
                  <FieldGroup>
                    <AppInput
                      label='Preț per Perioadă'
                      placeholder='0.00'
                      name='price'
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      value={String(formData.price || '')}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <AppSelectInput
                      label='Perioada'
                      options={PERIOD_OPTIONS}
                      value={String(formData.period || 'day')}
                      onValueChange={(v) => handleFieldChange('period', v)}
                    />
                  </FieldGroup>

                  <div className='grid grid-cols-2 gap-4'>
                    <FieldGroup>
                      <AppInput
                        label='Data Început'
                        placeholder='YYYY-MM-DD'
                        name='startDate'
                        onChange={(e) => handleFieldChange('startDate', e.target.value)}
                        value={String(formData.startDate || '')}
                        type='date'
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <AppInput
                        label='Data Sfârșit'
                        placeholder='YYYY-MM-DD'
                        name='endDate'
                        onChange={(e) => handleFieldChange('endDate', e.target.value)}
                        value={String(formData.endDate || '')}
                        type='date'
                      />
                    </FieldGroup>
                  </div>

                  <FieldGroup>
                    <label className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={Boolean(formData.withDriver)}
                        onChange={(e) => handleFieldChange('withDriver', e.target.checked)}
                        className='w-4 h-4'
                      />
                      <span className='text-sm'>Cu șofer</span>
                    </label>
                  </FieldGroup>

                  {formData.withDriver && (
                    <>
                      <FieldGroup>
                        <AppInput
                          label='Numele Șoferului'
                          placeholder='...'
                          name='driverName'
                          onChange={(e) => handleFieldChange('driverName', e.target.value)}
                          value={String(formData.driverName || '')}
                        />
                      </FieldGroup>
                      <FieldGroup>
                        <AppInput
                          label='Contact Șofer'
                          placeholder='Email sau telefon'
                          name='driverContact'
                          onChange={(e) => handleFieldChange('driverContact', e.target.value)}
                          value={String(formData.driverContact || '')}
                        />
                      </FieldGroup>
                      <FieldGroup>
                        <AppInput
                          label='Telefon Șofer'
                          placeholder='+40...'
                          name='driverTelephone'
                          onChange={(e) => handleFieldChange('driverTelephone', e.target.value)}
                          value={String(formData.driverTelephone || '')}
                        />
                      </FieldGroup>
                    </>
                  )}

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Locație</label>
                    <AppLocationInput
                      location={location}
                      onChange={(loc) => setLocation(loc)}
                      placeholder='Selectează sau caută o locație...'
                      label=''
                      showMap={true}
                    />
                  </div>
                </>
              )}

              {isAuction && (
                <>
                  <FieldGroup>
                    <AppInput
                      label='Preț Inițial'
                      placeholder='0.00'
                      name='price'
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      value={String(formData.price || '')}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <AppInput
                      label='Data Sfârșit Licitație'
                      placeholder='YYYY-MM-DDTHH:mm'
                      name='endDate'
                      onChange={(e) => handleFieldChange('endDate', e.target.value)}
                      value={String(formData.endDate || '')}
                      type='datetime-local'
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <AppInput
                      label='Locație'
                      placeholder='Locația mașinii...'
                      name='location'
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      value={String(formData.location || '')}
                    />
                  </FieldGroup>
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => handleOpenChange(false)} disabled={isPending}>
              Anulează
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Se salvează...' : 'Salvează'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
