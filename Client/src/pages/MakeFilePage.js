import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const geojson1 = require("../geojson.json");

function MakeFilePage() {
  const [region, setRegion] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const convertRegion = (data) => {
    if (data === "강원특별자치도") return "강원";
    if (data === "경기도") return "경기";
    if (data === "경상남도") return "경남";
    if (data === "경상북도") return "경북";
    if (data === "광주광역시") return "광주";
    if (data === "대구광역시") return "대구";
    if (data === "대전광역시") return "대전";
    if (data === "부산광역시") return "부산";
    if (data === "서울특별시") return "서울";
    if (data === "울산광역시") return "울산";
    if (data === "인천광역시") return "인천";
    if (data === "전라남도") return "전남";
    if (data === "전라북도") return "전북";
    if (data === "제주특별자치도") return "제주";
    if (data === "충청남도") return "충남";
    if (data === "충청북도") return "충북";
  };

  const handleUpload = async () => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      let geojson = JSON.parse(text);
      let i = 0;

      // 각 feature를 순회하며 'name' 속성 수정
      for (const feature of geojson.features) {
        const lat =
          feature.geometry.type === "Polygon"
            ? feature.geometry.coordinates[0][0][1]
            : feature.geometry.coordinates[0][0][0][1];

        const lng =
          feature.geometry.type === "Polygon"
            ? feature.geometry.coordinates[0][0][0]
            : feature.geometry.coordinates[0][0][0][0];

        // console.log(lat, lng);

        try {
          // API 요청
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          const data = await response.json();

          // 주소 정보에서 'state'와 'county' 값을 가져와 상태를 업데이트
          const address = data.address;
          if (address.borough) setRegion(`${address.city}, ${address.borough}`);
          // '서울특별시, 중구' 저장
          else setRegion(`${address.province}, ${address.city}`);

          console.log(i++, "address", address);
          console.log(feature.properties.SIG_KOR_NM);
          let skn = feature.properties.SIG_KOR_NM.split(" ");
          if (address.province) {
            if (skn.length > 1) {
              feature.properties.SIG_KOR_NM =
                `${convertRegion(address.province)} ` + skn[1];
            } else {
              feature.properties.SIG_KOR_NM =
                `${convertRegion(address.province)} ` + skn[0];
            }
          } else {
            if (skn.length > 1) {
              feature.properties.SIG_KOR_NM =
                `${convertRegion(address.city)} ` + skn[1];
            } else {
              feature.properties.SIG_KOR_NM =
                `${convertRegion(address.city)} ` + skn[0];
            }
          }
          console.log(feature.properties.SIG_KOR_NM);
        } catch (e) {
          console.error(e);
        }
      }

      console.log(geojson); // 수정된 geojson 출력
      // GeoJSON 객체를 JSON 문자열로 변환하고, Blob 객체로 만듭니다.
      let blob = new Blob([JSON.stringify(geojson, null, 2)], {
        type: "application/json",
      });

      // Blob 객체를 파일로 저장합니다.
      saveAs(blob, "output.json");
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    // // 좌표 (예: 서울시청)
    const lat = 37.5665;
    const lng = 126.978;

    let i = 0;
    // 각 feature를 순회하며 'name' 속성 수정
    for (const feature of geojson1.features) {
      const lat =
        feature.geometry.type === "Polygon"
          ? feature.geometry.coordinates[0][0][1]
          : feature.geometry.coordinates[0][0][0][1];

      const lng =
        feature.geometry.type === "Polygon"
          ? feature.geometry.coordinates[0][0][0]
          : feature.geometry.coordinates[0][0][0][0];
    }
  }, []); // 빈 의존성 배열을 사용하여 컴포넌트가 마운트될 때만 API를 호출하게 함

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      {isLoading ? <h1>...Loading</h1> : <h1>Complete</h1>}
    </div>
  );
}

export default MakeFilePage;
