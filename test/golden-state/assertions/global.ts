type AssertionResponse = {
  name: string;
  state: any;
  result: any;
};

let responses: AssertionResponse[] = [];

function resetResponses() {
  responses = [];
}

function getResponses() {
  return responses;
}

export { resetResponses, getResponses, AssertionResponse };
