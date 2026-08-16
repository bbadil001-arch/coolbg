export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full shadow-xl animate-[fadeIn_0.15s_ease-out]">
      {message}
    </div>
  );
}
