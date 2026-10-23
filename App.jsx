import { useCallback, useMemo, useState } from 'react'
import { Camera, Check, Heart, RefreshCw, Search, Sparkles, X } from 'lucide-react'
import { PhotoCard } from './components/PhotoCard'
import { PhotoModal } from './components/PhotoModal'
import { PhotoSkeleton } from './components/PhotoSkeleton'
import { useFavoritesReducer } from './hooks/useFavoritesReducer'
import { useFetchPhotos } from './hooks/useFetchPhotos'

function App() {
  const { photos, loading, error } = useFetchPhotos()
  const { favoriteIds, dispatch } = useFavoritesReducer()
  const [query, setQuery] = useState('')
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const handleSearch = useCallback((event) => {
    setQuery(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return photos.filter((photo) => {
      const matchesSearch = photo.author.toLowerCase().includes(normalizedQuery)
      const matchesFavorites = !showFavorites || favoriteIds.includes(photo.id)
      return matchesSearch && matchesFavorites
    })
  }, [photos, query, showFavorites, favoriteIds])

  const toggleFavorite = useCallback((id) => {
    dispatch({ type: 'toggle', id })
  }, [dispatch])

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-ink/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Snapfolio home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-cream"><Camera size={18} strokeWidth={2.4} /></span>
            <span className="font-display text-xl font-bold tracking-tight">snapfolio<span className="text-coral">.</span></span>
          </a>
          <div className="flex items-center gap-3 text-sm font-bold">
            <button type="button" onClick={() => setShowFavorites((visible) => !visible)} className={`flex items-center gap-2 rounded-full px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 ${showFavorites ? 'bg-ink text-white' : 'text-ink/65 hover:bg-ink/5 hover:text-ink'}`}>
              <Heart size={16} fill={showFavorites ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">Favorites</span>
              <span className="rounded-full bg-coral px-1.5 py-0.5 text-[10px] text-white">{favoriteIds.length}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-10">
        <section className="grid items-end gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-coral"><Sparkles size={14} /> Curated moments</div>
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">A little more <span className="text-coral">wonder</span> in your scroll.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink/60 sm:text-lg">Browse a hand-picked stream of visual moments. Save what sparks something, and make this little corner of the internet yours.</p>
          </div>
          <div className="relative hidden min-h-[170px] overflow-hidden rounded-2xl bg-moss p-6 text-cream shadow-soft lg:block">
            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[18px] border-mustard/80" />
            <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-coral/80" />
            <p className="relative max-w-[210px] font-display text-2xl font-bold leading-tight">Find your next favorite view.</p>
            <p className="relative mt-4 text-sm leading-5 text-cream/70">30 fresh frames, ready to explore.</p>
          </div>
        </section>

        <section className="mt-12 border-y border-ink/10 py-5 sm:mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/45" size={18} />
              <input value={query} onChange={handleSearch} type="search" placeholder="Search by photographer..." className="h-12 w-full rounded-xl border border-ink/15 bg-paper pl-11 pr-11 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-coral focus:ring-4 focus:ring-coral/10" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 flex -translate-y-1/2 p-1 text-ink/45 hover:text-ink"><X size={16} /></button>}
            </label>
            <div className="flex items-center justify-between gap-4 text-sm text-ink/55 sm:justify-end">
              <span>{loading ? 'Loading collection...' : `${filteredPhotos.length} ${filteredPhotos.length === 1 ? 'photo' : 'photos'}`}</span>
              {showFavorites && <span className="flex items-center gap-1.5 font-bold text-ink"><Check size={15} className="text-moss" /> Saved view</span>}
            </div>
          </div>
        </section>

        <section className="pt-8" aria-live="polite">
          {loading && <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <PhotoSkeleton key={index} />)}</div>}
          {error && <div className="rounded-2xl border border-coral/30 bg-coral/10 p-8 text-center"><p className="font-display text-xl font-bold">We hit a little bump.</p><p className="mt-2 text-sm text-ink/65">{error} Please refresh and try again.</p><button type="button" onClick={() => window.location.reload()} className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-coral"><RefreshCw size={15} /> Reload gallery</button></div>}
          {!loading && !error && filteredPhotos.length > 0 && <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{filteredPhotos.map((photo) => <PhotoCard key={photo.id} photo={photo} isFavorite={favoriteIds.includes(photo.id)} onToggleFavorite={toggleFavorite} onOpen={setSelectedPhoto} />)}</div>}
          {!loading && !error && filteredPhotos.length === 0 && <div className="rounded-2xl border border-dashed border-ink/20 bg-paper px-6 py-16 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mustard/25 text-ink"><Search size={20} /></div><h2 className="mt-5 font-display text-2xl font-bold">Nothing in this frame.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink/60">Try another photographer, or save a few photos to see them here.</p>{showFavorites && <button type="button" onClick={() => setShowFavorites(false)} className="mt-5 font-bold text-coral hover:underline">Browse all photos</button>}</div>}
        </section>
      </main>

      <footer className="border-t border-ink/10 px-5 py-8 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-ink/45 sm:flex-row sm:items-center sm:justify-between"><span>snapfolio<span className="text-coral">.</span> built for the curious</span><span>Images from the Lorem Picsum API</span></div></footer>
      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  )
}

export default App
