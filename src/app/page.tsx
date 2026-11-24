'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App').then((mod) => mod.App), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen w-full bg-[#1E1815] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A24B] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function Page() {
  return <App />;
}
