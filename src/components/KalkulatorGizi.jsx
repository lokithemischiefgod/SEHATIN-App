import { useState } from "react";
import './KalkulatorGizi.css';

function KalkulatorGizi() {
  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [usia, setUsia] = useState("");
  const [hamil, setHamil] = useState("");
  const [aktivitas, setAktivitas] = useState("1.3");
  const [hasil, setHasil] = useState(null);

  function hitung() {
    const bb = parseFloat(berat);
    const tb = parseFloat(tinggi);
    const umur = parseInt(usia);
    const usiaHamil = parseInt(hamil);
    const faktorAktivitas = parseFloat(aktivitas);

    if (isNaN(bb) || isNaN(tb) || isNaN(umur) || isNaN(usiaHamil)) {
      setHasil("Harap lengkapi semua data.");
      return;
    }

    // Hitung IMT
    const imt = bb / Math.pow(tb / 100, 2);

    let status = "";
    if (imt <= 18.49) {
        status = "Berat Badan Kurang";
    } else if (imt >= 18.5 && imt <= 24.9) {
        status = "Berat Badan Normal";
    } else if (imt > 25 && imt <= 27) {
        status = "Berat Badan Lebih";
    } else {
        status = "Obesitas";
    }


    // Hitung BEE
    const BEE = 655 + (9.6 * bb) + (1.8 * tb) - (4.7 * umur);

    // Hitung TEE
    const TEE = BEE * faktorAktivitas;

    // Tambahan energi trimester
    let tambahan = 0;
    if (usiaHamil <= 13) tambahan = 100;
    else tambahan = 300;

    const TEEKehamilan = TEE + tambahan;

    // Output sederhana
    setHasil({
      status,
      TEEKehamilan: TEEKehamilan.toFixed(2)
    });
  }

  return (
    <div className="kalkulator-container">
      <img src="/logoposco.jpg" alt="Logo SEHATIN" className="logo-image" />

      <h2>Kalkulator Gizi Ibu Hamil</h2>

      <div className="input-group">
        <label>Berat Badan (kg)</label>
        <input type="number" value={berat} onChange={(e) => setBerat(e.target.value)} />

        <label>Tinggi Badan (cm)</label>
        <input type="number" value={tinggi} onChange={(e) => setTinggi(e.target.value)} />

        <label>Usia Ibu (tahun)</label>
        <input type="number" value={usia} onChange={(e) => setUsia(e.target.value)} />

        <label>Usia Kehamilan (minggu)</label>
        <input type="number" value={hamil} onChange={(e) => setHamil(e.target.value)} />

        <label>Faktor Aktivitas</label>
        <select value={aktivitas} onChange={(e) => setAktivitas(e.target.value)}>
          <option value="1.1">Istirahat total (1.1)</option>
          <option value="1.2">Bedrest ringan (1.2)</option>
          <option value="1.3">Bergerak ringan (1.3)</option>
          <option value="1.4">Aktivitas sedang (1.4)</option>
          <option value="1.5">Aktivitas cukup berat (1.5)</option>
          <option value="1.75">Aktivitas berat (1.75)</option>
        </select>

        <button onClick={hitung}>Hitung Kebutuhan Energi</button>
      </div>

      {typeof hasil === "string" ? (
      <p className="error-message">{hasil}</p>
    ) : hasil ? (
      <>
        {/* Kotak Hasil */}
        <div className="result-box">
          <h3>Hasil Perhitungan</h3>
            <p>
            Status Gizi: 
        <span className={hasil.status === "Berat Badan Normal" ? "status-normal" : "status-tidak-normal"}>
            {hasil.status}
        </span>
            </p>

          <div className="total-energi-box">
            <p>Total Kebutuhan Energi:</p>
            <p className="angka-total-energi">{hasil.TEEKehamilan} kkal/hari</p>
        </div>

        </div>

        {/* Kotak Rekomendasi Pedoman */}
        <div className="pedoman-box">
          <h3>Pedoman Isi Piringku untuk Ibu Hamil</h3>
          <img src="/pedoman.jpg" alt="Pedoman Isi Piringku" className="pedoman-image" />
        </div>
      </>
    ) : null}
    </div>
  );
}

export default KalkulatorGizi;
