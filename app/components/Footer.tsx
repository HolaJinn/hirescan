export function Footer() {
    return (
        <footer className="py-6 bg-purple-100">
            <div className="max-w-6xl mx-auto px-4 flex justify-between text-sm text-purple-700">
                <span>© {new Date().getFullYear()} HireScan. All rights reserved.</span>
                <div className="space-x-6">
                    <a
                        href="/privacy"
                        className="hover:underline hover:text-purple-800 text-purple-600 transition-colors duration-200"
                    >
                        Privacy
                    </a>
                    <a
                        href="/terms"
                        className="hover:underline hover:text-purple-800 text-purple-600 transition-colors duration-200"
                    >
                        Terms
                    </a>
                </div>
            </div>
        </footer>
    );
}
