
// Add React import to fix "Cannot find namespace 'React'" error
import React from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: string;
  isSeasonal?: boolean;
}

export interface Pillar {
  title: string;
  description: string;
  icon: React.ReactNode;
}
