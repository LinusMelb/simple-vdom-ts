import { diffProps, diffVDom } from "./src/diff";
import { vEl } from "./src/element";

const vDom1 = vEl("div", { id: "container" }, [
  vEl("p", { style: "color: red" }, ["This is a <p> tag"]),
  vEl("h1", {}, ["simple virtal dom1"]),
  vEl("h1", {}, ["simple virtal dom2"]),
  vEl("h1", {}, ["simple virtal dom3"]),
  vEl("h1", {}, ["simple virtal dom4"]),
  vEl("h1", {}, ["simple virtal dom5"]),
  vEl("h2", {}, ["simple virtal dom"]),
]);

const vDom2 = vEl("div", { id: "container" }, [
  vEl("p", { style: "color: red" }, ["another text", "This is a <p> tag"]),
  vEl("h1", {}, ["simple virtal dom1"]),
  vEl("h1", {}, ["simple virtal dom2", "another text"]),
  vEl("h1", {}, ["simple virtal dom3"]),
  vEl("h1", {}, ["simple virtal dom4"]),
  vEl("h1", {}, ["simple virtal dom5"]),
  vEl("h3", {}, ["simple virtal dom2"]),
  vEl("h3", {}, ["simple virtal dom2"]),
]);

const renderedHtml = vDom1.render();

document.getElementById("app").append(renderedHtml);

// test diff.ts
const oldEle = vEl("div", { id: "container1", class: "box" }, []);
const newEle = vEl(
  "div",
  { id: "container2", class: "box", style: "color: white" },
  []
);
const propDiffs = diffProps(oldEle.props, newEle.props);
console.log("propDiffs: ", propDiffs);

const patches = diffVDom(vDom1, vDom2);
console.log("domPatches: ", patches);
