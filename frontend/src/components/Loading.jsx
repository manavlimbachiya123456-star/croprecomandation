export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-green-800">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
      <span>{text}</span>
    </div>
  );
}
