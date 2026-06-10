import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "./ApiService";



function BowlingScorecard(){

    const{matchId} = useParams();
    const[bowlers,setBowlers] = useState([]);

    useEffect(()=>{

          if (!matchId) return;
          
        ApiService.getBowling(matchId)
          .then(res => setBowlers(res.data))
          .catch(err => console.log(err));

    },[matchId]);

    return(
        <div className="container mt-4">

            <h2>Bowling Scorecard</h2>

            <table className="table table-bordered">

                <thead>
                    <tr>
                        <th>Names</th>
                        <th>Overs</th>
                        <th>Runs</th>
                        <th>Wickets</th>
                        <th>Economy</th>
                    </tr>
                </thead>

                   <tbody>
                       {
                        bowlers.map(bowler =>(
                            <tr key={bowler.playerId}>

                                <td>{bowler.playerName}</td>
                                <td>{bowler.overs}</td>
                                <td>{bowler.runsConceded}</td>
                                <td>{bowler.wickets}</td>
                                <td>{bowler.economyRate}</td>

                            </tr>
                        ))
                       }
                   </tbody>

            </table>

        </div>
    );
}


export default BowlingScorecard;