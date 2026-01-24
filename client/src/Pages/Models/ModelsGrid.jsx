import { Grid } from "@mui/material";
import ModelsCard from "./ModelsCard";

const ModelsGrid = ({ models, onEdit, onDelete }) => {
    return (
        <Grid container spacing={3}>
            {models.map((model) => (
                <Grid item xs={12} sm={6} md={4} key={model._id}>
                    <ModelsCard
                        model={model}
                        onEdit={() => onEdit(model)}
                        onDelete={(e) => onDelete(model._id, e)}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ModelsGrid;