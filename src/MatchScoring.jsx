import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "./ApiService";

function MatchScoring() {

    const { matchId } = useParams();
    const navigate = useNavigate();

    const [score, setScore] = useState(null);

    const [battingPlayers, setBattingPlayers] = useState([]);
    const [bowlingPlayers, setBowlingPlayers] = useState([]);

    const [battingScorecard, setBattingScorecard] = useState([]);
    const [bowlingScorecard, setBowlingScorecard] = useState([]);

    const [strikerId, setStrikerId] = useState("");
    const [nonStrikerId, setNonStrikerId] = useState("");
    const [bowlerId, setBowlerId] = useState("");

    const [outPlayers, setOutPlayers] = useState([]);

    const [ballLog, setBallLog] = useState([]);
    const [showAllOvers, setShowAllOvers] = useState(false);

    const [bowlerOvers, setBowlerOvers] = useState({});

    const [fielderId, setFielderId] = useState("");

    const MAX_OVERS =
        score?.match?.totalOver === "20"
            ? 4
            : score?.match?.totalOver === "50"
                ? 10
                : 10;

    const [extras, setExtras] = useState({
        wd: 0,
        nb: 0,
        lb: 0
    });

    const [nextBatsmanRole, setNextBatsmanRole] = useState(null);
    // "STRIKER" or "NON_STRIKER"

    const STORAGE_KEY = `match_state_${matchId}_innings_${score?.innings || 1}`;
    const [lastBowlerId, setLastBowlerId] = useState(null);
    const [ballsInOver, setBallsInOver] = useState(0);


    // ================= LOAD SCORE =================
    useEffect(() => {
        loadScore();
    }, [matchId]);



    useEffect(() => {
        if (score) {
            loadPlayers();
        }
    }, [score]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const data = JSON.parse(saved);

            setStrikerId(data.strikerId || "");
            setNonStrikerId(data.nonStrikerId || "");
            setBowlerId(data.bowlerId || "");
            setOutPlayers(data.outPlayers || []);
            setBowlerOvers(data.bowlerOvers || {});
            setExtras(data.extras || { wd: 0, nb: 0, lb: 0 });
            setBallLog(data.ballLog || []);
        } else {

            // New innings starts with fresh data
            setStrikerId("");
            setNonStrikerId("");
            setBowlerId("");
            setOutPlayers([]);
            setBowlerOvers({});
            setExtras({
                wd: 0,
                nb: 0,
                lb: 0
            });
            setBallLog([]);
        }

    }, [STORAGE_KEY]);


    useEffect(() => {
        const data = {
            strikerId,
            nonStrikerId,
            bowlerId,
            outPlayers,
            bowlerOvers,
            extras,
            ballLog
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [strikerId, nonStrikerId, bowlerId, outPlayers, bowlerOvers, extras]);

    useEffect(() => {

        if (!score) return;

        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {

            const data = JSON.parse(saved);

            setExtras(
                data.extras || {
                    wd: 0,
                    nb: 0,
                    lb: 0
                }
            );

        } else {

            setExtras({
                wd: 0,
                nb: 0,
                lb: 0
            });

        }

    }, [score, STORAGE_KEY]);

    const loadScore = async () => {


        const batRes = await ApiService.getBatting(matchId);
        setBattingScorecard(batRes.data);

        const bowlRes = await ApiService.getBowling(matchId);
        setBowlingScorecard(bowlRes.data);
        const res = await ApiService.getMatchState(matchId);
        console.log("MATCH =", res.data.match);
        setScore(res.data);

        setStrikerId(res.data.strikerId || "");
        setNonStrikerId(res.data.nonStrikerId || "");
        setBowlerId(res.data.currentBowlerId || "");
    };

    useEffect(() => {

        if (!strikerId || !nonStrikerId || !bowlerId) {
            return;
        }

        ApiService.updateCurrentPlayers(matchId, {

            strikerId: Number(strikerId),
            nonStrikerId: Number(nonStrikerId),
            currentBowlerId: Number(bowlerId)

        });

    }, [strikerId, nonStrikerId, bowlerId]);



    const loadPlayers = async () => {

        let battingTeamId, bowlingTeamId;

        if (score.innings === 1) {
            battingTeamId = score.match.team1.id;
            bowlingTeamId = score.match.team2.id;
        } else {
            battingTeamId = score.match.team2.id;
            bowlingTeamId = score.match.team1.id;
        }

        const bat = await ApiService.getPlaying11ByTeam(matchId, battingTeamId);
        const bowl = await ApiService.getPlaying11ByTeam(matchId, bowlingTeamId);



        setBattingPlayers(bat.data || []);
        setBowlingPlayers(bowl.data || []);
    };

    const updateCurrentPlayers = async (
        striker,
        nonStriker,
        bowler
    ) => {

        try {

            console.log("Sending request...");

            const response = await ApiService.updateCurrentPlayers(matchId, {

                strikerId: striker ? Number(striker) : null,
                nonStrikerId: nonStriker ? Number(nonStriker) : null,
                currentBowlerId: bowler ? Number(bowler) : null

            });

            console.log("SUCCESS", response.data);

        } catch (err) {

            console.log("ERROR =", err);

            console.log("ERROR RESPONSE =", err.response);

            console.log("ERROR REQUEST =", err.request);

            console.log("ERROR MESSAGE =", err.message);

        }

    };


    // ================= FILTERS =================
    const availableBatters = battingPlayers;

    const availableBowlers = bowlingPlayers.filter(p => {

        const role = p.player.role?.toUpperCase();

        const balls = bowlerOvers[p.player.id] || 0;

        const maxBalls =
            score?.match?.totalOvers === 20
                ? 24
                : 60;

        const canStillBowl = balls < maxBalls;

        const notPreviousOverBowler =
            String(p.player.id) !== String(lastBowlerId);

        return (
            (role.includes("BOWLER") || role.includes("ALL")) &&
            canStillBowl &&
            notPreviousOverBowler
        );
    });

    if (!score || !score.match) return <h3>Loading...</h3>;

    /// ================= TEAM SELECTION =================
    const battingTeam =
        score.innings === 1 ? score.match.team1 : score.match.team2;

    const bowlingTeam =
        score.innings === 1 ? score.match.team2 : score.match.team1;

    // ================= CURRENT PLAYERS =================
    const striker = battingPlayers.find(
        p => String(p.player.id) === String(strikerId)
    );

    const nonStriker = battingPlayers.find(
        p => String(p.player.id) === String(nonStrikerId)
    );

    const strikerStats =
        battingScorecard.find(
            p => p.playerId === Number(strikerId)
        );

    const nonStrikerStats =
        battingScorecard.find(
            p => p.playerId === Number(nonStrikerId)
        );

    const bowler = bowlingPlayers.find(
        p => String(p.player.id) === String(bowlerId)
    );

    const bowlerStats =
        bowlingScorecard.find(
            p => p.playerId === Number(bowlerId)
        );

    const totalOvers = Number(score?.match?.totalOvers || 0);

    const totalMatchBalls = totalOvers * 6;

    // if totalBalls is null when innings starts,
    // treat it as 0 balls bowled
    const ballsBowled = Number(score?.totalBalls ?? 0);

    const remainingBalls =
        totalMatchBalls > 0
            ? totalMatchBalls - ballsBowled
            : 0;

    const runsNeeded = Math.max(
        0,
        (score?.target || 0) - (score?.totalRuns || 0)
    );

    const groupedOvers = Object.entries(
        ballLog.reduce((acc, ball) => {

            if (!acc[ball.over]) {
                acc[ball.over] = [];
            }

            acc[ball.over].push(ball.label);

            return acc;

        }, {})
    );

    const oversToShow = showAllOvers
        ? groupedOvers
        : groupedOvers.slice(-3);

    const updateLocalBatsman = (batsmanId, runs, isBall) => {
        setBattingPlayers(prev =>
            prev.map(player => {

                if (String(player.player.id) === String(batsmanId)) {

                    return {
                        ...player,

                        runs: (player.runs || 0) + runs,

                        balls: isBall
                            ? (player.balls || 0) + 1
                            : (player.balls || 0)
                    };
                }

                return player;
            })
        );
    };

    const updateLocalBowler = (bowlerId, runs, isLegal) => {

        setBowlingPlayers(prev =>
            prev.map(player => {

                if (String(player.player.id) === String(bowlerId)) {

                    return {
                        ...player,

                        runsGiven:
                            (player.runsGiven || 0) + runs,

                        balls:
                            isLegal
                                ? (player.balls || 0) + 1
                                : (player.balls || 0)
                    };
                }

                return player;
            })
        );
    };
    const isLegalBall = true; // for cricket simplicity
    // ================= SCORE BALL =================
    const scoreBall = async (runs, type, wicketType = null) => {


        if (!strikerId || !nonStrikerId || !bowlerId) {
            alert("Select batsman and bowler");
            return;
        }

        if (ballsInOver >= 6) {
            alert("Over completed. Please select new bowler.");
            return;
        }


        // ================= EXTRAS =================
        if (type === "WIDE") {
            setExtras(prev => ({ ...prev, wd: prev.wd + runs }));
        }

        if (type === "NO_BALL") {
            setExtras(prev => ({ ...prev, nb: prev.nb + runs }));
        }

        if (type === "LEG_BYE") {
            setExtras(prev => ({ ...prev, lb: prev.lb + runs }));
        }

        // ================= API CALL =================
        try {

            await ApiService.scoreBall({

                match: { matchId: Number(matchId) },
                batsman: { id: Number(strikerId) },
                bowler: { id: Number(bowlerId) },

                fielder: fielderId
                    ? { id: Number(fielderId) }
                    : null,

                runs:
                    type === "LEG_BYE" || type === "WIDE"
                        ? 0
                        : runs,

                extras:
                    type === "LEG_BYE" ||
                        type === "WIDE" ||
                        type === "NO_BALL"
                        ? runs
                        : 0,

                ballType: type,
                wicketType
            });

        } catch (error) {

            console.log("ERROR RESPONSE =", error.response);
            console.log("ERROR DATA =", error.response?.data);
            console.log("FULL ERROR =", error);

        }
        await loadScore();

        const isLegalBall =
            type === "NORMAL" ||
            type === "LEG_BYE" ||
            wicketType === "BOWLED" ||
            wicketType === "LBW" ||
            wicketType === "CAUGHT" ||
            wicketType === "STUMPED" ||
            wicketType === "HIT_WICKET" ||
            wicketType === "RUN_OUT" ||
            wicketType === "RUN_OUT_NON_STRIKER";

        updateLocalBatsman(
            strikerId,
            type === "NORMAL" ? runs : 0,
            type === "NORMAL" || type === "LEG_BYE"
        );
        updateLocalBowler(bowlerId, runs, isLegalBall);

        let label = "";

        if (wicketType) {
            label = "W";
        }
        else if (type === "NORMAL") {
            label = String(runs);
        }
        else if (type === "WIDE") {
            label =
                runs === 1 ? "WD" :
                    runs === 2 ? "WD1" :
                        runs === 3 ? "WD2" :
                            runs === 5 ? "WD4" :
                                `WD${runs - 1}`;
        }
        else if (type === "NO_BALL") {
            label =
                runs === 1 ? "NB" :
                    runs === 2 ? "NB1" :
                        runs === 3 ? "NB2" :
                            runs === 4 ? "NB3" :
                                runs === 5 ? "NB4" :
                                    runs === 7 ? "NB6" :
                                        `NB${runs - 1}`;
        }
        else if (type === "LEG_BYE") {
            label =
                runs === 0 ? "LB" :
                    runs === 1 ? "LB1" :
                        runs === 2 ? "LB2" :
                            runs === 3 ? "LB3" :
                                runs === 4 ? "LB4" :
                                    `LB${runs}`;
        }

        setBallLog(prev => [
            ...prev,
            {
                over: Math.floor((score?.totalBalls || 0) / 6),
                label
            }
        ]);



        if (isLegalBall) {

            setBowlerOvers(prev => ({
                ...prev,
                [bowlerId]: (prev[bowlerId] || 0) + 1
            }));

            setBallsInOver(prev => {

                const next = prev + 1;
                if (next === 6) {

                    const isOddRun =
                        (type === "NORMAL" || type === "LEG_BYE")
                            ? runs % 2 === 1
                            : false;

                    // Last ball 0,2,4 -> change strike
                    if (!isOddRun) {
                        const currentStriker = strikerId;
                        const currentNonStriker = nonStrikerId;

                        setStrikerId(currentNonStriker);
                        setNonStrikerId(currentStriker);
                    }

                    setTimeout(() => {
                        alert("Over completed! Select new bowler");
                    }, 50);

                    setLastBowlerId(bowlerId);
                    setBowlerId("");

                    return 0;
                }
                return next;
            });
        }
        // ================= WICKET =================
        if (wicketType) {

            const next = ballsInOver + 1;
            const isLastBallOfOver = next === 6;

            if (wicketType === "RUN_OUT_NON_STRIKER") {

                setOutPlayers(prev => [...prev, nonStrikerId]);
                setNonStrikerId("");

                await updateCurrentPlayers(
                    strikerId,
                    "",
                    bowlerId
                );

                setNextBatsmanRole("NON_STRIKER");

            } else {

                setOutPlayers(prev => [...prev, strikerId]);
                setStrikerId("");

                await updateCurrentPlayers(
                    "",
                    nonStrikerId,
                    bowlerId
                );

                setNextBatsmanRole("STRIKER");
            }

            if (isLastBallOfOver) {

                setLastBowlerId(bowlerId);
                setBowlerId("");
                setBallsInOver(0);

                alert("Over completed! Select new bowler");

            } else {

                setBallsInOver(next);

            }

            return;
        }

        // ================= STRIKE ROTATION =================
        // NORMAL
        const isLastBall = ballsInOver + 1 === 6;

        if (
            type === "NORMAL" &&
            runs % 2 === 1 &&
            !isLastBall
        ) {
            const temp = strikerId;

            setStrikerId(nonStrikerId);
            setNonStrikerId(temp);

            await updateCurrentPlayers(
                nonStrikerId,
                temp,
                bowlerId
            );
        }

        // LEG BYE
        if (
            type === "LEG_BYE" &&
            runs % 2 === 1 &&
            !isLastBall
        ) {
            const temp = strikerId;
            setStrikerId(nonStrikerId);
            setNonStrikerId(temp);
        }
        // WIDE
        if (type === "WIDE") {

            const actualRunsTaken = runs - 1;

            if (actualRunsTaken % 2 === 1) {
                const temp = strikerId;
                setStrikerId(nonStrikerId);
                setNonStrikerId(temp);
            }
        }

        // NO BALL
        if (type === "NO_BALL") {

            const actualRunsTaken = runs - 1;

            if (actualRunsTaken % 2 === 1) {
                const temp = strikerId;
                setStrikerId(nonStrikerId);
                setNonStrikerId(temp);
            }
        }


    };


    // ================= END MATCH =================
    const endMatch = async () => {
        await ApiService.updateMatch(matchId, {
            status: "COMPLETED"
        });

        alert("Match Completed");
        navigate("/matches");
    };

    return (
        <div className="container-fluid p-3">

            {/* ================= HEADER ================= */}

            <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/matches")}
            >
                ⬅ Back to Matches
            </button>


            <div className="card bg-dark text-white p-4 mb-3">

                {/* CENTER SCORECARD */}
                <div className="text-center">

                    <h3 className="fw-bold">
                        {score.match.team1.teamName} VS {score.match.team2.teamName}
                    </h3>

                    <div className="mb-2">
                        <span className="text-success">
                            Batting : <b>{battingTeam.teamName}</b>
                        </span>

                        {" | "}

                        <span className="text-warning">
                            Bowling : <b>{bowlingTeam.teamName}</b>
                        </span>
                    </div>

                    <h1 className="fw-bold">
                        {score.totalRuns}/{score.wickets}
                    </h1>

                    <h5>
                        Overs : {Math.floor((score.totalBalls || 0) / 6)}.
                        {(score.totalBalls || 0) % 6}
                    </h5>

                    {score.innings === 2 && (
                        <div className="mt-2">
                            <h5 className="text-warning fw-bold">
                                🎯 Need {runsNeeded} runs from {remainingBalls} balls
                            </h5>
                        </div>
                    )}

                    {/* 🟢 MATCH RESULT (NEW PART) */}
                    {score.isMatchCompleted && (
                        <div className="mt-3 p-3 bg-success text-white rounded">

                            <h4 className="fw-bold">
                                🏆 {score.winnerTeam?.teamName || score.winnerTeam} WON
                            </h4>

                            <h5>
                                {score.result ||
                                    `${score.winnerTeam?.teamName || score.winnerTeam} won the match`}
                            </h5>

                        </div>
                    )}

                </div>



                <hr />

                <div className="row">

                    {/* LEFT SIDE - BATSMEN */}

                    <div className="col-md-6">

                        <div className="mb-2">
                            <b>* {striker?.player?.playerName || "Striker"}</b>

                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                            {strikerStats?.runs || 0} ({strikerStats?.balls || 0})
                        </div>

                        <div className="mb-2">
                            {nonStriker?.player?.playerName || "Non-Striker"}

                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                            {nonStrikerStats?.runs || 0} ({nonStrikerStats?.balls || 0})
                        </div>

                    </div>

                    {/* RIGHT SIDE - BOWLER */}
                    <div className="col-md-6 text-end">

                        <div>
                            <b>
                                {bowler?.player?.playerName || "Bowler"}
                            </b>
                        </div>

                        <div>
                            Overs- {Math.floor((bowlerOvers[bowlerId] || 0) / 6)}.
                            {(bowlerOvers[bowlerId] || 0) % 6}
                            -
                            Runs: {bowlerStats?.runsConceded || 0}
                            -
                            Wickets: {bowlerStats?.wickets || 0}
                        </div>

                        {/* <small>
                            Overs - Runs - Wickets
                        </small> */}

                    </div>

                </div>

            </div>
            <div className="row">

                {/* ================= LEFT ================= */}
                <div className="col-md-3">
                    <div className="card p-3">

                        <h5>Batting</h5>

                        {/* STRIKER */}
                        <select
                            className="form-select mb-2"
                            value={strikerId ? String(strikerId) : ""}
                            onChange={async e => {

                                const value = e.target.value;

                                setStrikerId(value);

                                await updateCurrentPlayers(
                                    value,
                                    nonStrikerId,
                                    bowlerId
                                );

                            }}
                        >
                            <option value="">Select Striker</option>
                            {battingPlayers.map(p => (
                                <option
                                    key={p.player.id}
                                    value={p.player.id}
                                    disabled={
                                        String(p.player.id) === String(nonStrikerId) ||
                                        outPlayers.includes(String(p.player.id))
                                    }
                                >
                                    {p.player.playerName}
                                </option>
                            ))}
                        </select>

                        {/* NON STRIKER */}
                        <select
                            className="form-select mb-3"
                            value={nonStrikerId ? String(nonStrikerId) : ""}
                            onChange={async e => {

                                const value = e.target.value;

                                setNonStrikerId(value);

                                await updateCurrentPlayers(
                                    strikerId,
                                    value,
                                    bowlerId
                                );

                            }}
                        >
                            <option value="">Select Non-Striker</option>
                            {battingPlayers.map(p => (
                                <option
                                    key={p.player.id}
                                    value={p.player.id}
                                    disabled={
                                        String(p.player.id) === String(strikerId) ||
                                        outPlayers.includes(String(p.player.id))
                                    }
                                >
                                    {p.player.playerName}
                                </option>
                            ))}
                        </select>

                        {/* ✅ ADD THIS HERE (IMPORTANT PLACE) */}
                        {nextBatsmanRole && (
                            <select
                                className="form-select mb-3 border-success"
                                onChange={async (e) => {
                                    const newId = e.target.value;
                                    if (outPlayers.includes(String(newId))) {
                                        alert("Player is already out");
                                        return;
                                    }

                                    if (nextBatsmanRole === "STRIKER") {

                                        setStrikerId(newId);

                                        await updateCurrentPlayers(
                                            newId,
                                            nonStrikerId,
                                            bowlerId
                                        );

                                    } else {

                                        setNonStrikerId(newId);

                                        await updateCurrentPlayers(
                                            strikerId,
                                            newId,
                                            bowlerId
                                        );
                                    }

                                    setNextBatsmanRole(null);
                                }}
                            >
                                <option>Select Next Batsman</option>
                                {availableBatters
                                    .filter(
                                        p =>
                                            !outPlayers.includes(String(p.player.id))
                                    )
                                    .map(p => (
                                        <option
                                            key={p.player.id}
                                            value={p.player.id}
                                            disabled={
                                                String(p.player.id) === String(strikerId) ||
                                                String(p.player.id) === String(nonStrikerId)
                                            }
                                        >
                                            {p.player.playerName}
                                        </option>
                                    ))}
                            </select>
                        )}

                        <h5>Bowler</h5>

                        <select
                            className="form-select"
                            value={bowlerId}
                            onChange={async e => {

                                const newBowler = e.target.value;

                                setBowlerId(newBowler);

                                // await updateCurrentPlayers(
                                //     strikerId,
                                //     nonStrikerId,
                                //     ""
                                // );

                                setBallsInOver(
                                    (bowlerOvers[newBowler] || 0) % 6
                                );

                                // await updateCurrentPlayers(
                                //     strikerId,
                                //     nonStrikerId,
                                //     newBowler
                                // );

                            }}
                        >
                            <option>Select Bowler</option>
                            {availableBowlers.map(p => (
                                <option key={p.player.id} value={p.player.id}>
                                    {p.player.playerName}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>

                {/* ================= CENTER ================= */}
                <div className="col-md-6">

                    <div className="card p-3">

                        <h5>⚡ Scoring Panel</h5>

                        {/* RUNS */}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {[0, 1, 2, 3, 4, 6].map(r => (
                                <button
                                    key={r}
                                    className="btn btn-primary"
                                    onClick={() => scoreBall(r, "NORMAL")}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        {/* WD / NB */}
                        <div className="d-flex flex-wrap gap-2 mb-3">

                            <button className="btn btn-warning" onClick={() => scoreBall(1, "WIDE")}>WD</button>
                            <button className="btn btn-warning" onClick={() => scoreBall(2, "WIDE")}>WD1</button>
                            <button className="btn btn-warning" onClick={() => scoreBall(3, "WIDE")}>WD2</button>
                            <button className="btn btn-warning" onClick={() => scoreBall(5, "WIDE")}>WD5</button>

                            <button className="btn btn-info" onClick={() => scoreBall(1, "NO_BALL")}>NB</button>
                            <button className="btn btn-info" onClick={() => scoreBall(2, "NO_BALL")}>NB1</button>
                            <button className="btn btn-info" onClick={() => scoreBall(3, "NO_BALL")}>NB2</button>
                            <button className="btn btn-info" onClick={() => scoreBall(5, "NO_BALL")}>NB4</button>
                            <button className="btn btn-info" onClick={() => scoreBall(7, "NO_BALL")}>NB6</button>

                        </div>

                        {/* LB */}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            <button className="btn btn-secondary" onClick={() => scoreBall(0, "LEG_BYE")}>LB</button>
                            <button className="btn btn-secondary" onClick={() => scoreBall(1, "LEG_BYE")}>LB1</button>
                            <button className="btn btn-secondary" onClick={() => scoreBall(2, "LEG_BYE")}>LB2</button>
                            <button className="btn btn-secondary" onClick={() => scoreBall(4, "LEG_BYE")}>LB4</button>

                        </div>

                        {/* FIELDER SELECTION */}
                        <h5 className="mt-3">Fielder</h5>

                        <select
                            className="form-select mb-3"
                            value={fielderId}
                            onChange={(e) => setFielderId(e.target.value)}
                        >
                            <option value="">Select Fielder</option>

                            {bowlingPlayers.map(p => (
                                <option
                                    key={p.player.id}
                                    value={p.player.id}
                                >
                                    {p.player.playerName}
                                </option>
                            ))}
                        </select>

                        {/* WICKETS */}
                        <div className="d-flex flex-wrap gap-2">

                            <button className="btn btn-dark" onClick={() => scoreBall(0, "NORMAL", "BOWLED")}>Bowled</button>
                            <button className="btn btn-dark" onClick={() => scoreBall(0, "NORMAL", "LBW")}>LBW</button>
                            <button className="btn btn-dark" onClick={() => scoreBall(0, "NORMAL", "CAUGHT")}>Caught</button>
                            <button className="btn btn-dark" onClick={() => scoreBall(0, "NORMAL", "RUN_OUT")}> Run Out (Striker)</button>
                            <button className="btn btn-dark" onClick={() => scoreBall(0, "NORMAL", "RUN_OUT_NON_STRIKER")}>  Run Out (Non-Striker) (Striker)</button>
                            <button className="btn btn-dark" onClick={() => scoreBall(0, "NORMAL", "STUMPED")}>Stumped</button>
                            <button className="btn btn-dark" onClick={() => scoreBall(0, "NORMAL", "HIT_WICKET")}>Hit-Wicket</button>

                        </div>

                    </div>
                </div>

                {/* ================= RIGHT (EXTRAS SUMMARY) ================= */}
                <div className="col-md-3">

                    <div className="card p-3 shadow">

                        <h5>📊 Extras Summary</h5>

                        <div className="d-flex justify-content-between">
                            <span>WD</span>
                            <b>{extras.wd}</b>
                        </div>

                        <div className="d-flex justify-content-between">
                            <span>NB</span>
                            <b>{extras.nb}</b>
                        </div>

                        <div className="d-flex justify-content-between">
                            <span>LB</span>
                            <b>{extras.lb}</b>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between">
                            <h6>Total Extras</h6>
                            <h6>{extras.wd + extras.nb + extras.lb}</h6>
                        </div>

                    </div>
                </div>
            </div>

            {/* ================= BALL LOG ================= */}
            <div className="card mt-3 p-3">

                <h5>Ball Log</h5>

                <div>

                    {groupedOvers.length > 3 && (

                        <button
                            className="btn btn-sm btn-outline-primary mb-3"
                            onClick={() => setShowAllOvers(!showAllOvers)}
                        >
                            {showAllOvers
                                ? "Show Last 3 Overs"
                                : "Show All Overs"}
                        </button>

                    )}

                    {oversToShow.map(([over, balls]) => (

                        <div key={over} className="mb-3">

                            <div className="fw-bold mb-1">
                                Over {Number(over) + 1}
                            </div>

                            <div
                                className="border rounded p-2 bg-light"
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "600"
                                }}
                            >

                                {balls.map((ball, index) => (

                                    <span
                                        key={index}
                                        className={
                                            ball === "W"
                                                ? "text-danger fw-bold me-2"
                                                : "me-2"
                                        }
                                    >
                                        {ball}
                                    </span>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* ================= END MATCH ================= */}
            <div className="text-center mt-3">

                <button className="btn btn-danger btn-lg" onClick={endMatch}>
                    End Match
                </button>

            </div>

        </div>
    );
}

export default MatchScoring;