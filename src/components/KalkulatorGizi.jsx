import { useState } from "react";
import './KalkulatorGizi.css';

function KalkulatorGizi() {
  const [nama, setNama] = useState("");
  const [bbAwal, setBbAwal] = useState("");
  const [bbSekarang, setBbSekarang] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [usia, setUsia] = useState("");
  const [hamil, setHamil] = useState("");
  const [aktivitas, setAktivitas] = useState("");
  const [hasil, setHasil] = useState(null);
  const [timestamp, setTimestamp] = useState("");

  function evaluasiKenaikanBB(imt, usiaHamil, bbAwal, bbSekarang) {
    const kenaikanBB = bbSekarang - bbAwal;
    const trimester = usiaHamil <= 13 ? 1 : 2;
    let status = "";
    let rekomendasi = "";
    let kelebihan = 0;
    let kekurangan = 0;

    if (trimester === 1) {
      const min = 0.5;
      const max = 2;

      if (kenaikanBB < min) {
        status = "Kurang";
        kekurangan = (min - kenaikanBB).toFixed(1);
      } else if (kenaikanBB > max) {
        status = "Berlebih";
        kelebihan = (kenaikanBB - max).toFixed(1);
      } else {
        status = "Normal";
      }

      rekomendasi = "Rekomendasi trimester 1: 0.5 – 2 kg";
    } else {
      const mingguLanjut = usiaHamil - 13;
      const bbMingguan = kenaikanBB / mingguLanjut;

      let min = 0, max = 0;

      if (imt < 18.5) {
        min = 0.45; max = 0.59;
        rekomendasi = "0.45 – 0.59 kg/minggu";
      } else if (imt < 25) {
        min = 0.36; max = 0.45;
        rekomendasi = "0.36 – 0.45 kg/minggu";
      } else if (imt < 30) {
        min = 0.23; max = 0.32;
        rekomendasi = "0.23 – 0.32 kg/minggu";
      } else {
        min = 0.18; max = 0.27;
        rekomendasi = "0.18 – 0.27 kg/minggu";
      }

      if (bbMingguan < min) {
        status = "Kurang";
        kekurangan = ((min * mingguLanjut) - kenaikanBB).toFixed(1);
      } else if (bbMingguan > max) {
        status = "Berlebih";
        kelebihan = (kenaikanBB - (max * mingguLanjut)).toFixed(1);
      } else {
        status = "Normal";
      }
    }

    return {
      status,
      rekomendasi,
      kenaikanBB: kenaikanBB.toFixed(1),
      kelebihan,
      kekurangan
    };
  }

  function hitung() {
    const bbAwalVal = parseFloat(bbAwal);
    const bbSekarangVal = parseFloat(bbSekarang);
    const tb = parseFloat(tinggi);
    const umur = parseInt(usia);
    const usiaHamil = parseInt(hamil);
    const faktorAktivitas = parseFloat(aktivitas);

    if (
      isNaN(bbAwalVal) || isNaN(bbSekarangVal) || isNaN(tb) || isNaN(umur) || isNaN(usiaHamil) ||
      aktivitas === "" || nama.trim() === ""
    ) {
      setHasil("Harap lengkapi semua data");
      return;
    }

    const imt = bbAwalVal / Math.pow(tb / 100, 2);
    const BEE = 655 + (9.6 * bbSekarangVal) + (1.8 * tb) - (4.7 * umur);
    const TEE = BEE * faktorAktivitas;
    const tambahan = usiaHamil <= 13 ? 180 : 300;
    const TEEKehamilan = TEE + tambahan;

    const evaluasi = evaluasiKenaikanBB(imt, usiaHamil, bbAwalVal, bbSekarangVal);
    setTimestamp(new Date().toLocaleString());

    setHasil({
      statusKenaikan: evaluasi.status,
      rekomendasi: evaluasi.rekomendasi,
      kenaikanTotal: evaluasi.kenaikanBB,
      kelebihan: evaluasi.kelebihan,
      kekurangan: evaluasi.kekurangan,
      TEEKehamilan: TEEKehamilan.toFixed(2),
    });
  }

  return (
    <div className="kalkulator-container">
      <img src="/logoposco.jpg" alt="Logo SEHATIN" className="logo-image" />
      <h2>Kalkulator Gizi Ibu Hamil</h2>

      <div className="input-group">
        <label>Nama Ibu Hamil</label>
        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} />

        <label>Berat Badan Sebelum Hamil (kg)</label>
        <input type="number" value={bbAwal} onChange={(e) => setBbAwal(e.target.value)} />

        <label>Berat Badan Sekarang (kg)</label>
        <input type="number" value={bbSekarang} onChange={(e) => setBbSekarang(e.target.value)} />

        <label>Tinggi Badan (cm)</label>
        <input type="number" value={tinggi} onChange={(e) => setTinggi(e.target.value)} />

        <label>Usia Ibu (tahun)</label>
        <input type="number" value={usia} onChange={(e) => setUsia(e.target.value)} />

        <label>Usia Kehamilan (minggu)</label>
        <input type="number" value={hamil} onChange={(e) => setHamil(e.target.value)} />

        <label>Faktor Aktivitas</label>
        <select value={aktivitas} onChange={(e) => setAktivitas(e.target.value)}>
          <option value="" disabled>Pilih Aktivitas</option>
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
          <div className="result-box">
            <h3>Hasil Perhitungan</h3>

            <p>
            <strong className="nama-ibu">Nama Ibu Hamil:</strong>{" "}
            <span className="hasil-angka">{nama}</span>
            </p>

            <p>Status Kenaikan BB:&nbsp;
              <span className={hasil.statusKenaikan === "Normal" ? "status-normal" : "status-tidak-normal"}>
                {hasil.statusKenaikan}
              </span>
            </p>

            <p>Total Kenaikan BB: <span className="hasil-angka">{hasil.kenaikanTotal} kg</span></p>

            {hasil.kelebihan > 0 && (
              <p>Kelebihan BB: <span className="hasil-angka">{hasil.kelebihan} kg</span></p>
            )}

            {hasil.kekurangan > 0 && (
              <p>Kekurangan BB: <span className="hasil-angka">{hasil.kekurangan} kg</span></p>
            )}

            <p>Panduan Kenaikan BB Sesuai Trimester: <span className="hasil-angka">{hasil.rekomendasi}</span></p>

            <div className="total-energi-box">
              <p>Total Kebutuhan Energi:</p>
              <p className="angka-total-energi">{hasil.TEEKehamilan} kkal/hari</p>
            </div>

            <p className="timestamp">Waktu Perhitungan: {timestamp}</p>
          </div>

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
