
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LucideIcon, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type AlertType = 'success' | 'warning' | 'error' | 'info';

interface AlertMessageProps {
  title: string;
  message: string;
  type?: AlertType;
  className?: string;
  icon?: LucideIcon;
  onDismiss?: () => void;
  index?: number;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  title,
  message,
  type = 'info',
  className,
  icon: CustomIcon,
  onDismiss,
  index = 0
}) => {
  const getIconAndStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: CustomIcon || CheckCircle,
          className: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          iconClass: 'text-green-600 dark:text-green-400'
        };
      case 'warning':
        return {
          icon: CustomIcon || AlertTriangle,
          className: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
          iconClass: 'text-amber-600 dark:text-amber-400'
        };
      case 'error':
        return {
          icon: CustomIcon || XCircle,
          className: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          iconClass: 'text-red-600 dark:text-red-400'
        };
      case 'info':
      default:
        return {
          icon: CustomIcon || Info,
          className: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          iconClass: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  const { icon: Icon, className: styleClass, iconClass } = getIconAndStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Alert className={cn(styleClass, className)}>
        <Icon className={cn("h-5 w-5", iconClass)} />
        <AlertTitle className="ml-2">{title}</AlertTitle>
        <AlertDescription className="ml-2">
          {message}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default AlertMessage;
