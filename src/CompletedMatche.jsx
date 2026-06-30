
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "./ApiService";

function CompletedMatches() {

    const [matches, setMatches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        ApiService.getCompletedMatches()
            .then(res => setMatches(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Completed Matches</h2>

            {matches.length === 0 ? (
                <p>No completed matches found.</p>
            ) : (
                matches.map(match => (
                    <div
                        key={match.id}
                        className="card shadow-sm mb-3"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                            navigate(`/result/${match.id}`)
                        }
                    >
                        <div className="card-body">

                            <h5>
                                {match.team1.teamName}
                                {" vs "}
                                {match.team2.teamName}
                            </h5>

                            <p>
                                Winner:
                                {" "}
                                {match.winner?.teamName}
                            </p>

                        </div>
                    </div>
                ))
            )}

        </div>
    );
}

export default CompletedMatches;