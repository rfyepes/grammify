
import example from "./images/empty.jpg";
import album from "./images/album-placeholder.png";
import song from "./images/song-placeholder.png";
import artist from "./images/artist-placeholder.png";
import test1 from "./images/test1.jpg";
import test2 from "./images/test2.jpg";

export default function TestPage() {
  
  // const x = {
  //   fontSize: "5em",
  //   display: "flex",
  //   fontFamily: "Bebas Neue",
  //   contentArea: "1",
  //   lineHeight: "1"
  // };
  
  // const imgStyle = {
  //   width: "600px",
  //   border: "1px black solid"
  // };
  
  // const wrapperStyle = {
  //   border: "1px red solid",
  //   height: "300px",
  //   width: "600px",
  //   backgroundColor: "pink",
  //   overflow: "hidden",
  //   marginLeft: "20px"
  // };
  // 
  // const caroselStyle = {
  //   display: "flex",
  //   animation: "slide 15s linear infinite"
  // };
  // 
  // const albumStyle = {
  //   width: "200px",
  //   height: "200px"
  // };
  // 
  // const shellStyle = {
  //   padding: "10px",
  //   backgroundColor: "black"
  // }
  
  // if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  //   // use image instead
  // }
  
  return (
  <div className="shell">
    <div className="graphic">
      <div className="wrapper">
        <div className="carosel">
          <img src={test1} />
          <img src={test2} />
          <img src={test1} />
          <img src={test2} />
        </div>
        <div className="carosel carosel-2">
          <img src={test1} />
          <img src={test2} />
          <img src={test1} />
          <img src={test2} />
        </div>
      </div>
    </div>
  </div>
  );
}
