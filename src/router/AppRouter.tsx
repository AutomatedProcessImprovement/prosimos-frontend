import { Routes, Route } from "react-router-dom"
import SimulationResults from "../components/results/SimulationResults";
import SimulationParameters from "../components/SimulationParameters"
import Upload from "../components/Upload"
import paths from "./paths";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Upload/>} />
            <Route path={paths.SIMULATOR_UPLOAD_PATH} element={<Upload/>} />
            <Route path={paths.SIMULATOR_PARAMS_PATH} element={<SimulationParameters/>} />
            <Route path={paths.SIMULATOR_RESULTS_PATH} element={<SimulationResults/>}/>
        </Routes>
    )
}

export default AppRouter;