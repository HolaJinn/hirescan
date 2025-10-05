'use client';

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    RadialBarChart, RadialBar, PolarAngleAxis,
    LineChart, Line,
    PieChart, Pie, Cell
} from 'recharts';

interface ChartsProps {
    applicantsPerJob: { jobTitle: string; count: number }[];
    averageMatchScore: { jobTitle: string; score: number }[];
    timeToFirstApplication: { jobTitle: string; hours: number }[];
    conversionRate: { jobTitle: string; rate: number }[];
}

export default function Charts({
    applicantsPerJob,
    averageMatchScore,
    timeToFirstApplication,
    conversionRate,
}: ChartsProps) {
    const COLORS = ["#8b5cf6", "#6366f1", "#22c55e", "#f97316", "#ef4444"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1 */}
            <div className="space-y-6">
                {/* Applicants per Job */}
                <div className="h-64">
                    <h3 className="text-lg font-semibold mb-2">Applicants per Job</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={applicantsPerJob}>
                            {/* Hide X-axis labels and axis line */}
                            <XAxis dataKey="jobTitle"  />
                            <YAxis />
                            {/* Show job title in tooltip */}
                            <Tooltip
                                labelFormatter={(label) => `Job: ${label}`}
                                formatter={(value) => [`${value}`, 'Applicants']}
                            />
                            {/* Set a fixed bar size to make it thinner */}
                            <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>


                {/* Time to First Application */}
                <div className="h-64">
                    <h3 className="text-lg font-semibold mb-2">Time to First Application (hrs)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeToFirstApplication}>
                            <XAxis />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="hours" stroke="#f97316" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 2 */}
            <div className="space-y-6">
                {/* Average Match Score */}
                <div className="h-64">
                    <h3 className="text-lg font-semibold mb-2">Average Match Score</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            data={averageMatchScore}
                            startAngle={90}
                            endAngle={-270}
                            barSize={20}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                            <RadialBar dataKey="score" cornerRadius={10} fill="#22c55e" />
                            <Tooltip />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>

                {/* Conversion Rate */}
                <div className="h-64">
                    <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={conversionRate}
                                dataKey="rate"
                                nameKey="jobTitle"
                                outerRadius={90}
                                label
                            >
                                {conversionRate.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
