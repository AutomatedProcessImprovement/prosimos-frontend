import { Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import ResourceUtilization from "./ResourceUtilization";
import ScenarioStatistics from "./ScenarioStatistics";
import TaskStatistics from "./TaskStatistics";

interface SimulationResultsProps {

}

interface SimulationResult {
    "Resource Utilization": any,
    "Individual Task Statistics": any,
    "Overall Scenario Statistics": any
}

interface ResultLocationState {
    output: SimulationResult
}

const SimulationResults = (props: SimulationResultsProps) => {
    const { state } = useLocation()
    const { output } = state as ResultLocationState
    return (
        <Grid 
            container
            alignItems="center"
            justifyContent="center"
            spacing={2}
        >
            <Grid item xs={8}>
                <TaskStatistics
                    data={output["Individual Task Statistics"]}
                />
            </Grid>
            <Grid item xs={8}>
                <ResourceUtilization 
                    data={output["Resource Utilization"]}
                />
            </Grid>
            <Grid item xs={8}>
                <ScenarioStatistics 
                    data={output["Overall Scenario Statistics"]}
                />
            </Grid>
        </Grid>
    )
}

export default SimulationResults;