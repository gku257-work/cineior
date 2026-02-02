'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import SearchBar from './SearchBar';
import {
    SunIcon,
    MoonIcon,
    FilmIcon,
    BookmarkIcon,
    StarIcon,
    ArrowRightStartOnRectangleIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

const navLinks = [
    { href: '/discover', label: 'Discover', icon: FilmIcon },
    { href: '/my-list', label: 'My List', icon: BookmarkIcon },
    { href: '/top-movies', label: 'Top Movies', icon: StarIcon },
];

export default function Navigation() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-2xl font-bold gradient-text">Cineior</span>
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:block flex-1 max-w-xl mx-4">
                        <SearchBar />
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-1">
                        {navLinks.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="relative px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                                    style={{
                                        color: isActive ? 'var(--accent)' : 'var(--foreground)',
                                    }}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="hidden lg:inline text-sm font-medium">{label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-lg -z-10"
                                            style={{ background: 'var(--surface-hover)' }}
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg transition-colors hover:opacity-70"
                            style={{ color: 'var(--foreground)' }}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="w-5 h-5" />
                            ) : (
                                <MoonIcon className="w-5 h-5" />
                            )}
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <div className="flex items-center gap-2">
                                <span
                                    className="hidden sm:inline text-sm"
                                    style={{ color: 'var(--muted)' }}
                                >
                                    {user.name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-lg transition-colors hover:opacity-70"
                                    style={{ color: 'var(--foreground)' }}
                                    aria-label="Logout"
                                >
                                    <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary"
                            >
                                <UserCircleIcon className="w-5 h-5" />
                                <span className="hidden sm:inline text-sm font-medium">Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden px-4 pb-3">
                <SearchBar />
            </div>
        </motion.nav>
    );
}
