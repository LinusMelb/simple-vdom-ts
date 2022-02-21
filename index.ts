import { diffProps, diffVDom } from "./src/diff";
import { vEl, VElement } from "./src/element";
import { patch } from "./src/patch";

document.getElementById("app").innerHTML =
  "<div id='left' style='float: left'><h3>--</h3></div><div id='right' style='float: right'><h3>Expected output: </h3></div>";

let vDom1 = vEl("div", { style: "float: left" }, [
  vEl("p", { style: "color: red" }, ["This is a <p> tag"]),
  vEl("h1", {}, ["simple virtal dom1"]),
  vEl("h2", {}, ["simple virtal dom2"]),
  vEl("h1", {}, ["simple virtal dom3"]),
  vEl("h1", {}, ["simple virtal dom4"]),
  vEl("h1", {}, ["simple virtal dom5"]),
  vEl("h2", {}, ["simple virtal dom"]),
]);

let vDom2 = vEl("div", { style: "float: right" }, [
  vEl("p", { style: "color: green" }, ["another text"]),
  vEl("h1", {}, ["simple virtal dom1"]),
  vEl("h2", {}, ["simple virtal dom2"]),
  vEl("h3", {}, ["simple virtal dom3"]),
  vEl("h4", {}, ["simple virtal dom4"]),
  vEl("h5", {}, ["simple virtal dom500000"]),
]);

const renderedHtml1 = vDom1.render();
const renderedHtml2 = vDom2.render();

document.getElementById("left").append(renderedHtml1);
document.getElementById("right").append(renderedHtml2);

setInterval(() => {
  const newDom = createVDom();
  const patches = diffVDom(vDom1, newDom);
  patch(renderedHtml1, patches);
  vDom1 = newDom;
}, 1000);

const createVDom = () => {
  const time = new Date();
  return vEl("div", { style: "float: right" }, [
    vEl("p", { style: "color: green; background: lightblue" }, [
      time.getTime().toString(),
    ]),
    vEl("h1", {}, ["simple virtal dom1"]),
    vEl("h2", {}, ["simple virtal dom" + Math.random() * 1000]),
    vEl("h3", {}, ["simple virtal dom3"]),
    vEl("h4", {}, ["simple virtal dom4"]),
    vEl("h5", {}, ["simple virtal dom500000"]),
  ]);
};
