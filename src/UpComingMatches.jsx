import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "./ApiService";

function UpcomingMatches() {

    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        ApiService.getMatches()
            .then(res => {
                const upcoming = res.data.filter(
                    match => match.status === "UPCOMING"
                );
                setMatches(upcoming);
            })
            .catch(console.error);
    }, []);

    const formatTime = (time) => {
        if (!time) return "-";

        const [h, m] = time.split(":");
        let hours = Number(h);

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) hours = 12;

        return `${hours}:${m} ${ampm}`;
    };

    const getDisplayDate = (dateStr) => {
        if (!dateStr) return "-";

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const date = new Date(dateStr);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="container mt-4">

            {/* HEADER SECTION */}
            <div className="d-flex align-items-center justify-content-between mb-4">

                <h3 className="fw-bold text-primary m-0">
                    🏏 Upcoming Matches
                </h3>

                <button
                    className="btn btn-outline-primary px-3"
                    onClick={() => {
                        if (matches.length > 0) {
                            navigate(`/live/${matches[0].matchId}`);
                        } else {
                            navigate("/");
                        }
                    }}
                >
                    ← Back
                </button>

            </div>

            {/* MATCHES */}
            {matches.length === 0 ? null : (

                <div className="row g-3">

                    {matches.map(match => (

                        <div
                            key={match.matchId}
                            className="col-lg-3 col-md-4 col-sm-6"
                        >

                            <div
                                className="card border-0 shadow-sm h-100"
                                style={{
                                    borderRadius: "16px",
                                    padding: "12px",
                                    cursor: "pointer"
                                }}
                            >

                                {/* VENUE */}
                                <div className="fw-bold text-dark mb-2">
                                    🏟 {match.venue}
                                </div>

                                <hr className="my-2" />

                                {/* CONTENT */}
                                <div className="d-flex justify-content-between align-items-start">

                                    {/* LEFT - TEAMS */}
                                    <div>

                                        <div className="fw-semibold">
                                            {match.team1?.teamName}
                                        </div>

                                        <div className="fw-semibold mt-2">
                                            {match.team2?.teamName}
                                        </div>

                                    </div>

                                    {/* RIGHT - DATE & TIME */}
                                    <div className="text-end">

                                        <div className="fw-bold text-primary">
                                            {getDisplayDate(match.matchDate)}
                                        </div>

                                        <div className="text-muted mt-2">
                                            {formatTime(match.matchTime)}
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default UpcomingMatches;