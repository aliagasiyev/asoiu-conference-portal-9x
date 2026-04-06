"use client"

type Props = { status: string }

const styleByStatus: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 border border-gray-300",
  SUBMITTED: "bg-blue-100 text-blue-800 border border-blue-300",
  WITHDRAWN: "bg-red-100 text-red-800 border border-red-300",
  CAMERA_READY_PENDING: "bg-amber-100 text-amber-900 border border-amber-300",
  CAMERA_READY_SUBMITTED: "bg-green-100 text-green-800 border border-green-300",
}

export default function StatusBadge({ status }: Props) {
  const key = (status || "").toUpperCase()
  const cls = styleByStatus[key] || "bg-gray-100 text-gray-700 border border-gray-300"
  const text = key.replaceAll("_", " ")
  return <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${cls}`}>{text}</span>
}


