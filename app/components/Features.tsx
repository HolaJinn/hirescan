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
        <section
            id="features"
            className="py-20 px-6 bg-purple-100"
        >
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-purple-700">Key Features</h2>
                <p className="mt-4 text-purple-600 max-w-2xl mx-auto text-lg">
                    Everything you need to make faster, smarter hiring decisions.
                </p>
                <div className="mt-12 grid gap-8 md:grid-cols-3 text-left">
                    {cards.map((card, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl p-8 bg-white border border-purple-200 transition-all duration-300 hover:shadow-lg hover:shadow-purple-300"
                        >
                            <h3 className="text-xl font-extrabold text-purple-600 mb-3">
                                {card.title}
                            </h3>
                            <p className="text-gray-700">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
