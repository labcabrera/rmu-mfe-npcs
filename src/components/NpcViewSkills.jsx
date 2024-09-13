import React from "react";
import { useLocation, useParams } from "react-router-dom";

const NpcViewSkills = () => {
    const location = useLocation();
    const npc = location.state?.npc;

    return (
        <div>
            <h3>Skills</h3>
            {npc.skills.map((item) => (
                <div>{item.skill}: +{item.bonus}</div>
            ))}
        </div >
    );
}

export default NpcViewSkills;
