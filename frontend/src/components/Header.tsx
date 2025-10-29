"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function HeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      router.push(`/?search=${encodeURIComponent(value)}`);
    } else {
      router.push("/");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <header className={`flex justify-between items-center px-6 md:px-16 py-4 bg-[var(--color-bg-light)] sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg backdrop-blur-sm bg-opacity-95' : 'shadow-sm'
    }`}>
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => router.push("/")}
      >
        <div className="relative w-[120px] h-[50px] group-hover:scale-110 transition-transform duration-200">
          <Image
            src="/logo.png"
            alt="Highway Delite Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search experiences"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border border-[var(--color-border)] rounded-lg px-4 py-2 w-60 md:w-80 text-[var(--color-dark)] placeholder:text-[var(--color-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-300 focus:shadow-lg group-hover:border-[var(--color-gray)]"
          />
          <div className="absolute inset-0 rounded-lg bg-[var(--color-primary)] opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        <button
          onClick={() => {
            if (searchQuery.trim()) {
              router.push(`/?search=${encodeURIComponent(searchQuery)}`);
            } else {
              router.push("/");
            }
          }}
          className="bg-[var(--color-primary)] text-[var(--color-dark)] px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-xl relative overflow-hidden group"
        >
          <span className="relative z-10">Search</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="flex justify-between items-center px-6 md:px-16 py-4 bg-[var(--color-bg-light)] sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="relative w-[120px] h-[50px]">
            <Image
              src="/logo.png"
              alt="Highway Delite Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search experiences"
              disabled
              className="border border-[var(--color-border)] rounded-lg px-4 py-2 w-60 md:w-80 text-[var(--color-dark)] placeholder:text-[var(--color-gray)] bg-white/50"
            />
          </div>
          <button
            disabled
            className="bg-[var(--color-primary)] text-[var(--color-dark)] px-4 py-2 rounded-lg font-medium shadow-md opacity-75"
          >
            Search
          </button>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  );
}
