import React, { FC } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CContainer,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

interface BunCardProps {
  bun: string;
  yourMates: string[];
  rivalMates: string[];
  mates: string[];
}

export const BunCard: FC<BunCardProps> = ({
  bun,
  yourMates,
  rivalMates,
  mates,
}) => {
  function getColor(mate: string): string {
    const youHave = yourMates.includes(mate);
    const rivalHas = rivalMates.includes(mate);
    if (youHave && rivalHas) return "black";
    if (youHave && !rivalHas) return "lime";
    if (!youHave && rivalHas) return "red";
    return "gray";
  }
  return (
    <CCard
      className={`mb-3 border-top-dark border-top-3`}
      style={{ maxWidth: "18rem"}}
    >
      <CCardHeader className={`h5`}> {bun} x ? </CCardHeader>
      <CCardBody>
        <CContainer>
          <CRow xs={{ cols: "auto" }}>
            {mates.map((mate) => (
              <CCol style={{ color: getColor(mate) }} key={mate}>
                <h5>{mate}</h5>
              </CCol>
            ))}
          </CRow>
        </CContainer>
      </CCardBody>
      <CCardFooter className={`h6`}>
        you: {yourMates?.length} rival: {rivalMates?.length} total:{" "}
        {mates?.length}
      </CCardFooter>
    </CCard>
  );
};


interface StatsCardProps {
  you: number;
  rival: number;
  total: number;
}

export const StatsCard: FC<StatsCardProps> = ({
  you,
  rival,
  total,
}) => {
  return (
    <CCard
      className={`mb-3 border-top-info border-top-3`}
      style={{ maxWidth: "18rem"}}
    >
      <CCardHeader className={`h5`}> All Stats </CCardHeader>
      <CListGroup flush>
        <CListGroupItem>you: {you}</CListGroupItem>
        <CListGroupItem>rival: {rival}</CListGroupItem>
        <CListGroupItem>total: {total}</CListGroupItem>
        <CListGroupItem>only you: {total-rival}</CListGroupItem>
        <CListGroupItem>only rival: {total-you}</CListGroupItem>
        <CListGroupItem>both: {you+rival-total}</CListGroupItem>
      </CListGroup>
    </CCard>
  );
};

