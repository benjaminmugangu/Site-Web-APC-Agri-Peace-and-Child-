"use client"

import React, { useState, useMemo } from "react"
import { MapPin, Calendar, ArrowRight, Search, Briefcase, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CareerApplicationForm } from "@/components/forms/career-application-form"

export interface Career {
  id: string
  title: string
  type: string
  location: string
  deadline: string
  status: string
}

export interface JobBoardProps {
  readonly initialCareers: Career[]
}

export function JobBoard({ initialCareers }: JobBoardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedJob, setSelectedJob] = useState<Career | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Extract unique job types for the filter
  const jobTypes = useMemo(() => {
    const types = new Set(initialCareers.map(job => job.type || "Emploi"))
    return ["all", ...Array.from(types)]
  }, [initialCareers])

  // Filter jobs based on search term and selected type
  const filteredCareers = useMemo(() => {
    return initialCareers.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            job.location.toLowerCase().includes(searchTerm.toLowerCase())
      const jobType = job.type || "Emploi"
      const matchesType = filterType === "all" || jobType === filterType

      return matchesSearch && matchesType
    })
  }, [initialCareers, searchTerm, filterType])

  const handleApplyClick = (job: Career) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleApplicationSuccess = () => {
    // Optionally close modal or trigger success state
  }

  return (
    <div>
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Rechercher par titre ou localisation..." 
            className="w-full pl-10 pr-4 h-12 rounded-xl bg-white border border-border/40 focus:border-apc-green/50 focus:ring-2 focus:ring-apc-green/20 outline-none transition-all text-sm text-gray-900"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-border/40 bg-white focus:outline-none focus:border-apc-green/50 focus:ring-2 focus:ring-apc-green/20 appearance-none text-sm font-medium text-gray-700"
            value={filterType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
          >
            <option value="all">Tous les contrats</option>
            {jobTypes.filter(t => t !== "all").map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Job List */}
      {filteredCareers.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-border/60">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Aucune offre d'emploi ne correspond à vos critères.</p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => { setSearchTerm(""); setFilterType("all"); }}>
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCareers.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-6 md:p-8 border border-border/40 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-apc-alert/10 text-apc-alert rounded-full border border-apc-alert/20">
                    {job.type || "Emploi"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-apc-green transition-colors">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-apc-alert" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-apc-green" />
                    Date limite : {new Date(job.deadline).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => handleApplyClick(job)}
                className="rounded-xl h-12 px-8 font-bold bg-apc-green hover:bg-apc-green/90 text-white shadow-lg shadow-apc-green/20 group-hover:scale-105 transition-transform"
              >
                Postuler <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Custom Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-8 md:p-10">
              <div className="mb-8 pr-12">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-2">Postuler</h2>
                <p className="text-gray-500 text-sm">Veuillez remplir le formulaire ci-dessous pour soumettre votre candidature.</p>
              </div>
              
              {selectedJob && (
                <CareerApplicationForm 
                  careerId={selectedJob.id} 
                  jobTitle={selectedJob.title}
                  onSuccess={handleApplicationSuccess}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
