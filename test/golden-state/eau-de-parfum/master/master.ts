import docClone from "./docClone";
import { Master } from "../../../index.types";
import { generateJSDOMDocument } from "../../../../src/json-builder";
import path from "path";
import batchedDoc from "./batchedDoc";

const master: Master = {
  docClone,
  breakpoints: [375, 600],
  globalBaselineWidth: 375,
  batchedDoc,
};
export default master;
