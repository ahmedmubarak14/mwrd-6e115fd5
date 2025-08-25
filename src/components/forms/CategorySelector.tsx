
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  includeSubcategories?: boolean;
  className?: string;
}

export const CategorySelector = ({ 
  value, 
  onValueChange, 
  placeholder = "Select a category",
  includeSubcategories = true,
  className 
}: CategorySelectorProps) => {
  const { categories, loading } = useCategories();
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  const getAllCategories = () => {
    const allCats: any[] = [];
    categories.forEach(category => {
      // Only add categories that have valid slugs (not empty strings)
      if (category.slug && category.slug.trim() !== '') {
        allCats.push(category);
      }
      if (includeSubcategories && category.children && category.children.length > 0) {
        category.children.forEach(child => {
          // Only add child categories that have valid slugs
          if (child.slug && child.slug.trim() !== '') {
            allCats.push({ 
              ...child, 
              isChild: true, 
              parentName: language === 'ar' ? category.name_ar : category.name_en 
            });
          }
        });
      }
    });
    return allCats;
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {getAllCategories().map((category) => (
          <SelectItem key={category.id} value={category.slug}>
            {category.isChild && "  ↳ "}
            {language === 'ar' ? category.name_ar : category.name_en}
            {category.isChild && ` (${category.parentName})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
