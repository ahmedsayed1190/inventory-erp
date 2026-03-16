import { useState } from "react";

function CompanySettings() {
  const [companyLogo, setCompanyLogo] = useState(
    localStorage.getItem("companyLogo") || ""
  );

  const [companyName, setCompanyName] = useState(
    localStorage.getItem("companyName") || ""
  );

  const [companyAddress, setCompanyAddress] = useState(
    localStorage.getItem("companyAddress") || ""
  );

  const [companyPhone, setCompanyPhone] = useState(
    localStorage.getItem("companyPhone") || ""
  );

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("companyLogo", reader.result);
      setCompanyLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("companyAddress", companyAddress);
    localStorage.setItem("companyPhone", companyPhone);
    alert("✅ تم حفظ بيانات الشركة");
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>🏢 بيانات الشركة</h2>

      <input type="file" accept="image/*" onChange={handleLogoUpload} />

      {companyLogo && (
        <img src={companyLogo} alt="logo" style={{ height: 80 }} />
      )}

      <input
        className="form-control mt-3"
        placeholder="اسم الشركة"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <input
        className="form-control mt-2"
        placeholder="عنوان الشركة"
        value={companyAddress}
        onChange={(e) => setCompanyAddress(e.target.value)}
      />

      <input
        className="form-control mt-2"
        placeholder="هاتف الشركة"
        value={companyPhone}
        onChange={(e) => setCompanyPhone(e.target.value)}
      />

      <button onClick={handleSave} className="btn btn-primary mt-3">
        حفظ
      </button>
    </div>
  );
}

export default CompanySettings;