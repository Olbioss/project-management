import { Link, useNavigate } from "react-router";
import { MapPinOff, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-8">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-blue-100 dark:bg-dark-secondary">
          <MapPinOff
            className="h-9 w-9 text-blue-primary dark:text-blue-400"
            aria-hidden="true"
          />
        </div>

        <div className="text-[56px] font-medium leading-none tracking-tight text-gray-800 dark:text-white">
          404
        </div>

        <h2 className="mt-3 text-lg font-medium text-gray-800 dark:text-white">
          Page not found
        </h2>
        <p className="mb-7 mt-2 text-sm leading-relaxed text-gray-500 dark:text-neutral-400">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="flex justify-center gap-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 active:scale-[0.98] dark:border-stroke-dark dark:text-neutral-300 dark:hover:bg-dark-secondary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}