export function Logo({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 2L2 22h20L12 2z" /> {/* Triangle/Blade base */}
            <path d="M12 2v20" /> {/* Center line for sharpness */}
            <path d="M7 12h10" /> {/* Cross check */}
            <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" /> {/* Eye/Point */}
        </svg>
    );
}
