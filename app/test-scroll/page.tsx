export default function TestScroll() {
  return (
    <div className="flex flex-col h-screen ">
      <header className="p-4 bg-gray-800 text-white">Header</header>

      <main className="flex flex-1 min-h-0">
        <aside className="w-64  p-4">Sidebar</aside>

        <div className="flex flex-col flex-1 min-h-0  border-l">
          <div className="p-3 border-b">Feed Header</div>

          <div className="flex-1 min-h-0 overflow-auto p-3 space-y-2">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="p-3  border rounded shadow-sm"
              >
                Post #{i + 1}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
