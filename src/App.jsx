import ThreeObj from './ThreeObj.jsx'
import './App.css';

function App() {
    const modelPath = 'src/models';

    return (
        <main>
            <ThreeObj width={500} height={700} cameraPosition={[0, 0, .85]} modelOffset={[0, -.35, 0]}  objPath={`${modelPath}/Primrose.obj`} mtlPath={`${modelPath}/Primrose.mtl`}/>
        </main>
    );
}

export default App;
