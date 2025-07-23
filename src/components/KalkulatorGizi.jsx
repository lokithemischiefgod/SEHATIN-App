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

  function evaluasiKenaikanBB(imtAwal, usiaHamil, bbAwal, bbSekarang, tinggi) {
    const kenaikanBB = bbSekarang - bbAwal;
    const trimester = usiaHamil <= 13 ? 1 : 2;
    let status = "";
    let rekomendasi = "";
    let kelebihan = 0;
    let kekurangan = 0;
    let tampilkanKenaikan = false;

    if (trimester === 1) {
      const imtSekarang = bbSekarang / Math.pow(tinggi / 100, 2);

      if (imtSekarang < 18.5) {
        status = "Gizi Kurang";
      } else if (imtSekarang < 25) {
        status = "Normal";
      } else if (imtSekarang < 30) {
        status = "Kelebihan BB";
      } else {
        status = "Obesitas";
      }
    } else {
      tampilkanKenaikan = true;
      const mingguLanjut = usiaHamil - 13;
      const bbMingguan = +(kenaikanBB / mingguLanjut).toFixed(2);


      let min = 0, max = 0;

      if (imtAwal < 18.5) {
        min = 0.5; max = 0.5;
        rekomendasi = "0.5 kg/minggu";
      } else if (imtAwal < 25) {
        min = 0.4; max = 0.4;
        rekomendasi = "0.4 kg/minggu";
      } else if (imtAwal < 30) {
        min = 0.3; max = 0.3;
        rekomendasi = "0.3 kg/minggu";
      } else {
        min = 0.2; max = 0.2;
        rekomendasi = "0.2 kg/minggu";
      }

      if (bbMingguan < min) {
        status = "Kurang";
        kekurangan = ((min * mingguLanjut) - kenaikanBB).toFixed(1);
        kelebihan = 0;
      } else if (bbMingguan > max) {
        status = "Berlebih";
        kelebihan = (kenaikanBB - (max * mingguLanjut)).toFixed(1);
        kekurangan = 0;
      } else {
        status = "Normal";
        kelebihan = 0;
        kekurangan = 0;
      }

    }

    return {
      status,
      rekomendasi,
      kenaikanBB: tampilkanKenaikan ? kenaikanBB.toFixed(1) : null,
      kelebihan: tampilkanKenaikan ? kelebihan : 0,
      kekurangan: tampilkanKenaikan ? kekurangan : 0,
      tampilkanKenaikan
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

    const imtAwal = bbAwalVal / Math.pow(tb / 100, 2);
    const BEE = 655 + (9.6 * bbSekarangVal) + (1.8 * tb) - (4.7 * umur);
    const TEE = BEE * faktorAktivitas;
    const tambahan = usiaHamil <= 13 ? 180 : 300;
    const TEEKehamilan = TEE + tambahan;

    const evaluasi = evaluasiKenaikanBB(imtAwal, usiaHamil, bbAwalVal, bbSekarangVal, tb);
    setTimestamp(new Date().toLocaleString());

    setHasil({
      statusKenaikan: evaluasi.status,
      rekomendasi: evaluasi.rekomendasi,
      kenaikanTotal: evaluasi.kenaikanBB,
      kelebihan: evaluasi.kelebihan,
      kekurangan: evaluasi.kekurangan,
      TEEKehamilan: TEEKehamilan.toFixed(2),
      tampilkanKenaikan: evaluasi.tampilkanKenaikan
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

            <p><strong className="nama-ibu">Nama Ibu Hamil:</strong>{" "}
              <span className="hasil-angka">{nama}</span></p>

            <p>Status Gizi:&nbsp;
              <span className={hasil.statusKenaikan === "Normal" || hasil.statusKenaikan === "Gizi Kurang" ? "status-normal" : "status-tidak-normal"}>
                {hasil.statusKenaikan}
              </span>
            </p>

            {hasil.tampilkanKenaikan && (
              <>
                <p>Total Kenaikan BB: <span className="hasil-angka">{hasil.kenaikanTotal} kg</span></p>

                {hasil.kelebihan > 0 && (
                  <p>Kelebihan BB: <span className="hasil-angka">{hasil.kelebihan} kg</span></p>
                )}

                {hasil.kekurangan > 0 && (
                  <p>Kekurangan BB: <span className="hasil-angka">{hasil.kekurangan} kg</span></p>
                )}

                <p>Panduan: <span className="hasil-angka">{hasil.rekomendasi}</span></p>
              </>
            )}

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
