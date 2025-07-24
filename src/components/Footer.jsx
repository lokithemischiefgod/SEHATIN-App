import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <p><strong>KKN-PK UNIVERSITAS HASANUDDIN ANGKATAN 67</strong></p>
          <p>Desa Layoa, Kecamatan Gantarangkeke, Kabupaten Bantaeng, Provinsi Sulawesi Selatan</p>
        </div>

        <div className="footer-section">
          <p><strong>DIBUAT OLEH :</strong></p>
          <p>Andi Muhammad Farhan Abdillah (D121221032)</p>
          <p>Supervisor : dr. Ainan Raena Nas, S.Ked., M.KM</p>
        </div>

        <div className="footer-contact">
          <p><strong>HUBUNGI KAMI :</strong></p>
          <p>WhatsApp/Telepon : 0877-1666-3695</p>
          <p>Instagram : @kknpk67_desalayoa</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; 2025 SEHATIN — KKN PK 67 UNHAS
      </div>
    </footer>
  );
}

export default Footer;
