import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  Home,
  Users,
  Receipt,
  CreditCard,
  MessageSquare,
  Settings,
  BarChart3,
  Wrench,
  DollarSign,
  X,
  Gauge,
} from 'lucide-react';
import { Role } from '@/types';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getNavigationItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: BarChart3,
      },
    ];

    switch (user?.role.role) {
      case Role.ADMIN_ASSOCIATION:
        return [
          ...baseItems,
          {
            title: 'Asociații',
            href: '/associations',
            icon: Building2,
          },
          {
            title: 'Blocuri',
            href: '/blocks',
            icon: Home,
          },
          {
            title: 'Utilizatori',
            href: '/users',
            icon: Users,
          },
          {
            title: 'Cheltuieli',
            href: '/expenses',
            icon: Receipt,
          },
          {
            title: 'Plăți',
            href: '/payments',
            icon: CreditCard,
          },
        ];

      case Role.BLOCK_ADMIN:
        return [
          ...baseItems,
          {
            title: 'Apartamente',
            href: '/apartments',
            icon: Home,
          },
          {
            title: 'Cheltuieli',
            href: '/expenses',
            icon: Receipt,
          },
          {
            title: 'Contoare',
            href: '/meter-readings',
            icon: Gauge,
          },
          {
            title: 'Anunțuri',
            href: '/announcements',
            icon: MessageSquare,
          },
          {
            title: 'Plăți',
            href: '/payments',
            icon: CreditCard,
          },
          {
            title: 'Reparații',
            href: '/repair-requests',
            icon: Wrench,
          },
        ];

      case Role.LOCATAR:
        return [
          ...baseItems,
          {
            title: 'Apartamentul meu',
            href: '/my-apartment',
            icon: Home,
          },
          {
            title: 'Cheltuielile mele',
            href: '/my-expenses',
            icon: Receipt,
          },
          {
            title: 'Plățile mele',
            href: '/my-payments', 
            icon: DollarSign,
          },
          {
            title: 'Sesizările mele',
            href: '/my-repairs',
            icon: Wrench,
          },
          {
            title: 'Anunțuri',
            href: '/announcements',
            icon: MessageSquare,
          },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          'h-screen flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">
              ApartmentPro
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <li key={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start h-10',
                      isActive && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}