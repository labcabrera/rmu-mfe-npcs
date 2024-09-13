import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

const NpcViewActions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { npcId } = useParams();
    const game = location.state?.game;

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const deleteNpc = async () => {
        console.log("deleting npc " + npcId);
        const response = await fetch("http://localhost:3002/v1/npc/" + npcId, {
            method: "DELETE",
        });
        const deleteResponse = await response;
        if (deleteResponse.status == 200) {
            navigate("/npc");
        } else {
            //TODO display error
        }
    };

    const handleEditClick = () => {
    }

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    }

    const handleDialogDeleteClose = () => {
        setDeleteDialogOpen(false);
    }

    const handleDialogDelete = () => {
        deleteNpc();
        setDeleteDialogOpen(false);
    }

    return (
        <div class="tactical-game-view-actions">
            <Stack spacing={2} direction="row" sx={{
                justifyContent: "flex-end",
                alignItems: "flex-start",
            }}>
                <Button variant="contained" onClick={handleEditClick}>Edit</Button>
                <Button variant="contained" onClick={handleDeleteClick}>Delete</Button>
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDialogDeleteClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete NPC?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Lorem ipsum
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogDeleteClose}>Cancel</Button>
                        <Button onClick={handleDialogDelete} autoFocus>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </div>
    );
}

export default NpcViewActions;