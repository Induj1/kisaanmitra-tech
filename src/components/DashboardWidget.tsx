
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface DashboardWidgetProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  children: ReactNode;
  className?: string;
  actionLabel?: string;
  actionLink?: string;
  onActionClick?: () => void;
  headerClassName?: string;
  borderColor?: string;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  children,
  className,
  actionLabel,
  actionLink,
  onActionClick,
  headerClassName,
  borderColor
}) => {
  // Create dynamic border style for left border
  const borderStyle = borderColor 
    ? { borderLeftColor: borderColor }
    : {};
  
  return (
    <Card 
      className={cn(
        "h-full shadow-sm overflow-hidden", 
        className, 
        borderColor && "border-l-4 border-t-0"
      )}
      style={borderStyle}
    >
      <CardHeader className={cn("pb-3 flex flex-row items-center justify-between", headerClassName)}>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn("p-2 rounded-full", iconBgColor)}>
              <Icon className={iconColor} size={20} />
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
        
        {(actionLabel && actionLink) && (
          <Button variant="outline" size="sm" asChild>
            <Link to={actionLink}>{actionLabel}</Link>
          </Button>
        )}
        
        {(actionLabel && onActionClick) && (
          <Button variant="outline" size="sm" onClick={onActionClick}>
            {actionLabel}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;
