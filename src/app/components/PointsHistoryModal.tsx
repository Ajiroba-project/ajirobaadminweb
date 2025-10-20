"use client";
import React, { useEffect, useMemo, useState } from "react";
import ModalComponent from "./ModalComponent";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type PointsItem = {
  full_name: string;
  point: string | number;
  description: string;
  date_created: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
};

export default function PointsHistoryModal({ isOpen, onClose, userId }: Props) {
  const [sortBy, setSortBy] = useState<string>("");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [rows, setRows] = useState<PointsItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(0);
  // Debounced filter values for seamless fetch flow
  const [debouncedSortBy, setDebouncedSortBy] = useState<string>("");
  const [debouncedCustomStart, setDebouncedCustomStart] = useState<string>("");
  const [debouncedCustomEnd, setDebouncedCustomEnd] = useState<string>("");

  const canLoad = useMemo(() => {
    if (debouncedSortBy === "custom") return Boolean(debouncedCustomStart && debouncedCustomEnd);
    return true;
  }, [debouncedSortBy, debouncedCustomStart, debouncedCustomEnd]);

  // Debounce filter changes to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSortBy(sortBy);
      setDebouncedCustomStart(customStart);
      setDebouncedCustomEnd(customEnd);
    }, 500);
    return () => clearTimeout(timer);
  }, [sortBy, customStart, customEnd]);

  useEffect(() => {
    if (!isOpen) return;
    if (!userId) return;
    // If custom filter selected but dates incomplete, don't fetch yet
    if (debouncedSortBy === 'custom' && (!debouncedCustomStart || !debouncedCustomEnd)) return;

    const controller = new AbortController();
    const q = new URLSearchParams();
    if (debouncedSortBy) q.append("filter", debouncedSortBy);
    if (debouncedSortBy === "custom") {
      q.append("start_date", debouncedCustomStart);
      q.append("end_date", debouncedCustomEnd);
    }
    if (userId) q.append("user_id", userId);
    if (page) q.append("page", String(page));

    setIsLoading(true);
    setError("");
    fetch(`/api/customerpointshistory${q.toString() ? `?${q.toString()}` : ''}`, {
      signal: controller.signal,
    })
      .then(async (r) => {
        const payload = await r.json();
        if (!r.ok) throw new Error(payload?.message || "Failed to fetch");
        const data: PointsItem[] = payload?.data?.results?.data || [];
        setRows(data);
        const total = Number(payload?.data?.count || 0);
        setCount(total);
        if (!perPage && Array.isArray(data)) {
          setPerPage(data.length);
        }
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError("Failed to load points");
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [isOpen, debouncedSortBy, debouncedCustomStart, debouncedCustomEnd, userId, page]);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(r =>
      r.full_name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const totalPages = useMemo(() => {
    const pg = perPage || (rows.length > 0 ? rows.length : 10);
    return Math.max(1, Math.ceil(count / pg));
  }, [count, rows, perPage]);

  const pageNumbers = useMemo(() => {
    // show up to 3 pages around current like the design
    const start = Math.max(1, page);
    const nums: number[] = [];
    for (let i = start; i < start + 3 && i <= totalPages; i++) nums.push(i);
    // ensure page 1 is visible if current is near start
    if (page === 1 && nums.length < Math.min(totalPages, 3)) {
      for (let i = nums.length + 1; i <= Math.min(3, totalPages); i++) nums.push(i);
    }
    return nums;
  }, [page, totalPages]);

  const content = (
    <div className=" relative">
      <button aria-label="Close" onClick={onClose} className="absolute right-0 -top-2 text-gray-700">×</button>
      <div className="text-center mb-6 mt-2">
        <h2 className="text-xl font-semibold">Ajiroba Points</h2>
        <p className="text-gray-500 text-sm">Here is the list of all Ajiroba points you have received.</p>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-[220px]">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded border border-[#E9E9E9] bg-white text-sm focus:outline-none"
          />
          <span className="absolute left-2 top-1.5 text-gray-400">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="#A09F9F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11.5 21c5.247 0 9.5-4.253 9.5-9.5S16.747 2 11.5 2 2 6.253 2 11.5 6.253 21 11.5 21Z"/><path stroke="#A09F9F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m22 22-2-2"/></svg>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-[110px] rounded border px-2 selector text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="z-[2000]" style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last_week">Last Week</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {sortBy === 'custom' && (
            <div className="flex items-center gap-1">
              <input type="date" className="border rounded px-2 py-1 text-xs" value={customStart} onChange={(e) => { setCustomStart(e.target.value); setPage(1); }} />
              <span className="text-xs">to</span>
              <input type="date" className="border rounded px-2 py-1 text-xs" value={customEnd} onChange={(e) => { setCustomEnd(e.target.value); setPage(1); }} />
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#FCE1D7]">
              <th className="text-left px-4 py-3">S/N</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-center px-4 py-3">Points</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center">Loading…</td></tr>
            ) : error ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-red-600">{error}</td></tr>
            ) : filteredRows.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center">No points found</td></tr>
            ) : (
              filteredRows.map((r, i) => (
                <tr key={`${r.full_name}-${r.date_created}-${i}`} className="border-t">
                  <td className="px-4 py-5">{(page - 1) * (perPage || rows.length || 10) + i + 1}</td>
                  <td className="px-4 py-5">{r.full_name}</td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span>{Number(r.point)}</span>
                      <span className="text-xs text-gray-600">({r.description})</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">{new Date(r.date_created).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', ' ').replace(' ', ' ')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <button className="px-2 py-1 border rounded text-sm disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>{'<'}</button>
        {pageNumbers.map(n => (
          <button key={n} onClick={() => setPage(n)} className={`h-7 w-7 text-sm rounded border ${n === page ? 'bg-[#FFF2EC] border-[#F25E26] text-[#F25E26]' : 'bg-white border-gray-200 text-gray-700'}`}>{n}</button>
        ))}
        <button className="px-2 py-1 border rounded text-sm disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>{'>'}</button>
      </div>
    </div>
  );

  return (
    <ModalComponent
      content={content}
      isModalOpen={isOpen}
      handleCancel={onClose}
    />
  );
}


