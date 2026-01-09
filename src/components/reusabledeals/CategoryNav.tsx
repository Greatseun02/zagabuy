// /**
//  * Zagabuy Platform - Category Navigation
//  *
//  * Horizontal category navigation for the marketplace.
//  */

// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";

// import {
//   LayoutGrid,
//   Smartphone,
//   Shirt,
//   Home,
//   Sparkles,
//   Dumbbell,
//   UtensilsCrossed,
//   Plane,
//   Wrench,
//   type LucideIcon,
// } from "lucide-react";

// const categoryIcons: Record<string, LucideIcon> = {
//   Smartphone,
//   Shirt,
//   Home,
//   Sparkles,
//   Dumbbell,
//   UtensilsCrossed,
//   Plane,
//   Wrench,
// };

// interface CategoryNavProps {
//   categories: Category[];
//   activeCategory?: string;
//   onSelect?: (categoryId: string | null) => void;
//   showCounts?: boolean;
//   className?: string;
// }

// export function CategoryNav({
//   categories,
//   activeCategory,
//   onSelect,
//   showCounts = true,
//   className,
// }: CategoryNavProps) {
//   const [location] = useLocation();

//   const handleCategoryClick = (categoryId: string | null) => {
//     if (onSelect) {
//       onSelect(categoryId);
//     }
//   };

//   return (
//     <ScrollArea className={cn("w-full", className)}>
//       <div className="flex items-center gap-2 pb-3" data-testid="category-nav">
//         {/* All Deals Button */}
//         <Button
//           variant={!activeCategory ? "default" : "outline"}
//           size="sm"
//           onClick={() => handleCategoryClick(null)}
//           className="flex-shrink-0"
//           data-testid="button-all-categories"
//         >
//           <LayoutGrid className="h-4 w-4 mr-2" />
//           All Deals
//         </Button>

//         {/* Category Buttons */}
//         {categories.map((category) => {
//           const Icon = categoryIcons[category.iconName || ""] || LayoutGrid;
//           const isActive = activeCategory === category.id;

//           return (
//             <Button
//               key={category.id}
//               variant={isActive ? "default" : "outline"}
//               size="sm"
//               onClick={() => handleCategoryClick(category.id)}
//               className="flex-shrink-0 gap-2"
//               data-testid={`button-category-${category.slug}`}
//             >
//               <Icon className="h-4 w-4" />
//               {category.name}
//               {showCounts && category.dealCount > 0 && (
//                 <Badge
//                   variant="secondary"
//                   className={cn(
//                     "ml-1 text-xs px-1.5",
//                     isActive &&
//                       "bg-primary-foreground/20 text-primary-foreground"
//                   )}
//                 >
//                   {FormatUtils.compact(category.dealCount)}
//                 </Badge>
//               )}
//             </Button>
//           );
//         })}
//       </div>
//       <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//   );
// }
