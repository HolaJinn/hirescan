export function Features() {
    const cards = [
        {
            title: "AI-Powered Resume Screening",
            desc: "Instantly score candidates based on job descriptions and qualifications.",
        },
        {
            title: "Smart Role Suggestions",
            desc: "Automatically match candidates with alternate roles across your company.",
        },
        {
            title: "Collaborative Hiring",
            desc: "Invite your team to review, rate, and comment on potential candidates.",
        },
    ];

    return (
        <section id="features" className="py-20 px-6" style={{ backgroundColor: '#A9B5DF' }}>
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-semibold text-[#2D336B]">Key Features</h2>
                <p className="mt-4 text-[#2D336B]/80 max-w-2xl mx-auto">
                    Everything you need to make faster, smarter hiring decisions.
                </p>
                <div className="mt-12 grid gap-8 md:grid-cols-3 text-left">
                    {cards.map((card, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-[#7886C7]/20"
                        >
                            <h3 className="text-xl font-semibold text-[#2D336B]">{card.title}</h3>
                            <p className="mt-2 text-[#2D336B]/70">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
