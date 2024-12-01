import React from 'react';
import {
  HomeIcon,
  SettingsIcon,
  InfoIcon,
  MailIcon,
  UserCircleIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';

const MenuItems = [
  {
    label: 'Home',
    href: '/',
    icon: HomeIcon,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
  {
    label: 'About',
    href: '/about',
    icon: InfoIcon,
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: MailIcon,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: UserCircleIcon,
  },
];

export default async function BottomTab() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="fixed bottom-0 w-full border-t bg-card sm:hidden">
      <div className="flex items-center justify-around pt-3">
        {MenuItems.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            className="flex flex-col items-center gap-0.5">
            {item.label === 'Profile' && user ? (
              <Image
                src={user.image ?? '/avatar-placeholder.png'}
                alt={user.name ?? `@${user.username}`}
                width={28}
                height={28}
                className="size-7 rounded-full"
              />
            ) : (
              <item.icon className="size-7" />
            )}
            <span className="text-2xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
