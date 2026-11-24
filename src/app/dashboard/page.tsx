'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  XCircle,
  MessageSquare,
  RefreshCw,
  Search,
  Download,
  Copy,
  Check,
  Trash2,
  Lock,
  Unlock,
  Heart,
  ChevronLeft,
  Phone,
  Calendar,
  LogOut,
  SlidersHorizontal,
  Music,
  Play,
  Pause,
  Volume2,
} from 'lucide-react';
import { fetchRsvps, deleteRsvpApi, StoredRsvpItem } from '../../utils/rsvp';
import { MUSIC_CONFIG, MUSIC_PRESETS, getEffectiveMusicStartTime, updateMusicStartTime } from '../../config/audio';

const DASHBOARD_PIN = '2027'; // رمز الدخول السريع للعروسين

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [items, setItems] = useState<StoredRsvpItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Music Settings State
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [startTimeInput, setStartTimeInput] = useState<number>(MUSIC_CONFIG.startTime);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showMusicSettings, setShowMusicSettings] = useState<boolean>(false);

  useEffect(() => {
    setStartTimeInput(getEffectiveMusicStartTime());
  }, []);

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('wedding_couple_authenticated');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Load data when authenticated
  const loadData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const list = await fetchRsvps();
      setItems(list);
    } catch (err) {
      console.error('Failed to load RSVPs:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DASHBOARD_PIN) {
      setIsAuthenticated(true);
      setPinError('');
      try {
        localStorage.setItem('wedding_couple_authenticated', 'true');
      } catch { }
    } else {
      setPinError('رمز الدخول غير صحيح، جرب سنة الفرح (2027)');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('wedding_couple_authenticated');
    } catch { }
  };

  // Filtered list
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.message && item.message.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter =
        activeFilter === 'all'
          ? true
          : activeFilter === 'yes'
            ? item.attending === 'yes'
            : item.attending === 'no';

      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, activeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalWishes = items.length;
    const attendingCount = items.filter((i) => i.attending === 'yes').length;
    const declinedCount = items.filter((i) => i.attending === 'no').length;
    const totalGuests = items
      .filter((i) => i.attending === 'yes')
      .reduce((sum, curr) => sum + (Number(curr.guests) || 1), 0);

    return { totalWishes, attendingCount, declinedCount, totalGuests };
  }, [items]);

  // Copy wish text to clipboard
  const handleCopyWish = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  // Music Preview & Configuration Handlers
  const handleTogglePreview = () => {
    if (!previewAudioRef.current) return;
    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.currentTime = startTimeInput;
      previewAudioRef.current.volume = 0.5;
      previewAudioRef.current
        .play()
        .then(() => setIsPlayingPreview(true))
        .catch(() => setIsPlayingPreview(false));
    }
  };

  const handleSelectPreset = (seconds: number) => {
    setStartTimeInput(seconds);
    if (previewAudioRef.current) {
      previewAudioRef.current.currentTime = seconds;
      if (!isPlayingPreview) {
        previewAudioRef.current.play().then(() => setIsPlayingPreview(true)).catch(() => { });
      }
    }
  };

  const handleSaveMusicStart = async () => {
    try {
      localStorage.setItem('wedding_music_start_time', String(startTimeInput));
      await updateMusicStartTime(startTimeInput);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch { }
  };

  // Delete wish
  const handleDelete = async (id: string) => {
    const success = await deleteRsvpApi(id);
    if (success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setDeleteConfirmId(null);
    }
  };

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (items.length === 0) return;

    const headers = ['الاسم', 'الحالة', 'عدد الأفراد', 'الرسالة / التهنئة', 'تاريخ الإرسال'];
    const rows = items.map((i) => [
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${i.attending === 'yes' ? 'حاضر' : 'معتذر'}"`,
      i.guests || 1,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${new Date(i.submittedAt).toLocaleString('ar-EG')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تهاني_فرح_رحمة_وعمر_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. PIN Security Screen
  if (!isAuthenticated) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#1E1815] text-[#4E3E37] flex flex-col justify-center items-center px-4 py-8 font-cairo"
      >
        <div className="w-full max-w-sm rounded-[32px] border border-gold/40 bg-cream/95 backdrop-blur-md p-7 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/50 mx-auto flex items-center justify-center text-gold-dark mb-4 shadow-inner">
            <Lock className="w-8 h-8 text-[#78550E]" />
          </div>

          <span className="text-xs font-bold tracking-wider text-[#78550E] uppercase block mb-1">
            منطقة العروسين الخاصة
          </span>
          <h1 className="text-2xl font-bold font-serif text-taupe-dark">
            لوحة تحكم رحمة وعمر
          </h1>
          <p className="text-xs text-taupe-dark/80 mt-1 mb-6">
            أدخل رمز المرور لعرض دفتر التهاني وتأكيدات الحضور
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError('');
                }}
                placeholder="رمز المرور (مثال: 2027)"
                className="w-full text-center tracking-[0.3em] font-mono text-xl py-3 px-4 rounded-full border border-gold/50 bg-white/90 text-[#78550E] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 shadow-xs"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-dark mt-2 font-medium">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 min-h-[44px] rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>دخول لوحة التحكم</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gold/20 flex items-center justify-between text-xs text-taupe/70">
            <Link
              href="/"
              className="hover:text-gold-dark transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>العودة لصفحة الدعوة</span>
            </Link>
            <span className="text-[11px] text-taupe/60">١ يناير ٢٠٢٧</span>
          </div>
        </div>
      </main>
    );
  }

  // 2. Authenticated Dashboard Screen
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#1E1815] text-[#4E3E37] flex flex-col items-center px-3 sm:px-4 py-4 sm:py-6 font-cairo selection:bg-rose/40 selection:text-taupe-dark"
    >
      <div className="w-full max-w-lg bg-cream/95 min-h-[92vh] rounded-[32px] sm:rounded-[36px] border border-gold/40 shadow-2xl p-4 sm:p-6 flex flex-col">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pb-4 border-b border-gold/25">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/50 flex items-center justify-center text-[#78550E] shadow-xs">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold font-serif text-taupe-dark leading-tight">
                  فرح رحمة وعمر
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1 animate-pulse"></span>
                  مباشر
                </span>
              </div>
              <p className="text-[11px] text-[#78550E] font-medium">لوحة تحكم التهاني والحضور</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              title="تحديث البيانات"
              aria-label="تحديث البيانات"
              className="p-2 min-h-[38px] min-w-[38px] rounded-full bg-white/80 border border-gold/40 text-[#78550E] hover:border-gold hover:bg-white transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-gold-dark' : ''}`}
              />
            </button>

            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
              className="p-2 min-h-[38px] min-w-[38px] rounded-full bg-white/80 border border-gold/40 text-taupe hover:text-rose-dark hover:border-rose/40 hover:bg-white transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <Link
              href="/"
              title="عرض صفحة الدعوة"
              className="px-3 py-2 min-h-[38px] rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1"
            >
              <span>الدعوة</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* 4 Stats Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          {/* Stat 1: Total Wishes */}
          <div className="bg-white/90 border border-gold/30 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#78550E]">
              <span className="text-[11px] font-bold">إجمالي التهاني</span>
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-taupe-dark mt-1">
              {stats.totalWishes}
            </div>
          </div>

          {/* Stat 2: Attending */}
          <div className="bg-emerald-50/80 border border-emerald-300/70 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[11px] font-bold">أكيد جايين</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-900 mt-1">
              {stats.attendingCount}
            </div>
          </div>

          {/* Stat 3: Total Headcount */}
          <div className="bg-amber-50/80 border border-amber-300/70 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-900">
              <span className="text-[11px] font-bold">إجمالي الأفراد</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-950 mt-1">
              {stats.totalGuests}
            </div>
          </div>

          {/* Stat 4: Declined */}
          <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-800">
              <span className="text-[11px] font-bold">معتذرين</span>
              <XCircle className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-rose-900 mt-1">
              {stats.declinedCount}
            </div>
          </div>
        </section>

        {/* Hidden Preview Audio for Dashboard */}
        <audio
          ref={previewAudioRef}
          src={MUSIC_CONFIG.src}
          preload="none"
          onEnded={() => setIsPlayingPreview(false)}
          onPause={() => setIsPlayingPreview(false)}
        />

        {/* Wedding Music Settings Card */}
        <section className="bg-white/95 border border-gold/40 rounded-2xl p-3.5 mb-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-[#78550E]">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-taupe-dark">
                  موسيقى الزفة وجزء التشغيل
                </h2>
                <p className="text-[11px] text-[#78550E]">
                  تبدأ بعد فتح الظرف من:{' '}
                  <span className="font-bold font-mono">
                    {Math.floor(startTimeInput / 60)}:
                    {(startTimeInput % 60).toString().padStart(2, '0')}
                  </span>{' '}
                  (الثانية {startTimeInput})
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowMusicSettings((prev) => !prev)}
              className="text-xs font-bold text-[#78550E] hover:underline px-2.5 py-1 rounded-full bg-gold/10 border border-gold/30 cursor-pointer"
            >
              {showMusicSettings ? 'إخفاء' : 'تعديل الوقت'}
            </button>
          </div>

          {showMusicSettings && (
            <div className="mt-3 pt-3 border-t border-gold/20 space-y-3">
              <div>
                <span className="text-[11px] font-bold text-taupe block mb-1.5">
                  مقاطع مقترحة سريعة (اضغط لتجربة أي مقطع):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {MUSIC_PRESETS.map((preset) => (
                    <button
                      key={preset.seconds}
                      type="button"
                      onClick={() => handleSelectPreset(preset.seconds)}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer font-medium ${startTimeInput === preset.seconds
                        ? 'bg-[#78550E] text-white border-[#78550E] shadow-xs'
                        : 'bg-white text-taupe border-gold/40 hover:border-gold'
                        }`}
                    >
                      {preset.timeStr} • {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider & Custom Input */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="1"
                  value={startTimeInput}
                  onChange={(e) => {
                    const sec = parseInt(e.target.value, 10) || 0;
                    setStartTimeInput(sec);
                    if (previewAudioRef.current) {
                      previewAudioRef.current.currentTime = sec;
                    }
                  }}
                  className="flex-1 accent-[#78550E] cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-[#78550E] min-w-[50px] text-center">
                  {Math.floor(startTimeInput / 60)}:
                  {(startTimeInput % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Buttons: Test Play & Save */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTogglePreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gold/50 text-xs font-bold text-[#78550E] hover:border-gold hover:shadow-xs transition-all cursor-pointer"
                >
                  {isPlayingPreview ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>إيقاف المعاينة</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>استماع للمقطع المختار</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveMusicStart}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم الحفظ بنجاح!</span>
                    </>
                  ) : (
                    <span>حفظ وقت البدء</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Search & Export Bar */}
        <section className="space-y-2 mb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-taupe/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو بكلمة من التهنئة..."
              className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm rounded-full border border-gold/40 bg-white/90 text-taupe-dark placeholder:text-taupe/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-taupe hover:text-rose cursor-pointer"
              >
                مسح
              </button>
            )}
          </div>

          {/* Filter Tabs & Export Button */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-gold/30 shadow-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${activeFilter === 'all'
                  ? 'bg-[#78550E] text-white shadow-xs'
                  : 'text-taupe hover:text-[#78550E]'
                  }`}
              >
                الكل ({items.length})
              </button>
              <button
                onClick={() => setActiveFilter('yes')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${activeFilter === 'yes'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-taupe hover:text-emerald-800'
                  }`}
              >
                جايين ({stats.attendingCount})
              </button>
              <button
                onClick={() => setActiveFilter('no')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${activeFilter === 'no'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-taupe hover:text-rose-800'
                  }`}
              >
                اعتذار ({stats.declinedCount})
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={items.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gold/50 bg-white hover:border-gold hover:bg-gold/10 text-xs font-bold text-[#78550E] transition-all cursor-pointer shadow-xs disabled:opacity-40"
              title="تحميل ملف Excel بكل التهاني"
            >
              <Download className="w-3.5 h-3.5 text-gold-dark" />
              <span>تصدير Excel</span>
            </button>
          </div>
        </section>

        {/* Wishes List (Cards) */}
        <section className="flex-1 overflow-y-auto space-y-3 pr-0.5">
          {isLoading ? (
            <div className="py-16 text-center text-taupe/70 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-gold-dark" />
              <p className="text-xs font-medium">جارٍ تحميل التهاني...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-gold/40 bg-white/50 p-6 flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="w-8 h-8 text-gold/60" />
              <p className="font-bold text-sm text-taupe-dark">لا توجد تهاني مطابقة</p>
              <p className="text-xs text-taupe/70 max-w-xs">
                {searchQuery
                  ? 'لم يتم العثور على أي تهنئة تطابق البحث.'
                  : 'أي ضيف يسجل كلمة أو تأكيد حضور من الموقع ستظهر تهنئته هنا فوراً.'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isAttending = item.attending === 'yes';
              const formattedDate = new Date(item.submittedAt).toLocaleDateString('ar-EG', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="relative rounded-2xl bg-white border border-gold/30 shadow-xs p-3.5 sm:p-4 hover:border-gold/60 transition-all text-start"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-taupe-dark">
                        {item.name}
                      </h3>
                      <span className="text-[11px] text-taupe/60 block mt-0.5">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {isAttending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>أكيد حاضر</span>
                          {item.guests > 1 && (
                            <span className="bg-emerald-200 text-emerald-900 rounded-full px-1.5 py-0.2 text-[10px]">
                              +{item.guests - 1} مرافق
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>اعتذار بمحبة</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  {item.message ? (
                    <div className="rounded-xl bg-blush-50/60 border border-gold/20 p-3 my-2 text-xs sm:text-sm text-taupe-dark font-serif italic leading-relaxed">
                      "{item.message}"
                    </div>
                  ) : (
                    <div className="text-[11px] text-taupe/50 italic my-1">
                      (لم يكتب رسالة، أكد الحضور فقط)
                    </div>
                  )}

                  {/* Action Buttons on Card */}
                  <div className="flex items-center justify-between pt-2 border-t border-gold/15 mt-2">
                    <div className="text-[11px] text-[#78550E] font-medium">
                      {isAttending ? `عدد الأفراد: ${item.guests || 1}` : 'اعتذر عن الحضور'}
                    </div>

                    <div className="flex items-center gap-1">
                      {item.message && (
                        <button
                          onClick={() => handleCopyWish(item.id, item.message!)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#78550E] hover:bg-gold/10 transition-colors cursor-pointer"
                          title="نسخ نص التهنئة"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-gold-dark" />
                              <span>نسخ</span>
                            </>
                          )}
                        </button>
                      )}

                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-300">
                          <span className="text-[10px] text-rose-700 font-bold">تأكيد؟</span>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-[11px] text-rose-700 font-bold hover:underline cursor-pointer"
                          >
                            نعم
                          </button>
                          <span className="text-rose-400">|</span>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-[11px] text-taupe hover:underline cursor-pointer"
                          >
                            لا
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 rounded-full text-taupe/40 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="حذف التهنئة"
                          aria-label="حذف التهنئة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Footer info */}
        <footer className="pt-3 border-t border-gold/20 mt-3 text-center text-[11px] text-taupe/60 flex items-center justify-between">
          <span>فرح رحمة وعمر • ١ يناير ٢٠٢٧</span>
          <span>رمز الدخول الافتراضي: 2027</span>
        </footer>
      </div>
    </main>
  );
}
