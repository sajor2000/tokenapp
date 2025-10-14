export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-slate-900">Loading CLIF-CAT</p>
          <p className="text-sm text-slate-600">
            Clinical Logic-Informed Foundation Model Tokenization
          </p>
        </div>
      </div>
    </div>
  );
}
