
// import { IoPerson } from "react-icons/io5";
// import { BiSolidAlbum } from "react-icons/bi";
import { IoMdMusicalNote } from "react-icons/io";

export default function TestPage() {
  
  const wrapperStyle = {
    border: "1px red solid",
    fontSize: "5em",
    display: "flex",
    fontFamily: "Bebas Neue",
    contentArea: "1",
    lineHeight: "1"
  };
  
  const ugh = {
    border: "1px blue solid"
  };
  
  return (
  <div className="wrapper" style={wrapperStyle}>
    <span className="icon" style={ugh}><IoMdMusicalNote /></span>
    <span style={ugh}>Artist of the Year</span>
  </div>
  );
}
