import KalkulatorGizi from './components/KalkulatorGizi';
import Footer from './components/Footer';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <main style={{ flex: 1 }}>
        <KalkulatorGizi />
      </main>
      <Footer />
    </div>
  );
}

export default App;
