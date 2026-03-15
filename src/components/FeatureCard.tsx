
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  englishTitle?: string;
  description: string;
  englishDescription?: string;
  icon: LucideIcon;
  color: string;
  route?: string;
  buttonText?: string;
  buttonHindi?: string;
  onClick?: () => void;
  className?: string;
  iconBgColor?: string;
  index?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  englishTitle,
  description,
  englishDescription,
  icon: Icon,
  color,
  route,
  buttonText = "Learn More",
  buttonHindi,
  onClick,
  className,
  iconBgColor,
  index = 0
}) => {
  const cardContent = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="h-full"
    >
      <Card className={cn(
        "overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col border-t-4 hover:translate-y-[-5px]",
        className
      )} style={{ borderTopColor: color }}>
        <CardHeader className={cn("pb-3", iconBgColor)}>
          <div className="flex items-center space-x-3">
            <div className={cn("p-3 rounded-full", color, "text-white")}>
              <Icon size={24} />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {englishTitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-noto">{englishTitle}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-4 flex-grow">
          <p className="text-foreground/80 text-sm mb-2">{description}</p>
          {englishDescription && (
            <p className="text-foreground/60 text-xs">{englishDescription}</p>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            className="w-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center gap-2"
            onClick={onClick}
          >
            {buttonText}
            {buttonHindi && (
              <span className="ml-1 text-sm font-noto">({buttonHindi})</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  if (route) {
    return <Link to={route} className="block h-full">{cardContent}</Link>;
  }

  return cardContent;
};

export default FeatureCard;
