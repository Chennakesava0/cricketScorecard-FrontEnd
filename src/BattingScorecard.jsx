import { useEffect, useState } from "react";
import ApiService from "./ApiService";
import { useParams } from "react-router-dom";


function BattingScorecard(){

    const {matchId} = useParams();

    const[players,setPlayers] = useState([]);

    useEffect(()=>{

          if (!matchId) return;

        ApiService.getBatting(matchId)
            .then(res => setPlayers(res.data))
            .catch(err => console.log(err));

    },[matchId]);

    return(
        <div className="container mt-4"> 

               <h2>Batting Scorecard</h2>

               <table className="table table-bordered">

                 <thead>
                     <tr>
                        <th>Name</th>
                        <th>Runs</th>
                        <th>Balls</th>
                        <th>Fours</th>
                        <th>Sixes</th>
                        <th>SR</th>
                        <th>Dismissal</th>
                     </tr>
                 </thead>

                   <tbody>
                        {
                            players.map(player =>(
                                <tr key={player.playerId}>

                                    <td>{player.playerName}</td>
                                    <td>{player.runs}</td>
                                    <td>{player.balls}</td>
                                    <td>{player.fours}</td>
                                    <td>{player.sixes}</td>
                                    <td>{player.strikeRate}</td>
                                    <td>{player.dismissalType || "Not Out"}</td>

                                </tr>
                            ))
                        }
                   </tbody>

               </table>

        </div>
    );
}


export default BattingScorecard;