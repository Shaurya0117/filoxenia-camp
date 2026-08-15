import React from 'react';
import { Book, ChevronRight, Download, Search, FileText } from 'lucide-react';

export default function Manual() {
  const chapters = [
    {
      id: 1,
      title: "1. Camp Organization",
      subsections: [
        "1.1 Camp staffing & hierarchy",
        "1.2 Specifications for the protection of minors",
        "1.3 Health check protocols",
        "1.4 Arrival and departure procedures"
      ]
    },
    {
      id: 2,
      title: "2. Emergency Procedures",
      subsections: [
        "2.1 Fire evacuation routes",
        "2.2 Medical emergency response",
        "2.3 Severe weather protocols"
      ]
    },
    {
      id: 3,
      title: "3. Daily Operations",
      subsections: [
        "3.1 Daily schedule & routines",
        "3.2 Kitchen & dining rules",
        "3.3 Activity supervision guidelines"
      ]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
            <Book className="text-blue-500 w-8 h-8" /> 
            Filoxenia Camping Manual
          </h1>
          <p className="text-gray-500 mt-2">Organization instructions, procedures, and useful information for executives.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative hidden md:block">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search manual..." 
              className="pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1a2b4c] outline-none w-64 bg-gray-50"
            />
          </div>
          <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-3 rounded-xl transition flex items-center gap-2 font-bold shadow-sm border border-blue-200">
            <Download className="w-5 h-5" /> PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Table of Contents sidebar */}
        <div className="col-span-1 bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" /> Table of Contents
          </h2>
          <div className="space-y-4">
            {chapters.map(chap => (
              <div key={chap.id}>
                <h3 className="font-bold text-[#1a2b4c] mb-2">{chap.title}</h3>
                <ul className="space-y-2 ml-2 border-l-2 border-gray-100 pl-4">
                  {chap.subsections.map((sub, idx) => (
                    <li key={idx} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer flex items-center gap-1 group transition">
                      <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500" /> {sub}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-2 bg-white p-10 rounded-2xl border shadow-sm prose max-w-none prose-blue">
          <h2 className="text-3xl font-bold border-b pb-4 mb-6">1. Camp Organization</h2>
          
          <h3 className="text-xl font-bold mt-8 mb-4">1.1 Camp staffing</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            The camp is managed by the Camp Director, supported by the Assistant Director, Medical Staff, and Head Counselors. 
            All staff members must undergo rigorous background checks and complete the Filoxenia Safety Training Course prior to the start of any camping period.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">1.2 Specifications for the protection of minors</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Protection of minors is our highest priority. Counselors must adhere strictly to the rule of three: no staff member is to be alone with a single camper at any time. All interactions must occur in open, observable spaces or with another staff member present.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">1.3 Health check</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Upon arrival, all campers undergo a preliminary health check by the nursing staff to verify medical forms, check for communicable illnesses, and securely log any medications that will be administered during the period.
          </p>

          <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
            <Book className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Note to Executives</h4>
              <p className="text-blue-800 text-sm">Please ensure you have read and signed the acknowledgment form for Chapter 1 before the start of Period 1.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
