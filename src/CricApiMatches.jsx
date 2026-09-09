import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CricApiService from "./CricApiService";
import "./CricApiMatches.css";

function CricApiMatches() {

    const navigate = useNavigate();

    const [matches, setMatches] = useState([]);
    const [series, setSeries] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedMatch, setSelectedMatch] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState(null);


    // =====================================================
    // LOAD DATA FROM DATABASE
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        try {

            setLoading(true);

            const [matchesResponse, seriesResponse] =
                await Promise.all([
                    CricApiService.getApiMatches(),
                    CricApiService.getApiSeries()
                ]);


            // =====================================================
            // SORT MATCHES
            // LIVE -> UPCOMING -> COMPLETED
            // =====================================================

            const matchData = matchesResponse.data || [];

            const sortedMatches = [...matchData].sort((a, b) => {

                const getPriority = (match) => {

                    // LIVE MATCH
                    if (
                        match.matchStarted === true &&
                        match.matchEnded === false
                    ) {
                        return 1;
                    }

                    // UPCOMING MATCH
                    if (
                        match.matchStarted === false &&
                        match.matchEnded === false
                    ) {
                        return 2;
                    }

                    // COMPLETED MATCH
                    if (match.matchEnded === true) {
                        return 3;
                    }

                    return 4;
                };

                return getPriority(a) - getPriority(b);

            });

            setMatches(sortedMatches);

            setSeries(seriesResponse.data || []);

        }
        catch (error) {

            console.error(
                "Error loading CricAPI database data:",
                error
            );

        }
        finally {

            setLoading(false);

        }
    };


    // =====================================================
    // DELETE MATCH
    // =====================================================

    const handleDeleteMatch = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this match?"
            );

        if (!confirmDelete) {
            return;
        }


        try {

            await CricApiService.deleteApiMatch(id);


            // Remove from page immediately
            setMatches(prevMatches =>
                prevMatches.filter(
                    match => match.apiMatchId !== id
                )
            );


            // Clear selected match if deleted
            if (
                selectedMatch &&
                selectedMatch.apiMatchId === id
            ) {

                setSelectedMatch(null);

            }

        }
        catch (error) {

            console.error(
                "Error deleting match:",
                error
            );

            alert("Unable to delete match.");

        }

    };


    // =====================================================
    // DELETE SERIES
    // =====================================================

    const handleDeleteSeries = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this series?"
            );

        if (!confirmDelete) {
            return;
        }


        try {

            await CricApiService.deleteApiSeries(id);


            // Remove from page immediately
            setSeries(prevSeries =>
                prevSeries.filter(
                    item => item.id !== id
                )
            );


            // Clear selected series
            if (
                selectedSeries &&
                selectedSeries.id === id
            ) {

                setSelectedSeries(null);

            }

        }
        catch (error) {

            console.error(
                "Error deleting series:",
                error
            );

            alert("Unable to delete series.");

        }

    };


    // =====================================================
    // SELECT MATCH
    // =====================================================

    const handleSelectMatch = (match) => {

        setSelectedMatch(match);

        localStorage.setItem(
            "selectedApiMatchId",
            match.apiMatchId
        );

        localStorage.setItem(
            "selectedApiMatchKey",
            match.apiMatchKey
        );

    };


    // =====================================================
    // SELECT SERIES
    // =====================================================

    const handleSelectSeries = (item) => {

        setSelectedSeries(item);

        localStorage.setItem(
            "selectedApiSeriesId",
            item.id
        );

        localStorage.setItem(
            "selectedApiSeriesKey",
            item.seriesId
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="cricapi-page">

                <div className="cricapi-loading">

                    Loading CricAPI data...

                </div>

            </div>
        );

    }


    return (

        <div className="cricapi-page">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="cricapi-page-header">

                <div>

                    <h1>
                        CricAPI Data
                    </h1>

                    <p>
                        Matches and series synchronized
                        from CricAPI
                    </p>

                </div>


                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Dashboard
                </button>

            </div>



            {/* ================================================= */}
            {/* SUMMARY */}
            {/* ================================================= */}

            <div className="cricapi-summary">

                <div className="summary-card">

                    <span>
                        Total Matches
                    </span>

                    <strong>
                        {matches.length}
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Total Series
                    </span>

                    <strong>
                        {series.length}
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Selected Match
                    </span>

                    <strong>

                        {selectedMatch
                            ? "Selected"
                            : "None"}

                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Selected Series
                    </span>

                    <strong>

                        {selectedSeries
                            ? "Selected"
                            : "None"}

                    </strong>

                </div>

            </div>



            {/* ================================================= */}
            {/* MATCHES */}
            {/* ================================================= */}

            <div className="data-section">

                <div className="section-title">

                    <div>

                        <h2>
                            🏏 Current Matches
                        </h2>

                        <p>
                            Matches stored in your database
                        </p>

                    </div>

                    <span className="count-badge">
                        {matches.length} Matches
                    </span>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    API Match ID
                                </th>

                                <th>
                                    Teams
                                </th>

                                <th>
                                    Venue
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Time
                                </th>

                                <th>
                                    Format
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Started
                                </th>

                                <th>
                                    Ended
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {matches.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="empty-row"
                                    >
                                        No matches found
                                    </td>

                                </tr>

                            ) : (

                                matches.map(match => (

                                    <tr
                                        key={match.apiMatchId}
                                        className={`
        ${match.matchStarted && !match.matchEnded
                                                ? "live-match-row"
                                                : ""
                                            }

        ${selectedMatch &&
                                                selectedMatch.apiMatchId === match.apiMatchId
                                                ? "selected-row"
                                                : ""
                                            }
    `}
                                    >

                                        <td>
                                            {
                                                match.apiMatchId
                                            }
                                        </td>

                                        <td className="api-id">

                                            {
                                                match.apiMatchKey
                                            }

                                        </td>

                                        <td>

                                            <strong>
                                                {
                                                    match.team1Name
                                                }
                                            </strong>

                                            <br />

                                            <span>
                                                vs
                                            </span>

                                            <br />

                                            <strong>
                                                {
                                                    match.team2Name
                                                }
                                            </strong>

                                        </td>

                                        <td>
                                            {
                                                match.venue ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                match.matchDate ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                match.matchTime ||
                                                "-"
                                            }
                                        </td>

                                        <td>

                                            <span className="format-badge">

                                                {
                                                    match.matchFormat
                                                }

                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    match.matchEnded
                                                        ? "status completed"
                                                        : match.matchStarted
                                                            ? "status live"
                                                            : "status upcoming"
                                                }
                                            >

                                                {
                                                    match.status ||
                                                    "UNKNOWN"
                                                }

                                            </span>

                                        </td>

                                        <td>

                                            {match.matchStarted
                                                ? "YES"
                                                : "NO"}

                                        </td>

                                        <td>

                                            {match.matchEnded
                                                ? "YES"
                                                : "NO"}

                                        </td>


                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="select-button"
                                                    onClick={() =>
                                                        handleSelectMatch(
                                                            match
                                                        )
                                                    }
                                                >
                                                    {selectedMatch &&
                                                        selectedMatch.apiMatchId ===
                                                        match.apiMatchId
                                                        ? "Selected"
                                                        : "Select"}
                                                </button>


                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDeleteMatch(
                                                            match.apiMatchId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>



            {/* ================================================= */}
            {/* SERIES */}
            {/* ================================================= */}

            <div className="data-section">

                <div className="section-title">

                    <div>

                        <h2>
                            🏆 Cricket Series
                        </h2>

                        <p>
                            Series stored in your database
                        </p>

                    </div>

                    <span className="count-badge">
                        {series.length} Series
                    </span>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    DB ID
                                </th>

                                <th>
                                    Series ID
                                </th>

                                <th>
                                    Series Name
                                </th>

                                <th>
                                    Season
                                </th>

                                <th>
                                    Format
                                </th>

                                <th>
                                    Start Date
                                </th>

                                <th>
                                    End Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {series.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="empty-row"
                                    >
                                        No series found
                                    </td>

                                </tr>

                            ) : (

                                series.map(item => (

                                    <tr
                                        key={item.id}
                                        className={
                                            selectedSeries &&
                                                selectedSeries.id === item.id
                                                ? "selected-row"
                                                : ""
                                        }
                                    >

                                        <td>
                                            {item.id}
                                        </td>

                                        <td className="api-id">

                                            {
                                                item.seriesId
                                            }

                                        </td>

                                        <td>

                                            <strong>
                                                {
                                                    item.seriesName
                                                }
                                            </strong>

                                        </td>

                                        <td>
                                            {
                                                item.season ||
                                                "-"
                                            }
                                        </td>

                                        <td>

                                            <span className="format-badge">

                                                {
                                                    item.seriesFormat
                                                }

                                            </span>

                                        </td>

                                        <td>
                                            {
                                                item.startDate ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                item.endDate ||
                                                "-"
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    item.status ===
                                                        "LIVE"
                                                        ? "status live"
                                                        : item.status ===
                                                            "COMPLETED"
                                                            ? "status completed"
                                                            : "status upcoming"
                                                }
                                            >

                                                {
                                                    item.status
                                                }

                                            </span>

                                        </td>


                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="select-button"
                                                    onClick={() =>
                                                        handleSelectSeries(
                                                            item
                                                        )
                                                    }
                                                >

                                                    {selectedSeries &&
                                                        selectedSeries.id ===
                                                        item.id
                                                        ? "Selected"
                                                        : "Select"}

                                                </button>


                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDeleteSeries(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>



            {/* ================================================= */}
            {/* SELECTED MATCH */}
            {/* ================================================= */}

            {selectedMatch && (

                <div className="selected-info">

                    <h3>
                        Selected Match
                    </h3>

                    <p>

                        <strong>
                            {selectedMatch.team1Name}
                        </strong>

                        {" vs "}

                        <strong>
                            {selectedMatch.team2Name}
                        </strong>

                    </p>

                    <p>

                        API Match ID:

                        {" "}

                        {selectedMatch.apiMatchKey}

                    </p>

                </div>

            )}



            {/* ================================================= */}
            {/* SELECTED SERIES */}
            {/* ================================================= */}

            {selectedSeries && (

                <div className="selected-info">

                    <h3>
                        Selected Series
                    </h3>

                    <p>
                        <strong>
                            {selectedSeries.seriesName}
                        </strong>
                    </p>

                    <p>

                        Series ID:

                        {" "}

                        {selectedSeries.seriesId}

                    </p>

                </div>

            )}

        </div>

    );

}

export default CricApiMatches;