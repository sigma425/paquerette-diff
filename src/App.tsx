import { listBuns, getBabiesMap } from "./util.tsx";
import { BunCard } from "./bunCard.tsx";
import React, { FC, useState, ChangeEvent } from "react";
import { CButton, CRow, CCol } from "@coreui/react";
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
      <label htmlFor={label}> {label} </label>
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
}

const InputSection: FC<InputSectionProps> = ({
  you,
  onChangeYou,
  rival,
  onChangeRival,
  onClickDiff,
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
      <CButton color="primary" size="lg" onClick={onClickDiff}>
        Diff!
      </CButton>
    </>
  );
};

interface ResultSectionProps {
  you: string;
  rival: string;
}

const ResultSection: FC<ResultSectionProps> = ({ you, rival }) => {
  if (!you && !rival) {
    return <></>;
  }
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
  let bunList = listBuns(you, rival);
  let yourBabies = getBabiesMap(you, bunList);
  let rivalBabies = getBabiesMap(rival, bunList);
  return (
    <CRow xs={{ cols: "auto"}}>
      {bunList.map((bun) => <CCol key={bun}> {getBunCard(bun)} </CCol>)}
    </CRow>
  );
};

const App: FC = () => {
  const [you, setYou] = useState<string>("");
  const [rival, setRival] = useState<string>("");
  const [youSnap, setYouSnap] = useState<string>("");
  const [rivalSnap, setRivalSnap] = useState<string>("");

  return (
    <>
      <h1>Paquerette Diff Tool</h1>
      <h2>How to use</h2>
      わふだよ
      <InputSection
        you={you}
        onChangeYou={(e) => setYou(e.target.value)}
        rival={rival}
        onChangeRival={(e) => setRival(e.target.value)}
        onClickDiff={() => {
          setYouSnap(you);
          setRivalSnap(rival);
        }}
      />
      <p></p>
      <ResultSection you={youSnap} rival={rivalSnap} />
    </>
  );
};

export default App;
