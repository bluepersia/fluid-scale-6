import { DocumentClone } from "../../../../src/cloner.types";
import docClone from "./docClone";

type Master = {
  docClone: DocumentClone;
};

const master: Master = {
  docClone,
};
export type { Master };
export default master;
