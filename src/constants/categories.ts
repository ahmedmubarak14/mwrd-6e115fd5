export type Category = {
  value: string;
  labelEn: string;
  labelAr: string;
};

export const CATEGORIES: Category[] = [
  { value: 'avl', labelEn: 'Audio, Visual & Lighting', labelAr: 'الصوت والإضاءة والمرئيات' },
  { value: 'catering', labelEn: 'Catering Services', labelAr: 'خدمات الطعام' },
  { value: 'decoration', labelEn: 'Decoration & Design', labelAr: 'الديكور والتزيين' },
  { value: 'furniture', labelEn: 'Furniture', labelAr: 'الأثاث' },
  { value: 'security', labelEn: 'Security', labelAr: 'الأمن' },
  { value: 'transportation', labelEn: 'Transportation', labelAr: 'النقل' },
];

export const getCategoryLabel = (value: string, language: 'en' | 'ar' = 'en') => {
  const item = CATEGORIES.find(c => c.value === value);
  if (!item) return value;
  return language === 'ar' ? item.labelAr : item.labelEn;
};
