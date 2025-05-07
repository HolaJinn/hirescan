export function Footer() {
    return (
        <footer className="py-6" style={{ backgroundColor: '#2D336B' }}>
            <div className="max-w-6xl mx-auto px-4 flex justify-between text-sm text-white">
                <span>© {new Date().getFullYear()} HireScan. All rights reserved.</span>
                <div className="space-x-4">
                    <a href="/privacy" className="hover:underline">Privacy</a>
                    <a href="/terms" className="hover:underline">Terms</a>
                </div>
            </div>
        </footer>
    );
}
