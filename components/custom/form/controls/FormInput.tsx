'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

type FormInputProps = React.ComponentProps<typeof Input> & {
  className?: string;
};

export default function FormInput(props: FormInputProps) {
  const { type = 'text', onChange, className = '', ...rest } = props;

  const classes = `${className} w-full`;
  return <Input {...(rest as unknown as Record<string, unknown>)} type={type} onChange={onChange} className={classes} />;
}
