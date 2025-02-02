import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import koreaRegion from "../koreaRegion";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/searchPage.css";

export default function SearchPage() {
  const [selectedDOSI, setSelectedDOSI] = useState("");
  const [selectedSIGUNGU, setSelectedSIGUNGU] = useState("");
  const navigate = useNavigate();

  const onClickHandler = (e) => {
    const endpoint =
      `/detailRegionPage?` +
      `dosi=${selectedDOSI}&` +
      `sigungu=${selectedSIGUNGU}`;
    navigate(endpoint);
  };

  return (
    <div className="search-container">
      <Container className="search-form" fluid>
        <InputGroup style={{ marginLeft: "30px" }}>
          <DropdownButton
            variant="outline-success"
            as={ButtonGroup}
            size="lg"
            title="시/도"
          >
            {koreaRegion.map((region, idx) => (
              <Dropdown.Item
                key={idx}
                onClick={() => {
                  setSelectedDOSI(region[0]);
                }}
              >
                {region[0]}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <InputGroup.Text style={{ minWidth: "200px" }}>
            {selectedDOSI}
          </InputGroup.Text>
        </InputGroup>
        <InputGroup>
          <DropdownButton
            variant="outline-success"
            as={ButtonGroup}
            size="lg"
            title="시/군/구"
          >
            {selectedDOSI &&
              koreaRegion
                .find((region) => region[0] === selectedDOSI)[1]
                .map((city, idx) => (
                  <Dropdown.Item
                    key={idx}
                    onClick={() => {
                      setSelectedSIGUNGU(city);
                    }}
                  >
                    {city}
                  </Dropdown.Item>
                ))}
          </DropdownButton>
          <InputGroup.Text style={{ minWidth: "200px" }}>
            {selectedSIGUNGU}
          </InputGroup.Text>
        </InputGroup>
        <Button
          variant="outline-success"
          onClick={onClickHandler}
          style={{ width: "300px", marginRight: "30px" }}
        >
          Search
        </Button>{" "}
      </Container>
    </div>
  );
}
