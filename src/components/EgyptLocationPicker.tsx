import React, { useState } from "react";
import { EGYPT_GOVERNORATES, Governorate, City } from "../egyptData";

interface ThemeType {
  bg: string;
  surface: string;
  card: string;
  cardHover: string;
  elevated: string;
  border: string;
  borderMed: string;
  text: string;
  textSec: string;
  textMuted: string;
  textHint: string;
  blue: string;
  blueBg: string;
  blueBorder: string;
  green: string;
  greenBg: string;
  orange: string;
  orangeBg: string;
  red: string;
  redBg: string;
}

export interface LocationValue {
  govId: string;
  govName: string;
  cityId: string;
  cityName: string;
  village: string;
}

interface EgyptLocationPickerProps {
  value: LocationValue;
  onChange: (val: LocationValue) => void;
  t: ThemeType;
  allowAll?: boolean; // if true, allows "All" at every level
}

export const EgyptLocationPicker = ({ value, onChange, t, allowAll = true }: EgyptLocationPickerProps) => {
  const [govSearch, setGovSearch] = useState("");
  const [showGovDropdown, setShowGovDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showVillageDropdown, setShowVillageDropdown] = useState(false);
  
  // Custom village write-in text
  const [customVillage, setCustomVillage] = useState("");
  const [isCustomVillageUsed, setIsCustomVillageUsed] = useState(false);

  // Selected Governorate Object
  const currentGov = EGYPT_GOVERNORATES.find(g => g.id === value.govId);
  // Selected City Object
  const currentCity = currentGov?.cities.find(c => c.id === value.cityId);

  // Filtered Governorates list by search query
  const filteredGovs = EGYPT_GOVERNORATES.filter(g => 
    g.nameAr.includes(govSearch)
  );

  const handleGovSelect = (gov: Governorate | "all") => {
    if (gov === "all") {
      onChange({
        govId: "all",
        govName: "كل مصر",
        cityId: "all",
        cityName: "كل المراكز والمدن",
        village: "all"
      });
    } else {
      const defaultCity = gov.cities[0];
      onChange({
        govId: gov.id,
        govName: gov.nameAr,
        cityId: allowAll ? "all" : (defaultCity?.id || "all"),
        cityName: allowAll ? "كل المراكز والمدن" : (defaultCity?.nameAr || "كل المراكز والمدن"),
        village: "all"
      });
    }
    setShowGovDropdown(false);
    setShowCityDropdown(false);
    setShowVillageDropdown(false);
    setIsCustomVillageUsed(false);
    setCustomVillage("");
  };

  const handleCitySelect = (city: City | "all") => {
    if (city === "all") {
      onChange({
        ...value,
        cityId: "all",
        cityName: "كل المراكز والمدن",
        village: "all"
      });
    } else {
      onChange({
        ...value,
        cityId: city.id,
        cityName: city.nameAr,
        village: allowAll ? "all" : (city.villages[0] || "all")
      });
    }
    setShowCityDropdown(false);
    setShowVillageDropdown(false);
    setIsCustomVillageUsed(false);
    setCustomVillage("");
  };

  const handleVillageSelect = (villageName: string) => {
    onChange({
      ...value,
      village: villageName
    });
    setShowVillageDropdown(false);
    setIsCustomVillageUsed(false);
  };

  const handleCustomVillageSubmit = () => {
    if (customVillage.trim()) {
      onChange({
        ...value,
        village: customVillage.trim()
      });
      setIsCustomVillageUsed(true);
      setShowVillageDropdown(false);
    }
  };

  const dropdownStyle = {
    position: "absolute" as const,
    top: "105%",
    right: 0,
    left: 0,
    background: t.card,
    border: `1.5px solid ${t.borderMed}`,
    borderRadius: 12,
    zIndex: 999,
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    maxHeight: 220,
    overflowY: "auto" as const,
    padding: 6,
    display: "flex",
    flexDirection: "column" as const,
    gap: 2
  };

  const optionStyle = (active: boolean) => ({
    background: active ? t.blueBg : "transparent",
    color: active ? t.blue : t.text,
    border: "none",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 12.5,
    fontWeight: active ? 800 : 600,
    textAlign: "right" as const,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.1s"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, direction: "rtl", width: "100%" }}>
      
      {/* 1. SELECT GOVERNORATE */}
      <div style={{ position: "relative" }}>
        <label style={{ display: "block", color: t.textSec, fontSize: 11.5, fontWeight: 700, marginBottom: 5 }}>
          المحافظة *
        </label>
        <div 
          onClick={() => {
            setShowGovDropdown(!showGovDropdown);
            setShowCityDropdown(false);
            setShowVillageDropdown(false);
          }}
          style={{
            background: t.card,
            border: `1.5px solid ${showGovDropdown ? t.blue : t.border}`,
            borderRadius: 10,
            padding: "11px 13px",
            color: value.govId === "all" ? t.textMuted : t.text,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1.5px 3px rgba(0,0,0,0.02)"
          }}
        >
          <span style={{ fontWeight: value.govId === "all" ? 500 : 800 }}>
            {value.govId === "all" ? "كل محافظات جمهورية مصر العربية 🇪🇬" : value.govName}
          </span>
          <span style={{ fontSize: 10, color: t.textMuted }}>{showGovDropdown ? "▲" : "▼"}</span>
        </div>

        {showGovDropdown && (
          <div style={dropdownStyle}>
            {/* Search Input for Gov */}
            <div style={{ padding: "4px 6px", borderBottom: `1.5px solid ${t.border}`, position: "sticky", top: 0, background: t.card, zIndex: 10 }}>
              <input 
                type="text"
                value={govSearch}
                onChange={e => setGovSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                placeholder="ابحث عن اسم المحافظة..."
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  fontSize: 11.5,
                  borderRadius: 8,
                  border: `1.5px solid ${t.border}`,
                  background: t.surface,
                  color: t.text,
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {allowAll && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleGovSelect("all"); }}
                style={optionStyle(value.govId === "all")}
              >
                <span>🇪🇬 كل المحافظات المصرية</span>
                {value.govId === "all" && <span>✓</span>}
              </button>
            )}

            {filteredGovs.map(g => (
              <button 
                key={g.id}
                onClick={(e) => { e.stopPropagation(); handleGovSelect(g); }}
                style={optionStyle(value.govId === g.id)}
              >
                <span>📍 محافظة {g.nameAr}</span>
                {value.govId === g.id && <span>✓</span>}
              </button>
            ))}

            {filteredGovs.length === 0 && (
              <div style={{ padding: "12px", color: t.textMuted, fontSize: 11, textAlign: "center" }}>
                لا توجد نتائج مطابقة لبحثك
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. SELECT CITY / CENTER (Only visible if governorate is selected) */}
      {value.govId !== "all" && currentGov && (
        <div style={{ position: "relative" }}>
          <label style={{ display: "block", color: t.textSec, fontSize: 11.5, fontWeight: 700, marginBottom: 5 }}>
            المدينة / المركز / القسم *
          </label>
          <div 
            onClick={() => {
              setShowCityDropdown(!showCityDropdown);
              setShowGovDropdown(false);
              setShowVillageDropdown(false);
            }}
            style={{
              background: t.card,
              border: `1.5px solid ${showCityDropdown ? t.blue : t.border}`,
              borderRadius: 10,
              padding: "11px 13px",
              color: value.cityId === "all" ? t.textMuted : t.text,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 1.5px 3px rgba(0,0,0,0.02)"
            }}
          >
            <span style={{ fontWeight: value.cityId === "all" ? 500 : 800 }}>
              {value.cityId === "all" ? `كل المدن والمراكز في ${value.govName}` : value.cityName}
            </span>
            <span style={{ fontSize: 10, color: t.textMuted }}>{showCityDropdown ? "▲" : "▼"}</span>
          </div>

          {showCityDropdown && (
            <div style={dropdownStyle}>
              {allowAll && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCitySelect("all"); }}
                  style={optionStyle(value.cityId === "all")}
                >
                  <span>🏙️ كل المراكز والمدن</span>
                  {value.cityId === "all" && <span>✓</span>}
                </button>
              )}

              {currentGov.cities.map(c => (
                <button 
                  key={c.id}
                  onClick={(e) => { e.stopPropagation(); handleCitySelect(c); }}
                  style={optionStyle(value.cityId === c.id)}
                >
                  <span>🏢 {c.nameAr}</span>
                  {value.cityId === c.id && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SELECT VILLAGE / NEIGHBORHOOD (Only visible if a specific city/center is selected) */}
      {value.govId !== "all" && value.cityId !== "all" && currentCity && (
        <div style={{ position: "relative" }}>
          <label style={{ display: "block", color: t.textSec, fontSize: 11.5, fontWeight: 700, marginBottom: 5 }}>
            القرية / الحي / المنطقة الفرعية
          </label>
          <div 
            onClick={() => {
              setShowVillageDropdown(!showVillageDropdown);
              setShowGovDropdown(false);
              setShowCityDropdown(false);
            }}
            style={{
              background: t.card,
              border: `1.5px solid ${showVillageDropdown ? t.blue : t.border}`,
              borderRadius: 10,
              padding: "11px 13px",
              color: value.village === "all" ? t.textMuted : t.text,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 1.5px 3px rgba(0,0,0,0.02)"
            }}
          >
            <span style={{ fontWeight: value.village === "all" ? 500 : 800 }}>
              {value.village === "all" ? `كل القرى والأحياء في ${value.cityName}` : value.village}
            </span>
            <span style={{ fontSize: 10, color: t.textMuted }}>{showVillageDropdown ? "▲" : "▼"}</span>
          </div>

          {showVillageDropdown && (
            <div style={dropdownStyle}>
              {allowAll && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleVillageSelect("all"); }}
                  style={optionStyle(value.village === "all")}
                >
                  <span>🌳 كل القرى والمناطق المحلية</span>
                  {value.village === "all" && <span>✓</span>}
                </button>
              )}

              {currentCity.villages.map((v, idx) => (
                <button 
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); handleVillageSelect(v); }}
                  style={optionStyle(value.village === v)}
                >
                  <span>🏡 {v}</span>
                  {value.village === v && <span>✓</span>}
                </button>
              ))}

              {/* Add Custom Village Form Option */}
              <div style={{ 
                borderTop: `1.5px solid ${t.border}`, 
                padding: "8px 6px 4px", 
                marginTop: 4, 
                position: "sticky", 
                bottom: 0, 
                background: t.card 
              }} onClick={e => e.stopPropagation()}>
                <span style={{ display: "block", fontSize: 10, color: t.textMuted, fontWeight: 700, marginBottom: 4 }}>
                  قرية / شارع مخصص غير متواجد بالقائمة:
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <input 
                    type="text"
                    value={customVillage}
                    onChange={e => setCustomVillage(e.target.value)}
                    placeholder="كتب اسم القرية أو الشارع..."
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      fontSize: 11,
                      borderRadius: 8,
                      border: `1.5px solid ${t.border}`,
                      background: t.surface,
                      color: t.text,
                      outline: "none"
                    }}
                  />
                  <button 
                    onClick={handleCustomVillageSubmit}
                    style={{
                      background: t.blue,
                      border: "none",
                      color: "#fff",
                      borderRadius: 8,
                      padding: "0 10px",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    تطبيق
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Structured Location Summary Helper */}
      {value.govId !== "all" && (
        <div style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 10,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          alignSelf: "start"
        }}>
          <span style={{ fontSize: 11, color: t.textSec, fontWeight: 700 }}>النطاق الحالي:</span>
          <span style={{ fontSize: 11, color: t.blue, fontWeight: 800 }}>
            {value.govName}
            {value.cityId !== "all" && ` 🧭 ${value.cityName}`}
            {value.village !== "all" && ` 🧭 ${value.village}`}
          </span>
        </div>
      )}
    </div>
  );
};
