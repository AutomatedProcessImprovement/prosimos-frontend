import { Routes, Route } from "react-router-dom"
import BPMNModelViewer from "../components/model/BPMNModelViewer";
import SimulationParameters from "../components/SimulationParameters"
import Upload from "../components/Upload"
import paths from "./paths";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Upload/>} />
            <Route path={paths.SIMULATOR_UPLOAD_PATH} element={<Upload/>} />
            <Route path={paths.SIMULATOR_SCENARIO_PATH} element={<SimulationParameters/>} />
            <Route path={paths.MODEL_VIEWER} element={<BPMNModelViewer/>} />
        </Routes>
    )
}

export default AppRouter;