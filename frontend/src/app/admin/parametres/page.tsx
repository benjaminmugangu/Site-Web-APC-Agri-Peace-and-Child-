"use client"

import React, { useState, useEffect } from "react"
import { 
  Save, 
  Building2, 
  Layout, 
  Mail, 
  BarChart3, 
  Search, 
  CheckCircle2, 
  Loader2,
  X,
  AlertCircle,
  HelpCircle,
  Link2,
  Briefcase,
  Share2,
  FileText,
  Plus,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { settingsService, type SettingsUpdatePayload } from "@/lib/api/settings"
import { type SiteSettings } from "@/types"
import { toast } from "sonner"

type TabType = "institution" | "hero" | "contact" | "stats" | "seo" | "contents"

const normalizeSettings = (data: SiteSettings): SiteSettings => ({
  ...data,
  hero: data.hero || { title: "", subtitle: "", imageUrl: "" },
  stats: data.stats || { beneficiaries: "", projects: "", provinces: "", partners: "", teamMembers: "" },
  contact: data.contact || {
    address: "",
    phone1: "",
    phone2: "",
    whatsapp: "",
    email: "",
    emailSupport: "",
    emailCareers: "",
    socials: { facebook: "", twitter: "", linkedin: "", instagram: "", youtube: "" }
  },
  institution: data.institution || { name: "", acronym: "", foundationYear: "", vision: "", mission: "" },
  seo: data.seo || { metaTitle: "", metaDescription: "", metaKeywords: "", ogImage: "" },
  logo: data.logo || { logoHeader: "", logoFooter: "", logoDark: "", favicon: "" },
  // Contenus CMS (issue #47)
  supportSection: data.supportSection || { title: "", subtitle: "", description: "", imageUrl: "", bulletPoints: [] },
  historySection: data.historySection || { title: "", subtitle: "", paragraphs: [""], imageUrl: "", objectives: [] },
  engagementSection: data.engagementSection || { title: "", subtitle: "", engagementTypes: [], reasonsTitle: "", reasons: [] },
  donationMessage: data.donationMessage || "",
  transparencyMessage: data.transparencyMessage || { title: "", description: "" }
})

const cloneSettings = (settings: SiteSettings): SiteSettings =>
  JSON.parse(JSON.stringify(settings)) as SiteSettings

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)

const valuesAreEqual = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right)

const diffSettings = (current: unknown, original: unknown): unknown => {
  if (Array.isArray(current) || Array.isArray(original)) {
    return valuesAreEqual(current, original) ? undefined : current
  }

  if (isPlainObject(current) && isPlainObject(original)) {
    const patch: Record<string, unknown> = {}

    for (const key of Object.keys(current)) {
      const diff = diffSettings(current[key], original[key])
      if (diff !== undefined) {
        patch[key] = diff
      }
    }

    return Object.keys(patch).length > 0 ? patch : undefined
  }

  return Object.is(current, original) ? undefined : current
}

const buildSettingsPatch = (
  current: SiteSettings,
  original: SiteSettings
): SettingsUpdatePayload => {
  const patch = diffSettings(current, original)
  return isPlainObject(patch) ? (patch as SettingsUpdatePayload) : {}
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("institution")
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // State for the settings data
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [originalSettings, setOriginalSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setFetching(true)
    try {
      const data = await settingsService.get()
      if (data) {
        const normalized = normalizeSettings(data)
        setSettings(normalized)
        setOriginalSettings(cloneSettings(normalized))
      }
    } catch (err) {
      console.error("Failed to fetch settings", err)
      toast.error("Impossible de charger les paramètres système.")
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    setLoading(true)
    setStatus(null)
    
    try {
      const payload = originalSettings
        ? buildSettingsPatch(settings, originalSettings)
        : settings

      if (originalSettings && Object.keys(payload).length === 0) {
        setStatus({ type: 'success', message: "Aucune modification à enregistrer." })
        toast.success("Aucune modification à enregistrer")
        return
      }

      const updatedSettings = await settingsService.update(payload)
      const normalized = normalizeSettings(updatedSettings || settings)
      setSettings(normalized)
      setOriginalSettings(cloneSettings(normalized))
      setStatus({ type: 'success', message: "Paramètres mis à jour avec succès !" })
      toast.success("Paramètres enregistrés avec succès")
    } catch {
      setStatus({ type: 'error', message: "Erreur lors de la mise à jour des paramètres." })
      toast.error("Erreur lors de la sauvegarde")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
          <p className="text-sm text-slate-500 font-medium animate-pulse">Chargement de la configuration générale...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl max-w-xl mx-auto my-12 border border-red-100 shadow-sm">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
        <h3 className="text-lg font-bold">Erreur Technique</h3>
        <p className="text-sm mt-1">Impossible de charger les paramètres. Veuillez réessayer ou contacter le support technique.</p>
        <button 
          onClick={fetchSettings} 
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  const tabs = [
    { id: "institution" as TabType, label: "Institutionnel", icon: Building2 },
    { id: "hero" as TabType, label: "Accueil & Hero", icon: Layout },
    { id: "contents" as TabType, label: "Contenus des Pages", icon: FileText },
    { id: "contact" as TabType, label: "Coordonnées & Réseaux", icon: Mail },
    { id: "stats" as TabType, label: "Statistiques d'impact", icon: BarChart3 },
    { id: "seo" as TabType, label: "SEO & Identité Visuelle", icon: Search }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Sticky */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md py-4 rounded-2xl border border-slate-100 px-6 shadow-sm sticky top-2 z-10">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Paramètres du Système</h1>
          <p className="text-slate-500 text-sm">Configurez l&apos;identité officielle, les visuels et les coordonnées globales d&apos;APC.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10 min-w-[160px] rounded-xl py-6 font-semibold"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</>
          ) : (
            <><Save size={18} /> Enregistrer les modifications</>
          )}
        </Button>
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-600" /> : <AlertCircle size={20} className="text-red-600" />}
          <span className="text-sm font-medium flex-1">{status.message}</span>
          <button onClick={() => setStatus(null)} className="p-1 hover:bg-black/5 rounded-full transition-colors"><X size={16} /></button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive 
                  ? "bg-white text-emerald-700 shadow-sm border border-slate-200/30" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
            >
              <Icon size={18} className={isActive ? "text-emerald-600" : "text-slate-400"} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Main Form Content Cards */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px]">
        
        {/* Tab 1: Institutionnel */}
        {activeTab === "institution" && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Identité Institutionnelle</h3>
              <p className="text-xs text-slate-500 mt-0.5">Identité juridique et fondement social de l&apos;organisation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  Nom Officiel Complet
                  <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={settings.institution.name || ""}
                  onChange={e => setSettings({...settings, institution: {...settings.institution, name: e.target.value}})}
                  placeholder="Ex: Agri-Peace and Child"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acronyme</label>
                <input 
                  type="text" 
                  value={settings.institution.acronym || ""}
                  onChange={e => setSettings({...settings, institution: {...settings.institution, acronym: e.target.value}})}
                  placeholder="Ex: APC"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Année de Fondation</label>
                <input 
                  type="text" 
                  value={settings.institution.foundationYear || ""}
                  onChange={e => setSettings({...settings, institution: {...settings.institution, foundationYear: e.target.value}})}
                  placeholder="Ex: 2015"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                />
              </div>
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notre Vision</label>
                <textarea 
                  rows={3}
                  value={settings.institution.vision || ""}
                  onChange={e => setSettings({...settings, institution: {...settings.institution, vision: e.target.value}})}
                  placeholder="Ex: Un Congo solidaire, pacifié..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notre Mission</label>
                <textarea 
                  rows={3}
                  value={settings.institution.mission || ""}
                  onChange={e => setSettings({...settings, institution: {...settings.institution, mission: e.target.value}})}
                  placeholder="Ex: Promouvoir le développement agricole..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Accueil & Hero */}
        {activeTab === "hero" && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Bannière & Hero de la Page d&apos;accueil</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ces informations forment la première impression des internautes à leur arrivée sur le site.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-4">
                <ImageUploader 
                  value={settings.hero.imageUrl}
                  onChange={url => setSettings({...settings, hero: {...settings.hero, imageUrl: url}})}
                  label="Image de fond Hero"
                />
                <p className="text-xs text-slate-400">Recommandé : Image HD paysagère (1920x1080) sans textes incorporés.</p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grand Titre Principal</label>
                  <input 
                    type="text" 
                    value={settings.hero.title || ""}
                    onChange={e => setSettings({...settings, hero: {...settings.hero, title: e.target.value}})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Texte de Description / Sous-titre</label>
                  <textarea 
                    rows={4}
                    value={settings.hero.subtitle || ""}
                    onChange={e => setSettings({...settings, hero: {...settings.hero, subtitle: e.target.value}})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab X: Contenus des Pages (CMS) */}
        {activeTab === "contents" && (
          <div className="space-y-12 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Contenus des Pages (CMS)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Modifiez les textes, images et listes dynamiques des différentes sections publiques.</p>
            </div>

            {/* --- ACCUEIL --- */}
            <div className="space-y-6 border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">1. Page d'Accueil : Pourquoi nous soutenir ?</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Titre de la section</label>
                    <input 
                      type="text" 
                      value={settings.supportSection?.title || ""}
                      onChange={e => setSettings({...settings, supportSection: {...settings.supportSection!, title: e.target.value}})}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sous-titre / Description</label>
                    <textarea 
                      rows={3}
                      value={settings.supportSection?.description || ""}
                      onChange={e => setSettings({...settings, supportSection: {...settings.supportSection!, description: e.target.value}})}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Points Forts (Bullet points)</label>
                    <div className="space-y-2">
                      {(settings.supportSection?.bulletPoints || []).map((point, index) => (
                        <div key={index} className="flex gap-2">
                          <input 
                            type="text"
                            value={point}
                            onChange={(e) => {
                              const newPoints = [...settings.supportSection!.bulletPoints];
                              newPoints[index] = e.target.value;
                              setSettings({...settings, supportSection: {...settings.supportSection!, bulletPoints: newPoints}});
                            }}
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                          />
                          <Button 
                            variant="outline" size="icon" className="text-red-500 border-red-100 hover:bg-red-50"
                            onClick={() => {
                              const newPoints = settings.supportSection!.bulletPoints.filter((_, i) => i !== index);
                              setSettings({...settings, supportSection: {...settings.supportSection!, bulletPoints: newPoints}});
                            }}
                          ><Trash2 size={14} /></Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" size="sm" className="w-full gap-2 text-emerald-600 border-dashed"
                        onClick={() => {
                          const newPoints = [...(settings.supportSection?.bulletPoints || []), "Nouveau point"];
                          setSettings({...settings, supportSection: {...settings.supportSection!, bulletPoints: newPoints}});
                        }}
                      ><Plus size={14} /> Ajouter un point fort</Button>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <ImageUploader 
                    value={settings.supportSection?.imageUrl || ""}
                    onChange={url => setSettings({...settings, supportSection: {...settings.supportSection!, imageUrl: url}})}
                    label="Image illustrative"
                  />
                </div>
              </div>
            </div>

            {/* --- A PROPOS --- */}
            <div className="space-y-6 border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">2. Page À Propos : Notre Histoire</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Titre de la section</label>
                    <input 
                      type="text" 
                      value={settings.historySection?.title || ""}
                      onChange={e => setSettings({...settings, historySection: {...settings.historySection!, title: e.target.value}})}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paragraphes d'histoire</label>
                    <div className="space-y-2">
                      {(settings.historySection?.paragraphs || []).map((paragraph, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <textarea 
                            rows={3}
                            value={paragraph}
                            onChange={(e) => {
                              const newParagraphs = [...settings.historySection!.paragraphs];
                              newParagraphs[index] = e.target.value;
                              setSettings({...settings, historySection: {...settings.historySection!, paragraphs: newParagraphs}});
                            }}
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                          />
                          <Button 
                            variant="outline" size="icon" className="text-red-500 border-red-100 hover:bg-red-50 mt-1"
                            onClick={() => {
                              const newParagraphs = settings.historySection!.paragraphs.filter((_, i) => i !== index);
                              setSettings({...settings, historySection: {...settings.historySection!, paragraphs: newParagraphs}});
                            }}
                          ><Trash2 size={14} /></Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" size="sm" className="w-full gap-2 text-emerald-600 border-dashed"
                        onClick={() => {
                          const newParagraphs = [...(settings.historySection?.paragraphs || []), "Nouveau paragraphe..."];
                          setSettings({...settings, historySection: {...settings.historySection!, paragraphs: newParagraphs}});
                        }}
                      ><Plus size={14} /> Ajouter un paragraphe</Button>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <ImageUploader 
                    value={settings.historySection?.imageUrl || ""}
                    onChange={url => setSettings({...settings, historySection: {...settings.historySection!, imageUrl: url}})}
                    label="Image de l'histoire"
                  />
                </div>
              </div>
            </div>

            {/* --- NOUS REJOINDRE --- */}
            <div className="space-y-6 border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">3. Page Nous Rejoindre : S'engager & Pourquoi APC</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Types d'engagement */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-500 uppercase">Types d'engagement</h5>
                  <div className="space-y-3">
                    {(settings.engagementSection?.engagementTypes || []).map((type, index) => (
                      <div key={index} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 relative">
                        <Button 
                          variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            const newTypes = settings.engagementSection!.engagementTypes.filter((_, i) => i !== index);
                            setSettings({...settings, engagementSection: {...settings.engagementSection!, engagementTypes: newTypes}});
                          }}
                        ><Trash2 size={12} /></Button>
                        <input 
                          type="text" placeholder="Titre (ex: Bénévolat)" value={type.title}
                          onChange={(e) => {
                            const newTypes = [...settings.engagementSection!.engagementTypes];
                            newTypes[index].title = e.target.value;
                            setSettings({...settings, engagementSection: {...settings.engagementSection!, engagementTypes: newTypes}});
                          }}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-sm font-bold"
                        />
                        <textarea 
                          rows={2} placeholder="Description courte..." value={type.description}
                          onChange={(e) => {
                            const newTypes = [...settings.engagementSection!.engagementTypes];
                            newTypes[index].description = e.target.value;
                            setSettings({...settings, engagementSection: {...settings.engagementSection!, engagementTypes: newTypes}});
                          }}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-xs"
                        />
                      </div>
                    ))}
                    <Button 
                      variant="outline" size="sm" className="w-full gap-2 text-emerald-600 border-dashed"
                      onClick={() => {
                        const newTypes = [...(settings.engagementSection?.engagementTypes || []), { title: "Nouveau", description: "...", icon: "Users", color: "text-emerald-600", bg: "bg-emerald-100" }];
                        setSettings({...settings, engagementSection: {...settings.engagementSection!, engagementTypes: newTypes}});
                      }}
                    ><Plus size={14} /> Ajouter un type d'engagement</Button>
                  </div>
                </div>

                {/* Raisons */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-500 uppercase">Pourquoi rejoindre APC ? (Raisons)</h5>
                  <div className="space-y-3">
                    {(settings.engagementSection?.reasons || []).map((reason, index) => (
                      <div key={index} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 relative">
                        <Button 
                          variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            const newReasons = settings.engagementSection!.reasons.filter((_, i) => i !== index);
                            setSettings({...settings, engagementSection: {...settings.engagementSection!, reasons: newReasons}});
                          }}
                        ><Trash2 size={12} /></Button>
                        <input 
                          type="text" placeholder="Titre (ex: Impact Terrain)" value={reason.title}
                          onChange={(e) => {
                            const newReasons = [...settings.engagementSection!.reasons];
                            newReasons[index].title = e.target.value;
                            setSettings({...settings, engagementSection: {...settings.engagementSection!, reasons: newReasons}});
                          }}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-sm font-bold"
                        />
                        <textarea 
                          rows={2} placeholder="Description..." value={reason.description}
                          onChange={(e) => {
                            const newReasons = [...settings.engagementSection!.reasons];
                            newReasons[index].description = e.target.value;
                            setSettings({...settings, engagementSection: {...settings.engagementSection!, reasons: newReasons}});
                          }}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-xs"
                        />
                      </div>
                    ))}
                    <Button 
                      variant="outline" size="sm" className="w-full gap-2 text-emerald-600 border-dashed"
                      onClick={() => {
                        const newReasons = [...(settings.engagementSection?.reasons || []), { title: "Nouvelle raison", description: "..." }];
                        setSettings({...settings, engagementSection: {...settings.engagementSection!, reasons: newReasons}});
                      }}
                    ><Plus size={14} /> Ajouter une raison</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- FAIRE UN DON --- */}
            <div className="space-y-6 border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
              <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">4. Page Faire un Don</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message Principal de Don</label>
                  <textarea 
                    rows={4}
                    value={settings.donationMessage || ""}
                    onChange={e => setSettings({...settings, donationMessage: e.target.value})}
                    placeholder="Texte remerciant et incitant au don..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Encadré Transparence</label>
                  <input 
                    type="text" 
                    value={settings.transparencyMessage?.title || ""}
                    onChange={e => setSettings({...settings, transparencyMessage: {...settings.transparencyMessage!, title: e.target.value}})}
                    placeholder="Titre (ex: Notre engagement de transparence)"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold" 
                  />
                  <textarea 
                    rows={2}
                    value={settings.transparencyMessage?.description || ""}
                    onChange={e => setSettings({...settings, transparencyMessage: {...settings.transparencyMessage!, description: e.target.value}})}
                    placeholder="Description de la transparence..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" 
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Coordonnées & Réseaux */}
        {activeTab === "contact" && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Coordonnées de Contact & Réseaux Sociaux</h3>
              <p className="text-xs text-slate-500 mt-0.5">Canaux officiels de communication publique, recrutement et assistance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Téléphone Ligne 1</label>
                <input 
                  type="text" 
                  value={settings.contact.phone1 || ""}
                  onChange={e => setSettings({...settings, contact: {...settings.contact, phone1: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Téléphone Ligne 2</label>
                <input 
                  type="text" 
                  value={settings.contact.phone2 || ""}
                  onChange={e => setSettings({...settings, contact: {...settings.contact, phone2: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Direct</label>
                <input 
                  type="text" 
                  value={settings.contact.whatsapp || ""}
                  onChange={e => setSettings({...settings, contact: {...settings.contact, whatsapp: e.target.value}})}
                  placeholder="Ex: +243 971 234 567"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail de Contact Général</label>
                <input 
                  type="email" 
                  value={settings.contact.email || ""}
                  onChange={e => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail d&apos;Assistance / Support</label>
                <input 
                  type="email" 
                  value={settings.contact.emailSupport || ""}
                  onChange={e => setSettings({...settings, contact: {...settings.contact, emailSupport: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail Recrutement / Carrières</label>
                <input 
                  type="email" 
                  value={settings.contact.emailCareers || ""}
                  onChange={e => setSettings({...settings, contact: {...settings.contact, emailCareers: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adresse Physique Officielle</label>
              <textarea 
                rows={2}
                value={settings.contact.address || ""}
                onChange={e => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Link2 size={16} className="text-slate-400" /> Liens Externes & Réseaux Sociaux
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facebook Link</label>
                  <input 
                    type="text"
                    placeholder="https://facebook.com/..."
                    value={settings.contact.socials?.facebook || ""}
                    onChange={e => setSettings({
                      ...settings, 
                      contact: {
                        ...settings.contact, 
                        socials: { ...(settings.contact.socials || {}), facebook: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LinkedIn Link</label>
                  <input 
                    type="text"
                    placeholder="https://linkedin.com/company/..."
                    value={settings.contact.socials?.linkedin || ""}
                    onChange={e => setSettings({
                      ...settings, 
                      contact: {
                        ...settings.contact, 
                        socials: { ...(settings.contact.socials || {}), linkedin: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Twitter / X Link</label>
                  <input 
                    type="text"
                    placeholder="https://twitter.com/..."
                    value={settings.contact.socials?.twitter || ""}
                    onChange={e => setSettings({
                      ...settings, 
                      contact: {
                        ...settings.contact, 
                        socials: { ...(settings.contact.socials || {}), twitter: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instagram Link</label>
                  <input 
                    type="text"
                    placeholder="https://instagram.com/..."
                    value={settings.contact.socials?.instagram || ""}
                    onChange={e => setSettings({
                      ...settings, 
                      contact: {
                        ...settings.contact, 
                        socials: { ...(settings.contact.socials || {}), instagram: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">YouTube Channel</label>
                  <input 
                    type="text"
                    placeholder="https://youtube.com/..."
                    value={settings.contact.socials?.youtube || ""}
                    onChange={e => setSettings({
                      ...settings, 
                      contact: {
                        ...settings.contact, 
                        socials: { ...(settings.contact.socials || {}), youtube: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Statistiques d'impact */}
        {activeTab === "stats" && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Statistiques Globales d&apos;Impact</h3>
              <p className="text-xs text-slate-500 mt-0.5">Indicateurs clés affichés sur l&apos;ensemble du portail public pour valoriser l&apos;activité d&apos;APC.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Bénéficiaires
                  <span title="Nombre total de personnes touchées par nos actions">
                    <HelpCircle size={12} className="text-slate-400" />
                  </span>
                </label>
                <input 
                  type="text" 
                  value={settings.stats.beneficiaries || ""}
                  onChange={e => setSettings({...settings, stats: {...settings.stats, beneficiaries: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projets Réalisés</label>
                <input 
                  type="text" 
                  value={settings.stats.projects || ""}
                  onChange={e => setSettings({...settings, stats: {...settings.stats, projects: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Provinces Actives</label>
                <input 
                  type="text" 
                  value={settings.stats.provinces || ""}
                  onChange={e => setSettings({...settings, stats: {...settings.stats, provinces: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partenaires</label>
                <input 
                  type="text" 
                  value={settings.stats.partners || ""}
                  onChange={e => setSettings({...settings, stats: {...settings.stats, partners: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experts & Staff</label>
                <input 
                  type="text" 
                  value={settings.stats.teamMembers || ""}
                  onChange={e => setSettings({...settings, stats: {...settings.stats, teamMembers: e.target.value}})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: SEO & Identité Visuelle */}
        {activeTab === "seo" && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Identité Visuelle & SEO</h3>
              <p className="text-xs text-slate-500 mt-0.5">Configuration des logos officiels, du favicon et des métadonnées pour le référencement naturel (Google, Bing).</p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                <Briefcase size={16} className="text-slate-400" /> Logos Officiels de l&apos;Organisation
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ImageUploader 
                  value={settings.logo.logoHeader || ""}
                  onChange={url => setSettings({...settings, logo: {...settings.logo, logoHeader: url}})}
                  label="Logo Header (Clair)"
                />
                <ImageUploader 
                  value={settings.logo.logoFooter || ""}
                  onChange={url => setSettings({...settings, logo: {...settings.logo, logoFooter: url}})}
                  label="Logo Footer"
                />
                <ImageUploader 
                  value={settings.logo.logoDark || ""}
                  onChange={url => setSettings({...settings, logo: {...settings.logo, logoDark: url}})}
                  label="Logo Mode Sombre"
                />
                <ImageUploader 
                  value={settings.logo.favicon || ""}
                  onChange={url => setSettings({...settings, logo: {...settings.logo, favicon: url}})}
                  label="Favicon Onglet (.ico)"
                />
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                <Share2 size={16} className="text-slate-400" /> Référencement Google & Méta-tags Globaux
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Title (Titre)</label>
                    <input 
                      type="text" 
                      value={settings.seo.metaTitle || ""}
                      onChange={e => setSettings({...settings, seo: {...settings.seo, metaTitle: e.target.value}})}
                      placeholder="Ex: APC - Agri-Peace and Child | Protection et Paix en RDC"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Description</label>
                    <textarea 
                      rows={3}
                      value={settings.seo.metaDescription || ""}
                      onChange={e => setSettings({...settings, seo: {...settings.seo, metaDescription: e.target.value}})}
                      placeholder="Ex: Découvrez l'ONG APC..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mots Clés (Keywords, séparés par virgules)</label>
                    <input 
                      type="text" 
                      value={settings.seo.metaKeywords || ""}
                      onChange={e => setSettings({...settings, seo: {...settings.seo, metaKeywords: e.target.value}})}
                      placeholder="Ex: APC, ONG RDC, Paix, Goma, Agriculture"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 text-sm font-medium" 
                    />
                  </div>
                </div>

                <div className="md:col-span-1 space-y-4">
                  <ImageUploader 
                    value={settings.seo.ogImage || ""}
                    onChange={url => setSettings({...settings, seo: {...settings.seo, ogImage: url}})}
                    label="Image de Partage Réseaux (OG)"
                  />
                  <p className="text-xs text-slate-400">Cette image s&apos;affiche sur Facebook, WhatsApp et Twitter lors du partage de l&apos;URL d&apos;APC.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
