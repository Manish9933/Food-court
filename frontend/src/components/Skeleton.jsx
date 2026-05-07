import React from 'react';

/* ─── Base Skeleton ─── */
const Skeleton = ({ className = '', height, width, borderRadius = '1rem', style = {} }) => (
  <div
    className={`skeleton-shimmer ${className}`}
    style={{
      height: height || '100%',
      width: width || '100%',
      borderRadius,
      ...style,
    }}
  />
);

/* ─── Food Card Skeleton (Menu / Home) ─── */
export const FoodCardSkeleton = () => (
  <div className="glass-card rounded-[2.5rem] p-4 flex flex-col gap-4">
    <Skeleton height="200px" borderRadius="1.75rem" />
    <div className="px-2 space-y-3">
      <Skeleton height="10px" width="30%" />
      <Skeleton height="24px" width="70%" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton height="28px" width="40%" />
        <Skeleton height="40px" width="40%" borderRadius="0.75rem" />
      </div>
    </div>
  </div>
);

/* ─── Category Pills Skeleton ─── */
export const CategorySkeleton = () => (
  <div className="flex gap-4 overflow-hidden mb-12">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} height="48px" width="120px" borderRadius="1.25rem" className="flex-shrink-0" />
    ))}
  </div>
);

/* ─── Home Page Full Skeleton ─── */
export const HomePageSkeleton = () => (
  <div className="min-h-screen relative z-10 space-y-24 py-8">
    {/* Hero */}
    <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-20">
      <div className="space-y-6">
        <Skeleton height="32px" width="220px" borderRadius="9999px" />
        <Skeleton height="64px" width="90%" borderRadius="0.5rem" />
        <Skeleton height="48px" width="70%" borderRadius="0.5rem" />
        <Skeleton height="20px" width="80%" />
        <Skeleton height="20px" width="60%" />
        <div className="flex gap-4 pt-4">
          <Skeleton height="56px" width="180px" borderRadius="1rem" />
          <Skeleton height="56px" width="160px" borderRadius="1rem" />
        </div>
      </div>
      <Skeleton height="500px" borderRadius="4rem" />
    </section>
    {/* Categories */}
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <Skeleton height="12px" width="120px" className="mx-auto" />
          <Skeleton height="48px" width="320px" className="mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <Skeleton key={i} height="160px" borderRadius="3rem" />
          ))}
        </div>
      </div>
    </section>
    {/* Popular Items */}
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-3">
            <Skeleton height="12px" width="100px" />
            <Skeleton height="48px" width="300px" />
          </div>
          <Skeleton height="14px" width="120px" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1,2,3,4].map(i => <FoodCardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  </div>
);

/* ─── Menu Page Skeleton ─── */
export const MenuPageSkeleton = () => (
  <div className="relative pt-40 pb-20 px-6 min-h-screen">
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
        <div className="space-y-4 max-w-2xl">
          <Skeleton height="12px" width="80px" />
          <Skeleton height="64px" width="400px" />
          <Skeleton height="20px" width="280px" />
        </div>
        <div className="flex gap-3 bg-white/[0.03] p-2.5 rounded-[2.5rem]">
          {[1,2,3,4,5].map(i => (
            <Skeleton key={i} height="48px" width="100px" borderRadius="1rem" />
          ))}
        </div>
      </div>
      {/* Search */}
      <div className="flex gap-8 items-center">
        <Skeleton height="72px" borderRadius="3rem" className="flex-1" />
        <Skeleton height="72px" width="200px" borderRadius="2.5rem" />
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {[1,2,3,4,5,6,7,8].map(i => <FoodCardSkeleton key={i} />)}
      </div>
    </div>
  </div>
);

/* ─── Cart Page Skeleton ─── */
export const CartPageSkeleton = () => (
  <div className="pt-40 pb-20 px-6 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Items */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex justify-between items-end mb-10">
            <div className="space-y-3">
              <Skeleton height="48px" width="300px" />
              <Skeleton height="16px" width="150px" />
            </div>
            <Skeleton height="14px" width="140px" />
          </div>
          {[1,2,3].map(i => (
            <div key={i} className="glass-card p-6 rounded-[2.5rem] flex items-center gap-8">
              <Skeleton height="128px" width="128px" borderRadius="1.75rem" />
              <div className="flex-1 space-y-3">
                <Skeleton height="10px" width="60px" />
                <Skeleton height="28px" width="200px" />
                <div className="flex justify-between items-end mt-4">
                  <Skeleton height="32px" width="100px" />
                  <Skeleton height="44px" width="140px" borderRadius="1.25rem" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="w-full lg:w-[420px]">
          <div className="glass-card p-10 rounded-[3rem] space-y-8">
            <Skeleton height="32px" width="200px" />
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex justify-between">
                  <Skeleton height="12px" width="80px" />
                  <Skeleton height="20px" width="60px" />
                </div>
              ))}
            </div>
            <Skeleton height="1px" width="100%" />
            <div className="flex justify-between items-end">
              <Skeleton height="12px" width="60px" />
              <Skeleton height="48px" width="160px" />
            </div>
            <Skeleton height="56px" borderRadius="1.75rem" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Checkout Page Skeleton ─── */
export const CheckoutPageSkeleton = () => (
  <div className="pt-32 pb-20 px-6 min-h-screen">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <Skeleton height="48px" width="48px" borderRadius="1rem" />
        <Skeleton height="40px" width="350px" />
      </div>
      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-3 space-y-8">
          {/* Address */}
          <div className="glass p-10 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton height="40px" width="40px" borderRadius="0.75rem" />
              <Skeleton height="24px" width="200px" />
            </div>
            <Skeleton height="52px" borderRadius="1rem" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton height="52px" borderRadius="1rem" />
              <Skeleton height="52px" borderRadius="1rem" />
            </div>
          </div>
          {/* Payment */}
          <div className="glass p-10 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton height="40px" width="40px" borderRadius="0.75rem" />
              <Skeleton height="24px" width="180px" />
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[1,2,3].map(i => <Skeleton key={i} height="100px" borderRadius="2rem" />)}
            </div>
          </div>
        </div>
        {/* Receipt */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-10 rounded-[3.5rem] space-y-6">
            <Skeleton height="28px" width="180px" />
            {[1,2,3].map(i => (
              <div key={i} className="flex justify-between">
                <Skeleton height="14px" width="150px" />
                <Skeleton height="14px" width="60px" />
              </div>
            ))}
            <Skeleton height="1px" />
            <div className="flex justify-between items-center pt-4">
              <Skeleton height="12px" width="80px" />
              <Skeleton height="40px" width="120px" />
            </div>
            <Skeleton height="60px" borderRadius="2rem" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Profile Page Skeleton ─── */
export const ProfilePageSkeleton = () => (
  <div className="pt-32 pb-20 px-6 min-h-screen">
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[3rem] text-center space-y-6">
            <Skeleton height="160px" width="160px" borderRadius="50%" className="mx-auto" />
            <Skeleton height="32px" width="180px" className="mx-auto" />
            <Skeleton height="14px" width="200px" className="mx-auto" />
            <div className="bg-white/5 rounded-2xl p-4 flex justify-around">
              <div className="space-y-2 text-center">
                <Skeleton height="10px" width="40px" className="mx-auto" />
                <Skeleton height="20px" width="80px" className="mx-auto" />
              </div>
              <div className="space-y-2 text-center">
                <Skeleton height="10px" width="30px" className="mx-auto" />
                <Skeleton height="20px" width="50px" className="mx-auto" />
              </div>
            </div>
          </div>
          <div className="glass p-6 rounded-[2.5rem] space-y-4">
            <Skeleton height="14px" width="140px" />
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => <Skeleton key={i} height="44px" borderRadius="1rem" />)}
            </div>
          </div>
        </div>
        {/* Settings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass p-10 rounded-[3rem] space-y-8">
            <div className="flex justify-between items-center">
              <Skeleton height="40px" width="280px" />
              <Skeleton height="36px" width="140px" borderRadius="1rem" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton height="10px" width="80px" />
                  <Skeleton height="52px" borderRadius="1rem" />
                </div>
                <div className="space-y-2">
                  <Skeleton height="10px" width="100px" />
                  <Skeleton height="52px" borderRadius="1rem" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton height="10px" width="120px" />
                  <Skeleton height="52px" borderRadius="1rem" />
                </div>
                <Skeleton height="140px" borderRadius="2rem" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="glass p-6 rounded-[2rem] flex items-center gap-4">
                <Skeleton height="44px" width="44px" borderRadius="1rem" />
                <div className="space-y-2 flex-1">
                  <Skeleton height="10px" width="80px" />
                  <Skeleton height="20px" width="50px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Order History Skeleton ─── */
export const OrderHistorySkeleton = () => (
  <div className="pt-32 pb-20 px-6 min-h-screen">
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <Skeleton height="48px" width="380px" />
          <Skeleton height="14px" width="250px" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton height="52px" width="300px" borderRadius="1rem" />
          <Skeleton height="52px" width="180px" borderRadius="1rem" />
        </div>
      </div>
      <div className="space-y-6">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <Skeleton height="64px" width="64px" borderRadius="1.25rem" />
              <div className="space-y-2">
                <div className="flex gap-3">
                  <Skeleton height="14px" width="80px" />
                  <Skeleton height="14px" width="100px" />
                </div>
                <Skeleton height="20px" width="220px" />
                <Skeleton height="14px" width="150px" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton height="48px" width="48px" borderRadius="1rem" />
              <Skeleton height="48px" width="180px" borderRadius="1rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Track Order Skeleton ─── */
export const TrackOrderSkeleton = () => (
  <div className="pt-32 pb-20 px-6 min-h-screen">
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <Skeleton height="56px" width="56px" borderRadius="2rem" />
          <div className="space-y-3">
            <Skeleton height="48px" width="360px" />
            <div className="flex gap-4">
              <Skeleton height="12px" width="140px" />
              <Skeleton height="12px" width="160px" />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton height="48px" width="160px" borderRadius="1rem" />
          <Skeleton height="48px" width="160px" borderRadius="1rem" />
        </div>
      </div>
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Timeline */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 rounded-[4rem] space-y-10">
            <div className="flex justify-between">
              <Skeleton height="14px" width="140px" />
              <Skeleton height="20px" width="70px" borderRadius="0.5rem" />
            </div>
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-start gap-8">
                <Skeleton height="48px" width="48px" borderRadius="1.25rem" />
                <div className="space-y-2 flex-1">
                  <Skeleton height="12px" width="120px" />
                  <Skeleton height="10px" width="80px" />
                </div>
              </div>
            ))}
          </div>
          {/* Courier */}
          <div className="glass p-8 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-6">
              <Skeleton height="96px" width="96px" borderRadius="2.5rem" />
              <div className="space-y-2 flex-1">
                <Skeleton height="10px" width="100px" />
                <Skeleton height="28px" width="180px" />
                <Skeleton height="10px" width="120px" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton height="48px" borderRadius="1rem" />
              <Skeleton height="48px" borderRadius="1rem" />
            </div>
          </div>
        </div>
        {/* Map */}
        <div className="lg:col-span-8 space-y-8">
          <Skeleton height="520px" borderRadius="4rem" />
          <div className="glass rounded-[3rem] p-10 space-y-6">
            <div className="flex justify-between">
              <Skeleton height="12px" width="120px" />
              <Skeleton height="16px" width="80px" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl">
                  <Skeleton height="48px" width="48px" borderRadius="0.75rem" />
                  <div className="space-y-2 flex-1">
                    <Skeleton height="12px" width="100px" />
                    <Skeleton height="10px" width="60px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Contact Page Skeleton ─── */
export const ContactPageSkeleton = () => (
  <div className="pt-16 pb-20 px-6 min-h-[calc(100vh-110px)]">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-10">
          <div className="space-y-4">
            <Skeleton height="24px" width="140px" borderRadius="9999px" />
            <Skeleton height="56px" width="400px" />
            <Skeleton height="20px" width="300px" />
          </div>
          <Skeleton height="140px" borderRadius="3rem" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass p-6 rounded-[2.5rem] space-y-4">
                <Skeleton height="48px" width="48px" borderRadius="1rem" />
                <Skeleton height="18px" width="120px" />
                <Skeleton height="10px" width="100px" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-[500px]">
          <Skeleton height="600px" borderRadius="3rem" />
        </div>
      </div>
    </div>
  </div>
);

/* ─── Recommend Page Skeleton ─── */
export const RecommendPageSkeleton = () => (
  <div className="pt-40 pb-20 px-6 min-h-screen">
    <div className="max-w-5xl mx-auto text-center space-y-10">
      <Skeleton height="96px" width="96px" borderRadius="2.5rem" className="mx-auto" />
      <Skeleton height="60px" width="500px" className="mx-auto" />
      <Skeleton height="20px" width="320px" className="mx-auto" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6">
        {[1,2,3,4].map(i => (
          <Skeleton key={i} height="288px" borderRadius="3.5rem" />
        ))}
      </div>
    </div>
  </div>
);

/* ─── Build Your Plate Skeleton ─── */
export const BuildPlateSkeleton = () => (
  <div className="min-h-screen px-4 sm:px-6 pb-8">
    <div className="max-w-[1400px] mx-auto">
      <div className="py-6 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton height="32px" width="32px" borderRadius="0.75rem" />
          <Skeleton height="12px" width="90px" />
        </div>
        <Skeleton height="36px" width="280px" />
        <Skeleton height="14px" width="320px" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-6 py-8">
        <Skeleton height="calc(100vh - 300px)" borderRadius="2rem" />
        <Skeleton height="calc(100vh - 300px)" borderRadius="2rem" />
        <Skeleton height="calc(100vh - 300px)" borderRadius="2rem" />
      </div>
    </div>
  </div>
);

/* ─── Admin Dashboard Skeleton ─── */
export const AdminDashboardSkeleton = () => (
  <div className="space-y-10 pb-20">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <Skeleton height="40px" width="340px" />
        <Skeleton height="16px" width="280px" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-[#111114] border border-white/5 rounded-[2rem] p-6 space-y-6">
          <div className="flex justify-between">
            <Skeleton height="56px" width="56px" borderRadius="1rem" />
            <Skeleton height="28px" width="70px" borderRadius="9999px" />
          </div>
          <div className="space-y-2">
            <Skeleton height="12px" width="100px" />
            <Skeleton height="32px" width="120px" />
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
        <div className="space-y-2">
          <Skeleton height="28px" width="220px" />
          <Skeleton height="12px" width="140px" />
        </div>
        <Skeleton height="400px" borderRadius="1rem" />
      </div>
      <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex justify-between">
          <Skeleton height="28px" width="160px" />
          <Skeleton height="14px" width="60px" />
        </div>
        {[1,2,3,4].map(i => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton height="48px" width="48px" borderRadius="1rem" />
            <div className="flex-1 space-y-2">
              <Skeleton height="14px" width="140px" />
              <Skeleton height="10px" width="200px" />
            </div>
            <Skeleton height="24px" width="70px" borderRadius="0.75rem" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Admin Table Skeleton (Orders, Users, Menu, etc.) ─── */
export const AdminTableSkeleton = ({ rows = 6, cols = 5 }) => (
  <div className="space-y-8 pb-20">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <Skeleton height="40px" width="300px" />
        <Skeleton height="16px" width="240px" />
      </div>
      <Skeleton height="48px" width="200px" borderRadius="1rem" />
    </div>
    <div className="flex gap-4">
      <Skeleton height="48px" borderRadius="1rem" className="flex-1 min-w-[300px]" />
      <Skeleton height="48px" width="160px" borderRadius="1rem" />
    </div>
    <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-6 bg-white/[0.02] border-b border-white/5">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="12px" width={i === 0 ? '100px' : '120px'} className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-6 border-b border-white/5 items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} height={c === 0 ? '20px' : '16px'} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
