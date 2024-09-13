import React from "react";
import { useLocation, useParams } from "react-router-dom";

const NpcViewItems = () => {
    const location = useLocation();
    const npc = location.state?.npc;

    return (
        <div>
            <h3>Items</h3>
            {npc.items.map((item) => (
                <div>{item.name} - {item.type}</div>
            ))}
        </div >
    );
}

export default NpcViewItems;
