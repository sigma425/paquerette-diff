import { listBuns, getBabiesMap } from "./util.tsx";
import { BunCard, StatsCard } from "./bunCard.tsx";
import { SAMPLE_YOU, SAMPLE_RIVAL } from "./sample.ts";
import React, { FC, useState, ChangeEvent } from "react";
import { CButton, CRow, CCol, CFormCheck } from "@coreui/react";
import "./App.css";

interface TextBoxProps {
  label: string;
  val: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextBox: FC<TextBoxProps> = ({ label, val, placeholder, onChange }) => {
  return (
    <span className="textBox">
      <label htmlFor={label} className="labelOfBox"> {label} </label>
      <textarea
        id={label}
        cols={30}
        rows={30}
        value={val}
        placeholder={placeholder}
        onChange={onChange}
      />
    </span>
  );
};

interface InputSectionProps {
  you: string;
  onChangeYou: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rival: string;
  onChangeRival: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onClickDiff: () => void;
  floorFirst: boolean,
  onChangeSort: (e: ChangeEvent<HTMLInputElement>) => void;
  hideNoDiff: boolean,
  onChangeHide: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputSection: FC<InputSectionProps> = ({
  you,
  onChangeYou,
  rival,
  onChangeRival,
  onClickDiff,
  floorFirst,
  onChangeSort,
  hideNoDiff,
  onChangeHide,
}) => {
  return (
    <>
      <div className="boxes">
        <TextBox
          label="you"
          val={you}
          placeholder="paste your babies list"
          onChange={onChangeYou}
        />
        <TextBox
          label="rival"
          val={rival}
          placeholder="paste rival's babies list"
          onChange={onChangeRival}
        />
      </div>
      <div className="buttons">
        <CButton color="primary" size="lg" onClick={onClickDiff}>
          Diff!
        </CButton>
        <CFormCheck id="floorFirst" label="sort by floor first" checked={floorFirst} onChange={onChangeSort} />
        <CFormCheck id="hideNoDiff" label="hide no diff cards" checked={hideNoDiff} onChange={onChangeHide} />
      </div>
    </>
  );
};

interface ResultSectionProps {
  you: string;
  rival: string;
  floorFirst: boolean;
  hideNoDiff: boolean;
}

const ResultSection: FC<ResultSectionProps> = ({ you, rival, floorFirst, hideNoDiff }) => {
  let bunList = listBuns(you, rival, floorFirst);
  if(bunList.length === 0){
    return <></>;
  }
  if(bunList[0] === "err"){
    return <h5> invalid bun: {bunList[1]} </h5>
  }
  let yourBabies = getBabiesMap(you, bunList);
  let rivalBabies = getBabiesMap(rival, bunList);

  function getBunCard(bun: string) {
    const yourMates: string[] = yourBabies.get(bun) ?? [];
    const rivalMates: string[] = rivalBabies.get(bun) ?? [];
    const mates = bunList.filter(
      (bun) => yourMates?.includes(bun) || rivalMates?.includes(bun)
    );
    // console.log("bun = " + bun);
    // console.log(yourBabies.get(bun));
    // console.log(rivalBabies.get(bun));
    return (
      <BunCard
        bun={bun}
        yourMates={yourMates}
        rivalMates={rivalMates}
        mates={mates}
      ></BunCard>
    );
  }
  function getStatsCard() {
    let you = 0, rival = 0, total = 0;
    bunList.forEach((bun) => {
      const yourMates: string[] = yourBabies.get(bun) ?? [];
      const rivalMates: string[] = rivalBabies.get(bun) ?? [];
      const mates = bunList.filter(
        (bun) => yourMates?.includes(bun) || rivalMates?.includes(bun)
      );
      you += yourMates.length;
      rival += rivalMates.length;
      total += mates.length;
    });
    return (
      <StatsCard
        you = {you/2}
        rival = {rival/2}
        total = {total/2}
      ></StatsCard>
    );
  }
  function hasDifferentBunList(bun: string) {
    const yourMates: string[] = yourBabies.get(bun) ?? [];
    const rivalMates: string[] = rivalBabies.get(bun) ?? [];
    const mates = bunList.filter(
      (bun) => yourMates?.includes(bun) || rivalMates?.includes(bun)
    );
    return !(yourMates.length === mates.length && rivalMates.length === mates.length);
  }

  let filteredBunList = bunList.slice();
  if(hideNoDiff) filteredBunList = filteredBunList.filter(hasDifferentBunList);

  return (
    <>
      {getStatsCard()}
      <CRow xs={{ cols: "auto"}}>
        {filteredBunList.map((bun) => <CCol key={bun}> {getBunCard(bun)} </CCol>)}
      </CRow>
    </>
  );
};

const App: FC = () => {
  const [you, setYou] = useState<string>("");
  const [rival, setRival] = useState<string>("");
  const [youSnap, setYouSnap] = useState<string>("");
  const [rivalSnap, setRivalSnap] = useState<string>("");
  const [floorFirst, setFloorFirst] = useState<boolean>(false);
  const [hideNoDiff, setHideNoDiff] = useState<boolean>(false);

  return (
    <>
      <h1>Paquerette Diff Tool</h1>
      <h2>How to use</h2>
      <p>As the game progresses, you'll be able to copy the "babies list" to the clipboard.</p>
      <p>Paste your babies list in the left box, and your rival's babies list in the right box. Then click "Diff!" to see the differences.</p>
      <p>To see samples, click this: <CButton color="secondary" onClick={() => {setYou(SAMPLE_YOU); setRival(SAMPLE_RIVAL)}}> Set sample </CButton> and then click "Diff!"</p>

      <InputSection
        you={you}
        onChangeYou={(e) => setYou(e.target.value)}
        rival={rival}
        onChangeRival={(e) => setRival(e.target.value)}
        onClickDiff={() => {
          setYouSnap(you);
          setRivalSnap(rival);
        }}
        floorFirst={floorFirst}
        onChangeSort={(e) => setFloorFirst(e.target.checked)}
        hideNoDiff={hideNoDiff}
        onChangeHide={(e) => setHideNoDiff(e.target.checked)}
      />
      <p></p>
      <ResultSection you={youSnap} rival={rivalSnap} floorFirst={floorFirst} hideNoDiff={hideNoDiff}/>
    </>
  );
};

export default App;
