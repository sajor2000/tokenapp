export default function WizardLoading() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6 animate-pulse">
        {/* Progress bar skeleton */}
        <div className="h-10 bg-slate-200 rounded-lg"></div>

        {/* Card skeleton */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="space-y-4">
            {/* Title */}
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>

            {/* Description */}
            <div className="h-4 bg-slate-100 rounded w-2/3"></div>

            <div className="space-y-6 mt-8">
              {/* Form fields */}
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-24"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-32"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>

              {/* Large content area */}
              <div className="h-64 bg-slate-50 rounded-lg"></div>

              {/* Buttons */}
              <div className="flex justify-between pt-4">
                <div className="h-10 bg-slate-200 rounded w-32"></div>
                <div className="h-10 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <p className="text-sm text-slate-500">Loading wizard...</p>
      </div>
    </div>
  );
}
