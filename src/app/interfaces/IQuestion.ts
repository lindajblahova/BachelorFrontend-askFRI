export interface IQuestion {
  idQuestion: number;
  idRoom: number;
  type: number;
  content: string;
  optionalAnswers: string[];
  displayedQuestion: boolean;
  displayedAnswers: boolean;
}

/*
type:
  open = 0
  choice = 1
  checkbox = 2
  slider = 3
}*/

